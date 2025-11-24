import React, { CSSProperties } from 'react';
import PDFDownloadButton from './PdfDownloadButton';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

/**
 * Type definitions for medical data structures
 */

/**
 * Patient basic information
 */
interface PatientData {
  /** Full name of the patient */
  name: string;
  /** Unique patient identifier */
  id: string;
  /** Date of the document */
  date: string;
}

/**
 * Medication prescription details
 */
interface Medication {
  /** Name of the medication */
  name: string;
  /** Dosage amount and unit */
  dosage: string;
  /** How often to take the medication */
  frequency: string;
  /** Duration of the treatment */
  duration: string;
}

/**
 * Complete treatment plan data structure
 */
interface TreatmentPlanData {
  /** Patient information */
  patient: PatientData;
  /** Medical diagnosis */
  diagnosis: string;
  /** List of prescribed medications */
  medications: Medication[];
  /** Name of the healthcare provider */
  provider: string;
}

/**
 * Medical research source reference
 */
interface Source {
  /** Title of the research paper */
  title: string;
  /** Authors of the paper */
  authors: string;
  /** Journal or publication name */
  journal: string;
  /** Publication year */
  year: string;
  /** Database source (PubMed, Medline, etc.) */
  source: string;
}

/**
 * LLM-generated research report data
 */
interface LLMReportData {
  /** Original search query */
  query: string;
  /** AI-generated summary of findings */
  summary: string;
  /** List of source references */
  sources: Source[];
  /** Timestamp when report was generated */
  generatedAt: string;
}

/**
 * Reusable CSS styles for PDF documents
 * These styles are applied to HTML elements that will be converted to PDF
 */
const styles: Record<string, CSSProperties> = {
  /** Main document container */
  document: {
    padding: '30px',
    backgroundColor: 'white',
    fontFamily: 'Arial, sans-serif',
    maxWidth: '800px',
    margin: '0 auto',
    border: '1px solid #ddd',
    borderRadius: '8px'
  },
  /** Document header section */
  header: {
    backgroundColor: '#27ae60',
    color: 'white',
    padding: '20px',
    marginBottom: '20px',
    textAlign: 'center',
    borderRadius: '4px'
  },
  /** Content section container */
  section: {
    marginBottom: '25px',
    padding: '15px',
    borderRadius: '4px'
  },
  /** Table base styles */
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '10px'
  },
  /** Table header row */
  tableHeader: {
    backgroundColor: '#27ae60',
    color: 'white'
  },
  /** Table header cell */
  th: {
    padding: '12px',
    textAlign: 'left',
    border: '1px solid #ddd',
    fontWeight: 'bold'
  },
  /** Table data cell */
  td: {
    padding: '10px',
    border: '1px solid #ddd'
  },
  /** Even table rows (for striping effect) */
  tableRowEven: {
    backgroundColor: '#f9f9f9'
  },
  /** Odd table rows (for striping effect) */
  tableRowOdd: {
    backgroundColor: 'white'
  },
  /** Document footer section */
  footer: {
    marginTop: '30px',
    padding: '15px',
    fontSize: '12px',
    color: '#666',
    fontStyle: 'italic',
    borderTop: '2px solid #eee'
  }
};

// ============================================
// EXAMPLE 1: Treatment Plan (HTML → PDF)
// ============================================

/**
 * Example component demonstrating treatment plan PDF generation
 * Uses HTML→PDF mode to convert styled React content to PDF
 * 
 * This is the recommended approach for arsmedicatech as it:
 * - Reuses the same component for display and PDF
 * - Supports complex styling with CSS
 * - Easy to maintain (single source of truth)
 */
export const TreatmentPlanExample: React.FC = () => {
  // Sample treatment plan data
  const planData: TreatmentPlanData = {
    patient: { 
      name: 'Marie Dubois', 
      id: 'PAT-12345',
      date: 'March 15, 2024'
    },
    diagnosis: 'Essential hypertension (Stage 2)',
    medications: [
      { name: 'Lisinopril', dosage: '10 mg', frequency: '1x/day', duration: '3 months' },
      { name: 'Amlodipine', dosage: '5 mg', frequency: '1x/day', duration: '3 months' },
      { name: 'Aspirin', dosage: '81 mg', frequency: '1x/day', duration: 'Ongoing' }
    ],
    provider: 'Dr. Jean Martin'
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Patient Treatment Plan</h2>
      
      {/* PDF Download Button wraps the content to be converted */}
      <PDFDownloadButton
        filename={`treatment-plan-${planData.patient.id}`}
        buttonText="Download Treatment Plan (PDF)"
        buttonStyle={{ backgroundColor: '#27ae60' }}
      >
        {/* Content that will be converted to PDF */}
        <div style={styles.document}>
          {/* Header section */}
          <div style={styles.header}>
            <h1 style={{ margin: 0 }}>Treatment Plan</h1>
          </div>

          {/* Patient information section */}
          <div style={styles.section}>
            <h2>Patient Information</h2>
            <p><strong>Name:</strong> {planData.patient.name}</p>
            <p><strong>ID:</strong> {planData.patient.id}</p>
            <p><strong>Date:</strong> {planData.patient.date}</p>
          </div>

          {/* Diagnosis section */}
          <div style={styles.section}>
            <h2>Diagnosis</h2>
            <p>{planData.diagnosis}</p>
          </div>

          {/* Medications section with table */}
          <div style={styles.section}>
            <h2>Prescribed Medications</h2>
            <table style={styles.table}>
              <thead>
                <tr style={styles.tableHeader}>
                  <th style={styles.th}>Medication</th>
                  <th style={styles.th}>Dosage</th>
                  <th style={styles.th}>Frequency</th>
                  <th style={styles.th}>Duration</th>
                </tr>
              </thead>
              <tbody>
                {/* Map through medications to create table rows */}
                {planData.medications.map((med, i) => (
                  <tr 
                    key={i} 
                    // Alternate row colors for better readability
                    style={i % 2 === 0 ? styles.tableRowEven : styles.tableRowOdd}
                  >
                    <td style={styles.td}>{med.name}</td>
                    <td style={styles.td}>{med.dosage}</td>
                    <td style={styles.td}>{med.frequency}</td>
                    <td style={styles.td}>{med.duration}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Footer with metadata */}
          <div style={styles.footer}>
            <p>Prescribed by: {planData.provider}</p>
            <p>Generated on: {new Date().toLocaleDateString('en-US')}</p>
          </div>
        </div>
      </PDFDownloadButton>
    </div>
  );
};

// ============================================
// EXAMPLE 2: LLM Research Report (HTML → PDF)
// ============================================

/**
 * Example component demonstrating LLM/RAG research report PDF generation
 * Shows how to convert AI-generated medical research summaries to PDF
 * 
 * Use case: Converting results from knowledge base RAG search and Medline API
 * into a downloadable, formatted PDF report
 */
export const LLMReportExample: React.FC = () => {
  // Sample LLM-generated research report data
  const reportData: LLMReportData = {
    query: 'Latest advances in type 2 diabetes treatment with GLP-1 agonists',
    summary: `GLP-1 receptor agonists represent a major advance in type 2 diabetes treatment.

Key benefits:
• Body weight reduction of 5-15%
• Cardiovascular risk reduction (26%)
• Improved renal function
• Potential neuroprotective effects`,
    sources: [
      {
        title: 'Cardiovascular and Renal Outcomes with Semaglutide',
        authors: 'Marso SP, Bain SC, Consoli A, et al.',
        journal: 'New England Journal of Medicine',
        year: '2023',
        source: 'PubMed'
      },
      {
        title: 'Tirzepatide versus Semaglutide Once Weekly',
        authors: 'Frías JP, Davies MJ, Rosenstock J, et al.',
        journal: 'New England Journal of Medicine',
        year: '2023',
        source: 'Medline'
      }
    ],
    generatedAt: new Date().toISOString()
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Medical Research Report</h2>
      
      {/* PDF Download Button with custom styling */}
      <PDFDownloadButton
        filename="llm-research-report"
        buttonText="📄 Download Report (PDF)"
        buttonStyle={{ backgroundColor: '#9b59b6' }}
      >
        {/* Research report content */}
        <div style={styles.document}>
          {/* Header with purple theme */}
          <div style={{ ...styles.header, backgroundColor: '#9b59b6' }}>
            <h1 style={{ margin: 0 }}>Medical Research Report</h1>
            <p style={{ margin: '5px 0 0 0', fontSize: '12px' }}>
              Generated by LLM • Sources: RAG Knowledge Base + Medline API
            </p>
          </div>

          {/* Search query section - highlighted */}
          <div style={{ 
            ...styles.section, 
            backgroundColor: '#f0f8ff', 
            borderLeft: '4px solid #9b59b6' 
          }}>
            <h3 style={{ marginTop: 0, color: '#9b59b6' }}>Search Query</h3>
            <p>{reportData.query}</p>
          </div>

          {/* AI-generated summary section */}
          <div style={styles.section}>
            <h2>Summary</h2>
            {/* Preserve line breaks in summary text */}
            <p style={{ whiteSpace: 'pre-line', lineHeight: '1.6' }}>
              {reportData.summary}
            </p>
          </div>

          {/* References section */}
          <div style={styles.section}>
            <h2>References</h2>
            {/* Map through sources to create reference list */}
            {reportData.sources.map((source, i) => (
              <div key={i} style={{ 
                marginBottom: '15px', 
                paddingLeft: '15px', 
                borderLeft: '2px solid #ddd' 
              }}>
                {/* Reference title */}
                <p style={{ margin: '0 0 5px 0', fontWeight: 'bold' }}>
                  {i + 1}. {source.title}
                </p>
                {/* Authors */}
                <p style={{ margin: '0 0 3px 0', fontSize: '14px', color: '#666' }}>
                  {source.authors}
                </p>
                {/* Journal, year, and database source */}
                <p style={{ margin: 0, fontSize: '14px', color: '#666' }}>
                  <em>{source.journal}</em>, {source.year} • Source: {source.source}
                </p>
              </div>
            ))}
          </div>

          {/* Disclaimer footer */}
          <div style={{ ...styles.footer, backgroundColor: '#f9f9f9' }}>
            <p style={{ fontSize: '11px', color: '#666', margin: 0 }}>
              <strong>Note:</strong> This summary is AI-generated based on RAG and Medline. 
              Please consult a healthcare professional for validation.
            </p>
          </div>
        </div>
      </PDFDownloadButton>
    </div>
  );
};

// ============================================
// EXAMPLE 3: Code Generation with jsPDF (Code → PDF)
// ============================================

/**
 * Example component demonstrating programmatic PDF generation
 * Uses Code→PDF mode with jsPDF library directly
 * 
 * Use this approach when:
 * - You need pixel-perfect control
 * - The PDF layout differs from web display
 * - You're generating PDFs without displaying content first
 */
export const CodeGenerationExample: React.FC = () => {
  // Sample data for PDF generation
  const planData = {
    patient: { name: 'Pierre Martin', id: 'PAT-67890' },
    date: 'March 20, 2024',
    medications: [
      { name: 'Metformin', dosage: '500 mg', frequency: '2x/day' }
    ]
  };

  /**
   * Function to programmatically generate PDF content
   * @param doc - jsPDF instance to draw on
   */
  const generatePDF = (doc: jsPDF): void => {
    // Draw header background
    doc.setFillColor(39, 174, 96);  // Green color
    doc.rect(0, 0, 210, 40, 'F');   // Rectangle: x, y, width, height, 'F' = filled
    
    // Header text
    doc.setTextColor(255, 255, 255);  // White text
    doc.setFontSize(20);
    doc.text('Treatment Plan', 105, 25, { align: 'center' });
    
    // Reset text color for body content
    doc.setTextColor(0, 0, 0);  // Black text

    // Body content - starting Y position
    let y = 50;
    
    // Patient information
    doc.setFontSize(12);
    doc.text(`Patient: ${planData.patient.name}`, 20, y);
    y += 10;  // Move down 10mm
    
    doc.text(`ID: ${planData.patient.id}`, 20, y);
    y += 10;
    
    doc.text(`Date: ${planData.date}`, 20, y);
    y += 20;  // Extra space before table

    // Generate table using jspdf-autotable plugin
    // Note: Type assertion needed due to plugin not in standard jsPDF types
    (doc as any).autoTable({
      startY: y,  // Start table at current Y position
      head: [['Medication', 'Dosage', 'Frequency']],
      body: planData.medications.map(m => [m.name, m.dosage, m.frequency]),
      theme: 'grid',  // Table style
      headStyles: { fillColor: [39, 174, 96] }  // Green header to match document theme
    });
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Code-based PDF Generation</h2>
      <p>Patient: {planData.patient.name}</p>
      
      {/* PDF generation using custom function */}
      <PDFDownloadButton
        generateContent={generatePDF}
        filename={`treatment-${planData.patient.id}`}
        buttonText="📥 Generate PDF with jsPDF"
        buttonStyle={{ backgroundColor: '#3498db' }}
      />
    </div>
  );
};

// ============================================
// Demo Page - Combines All Examples
// ============================================

/**
 * Main demo page component showcasing all PDF generation examples
 * Displays all three approaches side by side for comparison
 */
export const PDFDemo: React.FC = () => {
  return (
    <div style={{ padding: '40px', backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Page title and description */}
        <h1>PDF Download Button</h1>
        <p style={{ color: '#666', marginBottom: '40px' }}>
          Flexible component supporting HTML to PDF and Code to PDF conversion
        </p>

        {/* Grid layout for examples */}
        <div style={{ 
          display: 'grid', 
          gap: '30px',
          // Responsive grid: minimum 400px columns, auto-fit as many as possible
          gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))'
        }}>
          {/* Example 1: Treatment Plan (HTML→PDF) */}
          <div style={{ 
            backgroundColor: 'white', 
            padding: '20px', 
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            <TreatmentPlanExample />
          </div>

          {/* Example 2: LLM Report (HTML→PDF) */}
          <div style={{ 
            backgroundColor: 'white', 
            padding: '20px', 
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            <LLMReportExample />
          </div>

          {/* Example 3: Code Generation (Code→PDF) */}
          <div style={{ 
            backgroundColor: 'white', 
            padding: '20px', 
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            <CodeGenerationExample />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PDFDemo;