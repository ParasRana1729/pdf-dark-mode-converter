# PDF Dark Mode Converter

A modern web application that converts PDF documents to dark mode for comfortable reading in low-light environments. Built with Next.js, React, TypeScript, and Tailwind CSS.

![PDF Dark Mode Converter](public/logo.png)

## 🌟 Features

- **True Color Inversion**: Pixel-level color inversion that preserves text clarity and document formatting
- **Modern Dark UI**: Professional dark theme inspired by modern developer tools like PDF.io and Smallpdf
- **Fast Processing**: Client-side processing ensures quick conversion without uploading files to servers
- **Secure**: All processing happens locally in your browser - files never leave your device
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Drag & Drop**: Easy file upload with drag and drop support
- **Progress Tracking**: Real-time conversion progress with detailed status messages
- **High Quality**: Preserves document structure and layout quality

## 🛠️ Technology Stack

- **Frontend Framework**: Next.js 14.2.5
- **UI Library**: React 18
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **PDF Processing**: PDF.js & jsPDF
- **Icons**: Heroicons
- **Image Optimization**: Next.js Image component

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/pdf-dark-mode-converter.git
   cd pdf-dark-mode-converter
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

## 🎯 Usage

1. **Upload PDF**: Click the upload area or drag and drop your PDF file (max 50MB)
2. **Convert**: Click "Convert to Dark Mode" to start the conversion process
3. **Download**: Once complete, download your dark mode PDF

## 🏗️ Project Structure

```
pdf-dark-mode-converter/
├── public/
│   ├── logo.png              # Application logo
│   ├── favicon.ico           # Favicon files
│   ├── pdf.worker.mjs        # PDF.js worker
│   └── ...
├── src/
│   ├── pages/
│   │   └── index.tsx         # Main application page
│   └── styles/
│       └── globals.css       # Global styles
├── package.json
├── tailwind.config.js
├── next.config.js
└── README.md
```

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Key Components

- **File Upload**: Drag & drop interface with file validation
- **PDF Processing**: Uses PDF.js for rendering and jsPDF for output
- **Progress Tracking**: Real-time progress updates during conversion
- **Dark Theme**: Modern dark UI with purple accent colors

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy automatically

### Manual Deployment

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Start the production server**
   ```bash
   npm start
   ```

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed deployment instructions.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🐛 Known Issues

- Large PDFs (>10MB) may take longer to process
- Complex layouts with embedded images may require additional processing time
- Some PDF forms and interactive elements may not convert perfectly

## 🔮 Future Enhancements

- [ ] Batch PDF conversion
- [ ] Custom color schemes beyond dark mode
- [ ] PDF compression options
- [ ] Cloud storage integration
- [ ] API for programmatic access

## 📞 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/yourusername/pdf-dark-mode-converter/issues) page
2. Create a new issue with detailed information
3. Include browser version and PDF details if relevant

## 🙏 Acknowledgments

- [PDF.js](https://github.com/mozilla/pdf.js/) for PDF rendering
- [jsPDF](https://github.com/parallax/jsPDF) for PDF generation
- [Heroicons](https://heroicons.com/) for beautiful icons
- [Tailwind CSS](https://tailwindcss.com/) for styling

---

**Made with ❤️ for better reading experiences** 