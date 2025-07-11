import { GoogleGenerativeAI } from '@google/generative-ai';
import mammoth from 'mammoth';

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || '');

export interface ATSAnalysisResult {
  overallScore: number;
  fileName: string;
  analysisDate: string;
  isFromGemini: boolean;
  sections: {
    keywords: { score: number; status: string };
    formatting: { score: number; status: string };
    structure: { score: number; status: string };
    length: { score: number; status: string };
  };
  keywordAnalysis: {
    matched: string[];
    missing: string[];
    density: number;
  };
  suggestions: string[];
  resumeText?: string;
}

export class GeminiService {
  private static async extractTextFromFile(file: File): Promise<string> {
    const fileType = file.type;
    const fileName = file.name.toLowerCase();
    
    if (fileType === 'application/pdf' || fileName.endsWith('.pdf')) {
      return this.extractTextFromPDF(file);
    } else if (fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || fileName.endsWith('.docx')) {
      return this.extractTextFromDOCX(file);
    } else if (fileType === 'text/plain' || fileName.endsWith('.txt')) {
      return this.extractTextFromTXT(file);
    } else {
      throw new Error('Unsupported file format. Please upload a PDF, DOCX, or TXT file.');
    }
  }

  private static async extractTextFromPDF(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const arrayBuffer = e.target?.result as ArrayBuffer;
          
          // Try multiple extraction methods in sequence
          const extractionMethods = [
            () => this.extractTextFromArrayBuffer(arrayBuffer),
            () => this.extractTextWithAlternativePDFJS(arrayBuffer),
            () => this.extractTextFromPDFWithOCR(arrayBuffer),
            () => this.extractRawTextFromPDF(arrayBuffer)
          ];
          
          for (let i = 0; i < extractionMethods.length; i++) {
            try {
              const text = await extractionMethods[i]();
              
              if (text && text.length > 100 && !this.containsPDFArtifacts(text)) {
                resolve(text);
                return;
              }
            } catch (methodError) {
              continue;
            }
          }
          
          // If all methods fail, create a fallback
          const fallbackText = this.createFallbackResumeText(file);
          resolve(fallbackText);
          
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = reject;
      reader.readAsArrayBuffer(file);
    });
  }

  private static async extractTextWithAlternativePDFJS(arrayBuffer: ArrayBuffer): Promise<string> {
    const pdfjsLib = await import('pdfjs-dist');
    
    // Try different worker configurations with reliable CDNs
    const workerConfigs = [
      `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`,
      `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.js`,
      `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.js`
    ];
    
    for (const workerSrc of workerConfigs) {
      try {
        pdfjsLib.GlobalWorkerOptions.workerSrc = workerSrc;
        
        const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
        const pdf = await loadingTask.promise;
        
        let fullText = '';
        
        for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
          const page = await pdf.getPage(pageNum);
          const textContent = await page.getTextContent();
          
          const pageText = textContent.items
            .map((item: any) => item.str)
            .join(' ');
          
          fullText += pageText + '\n';
        }
        
        const cleanedText = fullText.replace(/\s+/g, ' ').trim();
        if (cleanedText.length > 100 && !this.containsPDFArtifacts(cleanedText)) {
          return cleanedText;
        }
      } catch (error) {
        continue;
      }
    }
    
    throw new Error('All PDF.js configurations failed');
  }

  private static async extractRawTextFromPDF(arrayBuffer: ArrayBuffer): Promise<string> {
    const uint8Array = new Uint8Array(arrayBuffer);
    const textDecoder = new TextDecoder('utf-8');
    
    // Look for text content in chunks
    let text = '';
    const chunkSize = 4096;
    
    for (let i = 0; i < uint8Array.length; i += chunkSize) {
      const chunk = uint8Array.slice(i, i + chunkSize);
      const chunkText = textDecoder.decode(chunk);
      
      // Extract readable text patterns
      const words = chunkText.match(/[a-zA-Z]{3,}/g);
      if (words) {
        text += words.join(' ') + ' ';
      }
    }
    
    // Clean up the text
    text = text.replace(/\s+/g, ' ').trim();
    
    if (text.length > 100 && !this.containsPDFArtifacts(text)) {
      return text;
    }
    
    throw new Error('Raw text extraction failed');
  }

  private static containsPDFArtifacts(text: string): boolean {
    const pdfArtifacts = [
      /\/\w+\s+\d+\s+\d+\s+R/,
      /BT\s+ET/,
      /Td\s+Tj/,
      /stream.*endstream/i,
      /\/Font\s+\d+\s+\d+\s+R/,
      /\/Type\s+\/Page/,
      /\/MediaBox\s+\[/,
      /\/Parent\s+\d+\s+\d+\s+R/
    ];
    
    return pdfArtifacts.some(pattern => pattern.test(text));
  }

  private static createFallbackResumeText(file: File): string {
    return `Resume Analysis - ${file.name}

This PDF appears to contain scanned content or encoded text that cannot be automatically extracted. 

To get accurate ATS analysis, please:
1. Convert this PDF to a Word document (.docx) or text file (.txt)
2. Ensure the document contains selectable text, not just images
3. If this is a scanned document, use OCR software to convert it to text first

File Information:
- Name: ${file.name}
- Size: ${(file.size / 1024 / 1024).toFixed(2)} MB
- Type: PDF (may contain scanned content)

For best results, recreate your resume in a text-based format and upload again.`;
  }

  private static async extractTextFromDOCX(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const arrayBuffer = e.target?.result as ArrayBuffer;
          
          // Use mammoth.js to extract text from DOCX
          const result = await mammoth.extractRawText({ arrayBuffer });
          
          if (result.value && result.value.length > 50) {
            resolve(result.value);
          } else {
            reject(new Error('Unable to extract text from DOCX file'));
          }
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = reject;
      reader.readAsArrayBuffer(file);
    });
  }

  private static async extractTextFromTXT(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const text = e.target?.result as string;
          if (text.length < 50) {
            reject(new Error('Text file appears to be too short to be a valid resume'));
          }
          resolve(text);
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = reject;
      reader.readAsText(file);
    });
  }

  private static async extractTextFromArrayBuffer(arrayBuffer: ArrayBuffer): Promise<string> {
    try {
      // Import pdfjs-dist dynamically
      const pdfjsLib = await import('pdfjs-dist');
      
      // Configure worker properly for production
      if (typeof window !== 'undefined') {
        // Use a reliable CDN that works well with Vercel
        pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
      }
      
      // Load the PDF document
      const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
      const pdf = await loadingTask.promise;
      
      let fullText = '';
      
      // Extract text from each page
      for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        const page = await pdf.getPage(pageNum);
        const textContent = await page.getTextContent();
        
        // Extract text items and their positions
        const textItems = textContent.items.map((item: any) => ({
          text: item.str,
          x: item.transform[4],
          y: item.transform[5],
          width: item.width,
          height: item.height
        }));
        
        // Sort text items by position (top to bottom, left to right)
        textItems.sort((a, b) => {
          // First sort by Y position (top to bottom)
          if (Math.abs(a.y - b.y) > 5) {
            return b.y - a.y;
          }
          // Then sort by X position (left to right)
          return a.x - b.x;
        });
        
        // Build page text with proper spacing
        let pageText = '';
        let lastY = -1;
        
        for (const item of textItems) {
          // Add line break if Y position changes significantly
          if (lastY !== -1 && Math.abs(item.y - lastY) > 10) {
            pageText += '\n';
          }
          
          // Add space between items on same line if they're far apart
          if (pageText.length > 0 && !pageText.endsWith('\n') && !pageText.endsWith(' ')) {
            pageText += ' ';
          }
          
          pageText += item.text;
          lastY = item.y;
        }
        
        fullText += pageText + '\n\n';
      }
      
      // Clean up the extracted text
      fullText = fullText
        .replace(/\s+/g, ' ') // Replace multiple spaces with single space
        .replace(/\n\s*\n/g, '\n') // Replace multiple newlines with single newline
        .trim();
      
      // Validate that we got meaningful text
      if (fullText.length < 100) {
        throw new Error('Insufficient text extracted from PDF');
      }
      
      // Check if the text looks like actual content (not just PDF code)
      const hasReadableContent = /[a-zA-Z]{3,}/.test(fullText);
      if (!hasReadableContent) {
        throw new Error('Extracted content appears to be PDF code, not readable text');
      }
      
      return fullText;
    } catch (error) {
      throw new Error(`Unable to extract readable text from PDF: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // OCR fallback for scanned/image-only PDFs
  private static async extractTextFromPDFWithOCR(arrayBuffer: ArrayBuffer): Promise<string> {
    if (typeof window === 'undefined' || typeof document === 'undefined') {
      throw new Error('OCR extraction can only be performed in the browser environment.');
    }
    // Dynamically import required libraries
    const pdfjsLib = await import('pdfjs-dist');
    const Tesseract = (await import('tesseract.js')).default;

    // Use PDF.js to render each page as an image
    const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
    const pdf = await loadingTask.promise;
    let fullText = '';

    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const viewport = page.getViewport({ scale: 2.0 });
      // Create a canvas to render the page
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      await page.render({ canvasContext: context, viewport }).promise;
      // Run OCR on the canvas image
      const dataUrl = canvas.toDataURL('image/png');
      const result = await Tesseract.recognize(dataUrl, 'eng');
      fullText += result.data.text + '\n';
    }
    const cleanedText = fullText.replace(/\s+/g, ' ').trim();
    return cleanedText;
  }

  public static async analyzeResume(
    file: File, 
    jobDescription?: string
  ): Promise<ATSAnalysisResult> {
    try {
      // Extract text from file
      const resumeText = await this.extractTextFromFile(file);
      
      // Check if we got a fallback message instead of actual resume text
      if (resumeText.includes('This PDF appears to contain scanned content') || 
          resumeText.includes('Resume Analysis -')) {
        throw new Error('Unable to extract readable text from the uploaded file');
      }
      
      // Validate extracted text
      if (resumeText.length < 100) {
        throw new Error('Insufficient text extracted for analysis');
      }
      
      // Check for PDF artifacts or code
      if (this.containsPDFArtifacts(resumeText)) {
        throw new Error('PDF contains encoded content that cannot be properly extracted. Please ensure the PDF contains selectable text.');
      }
      
      // Check if API key is available
      if (!import.meta.env.VITE_GEMINI_API_KEY) {
        throw new Error('API configuration error. Please check your environment variables.');
      }
      
      // Prepare prompt for Gemini
      const prompt = this.buildAnalysisPrompt(resumeText, jobDescription);
      
      // Get Gemini model
      const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
      
      // Generate analysis with timeout
      const result = await Promise.race([
        model.generateContent(prompt),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Request timeout')), 25000)
        )
      ]);
      
      const response = await result.response;
      const text = response.text();
      
      // Parse the response
      const analysis = this.parseGeminiResponse(text, file.name);
      
      return {
        ...analysis,
        resumeText: resumeText.substring(0, 500) + (resumeText.length > 500 ? '...' : ''), // Show first 500 chars
        isFromGemini: true
      };
    } catch (error) {
      // Return a more informative fallback analysis
      return this.getFallbackAnalysis(file.name, error instanceof Error ? error.message : 'Unknown error');
    }
  }

  private static getFallbackAnalysis(fileName: string, errorMessage?: string): ATSAnalysisResult {
    return {
      overallScore: 0,
      fileName,
      analysisDate: new Date().toISOString(),
      isFromGemini: false,
      sections: {
        keywords: { score: 0, status: 'poor' },
        formatting: { score: 0, status: 'poor' },
        structure: { score: 0, status: 'poor' },
        length: { score: 0, status: 'poor' }
      },
      keywordAnalysis: {
        matched: [],
        missing: [],
        density: 0
      },
      suggestions: [
        'Text Extraction Failed:',
        '1. The file appears to contain scanned images or encoded text',
        '2. Try converting to DOCX format (Word document)',
        '3. Copy your resume content to a plain text (.txt) file',
        '4. Ensure the PDF contains selectable text, not just images',
        '5. If scanned, use OCR software to convert to text first',
        '6. Recreate the resume in a text-based format'
      ],
      resumeText: `Analysis failed: ${errorMessage || 'Unable to extract readable text from file'}`
    };
  }

  private static buildAnalysisPrompt(resumeText: string, jobDescription?: string): string {
    const basePrompt = `
You are an expert ATS (Applicant Tracking System) analyzer. Analyze the following resume and provide a comprehensive ATS score and feedback.

RESUME TEXT:
${resumeText}

${jobDescription ? `JOB DESCRIPTION:
${jobDescription}

Please analyze how well the resume matches this specific job description.` : 'Please provide a general ATS analysis.'}

Provide your analysis in the following JSON format:
{
  "overallScore": 85,
  "sections": {
    "keywords": {"score": 85, "status": "good"},
    "formatting": {"score": 78, "status": "fair"},
    "structure": {"score": 88, "status": "excellent"},
    "length": {"score": 75, "status": "fair"}
  },
  "keywordAnalysis": {
    "matched": ["keyword1", "keyword2"],
    "missing": ["keyword3", "keyword4"],
    "density": 2.3
  },
  "suggestions": [
    "Suggestion 1",
    "Suggestion 2",
    "Suggestion 3"
  ]
}

Scoring guidelines:
- Keywords: 0-100 (based on relevant technical skills, industry terms, and job-specific keywords)
- Formatting: 0-100 (based on clean layout, consistent formatting, readability)
- Structure: 0-100 (based on logical organization, clear sections, professional presentation)
- Length: 0-100 (based on appropriate length for experience level, typically 1-2 pages)

Status levels: "poor" (0-60), "fair" (61-75), "good" (76-85), "excellent" (86-100)

Return only the JSON response, no additional text.
`;

    return basePrompt;
  }

  private static parseGeminiResponse(response: string, fileName: string): Omit<ATSAnalysisResult, 'resumeText'> {
    try {
      // Extract JSON from response (in case there's extra text)
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('Invalid response format');
      }
      
      const parsed = JSON.parse(jsonMatch[0]);
      
      return {
        overallScore: parsed.overallScore || 0,
        fileName,
        analysisDate: new Date().toISOString(),
        isFromGemini: true,
        sections: parsed.sections || {
          keywords: { score: 0, status: 'poor' },
          formatting: { score: 0, status: 'poor' },
          structure: { score: 0, status: 'poor' },
          length: { score: 0, status: 'poor' }
        },
        keywordAnalysis: parsed.keywordAnalysis || {
          matched: [],
          missing: [],
          density: 0
        },
        suggestions: parsed.suggestions || []
      };
    } catch (error) {
      // Return default structure if parsing fails
      return {
        overallScore: 0,
        fileName,
        analysisDate: new Date().toISOString(),
        isFromGemini: false,
        sections: {
          keywords: { score: 0, status: 'poor' },
          formatting: { score: 0, status: 'poor' },
          structure: { score: 0, status: 'poor' },
          length: { score: 0, status: 'poor' }
        },
        keywordAnalysis: {
          matched: [],
          missing: [],
          density: 0
        },
        suggestions: ['Unable to analyze resume. Please try again.']
      };
    }
  }
} 