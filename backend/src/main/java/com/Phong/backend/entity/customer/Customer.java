package com.Phong.backend.entity.customer;

import java.time.LocalDate;
import java.util.List;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;

import com.Phong.backend.entity.Gender;
import com.Phong.backend.entity.account.Account;
import com.Phong.backend.entity.cart.Cart;
import com.Phong.backend.entity.order.Order;
import com.fasterxml.jackson.annotation.JsonManagedReference;

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
@Table(
        name = "customer",
        uniqueConstraints = {
            @UniqueConstraint(columnNames = {"Email"}),
            @UniqueConstraint(columnNames = {"Phone"}),
            @UniqueConstraint(columnNames = {"citizenId"})
        })
public class Customer {
    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "AccountId", referencedColumnName = "AccountId")
    Account account;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "customerId", unique = true)
    Long customerId;

    @NotBlank(message = "First name cannot be blank")
    @Column(name = "FirstName")
    String firstName;

    @NotBlank(message = "Last name cannot be blank")
    @Column(name = "LastName")
    String lastName;

    @Enumerated(EnumType.STRING)
    @Column(name = "Gender")
    Gender gender;

    @NotNull(message = "Citizen ID cannot be null")
    @Pattern(regexp = "^[0-9]{12}$", message = "Citizen ID must be 12 digits")
    @Column(unique = true)
    String citizenId;

    @NotNull(message = "Birthday cannot be null")
    @Past(message = "Birthday must be in the past")
    @Column(name = "Birthday")
    LocalDate birthday;

    @NotBlank(message = "Email cannot be blank")
    @Email(message = "Invalid email format")
    @Column(name = "Email", unique = true)
    String email;

    @NotBlank(message = "Phone number cannot be blank")
    @Pattern(
            regexp = "^(03|05|07|08|09)\\d{8}$",
            message = "Phone number must be 10 digits and start with a valid prefix (e.g., 03, 05, 07, 08, 09)")
    @Column(name = "Phone", unique = true)
    String phone;

    @Column(name = "Address")
    String address;

    @Column(name = "Avatar")
    private String avatar;

    @OneToOne(mappedBy = "customer", cascade = CascadeType.ALL)
    private Cart cart;

    @OneToMany(mappedBy = "customer", cascade = CascadeType.ALL)
    private List<Order> orders;

    @OneToOne(mappedBy = "customer", cascade = CascadeType.ALL)
    @JsonManagedReference
    private Loyalty loyalty;

    @OneToMany(mappedBy = "customer", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Address> addresses;
}
