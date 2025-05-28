export default function Header() {
  return (
    <header className="border-b border-gray-800 bg-[#1a1a2e]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <div className="relative w-8 h-8">
              <img
                src="/logo.png"
                alt="PDF Converter Logo"
                width={32}
                height={32}
                className="rounded-lg"
                onError={(e) => {
                  console.error('Logo failed to load');
                  e.currentTarget.style.display = 'none';
                }}
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
  );
} 