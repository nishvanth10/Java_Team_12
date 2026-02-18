package com.university.controller;

import com.university.dto.ExamDto;
import com.university.entity.Exam;
import com.university.service.ExamService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/exams")
@CrossOrigin
public class ExamController {

    @Autowired
    private ExamService examService;

    @PostMapping
    public ResponseEntity<Exam> createExam(@RequestBody ExamDto examDto) {
        Exam exam = examService.createExam(examDto);
        return new ResponseEntity<>(exam, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<Exam>> getAllExams() {
        return new ResponseEntity<>(examService.getAllExams(), HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Exam> getExamById(@PathVariable UUID id) {
        return new ResponseEntity<>(examService.getExamById(id), HttpStatus.OK);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Exam> updateExam(@PathVariable UUID id, @RequestBody ExamDto examDto) {
        Exam updatedExam = examService.updateExam(id, examDto);
        return new ResponseEntity<>(updatedExam, HttpStatus.OK);
    }
}
