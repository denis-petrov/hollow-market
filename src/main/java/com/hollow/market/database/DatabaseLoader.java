package com.hollow.market.database;

import com.hollow.market.domain.User;
import com.hollow.market.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.Date;

@Component
public class DatabaseLoader implements CommandLineRunner {

    private final UserRepository repository;

    @Autowired
    public DatabaseLoader(UserRepository repository) {
        this.repository = repository;
    }

    /**
     * Creat mock User after all Beans will be deployed in heap
     */
    @Override
    public void run(String... args) {
        this.repository.save(new User("Denis", "Petrov", new Date()));
    }
}
