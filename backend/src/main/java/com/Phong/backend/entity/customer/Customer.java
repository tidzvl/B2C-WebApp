package com.Phong.backend.entity.customer;

import java.time.LocalDate;
import java.util.List;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

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
@Table(name = "customer")
public class Customer {
    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "AccountId", referencedColumnName = "AccountId")
    Account account;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "customerId", unique = true)
    Long customerId;

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

    LocalDate birthday;

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
