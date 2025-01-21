package com.example.examManagementBackend.paperWorkflows.service;

import com.example.examManagementBackend.paperWorkflows.dto.FeedBackData.FeedBackDTO;
import com.example.examManagementBackend.paperWorkflows.dto.FeedBackData.questionData;
import com.example.examManagementBackend.utill.StandardResponse;
import com.itextpdf.io.font.PdfEncodings;
import com.itextpdf.io.font.constants.StandardFonts;
import com.itextpdf.kernel.colors.DeviceRgb;
import com.itextpdf.kernel.font.PdfFont;
import com.itextpdf.kernel.font.PdfFontFactory;
import com.itextpdf.kernel.geom.PageSize;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.borders.SolidBorder;
import com.itextpdf.layout.element.Cell;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.element.Table;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.io.IOException;

@Service
public class PdfGenrationService {

    public ResponseEntity<StandardResponse> genratePdf(FeedBackDTO feedBackDTO) throws IOException {
        questionData[] Question = feedBackDTO.getQuestion();
        String checkMark = "✔"; // Direct Unicode check mark
        if(Question != null) {
            String fileName = "feedback.pdf";
            PdfWriter writer = new PdfWriter(fileName);
            PdfDocument pdf = new PdfDocument(writer);
            Document document = new Document(pdf, PageSize.A4);

            // Add title
            Paragraph title = new Paragraph("Evaluation Form for Moderation of Examination papers")
                    .setBold()
                    .setFontSize(18)
                    .setTextAlignment(com.itextpdf.layout.properties.TextAlignment.CENTER);

            Paragraph subTitle = new Paragraph("Department of Computer Science-University of Ruhuna")
                    .setFontSize(12)
                    .setTextAlignment(com.itextpdf.layout.properties.TextAlignment.CENTER);
            document.add(title);
            document.add(subTitle);

            // Add metadata or custom fields as in the form (Degree Program, Course Name, etc.)
            document.add(new Paragraph("Degree Program: " + feedBackDTO.getDegreeProgram()));
            document.add(new Paragraph("Examination: " + feedBackDTO.getExamination()));
            document.add(new Paragraph("Course Name: " + feedBackDTO.getCourseName()));
            document.add(new Paragraph("Course Code: " + feedBackDTO.getCourseCode()));

            // Table for the main questions
            Table table = new Table(5); // 5 columns

            // Set the table header
            table.addCell(createStyledCell("Row No."));
            table.addCell(createStyledCell("Question"));
            table.addCell(createStyledCell("Yes"));
            table.addCell(createStyledCell("No"));
            table.addCell(createStyledCell("Specific Comment"));

            // Add rows
            for (int i = 0; i < 7; i++) {
                table.addCell(createStyledCell(String.valueOf(i + 1)));
                table.addCell(createStyledCell(Question[i].getQuestion()));
                table.addCell(createStyledCell(Question[i].getAnswer().equals("yes") ? checkMark : ""));
                table.addCell(createStyledCell(Question[i].getAnswer().equals("no") ? checkMark : ""));
                table.addCell(createStyledCell(Question[i].getComment()));
            }
            Cell commentCell = new Cell(1, 5); // 1 row, 5 columns
            commentCell.add(new Paragraph("Comment on Marking Scheme")
                    .setBold()
                    .setFontSize(14)
                    .setTextAlignment(com.itextpdf.layout.properties.TextAlignment.CENTER));
            commentCell.setBorder(new SolidBorder(new DeviceRgb(0, 0, 0), 1)); // Optional: Add a border
            commentCell.setPadding(5);
            table.addCell(commentCell);

            for(int i=7;i<9;i++){
                table.addCell(createStyledCell(String.valueOf(i + 1)));
                table.addCell(createStyledCell(Question[i].getQuestion()));
                table.addCell(createStyledCell(Question[i].getAnswer().equals("yes") ? checkMark : ""));
                table.addCell(createStyledCell(Question[i].getAnswer().equals("no") ? checkMark : ""));
                table.addCell(createStyledCell(Question[i].getComment()));
            }
            Cell commentCell1 = new Cell(1, 5);
            commentCell1.add(new Paragraph("General Comment on Question Paper and Marking Scheme")
                    .setBold()
                    .setFontSize(14)
                    .setTextAlignment(com.itextpdf.layout.properties.TextAlignment.CENTER));
            commentCell1.setBorder(new SolidBorder(new DeviceRgb(0, 0, 0), 1));
            commentCell1.setPadding(5);
            table.addCell(commentCell1);

            // Create a cell for the general comment
            Cell CommentCell = new Cell(1, 5); // Spans 5 columns
            CommentCell.add(new Paragraph(feedBackDTO.getGeneralComment())
                    .setTextAlignment(com.itextpdf.layout.properties.TextAlignment.LEFT) // Align text to the left
                    .setMarginLeft(10) // Add a margin for spacing from the left
                    .setMarginRight(10)); // Add a margin for spacing from the right

// Set border and padding
            CommentCell.setBorder(new SolidBorder(new DeviceRgb(0, 0, 0), 1)); // Black border with width 1
            CommentCell.setPaddingLeft(10); // Add padding on the left
            CommentCell.setPaddingRight(10); // Add padding on the right
            CommentCell.setPaddingTop(5); // Add padding on the top
            CommentCell.setPaddingBottom(5); // Add padding on the bottom
            commentCell1.add(new Paragraph(feedBackDTO.getGeneralComment()));
// Add the cell to the table
            table.addCell(CommentCell);
            document.add(table);


// Names Cell
            // Create a new table for Name, Signature, and Date
            float[] columnWidths = {2, 5, 3};
            Table namesSignatureDateTable = new Table(columnWidths);

// Name Cell
            Cell namesCell = new Cell(); // Spans 1 column
            namesCell.add(new Paragraph("---------------------")
                    .setTextAlignment(com.itextpdf.layout.properties.TextAlignment.CENTER));
            namesCell.add(new Paragraph("Name")
                    .setBold()
                    .setTextAlignment(com.itextpdf.layout.properties.TextAlignment.CENTER));
            namesCell.setVerticalAlignment(com.itextpdf.layout.properties.VerticalAlignment.MIDDLE);
            namesCell.setHeight(50);
            namesCell.setPadding(5);
            namesSignatureDateTable.addCell(namesCell);

// Signature Cell
            Cell signatureCell = new Cell(); // Spans 3 columns
            signatureCell.add(new Paragraph("---------------------")
                    .setTextAlignment(com.itextpdf.layout.properties.TextAlignment.CENTER));
            signatureCell.add(new Paragraph("Signature")
                    .setBold()
                    .setTextAlignment(com.itextpdf.layout.properties.TextAlignment.CENTER));
            signatureCell.setVerticalAlignment(com.itextpdf.layout.properties.VerticalAlignment.MIDDLE);
            signatureCell.setHeight(50);
            signatureCell.setPadding(5);
            namesSignatureDateTable.addCell(signatureCell);

// Date Cell
            Cell dateCell = new Cell(); // Spans 1 column
            dateCell.add(new Paragraph("---------------------")
                    .setTextAlignment(com.itextpdf.layout.properties.TextAlignment.CENTER));
            dateCell.add(new Paragraph("Date")
                    .setBold()
                    .setTextAlignment(com.itextpdf.layout.properties.TextAlignment.CENTER));
            dateCell.setVerticalAlignment(com.itextpdf.layout.properties.VerticalAlignment.MIDDLE);
            dateCell.setHeight(50);
            dateCell.setPadding(5);
            namesSignatureDateTable.addCell(dateCell);

            document.add(namesSignatureDateTable);


            // Add other details (e.g., comment on marking scheme, action by examiner)
            document.add(new Paragraph(feedBackDTO.getGeneralComment()));

            document.close();
            return null;
        }
        return null;
    }

    private Cell createStyledCell(String text) throws IOException {
        // Create a new cell
        Cell cell = new Cell();

        // Add text as a Paragraph to the cell
        cell.add(new Paragraph(text));

        // Set a solid black border with a width of 1
        cell.setBorder(new SolidBorder(new DeviceRgb(0, 0, 0), 1));

        // Set padding
        cell.setPadding(5);

        // Set the font to Helvetica
        PdfFont font = PdfFontFactory.createFont(StandardFonts.HELVETICA); // Use Helvetica font
        cell.setFont(font);

        // Return the styled cell
        return cell;
    }
}
