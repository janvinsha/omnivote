# Contributing to OmniVote
First off, thank you for considering contributing to OmniVote! 🎉 Your efforts are greatly appreciated and help make OmniVote a better project for everyone.
## Table of Contents
- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
  - [Reporting Bugs](#reporting-bugs)
  - [Suggesting Enhancements](#suggesting-enhancements)
  - [Your First Contribution](#your-first-contribution)
  - [Pull Requests](#pull-requests)
- [Style Guides](#style-guides)
  - [Git Commit Messages](#git-commit-messages)
  - [JavaScript/TypeScript Style Guide](#javascripttypescript-style-guide)
- [Setting Up the Development Environment](#setting-up-the-development-environment)
- [Additional Notes](#additional-notes)
## Code of Conduct
By participating in this project, you agree to abide by our Code of Conduct. Please take a moment to read it.
## How Can I Contribute?
### Reporting Bugs
If you find a bug in OmniVote, please open an issue with a clear and descriptive title. Include as much information as possible to help us reproduce and fix the issue.
### Suggesting Enhancements
Have an idea to improve OmniVote? We’d love to hear it! Please open an issue and provide a detailed description of your suggestion.
### Your First Contribution
If you're new to open-source or OmniVote, here are some ways to get started:
- **Documentation:** Improve the README.md, add more examples, or enhance the existing documentation.
- **Bug Fixes:** Look for issues tagged with help wanted.
- **Feature Implementation:** Start working on a feature you'd like to see in OmniVote. Please discuss it first by opening an issue.
### Pull Requests
1. **Fork the Repository:** Click the "Fork" button at the top right of the repository page.
2. **Clone the Fork:**  
   ```bash
   git clone https://github.com/janvinsha/OmniVote.git
   ```
3. **Create a New Branch:**  
   ```bash
   git checkout -b feature/YourFeatureName
   ```
4. **Make Your Changes:** Implement your feature or bug fix.
5. **Commit Your Changes:**  
   ```bash
   git commit -m "Add [description of your feature]"
   ```
6. **Push to Your Fork:**  
   ```bash
   git push origin feature/YourFeatureName
   ```
7. **Open a Pull Request:** Navigate to the original repository and click "Compare & pull request."
Please ensure your pull request adheres to the project's coding standards and includes relevant tests.
## Style Guides
### Git Commit Messages
Follow the Conventional Commits specification for commit messages.
**Examples:**
- `feat(authentication): add JWT support`
- `fix(voting): resolve vote count discrepancy`
### JavaScript/TypeScript Style Guide
- **Formatting:** Use Prettier for consistent code formatting.
- **Linting:** Follow ESLint rules as defined in the project.
- **Type Checking:** Ensure TypeScript types are correctly defined and used.
## Setting Up the Development Environment
To set up a local development environment, follow these steps:
1. **Clone the Repository:**  
   ```bash
   git clone https://github.com/janvinsha/OmniVote.git
   ```
2. **Navigate to the Project Directory:**  
   ```bash
   cd OmniVote
   ```
3. **Install Dependencies:**  
   ```bash
   npm install
   ```
4. **Configure Environment Variables:**  
   Create a `.env` file in the root directory and add the necessary environment variables as outlined in the README.md.
5. **Run the Development Server:**  
   ```bash
   npm run dev
   ```
6. **Run Tests:**  
   ```bash
   npm test
   ```
## Additional Notes
- **Dependencies:** Ensure all dependencies are up-to-date and compatible with the project.
- **Testing:** Write tests for new features and bug fixes to maintain code quality.
- **Documentation:** Update documentation to reflect any changes or additions to the project.
---
Thank you for your interest in contributing to OmniVote! Together, we can build a robust and decentralized voting platform that empowers users across multiple blockchain networks.
