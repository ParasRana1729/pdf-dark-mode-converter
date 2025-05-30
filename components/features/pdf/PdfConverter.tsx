import { useState, useCallback, ChangeEvent, DragEvent, useEffect } from 'react';
import { DocumentArrowDownIcon, Cog6ToothIcon, ArrowPathIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { useSpring, animated } from 'react-spring';
import FileUploadArea from '@/components/ui/FileUploadArea';
import ProgressBar from '@/components/ui/ProgressBar';
import StatusDisplay, { getStatusIcon as getStatusIconUtil } from '@/components/ui/StatusDisplay';
import * as pdfjsLib from 'pdfjs-dist';

// Initialize PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.mjs';

interface StatusMessage {
  text: string;
  type: 'info' | 'success' | 'error' | 'processing';
}

export default function PdfConverter() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [statusMessage, setStatusMessage] = useState<StatusMessage>({ text: 'Ready to convert PDF', type: 'info' });
  const [isProcessing, setIsProcessing] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [progress, setProgress] = useState(0);

  // Animated background gradient
  const gradientProps = useSpring({
    from: { backgroundPosition: '0% 50%' },
    to: { backgroundPosition: '100% 50%' },
    config: { duration: 20000 },
    loop: true,
  });

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
      setProgress(0);
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
      setProgress(0);
    }
  }, []);

  const convertToDarkMode = async () => {
    if (!selectedFile) return;

    setIsProcessing(true);
    setStatusMessage({ text: 'Initializing PDF.js...', type: 'processing' });
    setDownloadUrl(null);
    setProgress(0);

    try {
      // Load the PDF using PDF.js
      const arrayBuffer = await selectedFile.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      setProgress(20);

      setStatusMessage({ text: 'Processing pages...', type: 'processing' });
      
      // Create a custom viewer with dark mode
      const darkModeViewer = `
<!DOCTYPE html>
<html lang="en" class="dark">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dark Mode PDF - ${selectedFile.name}</title>
    <script src="https://cdn.jsdelivr.net/npm/pdfjs-dist@4.0.379/build/pdf.min.js"></script>
    <style>
        :root {
            color-scheme: dark;
        }
        
        body {
            margin: 0;
            background: #0f0f23;
            color: #fff;
            font-family: -apple-system, system-ui, sans-serif;
            min-height: 100vh;
            display: flex;
            flex-direction: column;
        }

        #toolbar {
            background: rgba(26, 26, 46, 0.8);
            backdrop-filter: blur(10px);
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            padding: 0.5rem 1rem;
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            z-index: 1000;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        #pageInfo {
            color: #fff;
            font-size: 0.9rem;
        }

        #viewerContainer {
            margin-top: 3.5rem;
            padding: 1rem;
            flex: 1;
            overflow: auto;
            background: #0f0f23;
        }

        #viewer {
            width: 100%;
            max-width: 1000px;
            margin: 0 auto;
            display: flex;
            flex-direction: column;
            gap: 2rem;
            padding: 1rem;
        }

        .page {
            background: #1a1a2e;
            border-radius: 8px;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
            overflow: hidden;
        }

        canvas {
            filter: invert(0.92) hue-rotate(180deg) contrast(1.05) brightness(1.15) saturate(1.1);
            display: block;
            margin: 0 auto;
            max-width: 100%;
            height: auto !important;
        }

        .loading {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(26, 26, 46, 0.9);
            backdrop-filter: blur(10px);
            padding: 1rem 2rem;
            border-radius: 8px;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
            border: 1px solid rgba(255, 255, 255, 0.1);
            color: #fff;
            font-size: 1rem;
        }

        /* Custom scrollbar */
        ::-webkit-scrollbar {
            width: 12px;
            height: 12px;
        }

        ::-webkit-scrollbar-track {
            background: #1a1a2e;
        }

        ::-webkit-scrollbar-thumb {
            background: rgba(63, 63, 103, 0.8);
            border-radius: 6px;
            border: 3px solid #1a1a2e;
        }

        ::-webkit-scrollbar-thumb:hover {
            background: rgba(79, 79, 119, 0.9);
        }

        @media (max-width: 768px) {
            #toolbar {
                padding: 0.5rem;
            }

            #viewerContainer {
                margin-top: 3rem;
                padding: 0.5rem;
            }

            #viewer {
                padding: 0.5rem;
                gap: 1rem;
            }
        }
    </style>
</head>
<body>
    <div id="toolbar">
        <div id="pageInfo">Loading...</div>
    </div>
    <div id="viewerContainer">
        <div id="viewer"></div>
    </div>
    <div class="loading">Preparing your dark mode PDF...</div>

    <script>
        pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdn.jsdelivr.net/npm/pdfjs-dist@4.0.379/build/pdf.worker.min.js';

        const BASE64_PDF = '${await arrayBufferToBase64(arrayBuffer)}';
        
        async function loadPDF() {
            try {
                const loadingTask = pdfjsLib.getDocument({ data: atob(BASE64_PDF) });
                const pdf = await loadingTask.promise;
                
                const pageInfo = document.getElementById('pageInfo');
                pageInfo.textContent = \`Page 1 of \${pdf.numPages}\`;
                
                document.querySelector('.loading').style.display = 'none';
                
                for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
                    const page = await pdf.getPage(pageNum);
                    const viewport = page.getViewport({ scale: 1.5 });

                    const pageContainer = document.createElement('div');
                    pageContainer.className = 'page';
                    document.getElementById('viewer').appendChild(pageContainer);

                    const canvas = document.createElement('canvas');
                    const context = canvas.getContext('2d');
                    canvas.height = viewport.height;
                    canvas.width = viewport.width;

                    const renderContext = {
                        canvasContext: context,
                        viewport: viewport
                    };

                    await page.render(renderContext).promise;
                    pageContainer.appendChild(canvas);
                    
                    // Update page info
                    pageInfo.textContent = \`Page \${pageNum} of \${pdf.numPages}\`;
                }
            } catch (error) {
                console.error('Error loading PDF:', error);
                document.querySelector('.loading').textContent = 'Error loading PDF';
            }
        }

        loadPDF();
    </script>
</body>
</html>`;

      setProgress(90);
      setStatusMessage({ text: 'Creating dark mode viewer...', type: 'processing' });

      // Create blob and URL
      const htmlBlob = new Blob([darkModeViewer], { type: 'text/html' });
      const url = URL.createObjectURL(htmlBlob);
      setDownloadUrl(url);

      setProgress(100);
      setStatusMessage({ 
        text: `✨ Dark mode PDF ready! Enhanced viewer size: ${(htmlBlob.size / 1024 / 1024).toFixed(1)}MB`, 
        type: 'success' 
      });

    } catch (error) {
      console.error('Conversion error:', error);
      const errorMsg = error instanceof Error ? error.message : 'Conversion failed';
      setStatusMessage({ text: `❌ ${errorMsg}`, type: 'error' });
      setProgress(0);
    } finally {
      setIsProcessing(false);
    }
  };

  // Helper function to convert ArrayBuffer to base64
  const arrayBufferToBase64 = (buffer: ArrayBuffer): string => {
    const bytes = new Uint8Array(buffer);
    const chunkSize = 65536;
    let binary = '';
    
    for (let i = 0; i < bytes.length; i += chunkSize) {
      const chunk = bytes.slice(i, i + chunkSize);
      binary += String.fromCharCode.apply(null, Array.from(chunk));
      
      // Update progress for large files
      if (i % (chunkSize * 10) === 0) {
        const progressPercent = Math.min(65 + (i / bytes.length) * 10, 74);
        setProgress(progressPercent);
      }
    }
    
    return btoa(binary);
  };

  // Using the utility function for icons
  const getStatusIcon = () => getStatusIconUtil(statusMessage.type);

  return (
    <animated.div 
      style={{
        ...gradientProps,
        backgroundImage: 'linear-gradient(-45deg, #1a1a2e 0%, #0f0f23 50%, #1a1a2e 100%)',
        backgroundSize: '400% 400%'
      }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 rounded-xl backdrop-blur-sm"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="text-center lg:text-left">
            <h2 className="text-4xl lg:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 animate-gradient">
              Convert PDF to Dark Mode
            </h2>
            <p className="text-lg text-gray-300 mb-8">
              Transform your PDF documents to dark theme for comfortable reading in low-light environments.
              Our advanced PDF.js technology preserves text quality and maintains perfect readability.
            </p>
          </div>

          <FileUploadArea
            dragOver={dragOver}
            handleDragOver={handleDragOver}
            handleDragLeave={handleDragLeave}
            handleDrop={handleDrop}
            handleFileChange={handleFileChange}
            isProcessing={isProcessing}
            selectedFile={selectedFile}
          />

          <div className="mt-6 flex flex-col sm:flex-row gap-4">
            <button
              onClick={convertToDarkMode}
              disabled={!selectedFile || isProcessing}
              className="flex-1 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 flex items-center justify-center space-x-3 shadow-lg hover:shadow-purple-500/25 backdrop-blur-sm"
            >
              {isProcessing ? <ArrowPathIcon className="w-5 h-5 animate-spin" /> : <Cog6ToothIcon className="w-5 h-5" />}
              <span>{isProcessing ? 'Converting...' : 'Convert to Dark Mode'}</span>
            </button>

            {downloadUrl && (
              <>
                <a
                  href={downloadUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 sm:flex-none bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 flex items-center justify-center space-x-3 shadow-lg hover:shadow-green-500/25 backdrop-blur-sm"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  <span>View Dark Mode</span>
                </a>
                
                <a
                  href={downloadUrl}
                  download={selectedFile ? `${selectedFile.name.replace(/\.pdf$/i, '')}_dark_mode.html` : 'dark_mode.html'}
                  className="flex-1 sm:flex-none bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 flex items-center justify-center space-x-3 shadow-lg hover:shadow-blue-500/25 backdrop-blur-sm"
                >
                  <DocumentArrowDownIcon className="w-5 h-5" />
                  <span>Download Dark Mode</span>
                </a>
              </>
            )}
          </div>

          {isProcessing && <ProgressBar progress={progress} statusMessage={statusMessage} />}
          
          {!isProcessing && statusMessage.text && (
            <div className="mt-4">
              <StatusDisplay statusMessage={statusMessage} />
            </div>
          )}

          {/* Features Section with Glassmorphism */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-8">
            <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10 hover:border-purple-500/30 transition-all duration-300 group">
              <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Lightning Fast</h3>
              <p className="text-gray-400 text-sm">Advanced PDF.js processing ensures quick conversion without quality loss.</p>
            </div>

            <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10 hover:border-purple-500/30 transition-all duration-300 group">
              <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Perfect Quality</h3>
              <p className="text-gray-400 text-sm">Custom PDF.js viewer ensures perfect text clarity and formatting.</p>
            </div>

            <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10 hover:border-purple-500/30 transition-all duration-300 group">
              <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">100% Secure</h3>
              <p className="text-gray-400 text-sm">All processing happens in your browser using PDF.js. Files never leave your device.</p>
            </div>

            <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10 hover:border-purple-500/30 transition-all duration-300 group">
              <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Easy on Eyes</h3>
              <p className="text-gray-400 text-sm">Custom dark mode reduces eye strain during extended reading sessions.</p>
            </div>
          </div>
        </div>

        {/* Sidebar with Glassmorphism */}
        <div className="space-y-6">
          <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
            <h3 className="text-lg font-semibold text-white mb-4">How it works</h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-purple-500/30 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-white">1</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-white">Upload PDF</p>
                  <p className="text-xs text-gray-400">Select or drag your PDF file</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-purple-500/30 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-white">2</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-white">Process</p>
                  <p className="text-xs text-gray-400">PDF.js converts your document</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-purple-500/30 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-white">3</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-white">View</p>
                  <p className="text-xs text-gray-400">Enjoy your dark mode PDF</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
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
    </animated.div>
  );
}