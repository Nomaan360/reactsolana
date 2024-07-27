import logo from './logo.svg';
import './App.css';
import { Buffer } from 'buffer';
import { Connection, Transaction, SystemProgram, PublicKey,TransactionMessage,VersionedTransaction } from '@solana/web3.js';
import { useState,useEffect, useRef } from 'react';

function App() {
  const [token,settoken]= useState('')
  const getProvider = () => {
    if ('phantom' in window) {
      const provider = window.phantom?.solana;
      console.log('win',window);
      if (provider?.isPhantom) {
        return provider;
      }
    }
  
    window.open('https://phantom.app/', '_blank');
  };
  window.Buffer = Buffer;

  const connectwallet = async () => {
    const provider = getProvider(); // see "Detecting the Provider"
    console.log('provider',provider);
    try {
        const resp = await provider.connect();

        let addr= document.getElementById('addr')
        addr.innerText=resp.publicKey.toString() 
    } catch (err) {
        // { code: 4001, message: 'User rejected the request.' }
    }
  }


  const sendTrans1 = async () => {
    const provider = window.solana; // Using Phantom Wallet
    await provider.connect(); // Connect to Phantom
    console.log('Provider connected:', provider.publicKey.toString());
  
    const network = "https://api.testnet.solana.com"; // Testnet URL
    const connection = new Connection(network);
    console.log('Connected to network:', network);
  
    const transaction = new Transaction();
    const recipientPublicKey = new PublicKey('9o1csNGeo9tB16EMdjDsSq4MHvRu3dh3w57oe8BsYjnN'); // Replace with the actual recipient public key
    console.log('Recipient Public Key:', recipientPublicKey.toString());
    const lamportsAmount = token * 1000000000;

    transaction.add(
      SystemProgram.transfer({
        fromPubkey: provider.publicKey,
        toPubkey: recipientPublicKey,
        lamports: lamportsAmount, 
      })
    );
    console.log('Added transfer instruction to transaction.');
  
    // Fetch the recent blockhash
    const { blockhash } = await connection.getRecentBlockhash();
    transaction.recentBlockhash = blockhash;
    transaction.feePayer = provider.publicKey;
    console.log('Set recent blockhash and fee payer:', blockhash);
  
    try {
      const signedTransaction = await provider.signTransaction(transaction);
      console.log('Transaction signed:', signedTransaction);
  
      const signature = await connection.sendRawTransaction(signedTransaction.serialize());
      console.log('Transaction signature:', signature);
  
      const confirmation = await connection.confirmTransaction(signature);
      console.log('Confirmation status:', confirmation);
    } catch (error) {
      console.error('Error sending transaction:', error);
    }
  };
  
  return (

  <div className="App">


<button onClick={connectwallet}>Connect wallet</button>
<h5 id="addr"></h5>
<input type='number' onChange={(e)=>settoken(e.target.value)} id='token'/>
<br/>
<button onClick={sendTrans1}>Send Transaction</button>

</div>
  )
}

export default App;
