package com.university.controller;

import com.university.dto.ExamAllotmentDto;
import com.university.entity.ExamAllotment;
import com.university.entity.User;
import com.university.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin
public class AdminController {

    @Autowired
    private AdminService adminService;

    @PutMapping("/users/{id}/unlock")
    public ResponseEntity<String> unlockUser(@PathVariable UUID id) {
        String response = adminService.unlockUser(id);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PutMapping("/users/{id}/approve-reset")
    public ResponseEntity<String> approvePasswordReset(@PathVariable UUID id) {
        String response = adminService.approvePasswordReset(id);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PostMapping("/exams/allot")
    public ResponseEntity<ExamAllotment> allotExam(@RequestBody ExamAllotmentDto allotmentDto) {
        ExamAllotment allotment = adminService.allotExam(allotmentDto);
        return new ResponseEntity<>(allotment, HttpStatus.CREATED);
    }

    @GetMapping("/allotments")
    public ResponseEntity<List<ExamAllotment>> getAllAllotments() {
        return new ResponseEntity<>(adminService.getAllAllotments(), HttpStatus.OK);
    }

    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        return new ResponseEntity<>(adminService.getAllUsers(), HttpStatus.OK);
    }

    @PutMapping("/allotments/{id}")
    public ResponseEntity<ExamAllotment> updateAllotment(@PathVariable UUID id,
            @RequestBody ExamAllotmentDto allotmentDto) {
        ExamAllotment updatedAllotment = adminService.updateAllotment(id, allotmentDto);
        return new ResponseEntity<>(updatedAllotment, HttpStatus.OK);
    }
}
