package com.Phong.backend.utils;

import java.text.ParseException;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import com.nimbusds.jose.*;
import com.nimbusds.jose.crypto.MACVerifier;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;

import lombok.experimental.NonFinal;

@Component
public class JwtUtils {

    @NonFinal
    @Value("${jwt.signerKey}")
    protected String signerKey;

    public String getUsernameFromToken(String token) {
        try {
            SignedJWT signedJWT = SignedJWT.parse(token);

            if (!signedJWT.verify(new MACVerifier(signerKey.getBytes()))) {
                throw new IllegalArgumentException("Token signature is invalid");
            }

            JWTClaimsSet claims = signedJWT.getJWTClaimsSet();

            return claims.getSubject();

        } catch (ParseException | JOSEException e) {
            throw new IllegalArgumentException("Token is invalid", e);
        }
    }
}
