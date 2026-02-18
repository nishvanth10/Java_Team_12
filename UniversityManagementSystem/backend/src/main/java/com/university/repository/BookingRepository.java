package com.university.repository;

import com.university.entity.Booking;
import com.university.entity.User;
import com.university.enums.BookingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface BookingRepository extends JpaRepository<Booking, UUID> {
    List<Booking> findByUser(User user);

    List<Booking> findByStatus(BookingStatus status);

    @org.springframework.data.jpa.repository.Query("SELECT b FROM Booking b WHERE b.hall.id = :hallId AND b.status IN (com.university.enums.BookingStatus.APPROVED_ADMIN, com.university.enums.BookingStatus.APPROVED_STAFF, com.university.enums.BookingStatus.PENDING) AND ((b.startTime < :endTime AND b.endTime > :startTime))")
    List<Booking> findConflictingBookings(@org.springframework.data.repository.query.Param("hallId") UUID hallId,
            @org.springframework.data.repository.query.Param("startTime") java.time.LocalDateTime startTime,
            @org.springframework.data.repository.query.Param("endTime") java.time.LocalDateTime endTime);
}
