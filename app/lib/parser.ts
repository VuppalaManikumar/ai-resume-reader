import fs from "fs";

export async function extractTextFromPDF(filePath: string): Promise<string> {
  // Dynamic import to avoid issues with Next.js bundling
  const pdfParse = (await import("pdf-parse")).default;
  const dataBuffer = fs.readFileSync(filePath);
  const data = await pdfParse(dataBuffer);
  return data.text;
}

export function extractTextFromPlainText(text: string): string {
  return text.trim();
}
