import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export const exportToPdf = async () => {
  const pdf = new jsPDF("l", "mm", "a4");
  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = pdf.internal.pageSize.getHeight();

  const exportContainer = document.getElementById("export-container");
  if (!exportContainer) {
    throw new Error("Export container not found");
  }

  const pageElements = exportContainer.querySelectorAll(".export-page");

  try {
    for (let i = 0; i < pageElements.length; i++) {
      const pageElement = pageElements[i];

      const canvas = await html2canvas(pageElement, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
      });

      const imgData = canvas.toDataURL("image/png");

      if (i > 0) {
        pdf.addPage();
      }

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    }

    return pdf.output("blob");
  } catch (error) {
    console.error("PDF generation failed:", error);
    throw error;
  }
};
