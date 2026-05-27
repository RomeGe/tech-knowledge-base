"use client";

export function PdfExport({ title, date }: { title: string; date?: string }) {
  const handlePrint = () => {
    const style = document.createElement("style");
    style.id = "tech-kb-print-styles";
    style.textContent = `
      @media print {
        header, footer, nav, aside, .fixed, [role="button"], button,
        .sidebar, .back-to-top, .command-palette, .reading-progress {
          display: none !important;
        }
        body {
          background: white !important;
          color: black !important;
          font-size: 11pt;
          margin: 0;
          padding: 0;
        }
        @page {
          margin: 2cm;
          @top-center {
            content: "${title}";
            font-size: 9pt;
            color: #666;
          }
          @bottom-center {
            content: counter(page) " / " counter(pages);
            font-size: 9pt;
            color: #666;
          }
        }
        main {
          max-width: 100% !important;
          padding: 0 !important;
        }
        .prose {
          max-width: 100% !important;
        }
        .prose pre {
          white-space: pre-wrap;
          word-wrap: break-word;
          page-break-inside: avoid;
        }
        .prose h1, .prose h2, .prose h3 {
          page-break-after: avoid;
        }
        .prose img {
          max-width: 100%;
          page-break-inside: avoid;
        }
        .prose table {
          page-break-inside: avoid;
        }
        a {
          color: black;
          text-decoration: underline;
        }
        a[href^="http"]::after {
          content: " (" attr(href) ")";
          font-size: 9pt;
          color: #666;
        }
      }
    `;
    document.head.appendChild(style);

    setTimeout(() => {
      window.print();
      setTimeout(() => {
        document.getElementById("tech-kb-print-styles")?.remove();
      }, 1000);
    }, 100);
  };

  return (
    <button
      onClick={handlePrint}
      className="px-3 py-1.5 text-xs text-text-tertiary border border-border rounded hover:bg-surface-hover transition-colors"
      title="导出 PDF"
    >
      PDF
    </button>
  );
}
