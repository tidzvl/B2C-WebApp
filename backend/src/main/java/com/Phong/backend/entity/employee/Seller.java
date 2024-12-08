package com.Phong.backend.entity.employee;

import java.time.LocalDate;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import com.Phong.backend.entity.Gender;
import com.Phong.backend.entity.account.Account;

import lombok.*;
import lombok.experimental.FieldDefaults;
import lombok.experimental.SuperBuilder;

@Getter
@Setter
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Entity
@Table(name = "salesPerson")
@Inheritance(strategy = InheritanceType.JOINED)
public class Seller {

    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "AccountId", referencedColumnName = "AccountId")
    Account account;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "salesPersonId", unique = true)
    Long personelId;

    @NotBlank
    @Column(name = "FirstName")
    String firstName;

    @NotBlank
    @Column(name = "LastName")
    String lastName;

    @Enumerated(EnumType.STRING)
    @Column(name = "Gender")
    Gender gender;

    String citizenId;

    LocalDate startWorkingDate;

    LocalDate birthday;

    double salesPerformance;

    @NotBlank
    @Email
    @Column(name = "Email")
    String email;

    @Size(max = 10)
    @Column(name = "Phone")
    String phone;

    @Column(name = "Address")
    String address;

    @Column(name = "Avatar")
    private String avatar;
}
