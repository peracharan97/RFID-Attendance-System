package com.attendance.attendance.controller;

import com.attendance.attendance.entity.AttendanceRecord;
import com.attendance.attendance.service.AttendanceServiceImplementation;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@AllArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
@RestController
public class AttendanceController {
    private AttendanceServiceImplementation attendanceServiceImplementation;

    @GetMapping("/attendance-post/{rollNo}/{section}/{sem}")
    public String addAttendance(@PathVariable String rollNo,@PathVariable String section,@PathVariable int sem){

        return attendanceServiceImplementation.addAttendance(rollNo, section, sem);
    }
    @GetMapping("/hello")
    public String hello(){
        return "Hello";
    }

    @GetMapping("/attendance/{section}/{sem}/{startDate}/{endDate}")
    public List<AttendanceRecord> getRecordsBySectionAndStartDateAndEndDate(@PathVariable String section,@PathVariable int sem, @PathVariable  LocalDate startDate,@PathVariable  LocalDate endDate){
        return attendanceServiceImplementation.getRecordsBySectionAndSemAndStartDateAndEndDate(section, sem,startDate, endDate);
    }
    @GetMapping("/attendance/{rollNo}/{sem}")
    public List<AttendanceRecord> getRecordsByRollNoAndSem(@PathVariable String rollNo,@PathVariable int sem){
        return attendanceServiceImplementation.getRecordsByRollNoAndSem(rollNo, sem);
    }

    @GetMapping("/attendance/{section}/{sem}/{passOutYear}")
    public List<AttendanceRecord> getRecordsBySectionAndSemAndPassOutYear(@PathVariable String section,@PathVariable int sem,@PathVariable int passOutYear){
        return attendanceServiceImplementation.getRecordsBySectionAndSemAndPassOutYear(section, sem, passOutYear);
    }

    @GetMapping("class-attendance/{section}/{sem}/{date}")
    public List<AttendanceRecord> classAttendance(@PathVariable String section,@PathVariable int sem,@PathVariable LocalDate date){
        return attendanceServiceImplementation.classAttendance(date, section, sem);

    }
    @PostMapping("/class-attendance/{id}/{selectedClass}")
    public String removeAttendance(@PathVariable int id ,@PathVariable String selectedClass){
        return attendanceServiceImplementation.removeAttendance(id,selectedClass);
    }

}
