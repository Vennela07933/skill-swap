package com.skillswap.repository;

import com.skillswap.entity.User;
import com.skillswap.entity.SkillCategory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);

    @Query("SELECT DISTINCT u FROM User u LEFT JOIN u.skills s WHERE " +
            "(:name IS NULL OR LOWER(u.name) LIKE LOWER(CONCAT('%', :name, '%'))) AND " +
            "(:location IS NULL OR LOWER(u.location) LIKE LOWER(CONCAT('%', :location, '%'))) AND " +
            "(:experience IS NULL OR LOWER(u.experience) LIKE LOWER(CONCAT('%', :experience, '%'))) AND " +
            "(:availability IS NULL OR LOWER(u.availability) LIKE LOWER(CONCAT('%', :availability, '%'))) AND " +
            "(:skillName IS NULL OR LOWER(s.skillName) LIKE LOWER(CONCAT('%', :skillName, '%'))) AND " +
            "(:category IS NULL OR s.category = :category)")
    Page<User> searchUsers(@Param("name") String name,
                           @Param("location") String location,
                           @Param("experience") String experience,
                           @Param("availability") String availability,
                           @Param("skillName") String skillName,
                           @Param("category") SkillCategory category,
                           Pageable pageable);

    // Dynamic JPQL for counting most skilled users based on reviews/ratings can be sorted using JPA Sort objects
}
