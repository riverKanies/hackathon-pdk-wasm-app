import React, { useState } from 'react';
import './App.css';
import {  Wallet, EsploraClient, ChangeSet, FeeRate, Recipient, Address, Amount, Psbt, SignOptions } from 'bitcoindevkit';
import { Uri, Receiver, SenderBuilder, Sender, Request, InputPair } from 'payjoindevkit';

const network = "signet";
const ohttpRelay = "https://pj.bobspacebkk.com";
const ohttpKeys = "OH1QYP87E2AVMDKXDTU6R25WCPQ5ZUF02XHNPA65JMD8ZA2W4YRQN6UUWG"
const payjoinDirectory = "https://payjo.in";


function App() {
  const [mnemonic, setMnemonic] = useState<string>('');
  const [invoiceAddress, setInvoiceAddress] = useState<string>('');

  const generateMnemonic = () => {
    // TODO: Implement actual mnemonic generation
    setMnemonic('example mnemonic words here');
  };

  const generateInvoiceAddress = () => {
    // TODO: Implement actual address generation
    setInvoiceAddress('example1address2here3');
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Payjoin</h1>
      </header>

      <main>
        <section>
          <h2>Test</h2>
          <button onClick={test}>Test</button>
          <p>see console for output</p>
        </section>
        <section>
          <h2>Generate Mnemonic</h2>
          <button onClick={generateMnemonic}>Generate New Mnemonic</button>
          <input 
            type="text" 
            readOnly 
            value={mnemonic}
            placeholder="Your mnemonic will appear here"
          />
        </section>

        <section>
          <h2>Generate Invoice Address</h2>
          <button onClick={generateInvoiceAddress}>Generate New Address</button>
          <input 
            type="text" 
            readOnly 
            value={invoiceAddress}
            placeholder="Your invoice address will appear here"
          />
        </section>
      </main>
    </div>
  );
}

export default App;

async function test() {
  console.log(Wallet)
  const { senderWallet, receiverWallet } = await initSenderAndReceiverWallets();
}

async function initSenderAndReceiverWallets(): Promise<{ senderWallet: Wallet, receiverWallet: Wallet }> {
  // generated descriptors using book of bdk descriptor example
  const senderDescriptorExternal = "tr(tprv8ZgxMBicQKsPeAndhG7FXuuk57oVpo4Y7xtUitrJyBRFnBHCCpLQofZZ7EZWcwB3zo8BLsJe8Qo5HeShP2zFoMx1zAA8PGnNGbfPozA4SvX/86'/1'/0'/0/*)#kkng6m9y"
  const senderDescriptorInternal = "tr(tprv8ZgxMBicQKsPeAndhG7FXuuk57oVpo4Y7xtUitrJyBRFnBHCCpLQofZZ7EZWcwB3zo8BLsJe8Qo5HeShP2zFoMx1zAA8PGnNGbfPozA4SvX/86'/1'/0'/1/*)#8zkf8w4u"

  const receiverDescriptorExternal = "tr(tprv8ZgxMBicQKsPdXaSHpSS8nXLfpPunAfEEs7K86ESCroA95iZbaxYyxgqNYurfnA85rKf7fXpqTcgtWC3w8cssERRxZtMafDmrYgRfp12PZw/86'/1'/0'/0/*)#vjm92l0u"
  const receiverDescriptorInternal = "tr(tprv8ZgxMBicQKsPdXaSHpSS8nXLfpPunAfEEs7K86ESCroA95iZbaxYyxgqNYurfnA85rKf7fXpqTcgtWC3w8cssERRxZtMafDmrYgRfp12PZw/86'/1'/0'/1/*)#ax7yh2ly"

  const senderWallet = Wallet.create(network, senderDescriptorExternal, senderDescriptorInternal);
  const receiverWallet = Wallet.create(network, receiverDescriptorExternal, receiverDescriptorInternal);

  const client: EsploraClient = new EsploraClient("https://mutinynet.com/api");
  // get sats from faucet: https://faucet.mutinynet.com/

  console.log("Receiver syncing...");
  const receiver_scan_request = receiverWallet.start_full_scan();
  const receiver_update = await client.full_scan(receiver_scan_request, 5, 1);
  receiverWallet.apply_update(receiver_update);
  console.log("Balance:", receiverWallet.balance.confirmed.to_sat());
  // console.log("New address:", receiverWallet.reveal_next_address().address);
  console.log("Transaction ID:", receiverWallet.list_unspent()[0].outpoint.txid.toString());

  console.log("Sender syncing...");
  const sender_scan_request = senderWallet.start_full_scan();
  const sender_update = await client.full_scan(sender_scan_request, 5, 1);
  senderWallet.apply_update(sender_update);
  console.log("Balance:", senderWallet.balance.confirmed.to_sat());
  console.log("New address:", senderWallet.reveal_next_address("external").address.toString());

  return { senderWallet, receiverWallet };
}