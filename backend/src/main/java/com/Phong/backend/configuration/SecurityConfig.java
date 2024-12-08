package com.Phong.backend.configuration;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.oauth2.server.resource.authentication.JwtGrantedAuthoritiesConverter;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    private static final String[] PUBLIC_ENDPOINTS = {
        "/auth/login",
        "/auth/introspect",
        "/auth/logout",
        "/auth/refresh",
        "/account/myInfo",
        "/account",
        "/account/{id}",
        "/salesperson",
        "/salesperson/{id}",
        "/customers",
        "/customers/{customerId}",
        "/customers/avatar/{customerId}",
        "/products",
        "/products/{productId}",
        "/products/category/{categoryId}",
        "/products/all",
        "/products/{productId}/category/{categoryId}",
        "/products/{productId}/category",
        "/products/search",
        "/products/{productId}/images",
        "/products/filter",
        "/categories",
        "/categories/{categoryId}",
        "/cart/add",
        "/cart/remove",
        "/cart/allItems",
        "/cart/quantity",
        "/order/create",
        "/order/all",
        "/order/details",
        "/order/cancel",
        "/address",
        "/address/{id}",
        "/invoice",
        "/invoice/{id}",
        "/invoice/{id}/cancel",
        "/invoice/{invoiceId}/details",
        "/payment/create",
        "/payment",
        "/images/upload",
        "/discounts",
        "/discounts/{discountId}",
        "/discounts/product/{productId}"
    };

    private final CustomJwtDecoder customJwtDecoder;

    @Autowired
    public SecurityConfig(CustomJwtDecoder customJwtDecoder) {
        this.customJwtDecoder = customJwtDecoder;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity httpSecurity) throws Exception {
        httpSecurity.authorizeHttpRequests(request -> request.requestMatchers(PUBLIC_ENDPOINTS)
                .permitAll()
                .anyRequest()
                .authenticated());

        httpSecurity.oauth2ResourceServer(oauth2 -> oauth2.jwt(jwtConfigurer -> jwtConfigurer
                        .decoder(customJwtDecoder)
                        .jwtAuthenticationConverter(jwtAuthenticationConverter()))
                .authenticationEntryPoint(new JwtAuthenEntryPoint()));
        httpSecurity.csrf(AbstractHttpConfigurer::disable);

        return httpSecurity.build();
    }

    @Bean
    JwtAuthenticationConverter jwtAuthenticationConverter() {
        JwtGrantedAuthoritiesConverter jwtGrantedAuthoritiesConverter = new JwtGrantedAuthoritiesConverter();
        jwtGrantedAuthoritiesConverter.setAuthorityPrefix("");

        JwtAuthenticationConverter jwtAuthenticationConverter = new JwtAuthenticationConverter();
        jwtAuthenticationConverter.setJwtGrantedAuthoritiesConverter(jwtGrantedAuthoritiesConverter);

        return jwtAuthenticationConverter;
    }

    @Bean
    PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(10);
    }
}
