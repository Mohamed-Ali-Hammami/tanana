'use client';
import { useEffect, useState } from 'react';
import { createPublicClient, http, keccak256, toHex, getAddress, numberToHex, hexToBigInt, padHex, decodeAbiParameters } from 'viem';
import { sepolia } from 'viem/chains';

// Create a public client for interacting with the Sepolia testnet
const client = createPublicClient({
    chain: sepolia,
    transport: http(),
});

const CONTRACT_ADDRESS = '0x7ade8333e92799ab60c6c8f2f9d308c4b3b5a1bf'; // The contract address

const START_HEX = keccak256(padHex(toHex(0), { size: 32 }));
const START_NUMBER = hexToBigInt(START_HEX);

// Manually parse packed data
function parsePackedData(data: string): [bigint, string] {
  // Ensure data length is correct (32 bytes = 64 hex characters + '0x' prefix)
  if (data.length !== 66) {
    throw new Error('Invalid data length');
  }

  // Extract uint64 (8 bytes = 16 hex characters)
  const uint64Hex = data.slice(2, 26);
  const uint64Value = BigInt('0x' + uint64Hex);

  // Extract address (20 bytes = 40 hex characters)
  const addressHex = data.slice(26);
  const address = getAddress('0x' + addressHex);

  return [uint64Value, address];
}

const GetStorageAt = () => {
    const [length, setLength] = useState<number>(0); // State to store the length of _locks
    const [list, setList] = useState<any[]>([]); // State to store the data from _locks

    // Fetch the length of _locks storage slot
    async function getLength() {
        try {
            const data = await client.getStorageAt({
                address: CONTRACT_ADDRESS,
                slot: '0x0', // Storage slot for the length of _locks
            });
            const length = hexToBigInt(data as `0x${string}`);
            setLength(Number(length)); // Update the state with the length
        } catch (error) {
            console.error('Error fetching storage data:', error);
            throw error;
        }
    }

    // Fetch storage data by index
    async function getStorageByIndex(index: number) {
        const data1 = await getDataAt(index * 2);
        const data2 = await getDataAt(index * 2 + 1);

        const values2 = decodeAbiParameters([
            { name: 'amount', type: 'uint256' },
        ], data2 as `0x${string}`);

        const startTime = Number(parsePackedData(data1 as `0x${string}`)[0]);
        const user = parsePackedData(data1 as `0x${string}`)[1];
        const amount = Number(values2);

        return [startTime, user, amount];
    }

    // Fetch data at a specific storage slot
    async function getDataAt(at: number) {
        const slot = numberToHex(START_NUMBER + BigInt(at));
        try {
            const data = await client.getStorageAt({
                address: CONTRACT_ADDRESS,
                slot: slot as `0x${string}`,
            });
            return data;
        } catch (error) {
            console.error('Error fetching storage data:', error);
            throw error;
        }
    }

    useEffect(() => {
        // Get the length of _locks
        getLength();
    }, []);

    useEffect(() => {
        // Get data from _locks once the length is available
        if (length === 0) return;

        const idxs = Array.from(Array(11).keys()); // The index list to request

        // Fetch the data sequentially
        const fetchSequentially = async () => {
            const newResults = new Array(idxs.length).fill(null);
            const promises = idxs.map(async (idx, index) => {
                try {
                    const result = await getStorageByIndex(idx);
                    newResults[index] = result;
                    setList([...newResults]);
                } catch (err) {
                    console.error(`Error fetching data for index ${idx}:`, err);
                }
            });

            await Promise.all(promises);
        };

        fetchSequentially();
    }, [length]);

    return (
        <div className='p-4'>
            <h1 className='text-2xl text-center mb-4'>Get Contract Storage Data</h1>
            <div>
                Contract Address: 
                <a href={"https://sepolia.etherscan.io/address/" + CONTRACT_ADDRESS} target='_blank'>
                    {CONTRACT_ADDRESS}
                </a>
            </div>
            <div>
                Length of _locks: {length}
            </div>
            <ul>
                {
                    list.length === 0 ? <div>Querying, please wait...</div> :
                    list.map((item: any, index: number) => {
                        if (!item) return null;
                        return (
                            <li key={index}>
                                locks[{index}]: user: {item[1]}, startTime: {item[0]}, amount: {item[2]}
                            </li>
                        );
                    })
                }
            </ul>
        </div>
    );
}

export default GetStorageAt;
