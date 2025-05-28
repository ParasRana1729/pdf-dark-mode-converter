export default function Footer() {
  return (
    <footer className="border-t border-gray-800 bg-[#1a1a2e] mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} PDF Dark Mode Converter. All files are processed locally in your browser.
          </p>
        </div>
      </div>
    </footer>
  );
} 