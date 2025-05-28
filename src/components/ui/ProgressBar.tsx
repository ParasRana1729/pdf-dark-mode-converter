interface ProgressBarProps {
  progress: number;
  statusMessage: {
    text: string;
    type: 'info' | 'success' | 'error' | 'processing';
  };
}

export default function ProgressBar({ progress, statusMessage }: ProgressBarProps) {
  return (
    <div className="mt-6 space-y-3">
      <div className="w-full bg-gray-700 rounded-full h-2">
        <div
          className="bg-gradient-to-r from-purple-500 to-purple-600 h-2 rounded-full transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="flex items-center justify-between text-sm">
        {/* StatusDisplay will be used here eventually, but for now keep it simple */}
        <span className={`${
          statusMessage.type === 'success' ? 'text-green-400' :
          statusMessage.type === 'error' ? 'text-red-400' :
          statusMessage.type === 'processing' ? 'text-amber-400' : 'text-gray-300'
        }`}>{statusMessage.text}</span>
        <span className="text-purple-400 font-medium">{progress}%</span>
      </div>
    </div>
  );
} 