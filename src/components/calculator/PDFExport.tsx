import { CalculatorState, CostItem, CostSection } from "@/types/calculator";

interface PDFExportProps {
  state: CalculatorState;
  totals: Record<string, number>;
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

// Icon SVG paths for common icons
const getIconSVG = (iconName: string): string => {
  const iconPaths: Record<string, string> = {
    Package: '<path d="M16.5 9.4l-9-5.19M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/>',
    Mountain: '<path d="m8 3 4 8 5-5 5 15H2L8 3z"/>',
    Grid3x3: '<rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>',
    Square: '<rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>',
    Paintbrush: '<path d="M18.37 2.63 14 7l-1.59-1.59a2 2 0 0 0-2.82 0L8 7l9 9 1.59-1.59a2 2 0 0 0 0-2.82L17 10l4.37-4.37a2.12 2.12 0 1 0-3-3Z"/><path d="M9 8c-2 3-4 3.5-7 4l8 10c2-1 6-5 6-7"/><path d="M14.5 17.5 4.5 15"/>',
    DoorOpen: '<path d="M13 4h3a2 2 0 0 1 2 2v14"/><path d="M2 20h3"/><path d="M13 20h9"/><path d="M10 12v.01"/><path d="M13 4.562v16.157a1 1 0 0 1-1.242.97L5 20V5.562a2 2 0 0 1 1.515-1.94l4-1A2 2 0 0 1 13 4.561Z"/>',
    SquareStack: '<path d="M4 10c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h4c1.1 0 2 .9 2 2"/><path d="M10 16c-1.1 0-2-.9-2-2v-4c0-1.1.9-2 2-2h4c1.1 0 2 .9 2 2"/><rect width="8" height="8" x="14" y="14" rx="2"/>',
    Zap: '<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>',
    Pipette: '<path d="m2 22 1-1h3l9-9"/><path d="M3 21v-3l9-9"/><path d="m15 6 3.4-3.4a2.1 2.1 0 1 1 3 3L18 9l.4.4a2.1 2.1 0 1 1-3 3l-3.8-3.8a2.1 2.1 0 1 1 3-3l.4.4Z"/>',
    Wrench: '<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>',
    Hammer: '<path d="m15 12-8.5 8.5c-.83.83-2.17.83-3 0 0 0 0 0 0 0a2.12 2.12 0 0 1 0-3L12 9"/><path d="M17.64 15 22 10.64"/><path d="m20.91 11.7-1.25-1.25c-.6-.6-.93-1.4-.93-2.25v-.86L16.01 4.6a5.56 5.56 0 0 0-3.94-1.64H9l.92.82A6.18 6.18 0 0 1 12 8.4v1.56l2 2h2.47l2.26 1.91"/>',
    Lightbulb: '<path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/>',
    Droplets: '<path d="M7 16.3c2.2 0 4-1.83 4-4.05 0-1.16-.57-2.26-1.71-3.19S7.29 6.75 7 5.3c-.29 1.45-1.14 2.84-2.29 3.76S3 11.1 3 12.25c0 2.22 1.8 4.05 4 4.05z"/><path d="M12.56 6.6A10.97 10.97 0 0 0 14 3.02c.5 2.5 2 4.9 4 6.5s3 3.5 3 5.5a6.98 6.98 0 0 1-11.91 4.97"/>',
    Palette: '<circle cx="13.5" cy="6.5" r=".5"/><circle cx="17.5" cy="10.5" r=".5"/><circle cx="8.5" cy="7.5" r=".5"/><circle cx="6.5" cy="12.5" r=".5"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.555C21.965 6.012 17.461 2 12 2z"/>',
    Brick: '<rect width="18" height="18" x="3" y="3" rx="2"/><path d="M12 3v18"/><path d="M3 9h18"/><path d="M3 15h18"/>',
    LayoutGrid: '<rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/>',
    Glasses: '<circle cx="6" cy="15" r="4"/><circle cx="18" cy="15" r="4"/><path d="M14 15a2 2 0 0 0-4 0"/><path d="M2.5 13 5 7c.7-1.3 1.4-2 3-2"/><path d="M21.5 13 19 7c-.7-1.3-1.5-2-3-2"/>',
    Frame: '<line x1="22" x2="2" y1="6" y2="6"/><line x1="22" x2="2" y1="18" y2="18"/><line x1="6" x2="6" y1="2" y2="22"/><line x1="18" x2="18" y1="2" y2="22"/>',
    Bath: '<path d="M9 6 6.5 3.5a1.5 1.5 0 0 0-1-.5C4.683 3 4 3.683 4 4.5V17a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-5"/><line x1="10" x2="8" y1="5" y2="7"/><line x1="2" x2="22" y1="12" y2="12"/><line x1="7" x2="7" y1="19" y2="21"/><line x1="17" x2="17" y1="19" y2="21"/>',
    MoreHorizontal: '<circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/>',
    Building: '<rect width="16" height="20" x="4" y="2" rx="2" ry="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01"/><path d="M16 6h.01"/><path d="M12 6h.01"/><path d="M12 10h.01"/><path d="M12 14h.01"/><path d="M16 10h.01"/><path d="M16 14h.01"/><path d="M8 10h.01"/><path d="M8 14h.01"/>',
    Building2: '<path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"/><path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"/><path d="M10 6h4"/><path d="M10 10h4"/><path d="M10 14h4"/><path d="M10 18h4"/>',
    Layers: '<polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/>',
    Box: '<path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/>',
    Cylinder: '<ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v14a9 3 0 0 0 18 0V5"/>',
  };
  
  return iconPaths[iconName] || iconPaths.Package;
};

const renderIcon = (iconName: string) => {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${getIconSVG(iconName)}</svg>`;
};

const renderItems = (section: CostSection, subtotal: number) => {
  if (section.items.length === 0) return "";

  return `
    <div class="section">
      <h3>${section.name}</h3>
      <table>
        <thead>
          <tr>
            <th style="width: 30px;"></th>
            <th>Item</th>
            <th>Description</th>
            <th>Qty</th>
            <th>Unit</th>
            <th>Rate</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          ${section.items
            .map(
              (item) => `
            <tr>
              <td class="icon-cell">${renderIcon(item.icon)}</td>
              <td>${item.name}</td>
              <td>${item.description}</td>
              <td class="center">${item.quantity || 0}</td>
              <td class="center">${item.unit}</td>
              <td class="right">${item.unitPrice > 0 ? formatCurrency(item.unitPrice) : "—"}</td>
              <td class="right">${item.quantity * item.unitPrice > 0 ? formatCurrency(item.quantity * item.unitPrice) : "—"}</td>
            </tr>
          `
            )
            .join("")}
          <tr class="subtotal-row">
            <td colspan="6"><strong>Subtotal</strong></td>
            <td class="right"><strong>${formatCurrency(subtotal)}</strong></td>
          </tr>
        </tbody>
      </table>
    </div>
  `;
};

const generateChartSVG = (sections: CostSection[], totals: Record<string, number>) => {
  const chartData = sections
    .map((section) => ({
      name: section.name,
      value: totals[section.id] || 0,
    }))
    .filter((item) => item.value > 0);

  const grandTotal = totals.grandTotal || 0;
  if (grandTotal === 0 || chartData.length === 0) return "";

  const colors = ["#3b82f6", "#22c55e", "#f59e0b", "#8b5cf6", "#ef4444", "#06b6d4"];

  // Generate HTML-based horizontal bar chart (same style as AnalyticsPanel)
  const bars = chartData.map((item, index) => {
    const percentage = (item.value / grandTotal) * 100;
    const color = colors[index % colors.length];

    return `
      <div class="bar-item">
        <div class="bar-header">
          <span class="bar-label">${item.name}</span>
          <span class="bar-value">${formatCurrency(item.value)} (${percentage.toFixed(1)}%)</span>
        </div>
        <div class="bar-track">
          <div class="bar-fill" style="width: ${percentage}%; background-color: ${color};"></div>
        </div>
      </div>
    `;
  }).join("");

  return `
    <div class="chart-section">
      <h3>Cost Distribution by Section</h3>
      <div class="chart-container horizontal-bars">
        ${bars}
      </div>
    </div>
  `;
};

// Duration bar chart
const generateDurationChart = (duration: string) => {
  if (!duration) return "";

  // Parse duration (e.g., "6 months", "8 months")
  const months = parseInt(duration) || 0;
  if (months === 0) return "";

  const phases = [
    { name: "Planning", percentage: 10, color: "#3b82f6" },
    { name: "Foundation", percentage: 15, color: "#22c55e" },
    { name: "Structure", percentage: 30, color: "#f59e0b" },
    { name: "Finishing", percentage: 35, color: "#8b5cf6" },
    { name: "Handover", percentage: 10, color: "#ef4444" },
  ];

  const barWidth = 60;
  const maxHeight = 120;
  const spacing = 20;

  const bars = phases.map((phase, index) => {
    const height = (phase.percentage / 100) * maxHeight;
    const x = index * (barWidth + spacing);
    const y = maxHeight - height;

    return `
      <g transform="translate(${x}, 0)">
        <rect x="0" y="${y}" width="${barWidth}" height="${height}" fill="${phase.color}" rx="4"/>
        <text x="${barWidth / 2}" y="${maxHeight + 15}" font-size="9" fill="#374151" text-anchor="middle">${phase.name}</text>
        <text x="${barWidth / 2}" y="${y - 5}" font-size="10" fill="#374151" text-anchor="middle" font-weight="bold">${phase.percentage}%</text>
      </g>
    `;
  }).join("");

  const svgWidth = phases.length * (barWidth + spacing);

  return `
    <div class="chart-section">
      <h3>Project Timeline - ${duration}</h3>
      <div class="chart-container">
        <svg width="${svgWidth}" height="150" viewBox="0 0 ${svgWidth} 150">
          ${bars}
        </svg>
      </div>
    </div>
  `;
};

export const generatePDFContent = ({ state, totals, ratePerSqft }: PDFExportProps): string => {
  const { projectInfo, sections } = state;
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
          font-size: 11px;
          line-height: 1.5;
          color: #1a1a1a;
          padding: 30px;
        }
        .header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          border-bottom: 3px solid #3b82f6;
          padding-bottom: 15px;
          margin-bottom: 20px;
        }
        .logo h1 {
          font-size: 22px;
          color: #3b82f6;
          margin-bottom: 4px;
        }
        .logo p {
          font-size: 10px;
          color: #666;
        }
        .doc-info {
          text-align: right;
          font-size: 10px;
          color: #666;
        }
        .doc-info strong {
          color: #1a1a1a;
        }
        .project-details {
          background: #f8fafc;
          border-radius: 8px;
          padding: 15px;
          margin-bottom: 20px;
        }
        .project-details h2 {
          font-size: 12px;
          color: #3b82f6;
          margin-bottom: 10px;
        }
        .details-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 10px;
        }
        .detail-item label {
          font-size: 9px;
          color: #666;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .detail-item p {
          font-size: 11px;
          font-weight: 500;
          margin-top: 2px;
        }
        .section {
          margin-bottom: 20px;
          page-break-inside: avoid;
        }
        .section h3 {
          font-size: 12px;
          color: #3b82f6;
          margin-bottom: 10px;
          padding-bottom: 5px;
          border-bottom: 1px solid #e2e8f0;
        }
        table {
          width: 100%;
          border-collapse: collapse;
        }
        th {
          background: #f1f5f9;
          padding: 8px 6px;
          text-align: left;
          font-size: 9px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          color: #475569;
        }
        td {
          padding: 8px 6px;
          border-bottom: 1px solid #e2e8f0;
          vertical-align: middle;
        }
        .icon-cell {
          width: 30px;
          text-align: center;
        }
        .center { text-align: center; }
        .right { text-align: right; }
        .subtotal-row {
          background: #f8fafc;
        }
        .subtotal-row td {
          border-bottom: 2px solid #3b82f6;
        }
        .chart-section {
          margin-bottom: 20px;
          page-break-inside: avoid;
        }
        .chart-section h3 {
          font-size: 12px;
          color: #3b82f6;
          margin-bottom: 10px;
          padding-bottom: 5px;
          border-bottom: 1px solid #e2e8f0;
        }
        .chart-container {
          padding: 15px;
          background: #f8fafc;
          border-radius: 8px;
        }
        .horizontal-bars {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .bar-item {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .bar-header {
          display: flex;
          justify-content: space-between;
          font-size: 11px;
        }
        .bar-label {
          font-weight: 600;
          color: #1a1a1a;
        }
        .bar-value {
          font-weight: 500;
          color: #374151;
        }
        .bar-track {
          width: 100%;
          height: 12px;
          background: #e5e7eb;
          border-radius: 6px;
          overflow: hidden;
        }
        .bar-fill {
          height: 100%;
          border-radius: 6px;
          transition: width 0.3s ease;
        }
        .summary {
          background: #1e3a5f;
          color: white;
          border-radius: 8px;
          padding: 15px;
          margin-top: 20px;
          page-break-inside: avoid;
        }
        .summary h3 {
          font-size: 11px;
          opacity: 0.8;
          margin-bottom: 10px;
        }
        .summary-row {
          display: flex;
          justify-content: space-between;
          padding: 6px 0;
          border-bottom: 1px solid rgba(255,255,255,0.1);
        }
        .summary-row:last-child {
          border-bottom: none;
        }
        .summary-row.total {
          font-size: 16px;
          font-weight: bold;
          margin-top: 8px;
          padding-top: 10px;
          border-top: 2px solid rgba(255,255,255,0.2);
        }
        .footer {
          margin-top: 30px;
          padding-top: 15px;
          border-top: 1px solid #e2e8f0;
          text-align: center;
          font-size: 9px;
          color: #666;
        }
        @media print {
          body { padding: 15px; }
          .summary { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .chart-container { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          svg { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          th { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .subtotal-row { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
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

      ${generateChartSVG(sections, totals)}
      ${generateDurationChart(projectInfo.duration)}

      ${sections.map((section) => renderItems(section, totals[section.id] || 0)).join("")}

      <div class="summary">
        <h3>COST SUMMARY</h3>
        ${sections
          .filter((section) => (totals[section.id] || 0) > 0)
          .map(
            (section) => `
          <div class="summary-row">
            <span>${section.name}</span>
            <span>${formatCurrency(totals[section.id] || 0)}</span>
          </div>
        `
          )
          .join("")}
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
