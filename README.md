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
- **Direct Download**: Instantly download your converted PDF
- **File Size Display**: Shows file size in KB or MB
- **PWA Ready**: Includes manifest and icons for PWA support

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
.gitignore
CONTRIBUTING.md
DEPLOYMENT.md
LICENSE
README.md
next-env.d.ts
package-lock.json
package.json
postcss.config.js
tailwind.config.js
tsconfig.json
components/
├── features/
│   └── pdf/
│       └── PdfConverter.tsx
├── layout/
│   ├── Footer.tsx
│   └── Header.tsx
└── ui/
    ├── FileUploadArea.tsx
    ├── ProgressBar.tsx
    └── StatusDisplay.tsx
constants/
    └── (empty - for future constants)
hooks/
    └── (empty - for future custom hooks)
public/
├── apple-touch-icon.png
├── favicon-16x16.png
├── favicon-32x32.png
├── favicon.ico
├── logo.png
└── pdf.worker.mjs
src/
├── pages/
│   ├── _app.tsx
│   └── index.tsx
└── styles/
    └── globals.css
utils/
    └── (empty - for future utility functions)
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v18.x or later recommended)
- npm or yarn

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/yourusername/pdf-dark-mode-converter.git
    cd pdf-dark-mode-converter
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    # or
    # yarn install
    ```

3.  **Set up PDF.js worker:**
    Copy `node_modules/pdfjs-dist/build/pdf.worker.mjs` to the `public/` directory.
    *Ensure your `pdf.worker.mjs` is in the `public` folder for the application to work correctly.*

### Running the Development Server

```bash
npm run dev
# or
# yarn dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 🛠️ How It Works

1.  **File Selection**: User uploads a PDF file via the drag & drop interface or file browser.
2.  **PDF Parsing**: The application uses `pdfjs-dist` to parse the PDF document page by page directly in the browser.
3.  **Canvas Rendering**: Each page is rendered onto an HTML5 Canvas element.
4.  **Pixel Manipulation**: The pixel data of the rendered page on the canvas is accessed. Each pixel's RGB values are inverted (e.g., `newColor = 255 - oldColor`).
5.  **New PDF Generation**: The modified (inverted) image data from the canvas is then used to create a new page in a PDF document using `jsPDF`.
6.  **Download**: The newly generated dark mode PDF is provided to the user as a direct download.

## 📜 Scripts

- `npm run dev`: Starts the development server.
- `npm run build`: Builds the application for production.
- `npm run start`: Starts a production server (after building).
- `npm run lint`: Lints the codebase (you may need to configure ESLint).

## 🤝 Contributing

Contributions are welcome! Please see `CONTRIBUTING.md` for more details on how to get started, report bugs, and submit pull requests.

## ☁️ Deployment

Refer to `DEPLOYMENT.md` for instructions on deploying this application to platforms like Vercel or Netlify.

## 📝 License

This project is licensed under the MIT License - see the `LICENSE` file for details.

## 🙏 Acknowledgements

- [PDF.js](https://mozilla.github.io/pdf.js/) for PDF rendering.
- [jsPDF](https://github.com/parallax/jsPDF) for PDF generation.
- [Tailwind CSS](https://tailwindcss.com/) for styling.
- [Heroicons](https://heroicons.com/) for icons.

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

---

**Made with ❤️ for better reading experiences** 