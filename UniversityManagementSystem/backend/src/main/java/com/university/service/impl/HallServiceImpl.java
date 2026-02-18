package com.university.service.impl;

import com.university.entity.Hall;
import com.university.repository.HallRepository;
import com.university.service.HallService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class HallServiceImpl implements HallService {

    @Autowired
    private HallRepository hallRepository;

    @Override
    public List<Hall> getAllHalls() {
        return hallRepository.findAll();
    }

    @Override
    public Hall getHallById(UUID id) {
        return hallRepository.findById(id).orElseThrow(() -> new RuntimeException("Hall not found"));
    }

    @Override
    public Hall createHall(Hall hall) {
        return hallRepository.save(hall);
    }
}
