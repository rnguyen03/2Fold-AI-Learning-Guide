'use client'
import Head from 'next/head';
import PromptComponent from '../../components/promptComp';

export default function Home() {
  return (
    <div>
      <Head>
        <title>Prompt Application</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1>Welcome to the Prompt Application</h1>
        <PromptComponent />
      </main>
    </div>
  );
}