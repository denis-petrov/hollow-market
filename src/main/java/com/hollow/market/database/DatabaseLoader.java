package com.hollow.market.database;

import com.hollow.market.domain.Employee;
import com.hollow.market.repository.EmployeeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.Date;

@Component
public class DatabaseLoader implements CommandLineRunner {

    private final EmployeeRepository repository;

    @Autowired
    public DatabaseLoader(EmployeeRepository repository) {
        this.repository = repository;
    }

    /**
     * Creat mock Employee after all Beans will be deployed in heap
     */
    @Override
    public void run(String... args) {
        this.repository.save(new Employee("Ivan", "Ivanov", "Employee"));
    }
}
