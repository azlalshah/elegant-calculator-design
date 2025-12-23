import { CalculatorState, CostItem } from "@/types/calculator";

interface PDFExportProps {
  state: CalculatorState;
  totals: {
    materials: number;
    labor: number;
    miscellaneous: number;
    grandTotal: number;
  };
  ratePerSqft: number;
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency: "PKR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

const renderItems = (items: CostItem[], title: string, subtotal: number) => {
  if (items.length === 0) return "";

  return `
    <div class="section">
      <h3>${title}</h3>
      <table>
        <thead>
          <tr>
            <th>Item</th>
            <th>Description</th>
            <th>Qty</th>
            <th>Unit</th>
            <th>Rate</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          ${items
            .map(
              (item) => `
            <tr>
              <td>${item.name}</td>
              <td>${item.description}</td>
              <td>${item.quantity || 0}</td>
              <td>${item.unit}</td>
              <td>${item.unitPrice > 0 ? formatCurrency(item.unitPrice) : "—"}</td>
              <td>${item.quantity * item.unitPrice > 0 ? formatCurrency(item.quantity * item.unitPrice) : "—"}</td>
            </tr>
          `
            )
            .join("")}
          <tr class="subtotal-row">
            <td colspan="5"><strong>Subtotal</strong></td>
            <td><strong>${formatCurrency(subtotal)}</strong></td>
          </tr>
        </tbody>
      </table>
    </div>
  `;
};

const generateChartSVG = (totals: { materials: number; labor: number; miscellaneous: number; grandTotal: number }) => {
  if (totals.grandTotal === 0) return "";
  
  const materialsPercent = (totals.materials / totals.grandTotal) * 100;
  const laborPercent = (totals.labor / totals.grandTotal) * 100;
  const miscPercent = (totals.miscellaneous / totals.grandTotal) * 100;
  
  // Calculate pie chart segments
  const radius = 80;
  const cx = 100;
  const cy = 100;
  
  const getArcPath = (startAngle: number, endAngle: number, color: string) => {
    if (endAngle - startAngle === 0) return "";
    const startRad = (startAngle - 90) * Math.PI / 180;
    const endRad = (endAngle - 90) * Math.PI / 180;
    const x1 = cx + radius * Math.cos(startRad);
    const y1 = cy + radius * Math.sin(startRad);
    const x2 = cx + radius * Math.cos(endRad);
    const y2 = cy + radius * Math.sin(endRad);
    const largeArc = (endAngle - startAngle) > 180 ? 1 : 0;
    
    return `<path d="M${cx},${cy} L${x1},${y1} A${radius},${radius} 0 ${largeArc},1 ${x2},${y2} Z" fill="${color}" />`;
  };
  
  let currentAngle = 0;
  const segments = [];
  
  if (totals.materials > 0) {
    const angle = (materialsPercent / 100) * 360;
    segments.push(getArcPath(currentAngle, currentAngle + angle, "#3b82f6"));
    currentAngle += angle;
  }
  if (totals.labor > 0) {
    const angle = (laborPercent / 100) * 360;
    segments.push(getArcPath(currentAngle, currentAngle + angle, "#22c55e"));
    currentAngle += angle;
  }
  if (totals.miscellaneous > 0) {
    const angle = (miscPercent / 100) * 360;
    segments.push(getArcPath(currentAngle, currentAngle + angle, "#f59e0b"));
    currentAngle += angle;
  }
  
  return `
    <div class="chart-section">
      <h3>Cost Distribution</h3>
      <div class="chart-container">
        <svg width="200" height="200" viewBox="0 0 200 200">
          ${segments.join("")}
        </svg>
        <div class="chart-legend">
          <div class="legend-item">
            <span class="legend-color" style="background-color: #3b82f6;"></span>
            <span>Materials: ${formatCurrency(totals.materials)} (${materialsPercent.toFixed(1)}%)</span>
          </div>
          <div class="legend-item">
            <span class="legend-color" style="background-color: #22c55e;"></span>
            <span>Labor: ${formatCurrency(totals.labor)} (${laborPercent.toFixed(1)}%)</span>
          </div>
          <div class="legend-item">
            <span class="legend-color" style="background-color: #f59e0b;"></span>
            <span>Miscellaneous: ${formatCurrency(totals.miscellaneous)} (${miscPercent.toFixed(1)}%)</span>
          </div>
        </div>
      </div>
    </div>
  `;
};

export const generatePDFContent = ({ state, totals, ratePerSqft }: PDFExportProps): string => {
  const { projectInfo, materials, labor, miscellaneous } = state;
  const date = new Date().toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Cost Estimate - ${projectInfo.projectName || "Project"}</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          font-size: 12px;
          line-height: 1.5;
          color: #1a1a1a;
          padding: 40px;
        }
        .header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          border-bottom: 3px solid #3b82f6;
          padding-bottom: 20px;
          margin-bottom: 30px;
        }
        .logo h1 {
          font-size: 24px;
          color: #3b82f6;
          margin-bottom: 4px;
        }
        .logo p {
          font-size: 11px;
          color: #666;
        }
        .doc-info {
          text-align: right;
          font-size: 11px;
          color: #666;
        }
        .doc-info strong {
          color: #1a1a1a;
        }
        .project-details {
          background: #f8fafc;
          border-radius: 8px;
          padding: 20px;
          margin-bottom: 24px;
        }
        .project-details h2 {
          font-size: 14px;
          color: #3b82f6;
          margin-bottom: 12px;
        }
        .details-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
        }
        .detail-item label {
          font-size: 10px;
          color: #666;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .detail-item p {
          font-size: 13px;
          font-weight: 500;
          margin-top: 2px;
        }
        .section {
          margin-bottom: 24px;
        }
        .section h3 {
          font-size: 13px;
          color: #3b82f6;
          margin-bottom: 12px;
          padding-bottom: 6px;
          border-bottom: 1px solid #e2e8f0;
        }
        table {
          width: 100%;
          border-collapse: collapse;
        }
        th {
          background: #f1f5f9;
          padding: 10px 8px;
          text-align: left;
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          color: #475569;
        }
        td {
          padding: 10px 8px;
          border-bottom: 1px solid #e2e8f0;
        }
        th:last-child, td:last-child {
          text-align: right;
        }
        .subtotal-row {
          background: #f8fafc;
        }
        .subtotal-row td {
          border-bottom: 2px solid #3b82f6;
        }
        .chart-section {
          margin-bottom: 24px;
          page-break-inside: avoid;
        }
        .chart-section h3 {
          font-size: 13px;
          color: #3b82f6;
          margin-bottom: 12px;
          padding-bottom: 6px;
          border-bottom: 1px solid #e2e8f0;
        }
        .chart-container {
          display: flex;
          align-items: center;
          gap: 40px;
          padding: 20px;
          background: #f8fafc;
          border-radius: 8px;
        }
        .chart-legend {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .legend-item {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 12px;
        }
        .legend-color {
          width: 16px;
          height: 16px;
          border-radius: 4px;
        }
        .summary {
          background: #1e3a5f;
          color: white;
          border-radius: 8px;
          padding: 20px;
          margin-top: 30px;
        }
        .summary h3 {
          font-size: 12px;
          opacity: 0.8;
          margin-bottom: 12px;
        }
        .summary-row {
          display: flex;
          justify-content: space-between;
          padding: 8px 0;
          border-bottom: 1px solid rgba(255,255,255,0.1);
        }
        .summary-row:last-child {
          border-bottom: none;
        }
        .summary-row.total {
          font-size: 18px;
          font-weight: bold;
          margin-top: 8px;
          padding-top: 12px;
          border-top: 2px solid rgba(255,255,255,0.2);
        }
        .footer {
          margin-top: 40px;
          padding-top: 20px;
          border-top: 1px solid #e2e8f0;
          text-align: center;
          font-size: 10px;
          color: #666;
        }
        @media print {
          body { padding: 20px; }
          .summary { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .chart-container { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .legend-color { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          svg { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="logo">
          <h1>Econ Construction</h1>
          <p>Building Dreams, Calculating Reality</p>
        </div>
        <div class="doc-info">
          <p><strong>Cost Estimate</strong></p>
          <p>Date: ${date}</p>
          <p>${projectInfo.category}: ${formatCurrency(ratePerSqft)}/sqft</p>
        </div>
      </div>

      <div class="project-details">
        <h2>Project Information</h2>
        <div class="details-grid">
          <div class="detail-item">
            <label>Client Name</label>
            <p>${projectInfo.clientName || "—"}</p>
          </div>
          <div class="detail-item">
            <label>Project Name</label>
            <p>${projectInfo.projectName || "—"}</p>
          </div>
          <div class="detail-item">
            <label>Location</label>
            <p>${projectInfo.location || "—"}</p>
          </div>
          <div class="detail-item">
            <label>Duration</label>
            <p>${projectInfo.duration || "—"}</p>
          </div>
          <div class="detail-item">
            <label>Working Area</label>
            <p>${projectInfo.workingArea ? `${projectInfo.workingArea.toLocaleString()} sqft` : "—"}</p>
          </div>
          <div class="detail-item">
            <label>Notes</label>
            <p>${projectInfo.notes || "—"}</p>
          </div>
        </div>
      </div>

      ${generateChartSVG(totals)}

      ${renderItems(materials, "Materials", totals.materials)}
      ${renderItems(labor, "Labor", totals.labor)}
      ${renderItems(miscellaneous, "Miscellaneous", totals.miscellaneous)}

      <div class="summary">
        <h3>COST SUMMARY</h3>
        <div class="summary-row">
          <span>Materials</span>
          <span>${formatCurrency(totals.materials)}</span>
        </div>
        <div class="summary-row">
          <span>Labor</span>
          <span>${formatCurrency(totals.labor)}</span>
        </div>
        <div class="summary-row">
          <span>Miscellaneous</span>
          <span>${formatCurrency(totals.miscellaneous)}</span>
        </div>
        <div class="summary-row total">
          <span>Grand Total</span>
          <span>${formatCurrency(totals.grandTotal)}</span>
        </div>
      </div>

      <div class="footer">
        <p>This is a computer-generated estimate. Actual costs may vary based on market conditions.</p>
        <p>Generated by Econ Construction Calculator</p>
      </div>
    </body>
    </html>
  `;
};

export const exportToPDF = (props: PDFExportProps) => {
  const content = generatePDFContent(props);
  const printWindow = window.open("", "_blank");
  if (printWindow) {
    printWindow.document.write(content);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 250);
  }
};
