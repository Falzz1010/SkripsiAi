import { jsPDF } from 'jspdf';
import { Document, Packer, Paragraph, HeadingLevel } from 'docx';
import { saveAs } from 'file-saver';
import { ThesisContent } from '../types';

export const generatePDF = (content: ThesisContent) => {
  const doc = new jsPDF();
  let y = 20;

  // Title
  doc.setFontSize(20);
  doc.text(content.title, 20, y);
  y += 20;

  // Abstract
  doc.setFontSize(16);
  doc.text('Abstract', 20, y);
  y += 10;
  doc.setFontSize(12);
  const abstractLines = doc.splitTextToSize(content.abstract, 170);
  doc.text(abstractLines, 20, y);
  y += abstractLines.length * 7 + 10;

  // Chapters
  Object.entries(content.chapters).forEach(([_, chapter]) => {
    if (y > 270) {
      doc.addPage();
      y = 20;
    }

    doc.setFontSize(16);
    doc.text(chapter.title, 20, y);
    y += 10;

    doc.setFontSize(12);
    const contentLines = doc.splitTextToSize(chapter.content, 170);
    doc.text(contentLines, 20, y);
    y += contentLines.length * 7 + 10;
  });

  doc.save('thesis.pdf');
};

export const generateDOCX = async (content: ThesisContent) => {
  const doc = new Document({
    sections: [{
      properties: {},
      children: [
        new Paragraph({
          text: content.title,
          heading: HeadingLevel.TITLE,
        }),
        new Paragraph({
          text: 'Abstract',
          heading: HeadingLevel.HEADING_1,
        }),
        new Paragraph({
          text: content.abstract,
        }),
        ...Object.entries(content.chapters).flatMap(([_, chapter]) => [
          new Paragraph({
            text: chapter.title,
            heading: HeadingLevel.HEADING_1,
          }),
          new Paragraph({
            text: chapter.content,
          }),
        ]),
      ],
    }],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, 'thesis.docx');
};