package com.hollow.market.domain;

import com.sun.istack.NotNull;
import net.minidev.json.annotate.JsonIgnore;

import javax.persistence.*;
import java.util.Date;
import java.util.Objects;

@Entity
public class User {
    @Id
    @GeneratedValue
    private Long id;

    @NotNull
    private String firstName;

    @NotNull
    private String lastName;

    @NotNull
    private Date dateBirth;

    @Version
    @JsonIgnore
    private Long version;

    public User() {
    }

    public User(String firstName, String lastName, Date dateBirth) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.dateBirth = dateBirth;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        User user = (User) o;
        return Objects.equals(id, user.id) &&
                Objects.equals(firstName, user.firstName) &&
                Objects.equals(lastName, user.lastName) &&
                Objects.equals(dateBirth, user.dateBirth) &&
                Objects.equals(version, user.version);
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setDateBirth(Date dateBirth) {
        this.dateBirth = dateBirth;
    }

    public Date getDateBirth() {
        return dateBirth;
    }

    public Long getVersion() {
        return version;
    }

    public void setVersion(Long version) {
        this.version = version;
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, firstName, lastName, dateBirth, version);
    }

    @Override
    public String toString() {
        return "User{" +
                "id=" + id +
                ", firstName='" + firstName + '\'' +
                ", lastName='" + lastName + '\'' +
                ", dateBirth=" + dateBirth + '\'' +
                ", version='" + version +
                '}';
    }
}
