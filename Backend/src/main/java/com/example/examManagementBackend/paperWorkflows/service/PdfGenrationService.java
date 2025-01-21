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
import com.itextpdf.layout.borders.Border;
import com.itextpdf.layout.borders.SolidBorder;
import com.itextpdf.layout.element.Cell;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.element.Table;
import com.itextpdf.layout.element.Text;
import com.itextpdf.layout.properties.TextAlignment;
import com.itextpdf.layout.properties.VerticalAlignment;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.io.IOException;

@Service
public class PdfGenrationService {

    public ResponseEntity<StandardResponse> genratePdf(FeedBackDTO feedBackDTO) throws IOException {
        questionData[] Question = feedBackDTO.getQuestion();
        if(Question != null) {
            String fileName = "feedback.pdf";
            PdfWriter writer = new PdfWriter(fileName);
            PdfDocument pdf = new PdfDocument(writer);
            Document document = new Document(pdf, PageSize.A4);
            float colSize1=190f;
            float colsize2=250f;
            float colsize3=100f;
            float questionTableSize[]={50f,250f,40f,200f};
            float examineTable[]={270f,270f};
            float moderatorSign[]={colSize1,colsize2,colsize3};
            float actionSign[]={180f,180f,180f};
            float fullColumn[]={540f};

            // Add title
            Paragraph title = new Paragraph("Evaluation Form for Moderation of Examination papers\n" +
                    "Department of Computer Science-University of Ruhuna")
                    .setBold()
                    .setFontSize(18)
                    .setTextAlignment(com.itextpdf.layout.properties.TextAlignment.CENTER);
            document.add(title);

            // Add metadata or custom fields as in the form (Degree Program, Course Name, etc.)
            document.add(new Paragraph("Degree Program: " + feedBackDTO.getDegreeProgram()));
            document.add(new Paragraph("Examination: " + feedBackDTO.getExamination()));
            document.add(new Paragraph("Course Name: " + feedBackDTO.getCourseName()));
            document.add(new Paragraph("Course Code: " + feedBackDTO.getCourseCode()));

            // Table for the main questions
            Table table = new Table(questionTableSize); // 5 columns

            // Set the table header
            table.addCell(createStyledCell("Row No."));
            table.addCell(createStyledCell("Question"));
            table.addCell(createStyledCell("Answer"));
            table.addCell(createStyledCell("Specific Comment"));

            // Add rows
            for (int i = 0; i < 7; i++) {
                table.addCell(createStyledCell(String.valueOf(i + 1)));
                table.addCell(createStyledCell(Question[i].getQuestion()));
                table.addCell(createStyledCell(Question[i].getAnswer()));
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
                table.addCell(createStyledCell(Question[i].getAnswer()));
                table.addCell(createStyledCell(Question[i].getComment()));
            }
            Cell commentCell1 = new Cell(1, 5);
            commentCell1.add(new Paragraph("General Comment on Question Paper and Marking Scheme")
                    .setBold()
                    .setFontSize(14)
                    .setTextAlignment(com.itextpdf.layout.properties.TextAlignment.CENTER));
            commentCell1.setBorder(new SolidBorder(new DeviceRgb(0, 0, 0), 1));
            commentCell1.setPadding(10);
            PdfFont font = PdfFontFactory.createFont(StandardFonts.HELVETICA); // Use Helvetica font
            commentCell1.setFont(font);
            table.addCell(commentCell1);
            commentCell1.add(new Paragraph(feedBackDTO.getGeneralComment()));
            document.add(table);
            Table table1 = new Table(moderatorSign);
            Cell namesCell = new Cell();
            namesCell.add(new Paragraph("---------------------")
                    .setTextAlignment(com.itextpdf.layout.properties.TextAlignment.CENTER));
            namesCell.add(new Paragraph("Name")
                    .setBold()
                    .setTextAlignment(com.itextpdf.layout.properties.TextAlignment.CENTER));
            namesCell.setVerticalAlignment(VerticalAlignment.BOTTOM);
            namesCell.setPadding(10);
            namesCell.setBorder(Border.NO_BORDER); // Add border for separation
            table1.addCell(namesCell);

// Signature Cell
            Cell signatureCell = new Cell();
            signatureCell.add(new Paragraph("---------------------")
                    .setTextAlignment(com.itextpdf.layout.properties.TextAlignment.CENTER));
            signatureCell.add(new Paragraph("Signature")
                    .setBold()
                    .setTextAlignment(com.itextpdf.layout.properties.TextAlignment.CENTER));
            signatureCell.setVerticalAlignment(VerticalAlignment.BOTTOM);
            signatureCell.setPadding(10);
            signatureCell.setBorder(Border.NO_BORDER); // Add border for separation
            table1.addCell(signatureCell);

// Date Cell
            Cell dateCell = new Cell();
            dateCell.add(new Paragraph("-------------------")
                    .setTextAlignment(com.itextpdf.layout.properties.TextAlignment.CENTER));
            dateCell.add(new Paragraph("Date")
                    .setBold()
                    .setTextAlignment(com.itextpdf.layout.properties.TextAlignment.CENTER));
            dateCell.setVerticalAlignment(VerticalAlignment.BOTTOM);
            dateCell.setPadding(10);
            dateCell.setBorder(Border.NO_BORDER); // Add border for separation
            table1.addCell(dateCell);
            document.add(table1.setBorder(new SolidBorder(new DeviceRgb(0, 0, 0), 1)));
            Table examinerTitle = new Table(examineTable);
            Cell namesCell1 = new Cell(1,2);
            namesCell1.add(new Paragraph("Follow Up Action by Examiner/s"))
                    .setBold()
                    .setFontSize(14)
                    .setTextAlignment(com.itextpdf.layout.properties.TextAlignment.CENTER);
            namesCell1.setBorder(Border.NO_BORDER);
            namesCell1.setPadding(10);
            PdfFont examineFont = PdfFontFactory.createFont(StandardFonts.HELVETICA);
            namesCell1.setFont(examineFont);
            examinerTitle.addCell(namesCell1);
            Cell agreeCell = new Cell();
            agreeCell.add(new Paragraph()
                    .add(new Text("(a) Agree and Adressed: \n").setBold())
                    .add(new Text(feedBackDTO.getAgreeAndAddressed()))
                    )
                    .setFontSize(12)
                    .setTextAlignment(TextAlignment.LEFT);
            agreeCell.setBorder(new SolidBorder(new DeviceRgb(0, 0, 0), 1));
            agreeCell.setPadding(4);
           agreeCell.setFont(examineFont);
           examinerTitle.addCell(agreeCell);
           Cell disagreeCell = new Cell();
           disagreeCell.add(new Paragraph()
                   .add(new Text("(b) Not Agree and Reasson: \n").setBold()).add(new Text("\t"+feedBackDTO.getAgreeAndAddressed()))

                   )
                    .setFontSize(12)
                    .setTextAlignment(TextAlignment.LEFT);

            agreeCell.setBorder(new SolidBorder(new DeviceRgb(0, 0, 0), 1));
           disagreeCell.setPadding(4);
           disagreeCell.setFont(examineFont);
           examinerTitle.addCell(disagreeCell);
           document.add(examinerTitle.setBorder(Border.NO_BORDER));
           Table examinersTable = new Table(actionSign);
           examinersTable.addCell(new Cell().add(new Paragraph("Name")).setBorder(Border.NO_BORDER));
           examinersTable.addCell(new Cell().add(new Paragraph("Signature")).setBorder(Border.NO_BORDER));
           examinersTable.addCell(new Cell().add(new Paragraph("Date")).setBorder(Border.NO_BORDER));
           for(int i=0;i<12;i++){
               examinersTable.addCell(new Cell().add(new Paragraph("---------------------------")).setBorder(Border.NO_BORDER));
           }
           document.add(examinersTable.setBorder(new SolidBorder(new DeviceRgb(0, 0, 0), 1)));
           Table endTable=new Table(fullColumn);
           Cell learningOutcomeCell = new Cell();
           learningOutcomeCell.add(new Paragraph( )
                   .add(new Text("Learning Outcomes:\n").setBold())
                   .add(feedBackDTO.getLearningOutcomes())
                   .setFontSize(14)
                   .setTextAlignment(TextAlignment.LEFT)
           );
           learningOutcomeCell.setBorder(Border.NO_BORDER);
           endTable.addCell(learningOutcomeCell);
            Cell CourseContent = new Cell();
            CourseContent.add(new Paragraph( )
                    .add(new Text("Course Content:\n").setBold())
                    .add(feedBackDTO.getCourseContent())
                    .setFontSize(14)
                    .setTextAlignment(TextAlignment.LEFT)
            );
            CourseContent.setBorder(Border.NO_BORDER);
            endTable.addCell(CourseContent);
            document.add(endTable.setBorder(new SolidBorder(new DeviceRgb(0, 0, 0), 1)));







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
