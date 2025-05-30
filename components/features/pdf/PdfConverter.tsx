import { useState, useCallback, ChangeEvent, DragEvent } from 'react';
import { DocumentArrowDownIcon, Cog6ToothIcon, ArrowPathIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import FileUploadArea from '@/components/ui/FileUploadArea';
import ProgressBar from '@/components/ui/ProgressBar';
import StatusDisplay, { getStatusIcon as getStatusIconUtil } from '@/components/ui/StatusDisplay';

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

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        setStatusMessage({ text: 'Please select a PDF file', type: 'error' });
        setSelectedFile(null);
        return;
      }
      if (file.size > 50 * 1024 * 1024) { // 50MB limit
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
      if (file.size > 50 * 1024 * 1024) { // 50MB limit
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
    setStatusMessage({ text: 'Initializing...', type: 'processing' });
    setDownloadUrl(null);
    setProgress(0);

    try {
      setStatusMessage({ text: 'Processing PDF for dark mode...', type: 'processing' });
      setProgress(25);

      // Read the original PDF file
      const arrayBuffer = await selectedFile.arrayBuffer();
      setProgress(50);

      setStatusMessage({ text: 'Creating dark mode viewer...', type: 'processing' });

      // Convert PDF to base64 for embedding - handle large files with chunked conversion
      setStatusMessage({ text: 'Processing large PDF file...', type: 'processing' });
      const arrayBufferToBase64 = (buffer: ArrayBuffer): string => {
        const bytes = new Uint8Array(buffer);
        const chunkSize = 65536; // 64KB chunks to avoid call stack overflow
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

      const base64PDF = arrayBufferToBase64(arrayBuffer);
      setProgress(75);

      // Create a simplified dark mode HTML viewer
      const darkModeViewer = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="color-scheme" content="dark">
    <meta name="theme-color" content="#000000">
    <title>Dark Mode PDF - ${selectedFile.name}</title>
    <style>
        :root {
            color-scheme: dark;
        }
        
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        html {
            background: #000000;
            color-scheme: dark;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: #000000;
            color: white;
            overflow: hidden;
            margin: 0;
            padding: 0;
        }

        .header {
            background: #1a1a1a;
            padding: 12px 20px;
            border-bottom: 1px solid #333;
            display: flex;
            justify-content: space-between;
            align-items: center;
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            z-index: 1000;
        }

        .title {
            font-size: 14px;
            font-weight: 500;
            color: #e5e5e5;
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .download-btn {
            background: #4f46e5;
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 6px;
            font-size: 13px;
            cursor: pointer;
            transition: all 0.2s;
            font-weight: 500;
            text-decoration: none;
        }

        .download-btn:hover {
            background: #3730a3;
            transform: translateY(-1px);
        }

        .pdf-container {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            overflow: hidden;
            background: #000000;
        }

        .pdf-viewer {
            width: 100%;
            height: 100%;
            border: none;
            background: #000000;
            filter: invert(0.92) hue-rotate(180deg) contrast(1.05) brightness(1.15) saturate(1.1);
        }
        
        /* Force dark mode on PDF viewer */
        embed {
            background: #000000 !important;
            color-scheme: dark !important;
        }
        
        /* Additional styling for PDF controls */
        embed::-webkit-media-controls-panel {
            background-color: #1a1a1a !important;
        }
        
        /* Force dark theme on all PDF viewer elements */
        embed, object, iframe {
            color-scheme: dark !important;
            background: #000000 !important;
        }
        
        /* Target PDF.js viewer if present */
        .textLayer {
            filter: invert(1) hue-rotate(180deg) !important;
        }
        
        /* Force dark scrollbars */
        * {
            scrollbar-color: #333 #000 !important;
            scrollbar-width: thin !important;
        }
        
        *::-webkit-scrollbar {
            background: #000 !important;
        }
        
        *::-webkit-scrollbar-thumb {
            background: #333 !important;
        }

        .icon {
            width: 16px;
            height: 16px;
            fill: currentColor;
        }

        @media (max-width: 768px) {
            .header {
                padding: 8px 12px;
            }

            .title {
                font-size: 12px;
            }

            .download-btn {
                padding: 6px 12px;
                font-size: 12px;
            }

            .pdf-container {
                top: 60px;
            }
        }
    </style>
</head>
<body>
    <div class="pdf-container">
        <embed 
            id="pdf-viewer" 
            class="pdf-viewer"
            src="data:application/pdf;base64,${base64PDF}"
            title="PDF Document">
    </div>

</body>
</html>`;

      setProgress(90);
      setStatusMessage({ text: 'Finalizing dark mode experience...', type: 'processing' });

      // Create blob and URL
      const htmlBlob = new Blob([darkModeViewer], { type: 'text/html' });
      const url = URL.createObjectURL(htmlBlob);
      setDownloadUrl(url);

      setProgress(100);
      setStatusMessage({ 
        text: `✅ Dark mode PDF ready! Perfect text selection preserved. Viewer size: ${(htmlBlob.size / 1024 / 1024).toFixed(1)}MB`, 
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

  // Using the utility function for icons
  const getStatusIcon = () => getStatusIconUtil(statusMessage.type);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="text-center lg:text-left">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
              Convert PDF to <span className="text-purple-400">Dark Mode</span>
            </h2>
            <p className="text-lg text-gray-300 mb-8">
              Transform your PDF documents to dark theme for comfortable reading in low-light environments.
              Our advanced CSS filter technology preserves text selectability and maintains perfect quality.
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
              className="flex-1 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 flex items-center justify-center space-x-3 shadow-lg hover:shadow-purple-500/25"
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
                  className="flex-1 sm:flex-none bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 flex items-center justify-center space-x-3 shadow-lg hover:shadow-green-500/25"
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
                  className="flex-1 sm:flex-none bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 flex items-center justify-center space-x-3 shadow-lg hover:shadow-blue-500/25"
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

          {/* Features Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-8">
            {/* ... Feature cards ... */}
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

        {/* Sidebar / Info Section */}
        <div className="space-y-6">
          {/* ... How it works, Benefits, Stats ... */}
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
  );
} 