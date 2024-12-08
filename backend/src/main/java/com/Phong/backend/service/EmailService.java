package com.Phong.backend.service;

import java.io.File;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.FileSystemResource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private final JavaMailSender mailSender;

    @Autowired
    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendEmail(String to, String subject, String content, String additionalArgument)
            throws MessagingException {
        // Xử lý logic liên quan đến `additionalArgument` (nếu cần)
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);

            helper.setFrom("tuanphonglqd@gmail.com");
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(content);
            FileSystemResource file = new FileSystemResource(new File(additionalArgument));
            helper.addAttachment("Invoice.pdf", file);

            mailSender.send(message);
            System.out.println("Email gửi thành công!");
        } catch (MessagingException e) {
            e.printStackTrace();
            System.out.println("Gửi email thất bại: " + e.getMessage());
        }
    }
}
