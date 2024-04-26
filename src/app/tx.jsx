'use client';

import Image from 'next/image'
import Meemaw from 'meemaw'
import { supabase } from './supabaseClient'
import { useState, useEffect } from 'react'
import Web3 from 'web3'

export default function Tx() {
    const [loading, setLoading] = useState(false)
    const [wallet, setWallet] = useState(false)
    const [address, setAddress] = useState('')
    const [recipient, setRecipient] = useState('');


    useEffect(() => {
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
        
            if (/^address-.+/.test(key)) {
                // If the key matches the "address-X" format, do something with it.
                setWallet(true)
                setAddress(localStorage.getItem(key))
            }

            // /!\ Does not work if there are multiple accounts on the same computer ! Needs an update
            // => get userId from Supabase, then get related wallet.
        }
    }, [])

    const getAccessToken = async () => {
        const {
            data: { session },
        } = await supabase.auth.getSession()
        const { access_token } = session || {}

        if (access_token == null) {
            throw new Error('No access token');
        } 

        return access_token;
    };

    const handleGenerateWallet = async () => {
        setLoading(true)

        let token;
        try {
            token = await getAccessToken()
        } catch (error) {
            throw error;
        }

        const meemaw = await Meemaw.init('http://localhost:8421');
        const wallet = await meemaw.GetWallet(token);

        console.log("meemaw:", meemaw);
        console.log("wallet:", wallet);

        setLoading(false)
        window.location.reload(false);
    };

    const handleSendTx = async () => {
        setLoading(true)

        let token;
        try {
            token = await getAccessToken()
        } catch (error) {
            throw error;
        }

        const meemaw = await Meemaw.init('http://localhost:8421');
        const wallet = await meemaw.GetWallet(token);

        console.log("meemaw:", meemaw);
        console.log("wallet:", wallet);

        console.log("recipient:", recipient);

        const web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8421/rpc"));
            
        const chainId = await web3.eth.getChainId();
        const nonce = await web3.eth.getTransactionCount(wallet.From())
        const gasPrice = await web3.eth.getGasPrice();
                
        const raw = {
            // 'to': '0x809ccc37d2dd55a8e8fa58fc51d101c6b22425a8',
            'to': recipient,
            'value': 10000000000000, 
            'nonce': Number(nonce),
            'gasLimit': 21000,
            'gasPrice': Math.round(Number(gasPrice)*1.2), // https://github.com/web3/web3.js/issues/6276
        };

        console.log("init tx");

        const rawTransaction = await wallet.SignEthTransaction(raw, chainId);

        console.log("received rawTransaction:", rawTransaction);
        console.log("sending signed transaction");

        const txReceipt = await web3.eth.sendSignedTransaction(rawTransaction);
        console.log("Look at my fabulous transaction:", txReceipt);

        setLoading(false)
        alert("Transaction sent!")
    };

    return (
        <main>
        <div>
            <Image
            src="https://influchain.fra1.digitaloceanspaces.com/meemaw/static/img/logo/grandma.webp"
            alt="Meemaw Logo"
            width={180}
            height={180}
            priority
            />
        </div>

        <div>
            <h1>Meemaw: Web SDK Example</h1>
            {!wallet ? (
                <div>
                    <p>You don't have a wallet yet.</p>
                    <button disabled={loading} onClick={handleGenerateWallet}>
                        {loading ? <span>Loading</span> : <span>Generate Wallet</span>}
                    </button>
                </div>
            ) : (
                <div>
                    <p>Here is your wallet address: {address}</p>
                    <p>Make sure to send it some gas before sending a transaction.</p>
                    <input type="text" placeholder="Recipient" value={recipient} onChange={(e) => setRecipient(e.target.value)} />
                    <button disabled={loading} onClick={handleSendTx}>
                        {loading ? <span>Loading</span> : <span>Send Transaction</span>}
                    </button>
                </div>
            )}
        </div>
        </main>
    )
}
