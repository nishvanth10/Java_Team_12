package com.university.dto;

import lombok.Data;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
public class ExamDto {
    private String name;
    private LocalDateTime date;
    private UUID hallId;
}
