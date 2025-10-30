package com.attendance.attendance.controller;

import com.attendance.attendance.service.DummyServiceImplementation;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@AllArgsConstructor
@RestController
@CrossOrigin(origins = "http://localhost:5173")
public class DummyController {
    private DummyServiceImplementation dummyServiceImplementation;
    @GetMapping("/dummy")
    public String getDummyStudent (){
        return dummyServiceImplementation.getDummyStudent();

    }
}
