"use client";
import { useState, useCallback, type RefObject } from "react";
import { downloadReportFile } from "@/lib/services/api";
import toast from "react-hot-toast";

interface PrintDownloadReport {
  fileUrl?: string;
  patientName?: string;
  testName?: string;
  _id?: string;
}

async function generatePdfFromContent(el: HTMLElement, filename: string) {
  const { default: html2canvas } = await import("html2canvas");
  const { default: jsPDF } = await import("jspdf");
  const canvas = await html2canvas(el, {
    scale: 2,
    useCORS: true,
    logging: false,
    backgroundColor: "#ffffff",
  });
  const imgData = canvas.toDataURL("image/png");
  const pdf = new jsPDF("p", "mm", "a4");
  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
  let heightLeft = pdfHeight;
  let position = 0;
  const pageHeight = pdf.internal.pageSize.getHeight();
  pdf.addImage(imgData, "PNG", 0, position, pdfWidth, pdfHeight);
  heightLeft -= pageHeight;
  while (heightLeft > 0) {
    position = heightLeft - pdfHeight;
    pdf.addPage();
    pdf.addImage(imgData, "PNG", 0, position, pdfWidth, pdfHeight);
    heightLeft -= pageHeight;
  }
  pdf.save(filename);
}

export function useReportDownload(report: PrintDownloadReport | null, printRef: RefObject<HTMLDivElement | null>) {
  const [isPrinting, setIsPrinting] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const handlePrint = useCallback(async () => {
    if (!report) return;
    setIsPrinting(true);
    try {
      if (report.fileUrl) {
        try {
          const { blob } = await downloadReportFile(report.fileUrl);
          const url = URL.createObjectURL(blob);
          const w = window.open(url, "_blank", "noopener,noreferrer");
          if (w) {
            w.onload = () => {
              setTimeout(() => { w.print(); }, 800);
            };
          }
          setTimeout(() => URL.revokeObjectURL(url), 60_000);
          return;
        } catch {
          toast.error("Original file unavailable; printing from view");
        }
      }
      window.print();
    } catch {
      toast.error("Failed to print report");
    } finally {
      setIsPrinting(false);
    }
  }, [report]);

  const handleDownload = useCallback(async () => {
    if (!report) return;
    setIsDownloading(true);
    try {
      if (report.fileUrl) {
        try {
          const { blob, filename } = await downloadReportFile(report.fileUrl);
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = filename;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          setTimeout(() => URL.revokeObjectURL(url), 1_000);
          toast.success("Report downloaded");
          return;
        } catch {
          toast.error("Original file unavailable; generating PDF from view");
        }
      }
      const el = printRef.current;
      if (!el) { toast.error("Report content not found"); return; }
      const filename = `${report.patientName || "report"}_${report.testName || "document"}.pdf`
        .replace(/[^a-zA-Z0-9_\u0980-\u09FF-]/g, "_");
      await generatePdfFromContent(el, filename);
      toast.success("PDF downloaded");
    } catch {
      toast.error("Failed to download report");
    } finally {
      setIsDownloading(false);
    }
  }, [report, printRef]);

  return { handlePrint, handleDownload, isPrinting, isDownloading };
}
