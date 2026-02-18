package com.university.service.impl;

import com.university.dto.ExamAllotmentDto;
import com.university.entity.Exam;
import com.university.entity.ExamAllotment;
import com.university.entity.User;
import com.university.repository.ExamAllotmentRepository;
import com.university.repository.ExamRepository;
import com.university.repository.UserRepository;
import com.university.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class AdminServiceImpl implements AdminService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ExamRepository examRepository;

    @Autowired
    private ExamAllotmentRepository examAllotmentRepository;

    @Autowired
    private org.springframework.security.crypto.password.PasswordEncoder passwordEncoder;

    @Override
    public String unlockUser(UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setLocked(false);
        user.setFailedAttempts(0);
        userRepository.save(user);
        return "User unlocked successfully.";
    }

    @Override
    public String approvePasswordReset(UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!user.isPasswordResetRequested()) {
            throw new RuntimeException("User has not requested a password reset.");
        }

        user.setPasswordResetRequested(false);
        user.setLocked(false);
        user.setFailedAttempts(0);
        user.setPassword(passwordEncoder.encode("Default@123"));
        userRepository.save(user);
        return "Password reset approved. New password is 'Default@123'.";
    }

    @Override
    public ExamAllotment allotExam(ExamAllotmentDto allotmentDto) {
        Exam exam = examRepository.findById(allotmentDto.getExamId())
                .orElseThrow(() -> new RuntimeException("Exam not found"));
        User student = userRepository.findById(allotmentDto.getStudentId())
                .orElseThrow(() -> new RuntimeException("Student not found"));

        ExamAllotment allotment = new ExamAllotment();
        allotment.setExam(exam);
        allotment.setStudent(student);
        allotment.setSeatNumber(allotmentDto.getSeatNumber());

        return examAllotmentRepository.save(allotment);
    }

    @Override
    public List<ExamAllotment> getAllAllotments() {
        return examAllotmentRepository.findAll();
    }

    @Override
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @Override
    public User getUserById(UUID userId) {
        return userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
    }

    @Override
    public ExamAllotment updateAllotment(UUID id, ExamAllotmentDto allotmentDto) {
        ExamAllotment allotment = examAllotmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Allotment not found"));

        Exam exam = examRepository.findById(allotmentDto.getExamId())
                .orElseThrow(() -> new RuntimeException("Exam not found"));

        User student = userRepository.findById(allotmentDto.getStudentId())
                .orElseThrow(() -> new RuntimeException("Student not found"));

        allotment.setExam(exam);
        allotment.setStudent(student);
        allotment.setSeatNumber(allotmentDto.getSeatNumber());

        return examAllotmentRepository.save(allotment);
    }
}
