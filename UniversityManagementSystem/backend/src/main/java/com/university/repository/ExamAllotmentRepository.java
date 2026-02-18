package com.university.repository;

import com.university.entity.ExamAllotment;
import com.university.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ExamAllotmentRepository extends JpaRepository<ExamAllotment, UUID> {
    List<ExamAllotment> findByStudent(User student);
}
