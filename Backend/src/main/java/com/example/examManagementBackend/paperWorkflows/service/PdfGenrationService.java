package com.example.examManagementBackend.paperWorkflows.service;

import com.example.examManagementBackend.paperWorkflows.dto.FeedBackData.FeedBackDTO;
import com.example.examManagementBackend.utill.StandardResponse;
import com.itextpdf.text.Document;
import com.itextpdf.text.DocumentException;
import com.itextpdf.text.pdf.PdfWriter;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.io.FileNotFoundException;
import java.io.FileOutputStream;

@Service
public class PdfGenrationService {

    public ResponseEntity<StandardResponse> genratePdf(FeedBackDTO feedBackDTO) {
        try{
            Document document = new Document();
            PdfWriter.getInstance(document, new FileOutputStream("feedback.pdf"));

        }
        catch (DocumentException | FileNotFoundException e) {
            throw new RuntimeException(e);
        }


        return null;
    }
}
