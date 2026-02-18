package com.university.service;

import com.university.dto.BookingDto;
import com.university.entity.Booking;
import com.university.enums.BookingStatus;

import java.util.List;
import java.util.UUID;

public interface BookingService {
    Booking createBooking(BookingDto bookingDto, String username);
    List<Booking> getAllBookings();
    List<Booking> getMyBookings(String username);
    Booking updateBookingStatus(UUID bookingId, BookingStatus status);
}
