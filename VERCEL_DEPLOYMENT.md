# Vercel Deployment Guide for ATS Score Checker

## Issues Fixed

The following changes have been made to resolve PDF analysis issues on Vercel:

### 1. PDF.js Worker Configuration
- Updated worker configuration to use reliable CDN sources
- Added fallback worker configurations
- Fixed CORS issues with PDF.js workers

### 2. Vite Configuration
- Added proper optimization for PDF.js and Tesseract.js
- Configured manual chunks for better loading
- Added global definition for compatibility

### 3. Error Handling
- Added comprehensive error handling for PDF processing
- Implemented multiple PDF extraction methods
- Added timeout handling for API calls
- Enhanced logging for debugging

### 4. Vercel Configuration
- Added `vercel.json` with proper headers and function configuration
- Configured CORS headers for PDF processing
- Set appropriate function timeouts

## Deployment Steps

### 1. Environment Variables
Make sure to set the following environment variable in your Vercel project:

```
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

### 2. Build Configuration
The project is configured to work with Vercel's build system. No additional configuration needed.

### 3. Deployment
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy the project

## Troubleshooting

### If PDF Analysis Still Fails:

1. **Check Environment Variables**
   - Verify `VITE_GEMINI_API_KEY` is set in Vercel dashboard
   - Ensure the API key is valid and has sufficient quota

2. **Use Debug Tool**
   - The debug tool is available when there are errors or in development
   - Click "Debug PDF Processing" to test PDF extraction step by step

3. **Check Browser Console**
   - Open browser developer tools
   - Look for error messages in the console
   - Check network tab for failed requests

4. **Common Issues and Solutions**

   **Issue: "PDF.js worker failed to load"**
   - Solution: The app now uses multiple CDN fallbacks
   - Check if your browser blocks CDN resources

   **Issue: "API key not found"**
   - Solution: Verify environment variable is set in Vercel
   - Check variable name spelling (must start with `VITE_`)

   **Issue: "Request timeout"**
   - Solution: The app now has a 25-second timeout
   - Try with a smaller PDF file
   - Check your internet connection

   **Issue: "Unable to extract text from PDF"**
   - Solution: Ensure PDF contains selectable text (not just images)
   - Try converting scanned PDFs to text-based PDFs
   - Use the debug tool to test extraction methods

### 4. Testing
1. Upload a simple text-based PDF first
2. Check if the debug tool shows successful extraction
3. Try with different PDF formats (PDF, DOCX, TXT)

## Performance Optimization

The app includes several optimizations for Vercel:

- **Lazy Loading**: PDF.js and Tesseract.js are loaded only when needed
- **Multiple Extraction Methods**: Falls back to different methods if one fails
- **Timeout Handling**: Prevents hanging requests
- **Error Recovery**: Graceful fallbacks when processing fails

## Support

If you continue to experience issues:

1. Use the debug tool to identify the specific problem
2. Check the browser console for detailed error messages
3. Verify your Gemini API key is working
4. Test with different PDF files to isolate the issue

## Recent Changes

- ✅ Fixed PDF.js worker configuration for production
- ✅ Added multiple PDF extraction fallback methods
- ✅ Enhanced error handling and logging
- ✅ Added debug tool for troubleshooting
- ✅ Configured Vercel-specific optimizations
- ✅ Added timeout handling for API calls 