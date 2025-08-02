import "@/styles/globals.css";
import Head from 'next/head'

export default function App({ Component, pageProps }) {
  return (
      <>
      {/* <Head>
        <title>Mock Interview AI</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="AI-powered mock interviews for job preparation" />
        <link rel="icon" href="/favicon.ico" />
      </Head> */}
      <main className="min-h-screen bg-white text-gray-900 antialiased font-sans">
        <Component {...pageProps} />
      </main>
    </>
  )
}
