package com.university.service.impl;

import com.university.dto.BookingDto;
import com.university.entity.Booking;
import com.university.entity.Hall;
import com.university.entity.User;
import com.university.enums.BookingStatus;
import com.university.enums.Role;
import com.university.repository.BookingRepository;
import com.university.repository.HallRepository;
import com.university.repository.UserRepository;
import com.university.service.BookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class BookingServiceImpl implements BookingService {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private HallRepository hallRepository;

    @Autowired
    private UserRepository userRepository;

    @Override
    public Booking createBooking(BookingDto bookingDto, String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Hall hall = hallRepository.findById(bookingDto.getHallId())
                .orElseThrow(() -> new RuntimeException("Hall not found"));

        // Check for conflicts
        List<Booking> conflicts = bookingRepository.findConflictingBookings(
                hall.getId(),
                bookingDto.getStartTime(),
                bookingDto.getEndTime());

        if (!conflicts.isEmpty()) {
            throw new RuntimeException("Hall is currently unavailable and already booked for the selected time slot.");
        }

        Booking booking = new Booking();
        booking.setUser(user);
        booking.setHall(hall);
        booking.setStartTime(bookingDto.getStartTime());
        booking.setEndTime(bookingDto.getEndTime());
        booking.setPurpose(bookingDto.getPurpose());

        if (user.getRole() == Role.ADMIN) {
            booking.setStatus(BookingStatus.APPROVED_ADMIN);
        } else if (user.getRole() == Role.STAFF) {
            booking.setStatus(BookingStatus.APPROVED_STAFF);
        } else {
            booking.setStatus(BookingStatus.PENDING);
        }

        return bookingRepository.save(booking);
    }

    @Override
    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }

    @Override
    public List<Booking> getMyBookings(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return bookingRepository.findByUser(user);
    }

    @Override
    public Booking updateBookingStatus(UUID bookingId, BookingStatus status) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
        booking.setStatus(status);
        return bookingRepository.save(booking);
    }
}
