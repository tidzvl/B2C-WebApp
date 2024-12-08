package com.Phong.backend.PayOS;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import vn.payos.PayOS;

@Configuration
public class Config {
    @Value("e7c0a175-9a65-44ea-b3d6-03eab89585c7")
    private String clientId;

    @Value("4ecfc1d7-0a71-4bd4-82d3-470c3d3b95ed")
    private String apiKey;

    @Value("9ca8acb2258ac33cce858598829db75b16e6baa12bc44cde14c0ac685e6366ac")
    private String checksumKey;

    @Bean
    public PayOS payOS() {
        return new PayOS(clientId, apiKey, checksumKey);
    }
}
