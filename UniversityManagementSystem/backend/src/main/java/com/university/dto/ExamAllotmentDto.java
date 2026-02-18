package com.university.dto;

import lombok.Data;
import java.util.UUID;

@Data
public class ExamAllotmentDto {
    private UUID examId;
    private UUID studentId;
    private String seatNumber;
}
