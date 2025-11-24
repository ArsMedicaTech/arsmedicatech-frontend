import React, { useRef, CSSProperties, ReactNode } from 'react';
import { jsPDF } from 'jspdf';
import html2pdf from 'html2pdf.js';

/**
 * Options for configuring PDF generation
 */
interface PDFOptions {
  /** Document margins in mm */
  margin?: number;
  
  /** PDF filename (with .pdf extension) */
  filename?: string;
  
  /** Image export options */
  image?: {
    /** Image format */
    type?: 'jpeg' | 'png' | 'webp';
    /** Image quality (0-1) */
    quality?: number;
  };
  
  /** html2canvas library options */
  html2canvas?: {
    /** Rendering scale (higher = better quality) */
    scale?: number;
    /** Enable CORS for external images */
    useCORS?: boolean;
    /** Enable debug logging */
    logging?: boolean;
    /** Improve text rendering */
    letterRendering?: boolean;
  };
  
  /** jsPDF library options */
  jsPDF?: {
    /** Measurement unit */
    unit?: string;
    /** Page format */
    format?: string;
    /** Page orientation */
    orientation?: 'portrait' | 'landscape';
  };
}

/**
 * Props for the PDFDownloadButton component
 */
interface PDFDownloadButtonProps {
  /** 
   * HTML content to convert to PDF (HTML→PDF mode)
   * If provided, the component will use html2pdf to convert this content
   */
  children?: ReactNode;
  
  /** 
   * Function to programmatically generate the PDF (Code→PDF mode)
   * Receives a jsPDF instance and must generate the content
   */
  generateContent?: (doc: jsPDF) => void | Promise<void>;
  
  /** 
   * PDF filename (without .pdf extension)
   * @default 'document'
   */
  filename?: string;
  
  /** 
   * Text displayed on the download button
   * @default 'Download PDF'
   */
  buttonText?: string;
  
  /** 
   * Custom CSS styles for the button
   */
  buttonStyle?: CSSProperties;
  
  /** 
   * CSS class names for the button
   */
  className?: string;
  
  /** 
   * Configuration options for html2pdf
   * Only used in HTML→PDF mode
   */
  pdfOptions?: PDFOptions;
  
  /** 
   * Callback function called after successful PDF generation
   */
  onSuccess?: () => void;
  
  /** 
   * Callback function called when an error occurs during generation
   */
  onError?: (error: Error) => void;
}

/**
 * Flexible component for downloading content as PDF
 * 
 * Supports two modes of operation:
 * 1. HTML → PDF: Converts existing React/HTML content to PDF using html2pdf
 * 2. Code → PDF: Programmatically generates PDF using jsPDF API
 * 
 * @example
 * // HTML → PDF mode
 * <PDFDownloadButton filename="report">
 *   <div>Content to convert</div>
 * </PDFDownloadButton>
 * 
 * @example
 * // Code → PDF mode
 * <PDFDownloadButton 
 *   generateContent={(doc) => doc.text('Hello', 20, 20)}
 *   filename="generated"
 * />
 */
const PDFDownloadButton: React.FC<PDFDownloadButtonProps> = ({
  // HTML → PDF mode props
  children,
  
  // Code → PDF mode props
  generateContent,
  
  // Common props
  filename = 'document',
  buttonText = 'Download PDF',
  buttonStyle = {},
  className = '',
  pdfOptions = {},
  onSuccess,
  onError
}) => {
  // Reference to the content div for HTML→PDF conversion
  const contentRef = useRef<HTMLDivElement>(null);

  /**
   * Handles HTML to PDF conversion using html2pdf library
   * Converts the HTML content in contentRef to a downloadable PDF
   * @throws {Error} If no HTML content is available to convert
   */
  const handleHTMLToPDF = async (): Promise<void> => {
    // Ensure we have content to convert
    if (!contentRef.current) {
      throw new Error('No HTML content to convert');
    }

    // Merge user options with sensible defaults
    const defaultOptions: PDFOptions = {
      margin: 10,                          // 10mm margins on all sides
      filename: `${filename}.pdf`,          // Output filename
      image: { 
        type: 'jpeg',                      // JPEG format for images
        quality: 0.98                      // High quality (98%)
      },
      html2canvas: { 
        scale: 2,                          // 2x scale for better resolution
        useCORS: true,                     // Allow cross-origin images
        logging: false,                    // Disable console logs
        letterRendering: true              // Improve text rendering
      },
      jsPDF: { 
        unit: 'mm',                        // Millimeters as unit
        format: 'a4',                      // A4 paper size
        orientation: 'portrait'            // Portrait orientation
      },
      ...pdfOptions                         // Merge with user-provided options
    };

    // Generate and download the PDF
    await html2pdf()
      .set(defaultOptions)                 // Apply configuration
      .from(contentRef.current)            // Source HTML element
      .save();                             // Trigger download
  };

  /**
   * Handles programmatic PDF generation using jsPDF library
   * Calls the user-provided generateContent function with a jsPDF instance
   * @throws {Error} If generateContent is not a function
   */
  const handleCodeToPDF = async (): Promise<void> => {
    // Validate that we have a generation function
    if (typeof generateContent !== 'function') {
      throw new Error('generateContent must be a function');
    }

    // Create new jsPDF instance
    const doc = new jsPDF();
    
    // Call user's generation function
    await generateContent(doc);
    
    // Download the generated PDF
    doc.save(`${filename}.pdf`);
  };

  /**
   * Main click handler that determines which mode to use
   * Chooses between HTML→PDF or Code→PDF based on provided props
   * Handles success/error callbacks
   */
  const handleDownload = async (): Promise<void> => {
    try {
      // Determine which mode to use based on props
      if (children) {
        // If children prop exists → HTML→PDF mode
        await handleHTMLToPDF();
      } else if (generateContent) {
        // If generateContent function exists → Code→PDF mode
        await handleCodeToPDF();
      } else {
        // Neither mode configured - throw error
        throw new Error('Either children or generateContent must be provided');
      }
      
      // Call success callback if provided
      if (onSuccess) onSuccess();
    } catch (error) {
      // Log error to console
      console.error('PDF generation error:', error);
      
      // Ensure error is Error instance
      const err = error instanceof Error ? error : new Error('Unknown error');
      
      // Call error callback if provided, otherwise show alert
      if (onError) {
        onError(err);
      } else {
        alert('Error generating PDF. Please try again.');
      }
    }
  };

  /**
   * Default button styles with user overrides
   * Provides a clean, modern button appearance
   */
  const defaultButtonStyle: CSSProperties = {
    padding: '10px 20px',                  // Comfortable padding
    backgroundColor: '#3498db',            // Blue background
    color: 'white',                        // White text
    border: 'none',                        // No border
    borderRadius: '4px',                   // Rounded corners
    cursor: 'pointer',                     // Pointer cursor on hover
    fontSize: '14px',                      // Readable font size
    fontWeight: '500',                     // Medium weight
    transition: 'background-color 0.2s',   // Smooth color transition
    ...buttonStyle                         // Merge with user styles
  };

  return (
    <div>
      {/* HTML→PDF mode: Display content to be converted */}
      {children && (
        <div ref={contentRef} style={{ marginBottom: '20px' }}>
          {children}
        </div>
      )}

      {/* Download button */}
      <button
        onClick={handleDownload}
        style={defaultButtonStyle}
        className={className}
        type="button"
      >
        {buttonText}
      </button>
    </div>
  );
};

export default PDFDownloadButton;