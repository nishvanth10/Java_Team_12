package com.university.service.impl;

import com.university.dto.ExamDto;
import com.university.entity.Exam;
import com.university.entity.Hall;
import com.university.repository.ExamRepository;
import com.university.repository.HallRepository;
import com.university.service.ExamService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class ExamServiceImpl implements ExamService {

    @Autowired
    private ExamRepository examRepository;

    @Autowired
    private HallRepository hallRepository;

    @Override
    public Exam createExam(ExamDto examDto) {
        Hall hall = hallRepository.findById(examDto.getHallId())
                .orElseThrow(() -> new RuntimeException("Hall not found"));

        Exam exam = new Exam();
        exam.setName(examDto.getName());
        exam.setDate(examDto.getDate());
        exam.setHall(hall);

        return examRepository.save(exam);
    }

    @Override
    public List<Exam> getAllExams() {
        return examRepository.findAll();
    }

    @Override
    public Exam getExamById(UUID id) {
        return examRepository.findById(id).orElseThrow(() -> new RuntimeException("Exam not found"));
    }

    @Override
    public Exam updateExam(UUID id, ExamDto examDto) {
        Exam exam = getExamById(id);

        Hall hall = hallRepository.findById(examDto.getHallId())
                .orElseThrow(() -> new RuntimeException("Hall not found"));

        exam.setName(examDto.getName());
        exam.setDate(examDto.getDate());
        exam.setHall(hall);

        return examRepository.save(exam);
    }
}
