package com.hollow.market.handler;

import com.hollow.market.domain.Employee;
import com.hollow.market.domain.Manager;
import com.hollow.market.domain.Role;
import com.hollow.market.repository.ManagerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.rest.core.annotation.HandleBeforeCreate;
import org.springframework.data.rest.core.annotation.HandleBeforeSave;
import org.springframework.data.rest.core.annotation.RepositoryEventHandler;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
@RepositoryEventHandler(Employee.class)
public class SpringDataRestEventHandler {

    private final ManagerRepository managerRepository;

    @Autowired
    public SpringDataRestEventHandler(ManagerRepository managerRepository) {
        this.managerRepository = managerRepository;
    }

    @HandleBeforeCreate
    @HandleBeforeSave
    public void applyUserInformationUsingSecurityContext(Employee employee) {
        String name = SecurityContextHolder.getContext().getAuthentication().getName();
        Manager manager = this.managerRepository.findByName(name);
        if (manager == null) {
            Manager newManager = new Manager();
            newManager.setName(name);
            List<Role> roles = new ArrayList<>(){{
                add(Role.MANAGER);
            }};
            newManager.setRoles(roles);
            manager = this.managerRepository.save(newManager);
        }
        employee.setManager(manager);
    }
}
