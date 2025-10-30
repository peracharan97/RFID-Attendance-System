package com.attendance.attendance.service;

import com.attendance.attendance.entity.Dummy;
import com.attendance.attendance.entity.Student;
import com.attendance.attendance.repository.DummyRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
@AllArgsConstructor
@Service
public class DummyServiceImplementation implements DummyService{
    private DummyRepository dummyRepository;
    @Override
    public String addDummyStudent(Student student) {
        Dummy dummy=dummyRepository.findById(0).orElse(new Dummy());
        dummy.setName(student.getName());
        dummy.setRollNo(student.getRollNo());
        dummy.setPassOutYear(student.getPassOutYear());
        try {
            dummyRepository.save(dummy);
            return "Added";
        } catch (Exception e) {
            return "Failed"+e;
        }
    }

    @Override
    public String getDummyStudent() {
        return dummyRepository.getById(0).getRollNo();
    }
}
