package com.attendance.attendance.service;

import com.attendance.attendance.entity.AttendanceRecord;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;


public interface AttendanceService {
    String addAttendance(String rollNo,String section,int sem);
    List<AttendanceRecord> getRecordsBySectionAndSemAndStartDateAndEndDate(String section, int sem,LocalDate startDate,LocalDate endDate);
    List<AttendanceRecord> getRecordsByRollNoAndSem(String rollNo,int sem);
    List<AttendanceRecord> getRecordsBySectionAndSemAndPassOutYear(String section,int sem,int passOutYear);
    List<AttendanceRecord> classAttendance(LocalDate date,String section,int sem);
}
