import { NextPage } from 'next';
import { useEffect, useState } from 'react';
import styles from '../styles/Home.module.css';
import { AppBar } from '../components/AppBar';
import { SendSolForm } from '../components/SendSolForm';
import Head from 'next/head';
import WalletContextProvider from '../components/WalletContextProvider';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import * as web3 from "@solana/web3.js";

const Home: NextPage = (props) => {
  return (
    <div className={styles.App}>
      <Head>
        <title>Wallet-Adapter Example</title>
        <meta
          name="description"
          content="Wallet-Adapter Example"
        />
      </Head>
      <WalletContextProvider>
        <AppBar />
        <div className={styles.AppBody}>
          <SendSolForm />
        </div>
      </WalletContextProvider>
    </div>
  );
}

export default Home;
