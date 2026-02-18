package com.university.controller;

import com.university.entity.Hall;
import com.university.service.HallService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/halls")
@CrossOrigin
public class HallController {

    @Autowired
    private HallService hallService;

    @GetMapping
    public ResponseEntity<List<Hall>> getAllHalls() {
        return new ResponseEntity<>(hallService.getAllHalls(), HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Hall> getHallById(@PathVariable UUID id) {
        return new ResponseEntity<>(hallService.getHallById(id), HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<Hall> createHall(@RequestBody Hall hall) {
        return new ResponseEntity<>(hallService.createHall(hall), HttpStatus.CREATED);
    }
}
