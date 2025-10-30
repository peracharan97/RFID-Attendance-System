package com.attendance.attendance.service;

import com.attendance.attendance.entity.Student;
import com.attendance.attendance.repository.StudentRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

@AllArgsConstructor
@Service
public class StudentServiceImplementation implements StudentService{
   private StudentRepository studentRepository;
    @Override
    public String addStudent(Student student) {
        try {
            studentRepository.save(student);
            return student.getName();
        } catch (Exception e) {
            return "Failed"+e;
        }


    }
}
