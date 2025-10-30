package com.attendance.attendance.controller;


import com.attendance.attendance.entity.Student;
import com.attendance.attendance.service.DummyServiceImplementation;
import com.attendance.attendance.service.StudentServiceImplementation;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.Objects;

@AllArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
@RestController
public class StudentController {
    private final StudentServiceImplementation studentServiceImplementation;
    private final DummyServiceImplementation dummyServiceImplementation;
    @PostMapping("/student")
    public String addStudent(@RequestBody Student student){
       return Objects.equals(dummyServiceImplementation.addDummyStudent(student), "Added") ? studentServiceImplementation.addStudent(student) : "Failed";

    }
}
