package com.attendance.attendance.repository;

import com.attendance.attendance.entity.Dummy;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DummyRepository extends JpaRepository<Dummy,Integer> {
}
