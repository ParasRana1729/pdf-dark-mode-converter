# Contributing to PDF Dark Mode Converter

We love your input! We want to make contributing to PDF Dark Mode Converter as easy and transparent as possible, whether it's:

- Reporting a bug
- Discussing the current state of the code
- Submitting a fix
- Proposing new features
- Becoming a maintainer

## 🚀 Quick Start

1. **Fork the repository**
2. **Clone your fork**
   ```bash
   git clone https://github.com/yourusername/pdf-dark-mode-converter.git
   cd pdf-dark-mode-converter
   ```
3. **Install dependencies**
   ```bash
   npm install
   ```
4. **Start development server**
   ```bash
   npm run dev
   ```

## 📋 Development Guidelines

### Code Style

We use the following tools to maintain code quality:

- **ESLint** for code linting
- **Prettier** for code formatting
- **TypeScript** for type safety
- **Tailwind CSS** for styling

Run linting before submitting:
```bash
npm run lint
```

### Git Workflow

1. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Write clear, concise commit messages
   - Follow conventional commit format: `type(scope): description`
   - Examples:
     - `feat(ui): add dark theme toggle`
     - `fix(pdf): resolve worker loading issue`
     - `docs(readme): update installation guide`

3. **Test your changes**
   ```bash
   npm run build
   npm run dev
   ```

4. **Commit and push**
   ```bash
   git add .
   git commit -m "feat(feature): add new feature description"
   git push origin feature/your-feature-name
   ```

5. **Create a Pull Request**

## 🐛 Bug Reports

When filing an issue, make sure to answer these questions:

1. **What browser and version are you using?**
2. **What did you do?**
3. **What did you expect to see?**
4. **What did you see instead?**
5. **Can you provide a sample PDF file?** (if relevant)

### Bug Report Template

```markdown
**Describe the bug**
A clear and concise description of what the bug is.

**To Reproduce**
Steps to reproduce the behavior:
1. Go to '...'
2. Click on '....'
3. Upload file '....'
4. See error

**Expected behavior**
A clear and concise description of what you expected to happen.

**Screenshots**
If applicable, add screenshots to help explain your problem.

**Environment:**
 - OS: [e.g. iOS]
 - Browser [e.g. chrome, safari]
 - Version [e.g. 22]

**Additional context**
Add any other context about the problem here.
```

## ✨ Feature Requests

We love feature requests! Please:

1. **Check if the feature already exists**
2. **Describe the feature clearly**
3. **Explain why it would be useful**
4. **Consider implementation complexity**

### Feature Request Template

```markdown
**Is your feature request related to a problem? Please describe.**
A clear and concise description of what the problem is.

**Describe the solution you'd like**
A clear and concise description of what you want to happen.

**Describe alternatives you've considered**
A clear and concise description of any alternative solutions.

**Additional context**
Add any other context or screenshots about the feature request.
```

## 📝 Pull Request Process

1. **Ensure your code follows our style guidelines**
2. **Update documentation if needed**
3. **Add tests for new features** (if applicable)
4. **Ensure the build passes**
5. **Link any relevant issues**

### Pull Request Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] I have tested these changes locally
- [ ] I have added tests that prove my fix is effective
- [ ] I have checked that new and existing tests pass

## Screenshots (if applicable)
Add screenshots to help explain your changes

## Checklist
- [ ] My code follows the project's style guidelines
- [ ] I have performed a self-review of my code
- [ ] I have commented my code where necessary
- [ ] I have made corresponding changes to the documentation
- [ ] My changes generate no new warnings
```

## 🏗️ Project Structure

```
src/
├── pages/           # Next.js pages
├── styles/          # Global styles and Tailwind CSS
public/
├── logo.png         # Application logo
├── favicon.ico      # Favicon files
└── pdf.worker.mjs   # PDF.js worker
```

## 🧪 Testing Guidelines

### Manual Testing

When contributing, please test:

1. **File Upload**
   - Drag & drop functionality
   - File type validation
   - File size limits

2. **PDF Conversion**
   - Various PDF types (text, images, mixed)
   - Different file sizes
   - Error handling

3. **UI/UX**
   - Responsive design
   - Dark theme consistency
   - Progress indicators

### Automated Testing

We encourage adding tests for new features:

```bash
# Run tests (when available)
npm run test

# Run type checking
npx tsc --noEmit
```

## 📚 Documentation

Help us improve documentation:

- **README.md**: General project information
- **DEPLOYMENT.md**: Deployment instructions
- **API documentation**: For any new endpoints
- **Code comments**: For complex logic

## 🤝 Code of Conduct

### Our Pledge

We are committed to making participation in this project a harassment-free experience for everyone.

### Our Standards

Examples of behavior that contributes to creating a positive environment:

- Being respectful and inclusive
- Gracefully accepting constructive criticism
- Focusing on what is best for the community
- Showing empathy towards other community members

### Enforcement

Project maintainers are responsible for clarifying standards and will take appropriate action in response to unacceptable behavior.

## 🏷️ Issue Labels

We use the following labels to categorize issues:

- `bug` - Something isn't working
- `enhancement` - New feature or request
- `documentation` - Improvements to documentation
- `good first issue` - Good for newcomers
- `help wanted` - Extra attention is needed
- `question` - Further information is requested

## 🎯 Roadmap

Current priorities:

1. **Performance optimization** for large PDFs
2. **Batch processing** capabilities
3. **Custom color schemes** beyond dark mode
4. **Mobile app** version
5. **API** for programmatic access

## 💬 Community

- **GitHub Issues**: For bugs and feature requests
- **GitHub Discussions**: For questions and community discussion

## 📞 Contact

- Create an issue for bugs or features
- Start a discussion for questions
- Email: [your-email] for security issues

## 🙏 Recognition

Contributors will be recognized in:

- README.md contributors section
- Release notes for significant contributions
- GitHub contributors page

---

**Thank you for contributing to PDF Dark Mode Converter!** 🎉 