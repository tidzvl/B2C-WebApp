package com.Phong.backend.service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.Phong.backend.dto.request.employee.SellerCreationRequest;
import com.Phong.backend.dto.request.employee.SellerUpdateRequest;
import com.Phong.backend.dto.response.employee.SellerResponse;
import com.Phong.backend.entity.Gender;
import com.Phong.backend.entity.account.Account;
import com.Phong.backend.entity.employee.Seller;
import com.Phong.backend.repository.AccountRepository;
import com.Phong.backend.repository.SalesPersonRepository;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class SalesPersonService {
    private final SalesPersonRepository personRepository;
    private final AccountRepository accountRepository;

    // Create Personnel
    public SellerResponse createPersonnel(SellerCreationRequest request) {
        Account account = accountRepository
                .findById(request.getAccountId())
                .orElseThrow(() -> new IllegalArgumentException("Account not found"));

        Seller salesPerson = Seller.builder()
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .email(request.getEmail())
                .phone(request.getPhone())
                .address(request.getAddress())
                .avatar(request.getAvatar())
                .birthday(request.getBirthday())
                .startWorkingDate(request.getStartWorkingDate())
                .citizenId(request.getCitizenId())
                .gender(Gender.valueOf(request.getSex().toUpperCase()))
                .account(account)
                .salesPerformance(0L) // Default sales volume
                .build();

        Seller saved = personRepository.save(salesPerson);
        return mapToPersonnelResponse(saved);
    }

    // Get All Personnel
    public List<SellerResponse> getAllPersonnel() {
        return personRepository.findAll().stream()
                .map(this::mapToPersonnelResponse)
                .collect(Collectors.toList());
    }

    // Get Personnel by ID
    public Optional<SellerResponse> getPersonnelById(Long id) {
        return personRepository.findById(id).map(this::mapToPersonnelResponse);
    }

    // Update Personnel
    public SellerResponse updatePersonnel(Long id, SellerUpdateRequest request) {
        Seller personnel =
                personRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Personnel not found"));

        if (request.getFirstName() != null) personnel.setFirstName(request.getFirstName());
        if (request.getLastName() != null) personnel.setLastName(request.getLastName());
        if (request.getEmail() != null) personnel.setEmail(request.getEmail());
        if (request.getPhone() != null) personnel.setPhone(request.getPhone());
        if (request.getAddress() != null) personnel.setAddress(request.getAddress());
        if (request.getAvatar() != null) personnel.setAvatar(request.getAvatar());
        if (request.getBirthday() != null) personnel.setBirthday(request.getBirthday());
        if (request.getStartWorkingDate() != null) personnel.setStartWorkingDate(request.getStartWorkingDate());
        if (request.getCitizenId() != null) personnel.setCitizenId(request.getCitizenId());
        if (request.getSex() != null)
            personnel.setGender(Gender.valueOf(request.getSex().toUpperCase()));

        Seller updatedPersonnel = personRepository.save(personnel);
        return mapToPersonnelResponse(updatedPersonnel);
    }

    // Delete Personnel
    public boolean deletePersonnel(Long id) {
        if (personRepository.existsById(id)) {
            personRepository.deleteById(id);
            return true;
        }
        return false;
    }

    // Helper: Map Entity to DTO
    private SellerResponse mapToPersonnelResponse(Seller personnel) {
        return SellerResponse.builder()
                .personelId(personnel.getPersonelId())
                .firstName(personnel.getFirstName())
                .lastName(personnel.getLastName())
                .email(personnel.getEmail())
                .phone(personnel.getPhone())
                .address(personnel.getAddress())
                .avatar(personnel.getAvatar())
                .birthday(personnel.getBirthday())
                .startWorkingDate(personnel.getStartWorkingDate())
                .citizenId(personnel.getCitizenId())
                .sex(personnel.getGender().name())
                .salesPerformance(personnel.getSalesPerformance())
                .accountId(personnel.getAccount().getId())
                .build();
    }
}
