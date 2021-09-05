package com.hollow.market.database;

import com.hollow.market.domain.Employee;
import com.hollow.market.domain.Manager;
import com.hollow.market.repository.EmployeeRepository;
import com.hollow.market.repository.ManagerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Component
public class DatabaseLoader implements CommandLineRunner {

    private final EmployeeRepository employees;
    private final ManagerRepository managers;

    @Autowired
    public DatabaseLoader(EmployeeRepository employeeRepository, ManagerRepository managerRepository) {
        this.employees = employeeRepository;
        this.managers = managerRepository;
    }

    /**
     * Creat mock Employee after all Beans will be deployed in heap
     */
    @Override
    public void run(String... args) {
        Manager admin = this.managers.save(new Manager("admin", "admin", "ROLE_MANAGER"));
        Manager oliver = this.managers.save(new Manager("oliver", "gierke", "ROLE_MANAGER"));

        SecurityContextHolder.getContext().setAuthentication(
                new UsernamePasswordAuthenticationToken("admin", "doesn't matter",
                        AuthorityUtils.createAuthorityList("MANAGER")));

        this.employees.save(new Employee("Frodo", "Baggins", "ring bearer", admin));
        this.employees.save(new Employee("Bilbo", "Baggins", "burglar", admin));
        this.employees.save(new Employee("Gandalf", "the Grey", "wizard", admin));

        SecurityContextHolder.getContext().setAuthentication(
                new UsernamePasswordAuthenticationToken("oliver", "doesn't matter",
                        AuthorityUtils.createAuthorityList("MANAGER")));

        this.employees.save(new Employee("Samwise", "Gamgee", "gardener", oliver));
        this.employees.save(new Employee("Merry", "Brandybuck", "pony rider", oliver));
        this.employees.save(new Employee("Peregrin", "Took", "pipe smoker", oliver));
        SecurityContextHolder.clearContext();
    }
}
