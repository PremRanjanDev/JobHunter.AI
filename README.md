# JobHunter.AI

JobHunter.AI is an automated job application tool for LinkedIn, powered by AI and Puppeteer.

## Features
- Automated LinkedIn login (manual or session-based)
- Easy Apply automation for jobs using Puppeteer
- AI-powered job and form parsing (OpenAI integration)
- Modular, modern ES module codebase

## Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- npm
- [OpenAI API key](https://platform.openai.com/)

### Installation
```sh
npm install
```

### Configuration
1. Place your OpenAI API key in `keys/openai-key.txt`.
2. (Optional) Adjust job search keywords and location in `src/main.js`.

### Usage
To run the main automation:
```sh
npm start
```
Or:
```sh
node src/main.js
```

### Project Structure
- `src/ai/` — AI utilities and OpenAI integration
- `src/linkedin/` — LinkedIn automation modules
- `src/utils/` — Utility classes (e.g., JSON file handling)
- `src/main.js` — Main entry point

### Notes
- By default, login session is only saved if you pass `saveLogin=true` to the login function.
- All code uses modern ES module syntax and best practices.

## License
MIT
