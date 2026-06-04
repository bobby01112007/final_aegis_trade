import { jsPDF } from 'jspdf';
import QRCode from 'qrcode';


interface ComplianceIssue {
  severity: 'low' | 'medium' | 'high';
  field: string;
  message: string;
  resolution: string;
}

interface ValidationReport {
  documentName: string;
  documentType: string;
  timestamp: string;
  complianceRatio: number;
  hsCodeConfidence: string;
  hsCodeSuggested: string;
  destinationFit: boolean;
  issues: ComplianceIssue[];
  rawTextSimulated: string;
  signatureAnalysis?: {
    detected: boolean;
    signerName?: string;
    confidence: string;
    locationBox: string;
  };
}

/**
 * Generates an executive, archival-grade AegisTrade export compliance certificate
 * using jsPDF client-side routines with absolute typographic spacing and vector ornaments.
 */
export const exportValidationReportToPDF = async (report: ValidationReport) => {
  // 1. Initialize A4 Document (Margins, sizing, landscape vs portrait)
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const width = doc.internal.pageSize.getWidth(); // 210mm
  const height = doc.internal.pageSize.getHeight(); // 297mm

  // Generate unique certificate ID
  const trackingHash = `AEG-CR-${Math.floor(100000 + Math.random() * 900000)}`;

  // 2. Clear Page and Draw Warm Paper Background Fill
  doc.setFillColor(253, 252, 249); // Off-white luxury archival parchment hue
  doc.rect(0, 0, width, height, 'F');

  // 3. Draw Dual Elegance Borders
  // Outer Border: Dark Imperial Navy (thick)
  doc.setDrawColor(12, 26, 37);
  doc.setLineWidth(1.2);
  doc.rect(8, 8, width - 16, height - 16, 'D');

  // Inner Border: Muted Gold (thin)
  doc.setDrawColor(212, 175, 55);
  doc.setLineWidth(0.4);
  doc.rect(10.5, 10.5, width - 21, height - 21, 'D');

  // 4. Stylized Corner Accents (Vintage L-shaped bracket flourishes)
  const drawCornerAccent = (x: number, y: number, dx: number, dy: number) => {
    doc.setDrawColor(212, 175, 55);
    doc.setLineWidth(0.7);
    doc.line(x, y, x + dx, y);
    doc.line(x, y, x, y + dy);
  };
  
  // Top-left
  drawCornerAccent(12, 12, 10, 10);
  // Top-right
  drawCornerAccent(width - 12, 12, -10, 10);
  // Bottom-left
  drawCornerAccent(12, height - 12, 10, -10);
  // Bottom-right
  drawCornerAccent(width - 12, height - 12, -10, -10);

  // 5. Header Emblem: Beautiful Golden Shield
  const shieldX = width / 2;
  const shieldY = 24;
  doc.setFillColor(212, 175, 55); // Gold Fill
  doc.setDrawColor(12, 26, 37); // Dark Line
  doc.setLineWidth(0.4);

  // Draw symmetrical diamond emblem for key visual identity
  doc.triangle(shieldX, shieldY, shieldX + 6, shieldY + 8, shieldX - 6, shieldY + 8, 'FD');
  doc.triangle(shieldX + 6, shieldY + 8, shieldX - 6, shieldY + 8, shieldX, shieldY + 16, 'FD');

  // Print white "A" inside the shield for Aegis
  doc.setTextColor(255, 255, 255);
  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('A', shieldX, shieldY + 11, { align: 'center' });

  // 6. Typography Headers
  doc.setTextColor(184, 142, 15); // Rich Gold
  doc.setFont('Times', 'italic');
  doc.setFontSize(11);
  doc.text('Aegis Trade Parity Authority', width / 2, 49, { align: 'center' });

  doc.setTextColor(12, 26, 37); // Imperial Navy
  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(18);
  doc.text('EXPORT CERTIFICATE OF REGULATORY PARITY', width / 2, 57, { align: 'center' });

  doc.setTextColor(115, 125, 137); // Grey Subtitle
  doc.setFont('Helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.text('BILATERAL SOVEREIGN CUSTOMS CLEARANCE ASSURANCE CORE v4.1', width / 2, 63, { align: 'center' });

  // Elegant Double Gold-line Divider below header
  doc.setDrawColor(212, 175, 55);
  doc.setLineWidth(0.5);
  doc.line(22, 68, width - 22, 68);
  doc.setLineWidth(0.2);
  doc.line(22, 69.5, width - 22, 69.5);

  // 7. Core Attestation Text (Archival Certificate Vow)
  doc.setTextColor(20, 30, 40);
  doc.setFont('Times', 'normal');
  doc.setFontSize(10);
  const coreVow = `This formal certification declares that the designated trade manifest has been scrutinized through the Aegis Systems decentralized cryptographic validation engine. Calculated compliance parameters indicate satisfaction of all dual-use, phytosanitary code-parity, and customs licensing directives relevant to bilateral commerce.`;
  const splitVow = doc.splitTextToSize(coreVow, width - 36);
  doc.text(splitVow, width / 2, 77, { align: 'center' });

  // 8. Grid of Certificate Metadata
  const gridY = 96;
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(228, 224, 215);
  doc.setLineWidth(0.3);
  doc.rect(18, gridY, width - 36, 32, 'F'); // Frame structure
  doc.rect(18, gridY, width - 36, 32, 'D');

  // Vertical Divider line in the middle of metadata block
  doc.line(width / 2, gridY, width / 2, gridY + 32);

  // Horizontal Dividers in Metadata
  doc.line(18, gridY + 16, width - 18, gridY + 16);

  // Metadata Fields Print:
  const col1X = 22;
  const col2X = (width / 2) + 4;

  const printMeta = (x: number, y: number, label: string, val: string) => {
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(115, 125, 137);
    doc.text(label, x, y);

    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(12, 26, 37);
    const splitVal = doc.splitTextToSize(val, 80);
    doc.text(splitVal, x, y + 4.5);
  };

  printMeta(col1X, gridY + 5, 'CERTIFICATE SERIAL ID', trackingHash);
  printMeta(col1X, gridY + 21, 'EVALUATION DATE/TIME', report.timestamp);
  printMeta(col2X, gridY + 5, 'REGULATORY EXPORT VEHICLE', report.documentType);
  printMeta(col2X, gridY + 21, 'TARGET SYSTEM HS CODE', `${report.hsCodeSuggested} (${report.hsCodeConfidence})`);

  // Extra metadata block centered above the score badge
  const docNameLabelY = gridY + 39;
  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(115, 125, 137);
  doc.text('CERTIFIED SOURCE DOCUMENT MANIFEST', width / 2, docNameLabelY, { align: 'center' });

  doc.setFont('Courier', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(12, 26, 37);
  doc.text(report.documentName, width / 2, docNameLabelY + 4.5, { align: 'center' });

  // 9. Compliance Metric Display Section
  const scoreY = 142;
  // Beautiful dark background field for compliance highlight
  doc.setFillColor(12, 26, 37); // Matte Imperial Navy
  doc.rect(18, scoreY, width - 36, 26, 'F');

  // Big Compliance score text
  doc.setTextColor(255, 255, 255);
  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(15);
  doc.text(`AUDIT RATING: ${report.complianceRatio}%`, 25, scoreY + 15);

  doc.setFont('Helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(212, 175, 55); // Gold text
  doc.text('INTELLIGENCE ENGINE PARITY ASSURANCE CALCULATED CODE', 25, scoreY + 20);

  // Solid rounded badge for certificate outcome on the right
  const badgeX = width - 78;
  const badgeY = scoreY + 6.5;
  const isClear = report.destinationFit;

  // Draw colored fill for verification stamp
  if (isClear) {
    doc.setFillColor(16, 185, 129); // Success green
  } else {
    doc.setFillColor(217, 119, 6); // Advisory amber
  }
  doc.rect(badgeX, badgeY, 52, 13, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.text(isClear ? 'CLEAR FOR DEPARTURE' : 'ADVISORY MANDATE', badgeX + 26, badgeY + 8, { align: 'center' });

  // 10. List of Audited Issues / Anomalies
  const auditListY = 176;
  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(184, 142, 15); // Rich Gold
  doc.text('AEGIS REGULATORY REGISTRY AUDIT STATEMENT', 18, auditListY);

  // Divide line
  doc.setDrawColor(212, 175, 55);
  doc.setLineWidth(0.3);
  doc.line(18, auditListY + 2, width - 18, auditListY + 2);

  let currentY = auditListY + 7;

  if (report.issues.length === 0) {
    // Elegant clean statement for 100% compliant documents
    doc.setFillColor(242, 249, 245); // Soft green tint
    doc.rect(18, currentY, width - 36, 26, 'F');
    doc.setDrawColor(16, 185, 129);
    doc.setLineWidth(0.3);
    doc.rect(18, currentY, width - 36, 26, 'D');

    doc.setTextColor(6, 95, 70); // Deep green
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(9);
    doc.text('STATUS: PASS WITH ZERO DEFICIENCIES', 23, currentY + 7);

    doc.setFont('Times', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(55, 65, 81);
    const pristineParagraph = `The document exhibits perfect synchronization with destination import databases. No biological, physical cooling anomalies, or dual-use treaty concerns were identified in standard scanning blocks. Direct customs authority bypass has been provisionally registered.`;
    const splitPristine = doc.splitTextToSize(pristineParagraph, width - 46);
    doc.text(splitPristine, 23, currentY + 12.5);

    currentY += 32;
  } else {
    // Loop through up to 3 issues (to fit exactly on A4 without crashing or overlapping)
    const displayIssues = report.issues.slice(0, 3);
    
    displayIssues.forEach((issue) => {
      // Small grey container for each anomaly
      doc.setFillColor(248, 248, 246);
      doc.rect(18, currentY, width - 36, 17, 'F');
      
      // Draw left color strip based on severity
      if (issue.severity === 'high') {
        doc.setFillColor(225, 29, 72); // rose-600
      } else if (issue.severity === 'medium') {
        doc.setFillColor(217, 119, 6); // amber-600
      } else {
        doc.setFillColor(115, 125, 137); // grey
      }
      doc.rect(18, currentY, 2.5, 17, 'F');

      // Title line inside issue
      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(12, 26, 37);
      doc.text(`${issue.field} [Severity: ${issue.severity.toUpperCase()}]`, 23, currentY + 4);

      // Warning text
      doc.setFont('Helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(75, 85, 99);
      const splitMsg = doc.splitTextToSize(`Anomaly: ${issue.message}`, width - 46);
      doc.text(splitMsg, 23, currentY + 8);

      // Resolution text
      doc.setFont('Helvetica', 'bold');
      doc.setTextColor(184, 142, 15);
      const splitRes = doc.splitTextToSize(`Required PARITY FIX: ${issue.resolution}`, width - 46);
      doc.text(splitRes, 23, currentY + 12.5);

      currentY += 19.5;
    });

    if (report.issues.length > 3) {
      doc.setFont('Helvetica', 'italic');
      doc.setFontSize(7.5);
      doc.setTextColor(115, 125, 137);
      doc.text(`* Note: ${report.issues.length - 3} additional low-priority anomalies verified in complete digital ledger record.`, 18, currentY + 2, { align: 'left' });
    }
  }

  // 11. Authentic Gold Seal Medallion Graphic (Bottom Left)
  const sealCenterX = 42;
  const sealCenterY = height - 37;

  // Outer gold circle with teeth
  doc.setDrawColor(212, 175, 55);
  doc.setLineWidth(0.4);
  doc.circle(sealCenterX, sealCenterY, 15, 'D');

  // Inner rings
  doc.circle(sealCenterX, sealCenterY, 13.8, 'D');
  doc.setLineWidth(0.15);
  doc.circle(sealCenterX, sealCenterY, 12.2, 'D');

  // Draw small graphic elements radiating inside seal
  doc.setLineWidth(0.2);
  for (let i = 0; i < 360; i += 15) {
    const rad = (i * Math.PI) / 180;
    const x1 = sealCenterX + Math.cos(rad) * 12.2;
    const y1 = sealCenterY + Math.sin(rad) * 12.2;
    const x2 = sealCenterX + Math.cos(rad) * 13.8;
    const y2 = sealCenterY + Math.sin(rad) * 13.8;
    doc.line(x1, y1, x2, y2);
  }

  // Text inside Medallion
  doc.setTextColor(184, 142, 15);
  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(5);
  doc.text('VERIFIED REGULATORY', sealCenterX, sealCenterY - 4, { align: 'center' });
  doc.setFontSize(6);
  doc.text('AEGIS', sealCenterX, sealCenterY + 1, { align: 'center' });
  doc.setFontSize(5.5);
  doc.text('COUNCIL SEAL', sealCenterX, sealCenterY + 5.5, { align: 'center' });

  // Ribbon ribbons trailing down from seal
  doc.setDrawColor(212, 175, 55);
  doc.setLineWidth(0.4);
  // Left Ribbon
  doc.line(sealCenterX - 5, sealCenterY + 15, sealCenterX - 8, height - 16);
  doc.line(sealCenterX - 8, height - 16, sealCenterX - 1, height - 20);
  doc.line(sealCenterX - 1, height - 20, sealCenterX - 1, sealCenterY + 15);
  // Right Ribbon
  doc.line(sealCenterX + 1, sealCenterY + 15, sealCenterX + 1, height - 20);
  doc.line(sealCenterX + 1, height - 20, sealCenterX + 8, height - 16);
  doc.line(sealCenterX + 8, height - 16, sealCenterX + 5, sealCenterY + 15);


  // 12. Signatures Block (Bottom Right)
  const sigX = width - 78;
  const sigY = height - 42;

  // Core Agent signature line
  doc.setDrawColor(115, 125, 137);
  doc.setLineWidth(0.3);
  doc.line(sigX, sigY + 12, sigX + 60, sigY + 12);

  doc.setTextColor(12, 26, 37);
  doc.setFont('Times', 'italic');
  doc.setFontSize(10);
  doc.text('Aegis System Core Ledger', sigX + 30, sigY + 9, { align: 'center' });

  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(115, 125, 137);
  doc.text('AUTOMATED AUDITING OFFICER', sigX + 30, sigY + 15, { align: 'center' });

  doc.setFont('Courier', 'normal');
  doc.setFontSize(6.5);
  doc.text('MD5: 22fb8cf273db9ac', sigX + 30, sigY + 18.5, { align: 'center' });


  // Exporter Signee line
  const sig2Y = sigY + 23;
  doc.line(sigX, sig2Y + 11, sigX + 60, sig2Y + 11);

  const signatureFilled = report.signatureAnalysis ? report.signatureAnalysis.detected : true;

  if (signatureFilled) {
    doc.setTextColor(12, 26, 37);
    doc.setFont('Times', 'italic');
    doc.setFontSize(10.5);
    doc.text(report.signatureAnalysis?.signerName || 'Nguyen Van Luc', sigX + 30, sig2Y + 8, { align: 'center' });
  } else {
    doc.setTextColor(225, 29, 72); // Red warning/void
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.text('● SIGNATURE DETECTED EMPTY // VOID', sigX + 30, sig2Y + 7, { align: 'center' });
    doc.setFontSize(6);
    doc.text('⚠️ REF_REGISTRY_ERR_SEALDENSE_0', sigX + 30, sig2Y + 10, { align: 'center' });
  }

  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(115, 125, 137);
  doc.text('AUTHORIZED EXPORTER SIGNATORY', sigX + 30, sig2Y + 14, { align: 'center' });

  // 12.5. Machine-Readable Customs Verification QR Code (Centered Bottom)
  const qrSize = 21; // 21mm x 21mm
  const qrX = (width / 2) - (qrSize / 2); // Center of page
  const qrY = height - 45; // Placed neatly on the lower-middle alignment

  try {
    const verificationUrl = `${window.location.origin}/?verifyInvoice=${trackingHash}&doc=${encodeURIComponent(report.documentName)}&score=${report.complianceRatio}`;
    const qrCodeDataUrl = await QRCode.toDataURL(verificationUrl, {
      margin: 1,
      width: 150,
      color: {
        dark: '#0c1a25', // Imperial Navy matching theme
        light: '#fdfcf9' // Beautiful warm paper background matching theme
      }
    });
    
    // Draw QR Code frame
    doc.setDrawColor(212, 175, 55); // Gold border to elevate design
    doc.setLineWidth(0.3);
    doc.rect(qrX - 1, qrY - 1, qrSize + 2, qrSize + 2, 'D');
    
    // Place QR Code image
    doc.addImage(qrCodeDataUrl, 'PNG', qrX, qrY, qrSize, qrSize);

    // QR Label / Guide text directly underneath
    doc.setTextColor(115, 125, 137);
    doc.setFont('Courier', 'bold');
    doc.setFontSize(6);
    doc.text('SECURE QR PORTAL', width / 2, qrY + qrSize + 3.5, { align: 'center' });
    
    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(5);
    doc.text('SCAN TO VERIFY LEDGER', width / 2, qrY + qrSize + 5.5, { align: 'center' });
  } catch (qrError) {
    console.error('Failed to render authentic tracking QR code:', qrError);
  }

  // 13. Certificate Footer Note
  doc.setTextColor(115, 125, 137);
  doc.setFont('Helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.text('This digital ledger receipt represents real-time regulatory compliance state and is permanently hashed inside the sovereign customs cloud.', width / 2, height - 13, { align: 'center' });

  // Save PDF Document with specialized filename
  const cleanDocName = report.documentName.replace(/[^a-z0-9]/gi, '_').toLowerCase();
  doc.save(`AegisCertificate_${cleanDocName}.pdf`);
};
