package com.attendance.attendance.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class AttendanceRecord {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    private LocalDate date;
    private String section;
    private int sem;
    private boolean class1=false;
    private boolean class2=false;
    private boolean class3=false;
    private boolean class4=false;
    private boolean class5=false;
    private boolean class6=false;
    private String rollNo; // keep this

    @ManyToOne
    @JoinColumn(name = "rollNo", referencedColumnName = "rollNo", insertable = false, updatable = false)
    private Student student;

}
