package com.example.examManagementBackend.paperWorkflows.service;

import com.example.examManagementBackend.paperWorkflows.dto.FeedBackData.FeedBackDTO;
import com.example.examManagementBackend.paperWorkflows.dto.FeedBackData.questionData;
import com.example.examManagementBackend.utill.StandardResponse;
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
import java.util.Arrays;

import static com.itextpdf.io.font.constants.StandardFonts.HELVETICA_BOLD;

@Service
public class PdfGenrationService {

    public ResponseEntity<StandardResponse> genratePdf(FeedBackDTO feedBackDTO) throws IOException {
        questionData[] questionData = feedBackDTO.getQuestion();
        if(questionData != null) {
            String fileName = "feedback.pdf";
            PdfWriter writer = new PdfWriter(fileName);
            PdfDocument pdf = new PdfDocument(writer);
            Document document = new Document(pdf, PageSize.A4);

            // Add title
            Paragraph title = new Paragraph("Evaluation Form for Moderation of Examination papers")
                    .setBold()
                    .setFontSize(18)
                    .setTextAlignment(com.itextpdf.layout.properties.TextAlignment.CENTER)
                    .setFont(PdfFontFactory.createFont(PdfFontFactory.createFont(HELVETICA_BOLD).getPdfObject()));

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

            // Table for the main questions (similar to your table)
            Table table = new Table(5); // 5 columns as in your HTML

            // Set the table header
            table.addCell(createStyledCell("Row No."));
            table.addCell(createStyledCell("Question"));
            table.addCell(createStyledCell("Yes"));
            table.addCell(createStyledCell("No"));
            table.addCell(createStyledCell("Specific Comment"));

            // Add rows
            for (int i = 0; i < 7; i++) {
                table.addCell(createStyledCell(String.valueOf(i + 1)));
                table.addCell(createStyledCell(Arrays.toString(questionData[i].getQuestions())));  // Assuming finalData.Question is available
                table.addCell(createStyledCell(questionData[i].getAnswer().equals("yes") ? "✔" : ""));
                table.addCell(createStyledCell(questionData[i].getAnswer().equals("no") ? "✔" : ""));
                table.addCell(createStyledCell(questionData[i].getAnswer()));
            }

            // Add the table to the document
            document.add(table);

            // Add other details (e.g., comment on marking scheme, action by examiner)
            document.add(new Paragraph("Comment on Marking Scheme").setBold().setFontSize(14).setTextAlignment(com.itextpdf.layout.properties.TextAlignment.CENTER));
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
        PdfFont font = PdfFontFactory.createFont(StandardFonts.HELVETICA);
        cell.setFont(font);

        // Return the styled cell
        return cell;
    }

}


