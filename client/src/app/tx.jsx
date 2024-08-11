'use client';

import Image from 'next/image'
import Meemaw from '@getmeemaw/meemaw-js'
import { supabase } from './supabaseClient'
import { useState, useEffect } from 'react'
import Web3 from 'web3'

export default function Tx() {
    const [loading, setLoading] = useState(false)
    const [wallet, setWallet] = useState(false)
    const [address, setAddress] = useState('')
    const [recipient, setRecipient] = useState('');
    const [privateKey, setPrivateKey] = useState('');
    const [backup, setBackup] = useState('');
    const [warning, setWarning] = useState('');

    const [showSections, setShowSections] = useState(false);


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
        const wallet = await meemaw.GetWallet(token, function() {
            alert('RegisterDevice started');
        }, function() {
            alert('RegisterDevice finished');
        });

        console.log("meemaw:", meemaw);
        console.log("wallet:", wallet);

        setLoading(false)
        window.location.reload(false);
    };

    const handleGetWalletFromBackup = async () => {
        setLoading(true)

        var backup = prompt("Please enter your backup:", "");

        if (backup !== null) {

            let token;
            try {
                token = await getAccessToken()
            } catch (error) {
                throw error;
            }

            const meemaw = await Meemaw.init('http://localhost:8421');
            const wallet = await meemaw.GetWalletFromBackup(token, backup);

            console.log("meemaw:", meemaw);
            console.log("wallet:", wallet);

            setLoading(false)
            window.location.reload(false);

        } else {
            console.log("no prompt...")
        }
    };



    const handleBackup = async () => {
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

        const backup = await wallet.Backup();

        console.log("backup:", backup);

        setBackup(backup);

        setLoading(false)

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
        // const meemaw = await Meemaw.init('https://test.localhost');
        const wallet = await meemaw.GetWallet(token);

        console.log("meemaw:", meemaw);
        console.log("wallet:", wallet);

        console.log("recipient:", recipient);

        const web3 = new Web3(new Web3.providers.HttpProvider("https://eth-sepolia.g.alchemy.com/v2/e7OD1JhrtDJlDEowtp7L6cSZNbgmbjUf"));
            
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

    const handleExport = async () => {
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

        const privateKey = await wallet.Export();

        console.log("privateKey end:", privateKey);

        setPrivateKey(privateKey);
        setWarning("You can now import the private key into your wallet of choice. Be careful though, anyone with this private key can spend your funds. Before, both the client and the server needed to collaborate to sign a transaction, adding an inherent level of security.");

        setLoading(false)
    };

    const handleAcceptDevice = async () => {
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

        await wallet.AcceptDevice();

        console.log("AcceptDevice done");

        setLoading(false)
    };

    const handleSignOut = async () => {
        await supabase.auth.signOut();
    }

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

                    <a 
                        href="#" 
                        onClick={handleGetWalletFromBackup}
                        style={{ display: 'block', marginTop: '10px' }}
                    >
                        {loading ? <span>Loading</span> : <span>Generate Wallet from backup</span>}
                    </a>
                </div>
            ) : (
                <div>
                    <p>Here is your wallet address (public key): {address}</p>
                    <p>Make sure to send it some gas before sending a transaction.</p>
                    <input type="text" placeholder="Recipient" value={recipient} onChange={(e) => setRecipient(e.target.value)} />
                    <button disabled={loading} onClick={handleSendTx}>
                        {loading ? <span>Loading</span> : <span>Send Transaction</span>}
                    </button>
                    <div style={{ marginTop: '30px' }}>
                        <div 
                            onClick={() => setShowSections(!showSections)} 
                            style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                        >

                            <span style={{ marginRight: '8px', transform: showSections ? 'rotate(90deg)' : 'rotate(0)', transition: 'transform 0.3s' }}>
                                &gt;
                            </span>
                            <span>Show Options</span>
                        </div>
                        {showSections && (
                            <div>
                                <div style={{ marginTop: '10px', padding: '10px', backgroundColor: '#f0f0f0', borderRadius: '5px' }}>
                                    <h3>Multi-device</h3>
                                    <p>
                                        If your user already created a wallet using device1, calling meemaw.GetWallet() on device2 will automatically start the multi-device process. 
                                        You will need to call wallet.AcceptDevice() from device1 in order to accept the new device.
                                        Try it by opening this page in another browser, logging in then clicking "Generate Wallet". Then come back here and click "Accept Device".
                                    </p>
                                    <button disabled={loading} onClick={handleAcceptDevice}>
                                        {loading ? <span>Loading</span> : <span>Accept Device</span>}
                                    </button>
                                </div>
                                <div style={{ marginTop: '10px', padding: '10px', backgroundColor: '#f0f0f0', borderRadius: '5px' }}>
                                    <h3>Backup</h3>
                                    <p>
                                        It is easy to create a backup file for users. 
                                        Behind the scenes, it uses multi-device for true redundancy.
                                        Try it by clicking "Backup", then use the text in another browser using "Generate wallet from backup" after login.
                                    </p>
                                    <button disabled={loading} onClick={handleBackup}>
                                        {loading ? <span>Loading</span> : <span>Backup</span>}
                                    </button>
                                    <div style={{ width: '700px', wordWrap: 'break-word', marginTop: '10px' }}>{backup}</div>
                                </div>
                                <div style={{ marginTop: '10px', padding: '10px', backgroundColor: '#f0f0f0', borderRadius: '5px' }}>
                                    <h3>Export private key</h3>
                                    <p>Until now, no private key was ever created for this MPC wallet, it just doesn't exist. Clicking the button will call wallet.Export() to send the client share to the server, which will then combine it with the server share to create the private key.</p>
                                    <button disabled={loading} onClick={handleExport}>
                                        {loading ? <span>Loading</span> : <span>Export Private Key</span>}
                                    </button>
                                    <p>{privateKey}</p>
                                    <p>{warning}</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
            <a 
                href="#" 
                onClick={handleSignOut}
                style={{ display: 'block', marginTop: '10px' }}
            >
                <span>Sign Out</span>
            </a>
        </div>
        </main>
    )
}
