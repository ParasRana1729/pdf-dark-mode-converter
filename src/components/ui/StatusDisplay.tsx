import { ArrowUpTrayIcon, CheckCircleIcon, XCircleIcon, ArrowPathIcon } from '@heroicons/react/24/outline';

interface StatusMessage {
  text: string;
  type: 'info' | 'success' | 'error' | 'processing';
}

interface StatusDisplayProps {
  statusMessage: StatusMessage;
}

export function getStatusIcon(type: StatusMessage['type']) {
  switch (type) {
    case 'info': return <ArrowUpTrayIcon className="h-4 w-4 text-blue-400 shrink-0" />;
    case 'success': return <CheckCircleIcon className="h-4 w-4 text-green-400 shrink-0" />;
    case 'error': return <XCircleIcon className="h-4 w-4 text-red-400 shrink-0" />;
    case 'processing': return <ArrowPathIcon className="h-4 w-4 text-amber-400 animate-spin shrink-0" />;
    default: return null;
  }
}

export default function StatusDisplay({ statusMessage }: StatusDisplayProps) {
  const icon = getStatusIcon(statusMessage.type);
  let textColorClass = 'text-gray-400';
  if (statusMessage.type === 'success') textColorClass = 'text-green-400';
  if (statusMessage.type === 'error') textColorClass = 'text-red-400';
  if (statusMessage.type === 'processing') textColorClass = 'text-amber-400';

  return (
    <div className="flex items-center space-x-2 text-sm">
      {icon}
      <span className={textColorClass}>{statusMessage.text}</span>
    </div>
  );
} 