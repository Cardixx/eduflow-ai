package com.emit.feedback.repository;

import com.emit.feedback.entity.Role;
import com.emit.feedback.entity.enums.RoleName;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RoleRepository extends JpaRepository<Role, Long> {
    Optional<Role> findByName(RoleName name);
}
