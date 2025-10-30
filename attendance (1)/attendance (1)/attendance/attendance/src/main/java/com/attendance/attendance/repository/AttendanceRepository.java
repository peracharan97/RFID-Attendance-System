package com.attendance.attendance.repository;

import com.attendance.attendance.entity.AttendanceRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface AttendanceRepository extends JpaRepository<AttendanceRecord,Integer> {
    Optional<AttendanceRecord> findByDateAndRollNo(LocalDate date, String rollNo);

    List<AttendanceRecord> findBySectionAndSemAndDateBetween(String section, int sem, LocalDate startDate, LocalDate endDate);

    List<AttendanceRecord> findByRollNoAndSem(String rollNo, int sem);

    List<AttendanceRecord> findByDateAndSectionAndSem(LocalDate date, String section, int sem);

    List<AttendanceRecord> findBySectionAndSemAndStudent_PassOutYear(String section, int sem, int passOutYear);

}