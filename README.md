# ATS Score Checker

A React application that analyzes resumes using Google's Gemini AI to provide ATS (Applicant Tracking System) scoring and optimization suggestions.

## Features

- **PDF Resume Upload**: Drag and drop PDF resumes for analysis
- **PDF Preview**: View uploaded resumes with page navigation
- **AI-Powered Analysis**: Uses Google Gemini AI for comprehensive ATS scoring
- **Keyword Analysis**: Identifies matched and missing keywords
- **Section Scoring**: Detailed breakdown of resume sections (keywords, formatting, structure, length)
- **Improvement Suggestions**: AI-generated recommendations for resume optimization
- **Job Description Integration**: Optional job description input for targeted analysis

## Setup

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Google Gemini API key

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd project/frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your Gemini API key:
   ```
   VITE_GEMINI_API_KEY=your_gemini_api_key_here
   ```

4. **Get a Gemini API key**
   - Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Create a new API key
   - Copy the key to your `.env` file

### Running the Application

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Usage

1. **Upload Resume**: Drag and drop a PDF resume or click to browse
2. **Preview**: Use the eye icon to preview the uploaded PDF
3. **Add Job Description** (Optional): Paste a job description for targeted analysis
4. **Analyze**: Click "Analyze Resume" to get ATS scoring
5. **Review Results**: View detailed scores, keyword analysis, and improvement suggestions

## Technical Stack

- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS
- **PDF Processing**: react-pdf, pdfjs-dist
- **AI Integration**: Google Generative AI (Gemini)
- **File Upload**: react-dropzone
- **Icons**: Lucide React

## API Integration

The application uses Google's Gemini AI API for resume analysis. The AI provides:

- Overall ATS score (0-100)
- Section-specific scores (keywords, formatting, structure, length)
- Keyword matching analysis
- Personalized improvement suggestions

## File Structure

```
src/
├── components/
│   ├── Header.tsx          # Navigation header
│   ├── UploadSection.tsx   # File upload and analysis
│   ├── ScoreDisplay.tsx    # Results display
│   └── ...
├── services/
│   └── geminiService.ts    # Gemini AI integration
└── ...
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_GEMINI_API_KEY` | Google Gemini API key | Yes |

## Troubleshooting

### Common Issues

1. **PDF not loading**: Ensure the PDF file is valid and under 10MB
2. **Analysis fails**: Check your Gemini API key is valid and has sufficient quota
3. **CORS errors**: Ensure you're running the development server locally

### API Limits

- Google Gemini API has rate limits and usage quotas
- Large PDFs may take longer to process
- Ensure your API key has sufficient quota for testing

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License. 