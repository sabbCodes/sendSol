import { FC, useEffect, useState } from 'react';
import styles from '../styles/Home.module.css';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import * as web3 from "@solana/web3.js";

export const SendSolForm: FC = () => {
    const { connection } = useConnection();
    const { publicKey, sendTransaction } = useWallet();
    const [message, setMessage] = useState<string | null>(null);
    const [balance, setBalance] = useState<number | null>(null);

    const sendSol = async (event) => {
        event.preventDefault();

        if (!connection || !publicKey) {
            setMessage("Please connect your wallet.");
            return;
        }

        const amount = parseFloat(event.target.amount.value);
        const recipient = event.target.recipient.value;

        if (isNaN(amount) || amount <= 0) {
            setMessage("Invalid amount.");
            return;
        }

        let recipientPubKey;
        try {
            recipientPubKey = new web3.PublicKey(recipient);
        } catch (error) {
            setMessage("Invalid recipient public key.");
            return;
        }

        const transaction = new web3.Transaction().add(
            web3.SystemProgram.transfer({
                fromPubkey: publicKey,
                toPubkey: recipientPubKey,
                lamports: amount * web3.LAMPORTS_PER_SOL,
            })
        );

        try {
            const signature = await sendTransaction(transaction, connection);
            await connection.confirmTransaction(signature, 'processed');
            setMessage(`Transaction successful! Signature: ${signature}`);
        } catch (error) {
            console.error(error);
            setMessage(`Transaction failed: ${error.message}`);
        }
    }

    useEffect(() => {
        const getBalance = async () => {
            if (publicKey) {
            try {
                const balance = await connection.getBalance(publicKey);
                setBalance(balance / web3.LAMPORTS_PER_SOL); // Convert lamports to SOL
            } catch (error) {
                console.error("Error getting balance:", error);
                setBalance(null);
            }
            }
        };

        getBalance();
    }, [connection, publicKey]);

    return (
        <div>
            <p>Balance: {balance !== null ? `${balance} SOL` : "Loading..."}</p>
            <form onSubmit={sendSol} className={styles.form}>
                <label htmlFor="amount">Amount (in SOL) to send:</label>
                <input id="amount" type="text" className={styles.formField} placeholder="e.g. 0.1" required />
                <br />
                <label htmlFor="recipient">Send SOL to:</label>
                <input id="recipient" type="text" className={styles.formField} placeholder="e.g. 4Zw1fXuYuJhWhu9KLEYMhiPEiqcpKd6akw3WRZCv84HA" required />
                <button type="submit" className={styles.formButton}>Send</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
}
