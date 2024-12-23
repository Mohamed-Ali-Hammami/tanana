'use client';
import { useEffect, useState } from 'react';
import { createPublicClient, http, parseAbiItem } from 'viem';
import { mainnet } from 'viem/chains';

// Create a public client for interacting with the Ethereum mainnet
const client = createPublicClient({
    chain: mainnet,
    transport: http(`https://mainnet.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_PROJECT_ID}`),
});

const USDT_ADDRESS = '0xdac17f958d2ee523a2206206994597c13d831ec7'; // USDT contract address

const QueryUSDTPage = () => {
    const [lastBlock, setLastBlock] = useState<number>(0); // State for the last block number
    const [lastBlockHash, setLastBlockHash] = useState<string>(''); // State for the hash of the last block
    const [list, setList] = useState<any[]>([]); // State to store the list of USDT transfers

    useEffect(() => {
        // Listen for the latest block
        client.watchBlocks({
            emitOnBegin: true,
            onBlock(block) {
                setLastBlock(Number(block.number)); // Update last block number
                setLastBlockHash(block.hash); // Update last block hash
            }
        });
    }, []);

    useEffect(() => {
        setList([]); // Reset the list before fetching new data
        // Get USDT transfer records in the latest block
        client.getLogs({
            address: USDT_ADDRESS,
            event: parseAbiItem('event Transfer(address indexed from, address indexed to, uint256 value)'),
            fromBlock: BigInt(lastBlock),
            toBlock: BigInt(lastBlock)
        }).then((res) => {
            setList(res); // Update the list with the transfer records
            console.log(res); // Log the response
        });
    }, [lastBlock]); // Fetch logs whenever the lastBlock changes

    return (
        <div className='p-4'>
            <h1 className='text-2xl text-center mb-4'>Listen for the Latest USDT Transfer Events and Block Information</h1>
            <div className='text-gray-400 mb-2'>
                Latest Block: {lastBlock ? `${lastBlock} (${lastBlockHash})` : ''}
                <br />
                Found {list.length} records in this block
            </div>
            {
                list.length === 0 ? <div className='text-gray-600'>Querying, please wait...</div> :
                <ul className='list-disc pl-4'>
                    {list.map((item: any, index: number) => {
                        return <li key={index}>
                            In block {lastBlock} (Transaction: {item.transactionHash}), {item.args.from} transferred {parseInt(item.args.value) / 1000000} USDT to {item.args.to}
                        </li>;
                    })}
                </ul>
            }
        </div>
    );
}

export default QueryUSDTPage;
