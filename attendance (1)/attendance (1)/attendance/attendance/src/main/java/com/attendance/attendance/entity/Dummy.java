package com.attendance.attendance.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;



@Entity
@AllArgsConstructor
@Setter
@Getter
@NoArgsConstructor
public class Dummy {
    @Id
    private int id;
    private String rollNo;
    private String name;
    private int passOutYear;
}
