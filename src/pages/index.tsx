import Head from 'next/head';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import PdfConverter from '@/components/features/pdf/PdfConverter';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#0f0f23] text-white flex flex-col">
      <Head>
        <title>PDF Dark Mode Converter - Convert PDFs to Dark Theme</title>
        <meta name="description" content="Convert your PDF documents to dark mode for comfortable reading in low-light environments" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <meta name="theme-color" content="#0f0f23" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="PDF Dark Mode" />
        <meta property="og:title" content="PDF Dark Mode Converter" />
        <meta property="og:description" content="Convert your PDF documents to dark mode for comfortable reading in low-light environments" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="/logo.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="PDF Dark Mode Converter" />
        <meta name="twitter:description" content="Convert your PDF documents to dark mode for comfortable reading in low-light environments" />
        <meta name="twitter:image" content="/logo.png" />
      </Head>

      <Header />

      <main className="flex-grow">
        <PdfConverter />
      </main>

      <Footer />
    </div>
  );
} 