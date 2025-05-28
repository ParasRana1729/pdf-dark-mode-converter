import { ArrowUpTrayIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { ChangeEvent, DragEvent } from 'react';

interface FileUploadAreaProps {
  dragOver: boolean;
  handleDragOver: (event: DragEvent<HTMLDivElement>) => void;
  handleDragLeave: (event: DragEvent<HTMLDivElement>) => void;
  handleDrop: (event: DragEvent<HTMLDivElement>) => void;
  handleFileChange: (event: ChangeEvent<HTMLInputElement>) => void;
  isProcessing: boolean;
  selectedFile: File | null;
}

export default function FileUploadArea({
  dragOver,
  handleDragOver,
  handleDragLeave,
  handleDrop,
  handleFileChange,
  isProcessing,
  selectedFile,
}: FileUploadAreaProps) {
  return (
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
                  <path
                    fillRule="evenodd"
                    d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div>
                <p className="text-white font-medium truncate max-w-xs">
                  {selectedFile.name}
                </p>
                <p className="text-sm text-gray-400">
                  {selectedFile.size >= 1024 * 1024
                    ? `${(selectedFile.size / (1024 * 1024)).toFixed(1)} MB`
                    : `${Math.round(selectedFile.size / 1024)} KB`}
                  {' • PDF Document'}
                </p>
              </div>
            </div>
            <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center">
              <CheckCircleIcon className="w-5 h-5 text-green-400" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 