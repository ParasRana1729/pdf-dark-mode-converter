import Head from 'next/head';
import { useState, useCallback, ChangeEvent, DragEvent } from 'react';
import { ArrowUpTrayIcon, DocumentArrowDownIcon, XCircleIcon, CheckCircleIcon, ArrowPathIcon, Cog6ToothIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';

interface StatusMessage {
  text: string;
  type: 'info' | 'success' | 'error' | 'processing';
}

export default function HomePage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [statusMessage, setStatusMessage] = useState<StatusMessage>({ text: 'Ready to convert PDF', type: 'info' });
  const [isProcessing, setIsProcessing] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        setStatusMessage({ text: 'Please select a PDF file', type: 'error' });
        setSelectedFile(null);
        return;
      }
      if (file.size > 50 * 1024 * 1024) {
        setStatusMessage({ text: 'File must be under 50MB', type: 'error' });
        setSelectedFile(null);
        return;
      }
      setSelectedFile(file);
      setStatusMessage({ text: `Ready to convert "${file.name}"`, type: 'success' });
      setDownloadUrl(null);
    }
  };

  const handleDragOver = useCallback((event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback((event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragOver(false);
  }, []);

  const handleDrop = useCallback((event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragOver(false);
    const file = event.dataTransfer.files?.[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        setStatusMessage({ text: 'Please select a PDF file', type: 'error' });
        setSelectedFile(null);
        return;
      }
      if (file.size > 50 * 1024 * 1024) {
        setStatusMessage({ text: 'File must be under 50MB', type: 'error' });
        setSelectedFile(null);
        return;
      }
      setSelectedFile(file);
      setStatusMessage({ text: `Ready to convert "${file.name}"`, type: 'success' });
      setDownloadUrl(null);
    }
  }, []);

  const convertToDarkMode = async () => {
    if (!selectedFile) return;

    setIsProcessing(true);
    setStatusMessage({ text: 'Initializing...', type: 'processing' });
    setDownloadUrl(null);
    setProgress(0);

    try {
      setStatusMessage({ text: 'Loading PDF library...', type: 'processing' });
      
      // Import PDF.js and jsPDF with proper error handling
      const [pdfjsLib, { jsPDF }] = await Promise.all([
        import('pdfjs-dist'),
        import('jspdf')
      ]);
      
      // Set up the worker using the local file in public folder
      setStatusMessage({ text: 'Setting up PDF worker...', type: 'processing' });
      
      // Use the local worker from public folder
      pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.mjs';
      
      setProgress(15);

      setStatusMessage({ text: 'Reading PDF...', type: 'processing' });
      const arrayBuffer = await selectedFile.arrayBuffer();
      setProgress(25);

      setStatusMessage({ text: 'Processing document...', type: 'processing' });
      const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
      const pdf = await loadingTask.promise;
      const totalPages = pdf.numPages;
      setProgress(35);

      const newPdf = new jsPDF();
      let isFirstPage = true;

      for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
        setStatusMessage({ text: `Converting page ${pageNum}/${totalPages}`, type: 'processing' });
        
        const page = await pdf.getPage(pageNum);
        const scale = 1.5;
        const viewport = page.getViewport({ scale });

        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        if (!context) throw new Error('Canvas context error');
        
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        await page.render({
          canvasContext: context,
          viewport: viewport
        }).promise;

        // Color inversion
        const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;

        for (let i = 0; i < data.length; i += 4) {
          data[i] = 255 - data[i];         // Red
          data[i + 1] = 255 - data[i + 1]; // Green  
          data[i + 2] = 255 - data[i + 2]; // Blue
        }

        context.putImageData(imageData, 0, 0);
        const imgData = canvas.toDataURL('image/jpeg', 0.9);
        
        if (!isFirstPage) {
          newPdf.addPage();
        }
        isFirstPage = false;

        const pdfWidth = newPdf.internal.pageSize.getWidth();
        const pdfHeight = newPdf.internal.pageSize.getHeight();
        const canvasAspect = canvas.width / canvas.height;
        const pageAspect = pdfWidth / pdfHeight;
        
        let finalWidth: number, finalHeight: number;
        
        if (canvasAspect > pageAspect) {
          finalWidth = pdfWidth;
          finalHeight = pdfWidth / canvasAspect;
        } else {
          finalHeight = pdfHeight;
          finalWidth = pdfHeight * canvasAspect;
        }
        
        const x = (pdfWidth - finalWidth) / 2;
        const y = (pdfHeight - finalHeight) / 2;

        newPdf.addImage(imgData, 'JPEG', x, y, finalWidth, finalHeight);

        const pageProgress = 35 + (pageNum / totalPages) * 55;
        setProgress(Math.round(pageProgress));
      }

      setProgress(95);
      setStatusMessage({ text: 'Finalizing...', type: 'processing' });

      const pdfBlob = newPdf.output('blob');
      const url = URL.createObjectURL(pdfBlob);
      setDownloadUrl(url);
      setStatusMessage({ text: 'Conversion complete!', type: 'success' });
      setProgress(100);

    } catch (error) {
      console.error('Conversion error:', error);
      const errorMsg = error instanceof Error ? error.message : 'Conversion failed';
      setStatusMessage({ text: errorMsg, type: 'error' });
      setProgress(0);
    } finally {
      setIsProcessing(false);
    }
  };

  const getStatusIcon = () => {
    switch (statusMessage.type) {
      case 'info': return <ArrowUpTrayIcon className="h-4 w-4 text-blue-400" />;
      case 'success': return <CheckCircleIcon className="h-4 w-4 text-green-400" />;
      case 'error': return <XCircleIcon className="h-4 w-4 text-red-400" />;
      case 'processing': return <ArrowPathIcon className="h-4 w-4 text-amber-400 animate-spin" />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#0f0f23] text-white">
      <Head>
        <title>PDF Dark Mode Converter - Convert PDFs to Dark Theme</title>
        <meta name="description" content="Convert your PDF documents to dark mode for comfortable reading in low-light environments" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        
        {/* Favicon and Icons */}
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        
        {/* PWA Meta Tags */}
        <meta name="theme-color" content="#0f0f23" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="PDF Dark Mode" />
        
        {/* Open Graph / Social Media Meta Tags */}
        <meta property="og:title" content="PDF Dark Mode Converter" />
        <meta property="og:description" content="Convert your PDF documents to dark mode for comfortable reading in low-light environments" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="/logo.png" />
        
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="PDF Dark Mode Converter" />
        <meta name="twitter:description" content="Convert your PDF documents to dark mode for comfortable reading in low-light environments" />
        <meta name="twitter:image" content="/logo.png" />
      </Head>

      {/* Header */}
      <header className="border-b border-gray-800 bg-[#1a1a2e]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="relative w-8 h-8">
                <Image 
                  src="/logo.png" 
                  alt="PDF Converter Logo" 
                  width={32} 
                  height={32}
                  className="rounded-lg"
                />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">PDF Dark Mode</h1>
                <p className="text-xs text-gray-400">Convert to dark theme</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-400">Free • Secure • Fast</div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Hero Section */}
            <div className="text-center lg:text-left">
              <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
                Convert PDF to <span className="text-purple-400">Dark Mode</span>
              </h2>
              <p className="text-lg text-gray-300 mb-8">
                Transform your PDF documents to dark theme for comfortable reading in low-light environments. 
                Our advanced pixel-level color inversion preserves all formatting and layout.
              </p>
            </div>

            {/* Upload Area */}
            <div className="bg-[#1a1a2e] rounded-2xl p-8 border border-gray-800">
              <div
                className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all duration-300 ${
                  dragOver 
                    ? 'border-purple-400 bg-purple-500/10' 
                    : 'border-gray-600 hover:border-gray-500 hover:bg-gray-800/30'
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => document.getElementById('file-upload')?.click()}
              >
                <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ArrowUpTrayIcon className="h-8 w-8 text-purple-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Choose PDF file</h3>
                <p className="text-gray-400 mb-4">
                  Drop your PDF here or <span className="text-purple-400 font-medium">browse files</span>
                </p>
                <p className="text-sm text-gray-500">Maximum file size: 50MB</p>
                <input
                  id="file-upload"
                  type="file"
                  className="hidden"
                  accept=".pdf"
                  onChange={handleFileChange}
                  disabled={isProcessing}
                />
              </div>

              {selectedFile && (
                <div className="mt-6 bg-[#16213e] rounded-xl p-6 border border-gray-700">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-red-500/20 rounded-lg flex items-center justify-center">
                        <svg className="w-6 h-6 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-white font-medium truncate max-w-xs">
                          {selectedFile.name}
                        </p>
                        <p className="text-sm text-gray-400">
                          {selectedFile.size >= 1024 * 1024 
                            ? `${(selectedFile.size / (1024 * 1024)).toFixed(1)} MB`
                            : `${Math.round(selectedFile.size / 1024)} KB`
                          } • PDF Document
                        </p>
                      </div>
                    </div>
                    <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center">
                      <CheckCircleIcon className="w-5 h-5 text-green-400" />
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-6 flex flex-col sm:flex-row gap-4">
                <button
                  onClick={convertToDarkMode}
                  disabled={!selectedFile || isProcessing}
                  className="flex-1 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 flex items-center justify-center space-x-3 shadow-lg hover:shadow-purple-500/25"
                >
                  {isProcessing ? (
                    <ArrowPathIcon className="w-5 h-5 animate-spin" />
                  ) : (
                    <Cog6ToothIcon className="w-5 h-5" />
                  )}
                  <span>{isProcessing ? 'Converting...' : 'Convert to Dark Mode'}</span>
                </button>

                {downloadUrl && (
                  <a
                    href={downloadUrl}
                    download={selectedFile ? `${selectedFile.name.replace(/\.pdf$/i, '')}_dark.pdf` : 'dark.pdf'}
                    className="flex-1 sm:flex-none bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 flex items-center justify-center space-x-3 shadow-lg hover:shadow-green-500/25"
                  >
                    <DocumentArrowDownIcon className="w-5 h-5" />
                    <span>Download</span>
                  </a>
                )}
              </div>

              {isProcessing && (
                <div className="mt-6 space-y-3">
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-purple-500 to-purple-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-2 text-gray-300">
                      {getStatusIcon()}
                      <span>{statusMessage.text}</span>
                    </div>
                    <span className="text-purple-400 font-medium">{progress}%</span>
                  </div>
                </div>
              )}

              {!isProcessing && statusMessage.text && (
                <div className="mt-4 flex items-center space-x-2 text-sm">
                  {getStatusIcon()}
                  <span className={`${
                    statusMessage.type === 'success' ? 'text-green-400' : 
                    statusMessage.type === 'error' ? 'text-red-400' : 'text-gray-400'
                  }`}>
                    {statusMessage.text}
                  </span>
                </div>
              )}
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="bg-[#1a1a2e] rounded-xl p-6 border border-gray-800">
                <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Lightning Fast</h3>
                <p className="text-gray-400 text-sm">Advanced processing algorithms ensure quick conversion without quality loss.</p>
              </div>

              <div className="bg-[#1a1a2e] rounded-xl p-6 border border-gray-800">
                <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Perfect Quality</h3>
                <p className="text-gray-400 text-sm">Pixel-level color inversion preserves all text clarity and formatting.</p>
              </div>

              <div className="bg-[#1a1a2e] rounded-xl p-6 border border-gray-800">
                <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">100% Secure</h3>
                <p className="text-gray-400 text-sm">All processing happens in your browser. Files never leave your device.</p>
              </div>

              <div className="bg-[#1a1a2e] rounded-xl p-6 border border-gray-800">
                <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Easy on Eyes</h3>
                <p className="text-gray-400 text-sm">Dark mode reduces eye strain during extended reading sessions.</p>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* How it works */}
            <div className="bg-[#1a1a2e] rounded-xl p-6 border border-gray-800">
              <h3 className="text-lg font-semibold text-white mb-4">How it works</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-white">1</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">Upload PDF</p>
                    <p className="text-xs text-gray-400">Select or drag your PDF file</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-white">2</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">Process</p>
                    <p className="text-xs text-gray-400">AI inverts colors pixel by pixel</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-white">3</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">Download</p>
                    <p className="text-xs text-gray-400">Get your dark mode PDF</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Benefits */}
            <div className="bg-[#1a1a2e] rounded-xl p-6 border border-gray-800">
              <h3 className="text-lg font-semibold text-white mb-4">Why choose dark mode?</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <CheckCircleIcon className="w-4 h-4 text-green-400 flex-shrink-0" />
                  <span className="text-sm text-gray-300">Reduces eye strain</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircleIcon className="w-4 h-4 text-green-400 flex-shrink-0" />
                  <span className="text-sm text-gray-300">Better for night reading</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircleIcon className="w-4 h-4 text-green-400 flex-shrink-0" />
                  <span className="text-sm text-gray-300">Saves battery on OLED</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircleIcon className="w-4 h-4 text-green-400 flex-shrink-0" />
                  <span className="text-sm text-gray-300">Modern aesthetic</span>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-xl p-6 border border-purple-500/20">
              <div className="text-center">
                <div className="text-2xl font-bold text-white mb-1">50MB</div>
                <div className="text-sm text-gray-300 mb-4">Maximum file size</div>
                <div className="text-2xl font-bold text-white mb-1">100%</div>
                <div className="text-sm text-gray-300">Client-side processing</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-800 bg-[#1a1a2e] mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p className="text-gray-400 text-sm">
              © 2025 PDF Dark Mode Converter. All files are processed locally in your browser.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
} 