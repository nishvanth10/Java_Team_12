package com.university.service;

import com.university.dto.ExamAllotmentDto;
import com.university.entity.ExamAllotment;
import com.university.entity.User;

import java.util.List;
import java.util.UUID;

public interface AdminService {
    String unlockUser(UUID userId);

    ExamAllotment allotExam(ExamAllotmentDto allotmentDto);

    List<ExamAllotment> getAllAllotments();

    List<User> getAllUsers();

    User getUserById(UUID userId);

    ExamAllotment updateAllotment(UUID id, ExamAllotmentDto allotmentDto);

    String approvePasswordReset(UUID userId);
}
