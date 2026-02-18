package com.university.service;

import com.university.entity.Hall;
import java.util.List;
import java.util.UUID;

public interface HallService {
    List<Hall> getAllHalls();

    Hall getHallById(UUID id);

    Hall createHall(Hall hall);
}
