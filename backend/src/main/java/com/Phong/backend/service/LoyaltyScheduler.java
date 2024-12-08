package com.Phong.backend.service;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import com.Phong.backend.entity.customer.Customer;
import com.Phong.backend.entity.customer.Loyalty;
import com.Phong.backend.repository.CustomerRepository;
import com.Phong.backend.repository.LoyaltyRepository;

@Service
public class LoyaltyScheduler {

    @Autowired
    private LoyaltyRepository loyaltyRepository;

    @Autowired
    private CustomerRepository customerRepository;

    @Scheduled(cron = "0 0 0 * * ?")
    public void updateAccumulationDays() {
        List<Customer> customers = customerRepository.findAll();
        for (Customer customer : customers) {
            Loyalty loyalty = loyaltyRepository.findByCustomer_CustomerId(customer.getCustomerId());
            if (loyalty != null) {
                long daysAccumulated = ChronoUnit.DAYS.between(loyalty.getCreateAt(), LocalDate.now());
                loyalty.setAccumulationNumber((int) daysAccumulated);
                loyaltyRepository.save(loyalty);
            }
        }
    }
}
