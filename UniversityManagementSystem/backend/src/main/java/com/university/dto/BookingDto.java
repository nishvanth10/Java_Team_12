package com.university.dto;

import lombok.Data;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
public class BookingDto {
    private UUID hallId;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private String purpose;
}
