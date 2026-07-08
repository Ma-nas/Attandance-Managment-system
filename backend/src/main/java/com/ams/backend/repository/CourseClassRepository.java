package com.ams.backend.repository;

import com.ams.backend.entity.CourseClass;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CourseClassRepository extends JpaRepository<CourseClass, Long> {
    List<CourseClass> findByDepartmentId(Long departmentId);
    List<CourseClass> findBySemester(Integer semester);
}
