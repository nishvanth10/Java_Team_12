package com.university.service;

import com.university.dto.ExamDto;
import com.university.entity.Exam;

import java.util.List;
import java.util.UUID;

public interface ExamService {
    Exam createExam(ExamDto examDto);

    List<Exam> getAllExams();

    Exam getExamById(UUID id);

    Exam updateExam(UUID id, ExamDto examDto);
}
