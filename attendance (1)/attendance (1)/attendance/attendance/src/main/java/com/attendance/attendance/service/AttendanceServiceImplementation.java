package com.attendance.attendance.service;

import com.attendance.attendance.entity.AttendanceRecord;
import com.attendance.attendance.repository.AttendanceRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@AllArgsConstructor
@Service
public class AttendanceServiceImplementation implements AttendanceService {
    private AttendanceRepository attendanceRepository;
    @Override
    public String addAttendance(String rollNo, String section, int sem) {
        LocalDate date = LocalDate.now();
        LocalTime now = LocalTime.now();
        int classNo = 0;
        // Determine classNo based on time
        if (now.isAfter(LocalTime.of(9, 29, 59)) && now.isBefore(LocalTime.of(10, 30))) {
            classNo = 1;
        } else if (now.isAfter(LocalTime.of(10, 29, 59)) && now.isBefore(LocalTime.of(11, 30))) {
            classNo = 2;
        } else if (now.isAfter(LocalTime.of(11, 29, 59)) && now.isBefore(LocalTime.of(12, 30))) {
            classNo = 3;
        } else if (now.isAfter(LocalTime.of(13, 29, 59)) && now.isBefore(LocalTime.of(14, 30))) {
            classNo = 4;
        } else if (now.isAfter(LocalTime.of(14, 29, 59)) && now.isBefore(LocalTime.of(15, 30))) {
            classNo = 5;
        } else if (now.isAfter(LocalTime.of(15, 29, 59)) && now.isBefore(LocalTime.of(16, 30))) {
            classNo = 6;
        } else {
            return "No class right now"; // Outside class hours
        }

        // Fetch existing record or create new
        AttendanceRecord record = attendanceRepository.findByDateAndRollNo(date, rollNo).orElse(null);
        if (record == null) {
            record = new AttendanceRecord();
            record.setRollNo(rollNo);
            record.setSection(section);
            record.setSem(sem);
            record.setDate(date);
        }

        // Set attendance for the current class
        if (classNo == 1) record.setClass1(true);
        else if (classNo == 2) record.setClass2(true);
        else if (classNo == 3) record.setClass3(true);
        else if (classNo == 4) record.setClass4(true);
        else if (classNo == 5) record.setClass5(true);
        else if (classNo == 6) record.setClass6(true);

        // Save the record
        try {
            attendanceRepository.save(record);
        } catch (Exception e) {
            return "Error: " + e.getMessage();
        }

        return "   Added For      " + rollNo;
    }

    @Override
    public List<AttendanceRecord> getRecordsBySectionAndSemAndStartDateAndEndDate(String section,int sem, LocalDate startDate, LocalDate endDate) {
        return attendanceRepository.findBySectionAndSemAndDateBetween(section,sem,startDate,endDate);
    }
    @Override
    public List<AttendanceRecord> getRecordsByRollNoAndSem(String rollNo,int sem){
        return attendanceRepository.findByRollNoAndSem(rollNo, sem);
    }
    @Override
    public List<AttendanceRecord> getRecordsBySectionAndSemAndPassOutYear(String section,int sem,int passOutYear){
        return attendanceRepository.findBySectionAndSemAndStudent_PassOutYear(section, sem, passOutYear);
    }

    @Override
    public List<AttendanceRecord> classAttendance(LocalDate date, String section, int sem) {

        return attendanceRepository.findByDateAndSectionAndSem(date, section, sem);
    }

    public String removeAttendance(int id,String classSelected) {
        AttendanceRecord record = attendanceRepository.findById(id).orElse(null);
        switch (classSelected) {
            case "class1"-> record.setClass1(false);
            case "class2"-> record.setClass2(false);
            case "class3"-> record.setClass3(false);
            case "class4"-> record.setClass4(false);
            case "class5"-> record.setClass5(false);
            case "class6"-> record.setClass6(false);
        }
        try {
            attendanceRepository.save(record);
            return "Success";
        }
        catch (Exception e) {
            return "Error: "+e;
        }
    }
}


