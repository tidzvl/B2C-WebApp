package com.Phong.backend.entity.customer;

import jakarta.persistence.*;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Entity
@Table(name = "image")
public class Avatar {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;

    String name;

    String url;

    String cloudinaryId;

    @OneToOne(fetch = FetchType.EAGER)
    Customer uploadedBy;

    @Lob
    byte[] data;
}
