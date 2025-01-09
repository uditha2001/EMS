package com.example.examManagementBackend.paperWorkflows.service;

import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.IOException;
import java.util.Arrays;
import java.util.List;

@Service
public class PdfQuestionExtractor {
    public List<String> extractQuestions(String filePath) throws IOException {
        try (PDDocument document = PDDocument.load(new File(filePath))) {
            PDFTextStripper pdfStripper = new PDFTextStripper();
            String text = pdfStripper.getText(document);
            return Arrays.asList(text.split("(?=\\d+\\.\\s)")); // Split at question numbers
        }
    }
}
