'use client';
import { useEffect, useState } from 'react';
import { createPublicClient, http, parseAbiItem } from 'viem';
import { mainnet } from 'viem/chains';

// Create a public client for interacting with the Ethereum mainnet via Infura
const client = createPublicClient({
    chain: mainnet,
    transport: http(`https://mainnet.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_PROJECT_ID}`),
});

const USDC_ADDRESS = '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606EB48';  // USDC contract address on Ethereum

const QueryUsdcPage = () => {
    const [lastBlock, setLastBlock] = useState<number>(0); // State to store the latest block number
    const [list, setList] = useState<any[]>([]); // State to store the list of transactions

    useEffect(() => {
        // Fetch the latest block number from the Ethereum blockchain
        client.getBlockNumber().then((res: BigInt) => {
            setLastBlock(Number(res)); // Update the state with the latest block number
        });
    }, []);

    useEffect(() => {
        // Fetch USDC Transfer logs from the latest 100 blocks
        client.getLogs({
            address: USDC_ADDRESS,
            event: parseAbiItem('event Transfer(address indexed from, address indexed to, uint256 value)'),
            fromBlock: BigInt(lastBlock > 100 ? lastBlock - 100 : 0), // Fetch logs from the last 100 blocks
            toBlock: BigInt(lastBlock) // To the latest block
        }).then((res) => {
            setList(res); // Update the state with the logs
            console.log(res); // Log the response
        });
    }, [lastBlock]);

    return (
        <div className='p-4'>
            <h1 className='text-2xl text-center mb-4'>
                Query the most recent 100 blocks for USDC Transfer logs on Ethereum
            </h1>
            <div className='text-gray-400 mb-2'>
                Latest block: {lastBlock || ''}, found {list.length} records in the last 100 blocks
            </div>
            {
                list.length === 0 
                    ? <div className='text-gray-600'>Querying, please wait...</div> 
                    : 
                    <ul className='list-disc pl-4'>
                        {list.map((item: any, index: number) => {
                            return (
                                <li key={index}>
                                    From {item.args.from} to {item.args.to} {parseInt(item.args.value) / 1000000} USDC, Transaction ID: {item.transactionHash}
                                </li>
                            );
                        })}
                    </ul>
            }
        </div>
    );
}

export default QueryUsdcPage;
