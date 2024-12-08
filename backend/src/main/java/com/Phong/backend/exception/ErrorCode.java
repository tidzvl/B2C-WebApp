package com.Phong.backend.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;

import lombok.Getter;

@Getter
public enum ErrorCode {
    UNCATEGORIZED_EXCEPTION(9999, "Uncategorized error", HttpStatus.INTERNAL_SERVER_ERROR),
    INVALID_KEY(1001, "Uncategorized error", HttpStatus.BAD_REQUEST),
    USER_EXISTED(1002, "User existed", HttpStatus.BAD_REQUEST),
    USERNAME_INVALID(1003, "Username must has from {min} to 24 characters", HttpStatus.BAD_REQUEST),
    INVALID_PASSWORD(1004, "Password must be at least {min} characters", HttpStatus.BAD_REQUEST),
    USER_NOT_EXISTED(1005, "Account not existed", HttpStatus.NOT_FOUND),
    UNAUTHENTICATED(1006, "Unauthenticated", HttpStatus.UNAUTHORIZED),
    UNAUTHORIZED(1007, "You don't have permissions", HttpStatus.FORBIDDEN),
    INVALID_DOB(1008, "Your age must be at least {min}.", HttpStatus.BAD_REQUEST),
    EMPLOYEE_NOT_FOUND(2001, "Employee not found", HttpStatus.NOT_FOUND),
    ALREADY_CHECKED_IN(2002, "Employee has already checked in today.", HttpStatus.BAD_REQUEST),
    NOT_CHECKED_IN(2003, "Employee has not checked in today.", HttpStatus.BAD_REQUEST),
    ALREADY_CHECKED_OUT(2004, "Employee has already checked out today.", HttpStatus.BAD_REQUEST),
    DURATION_CALCULATION_ERROR(
            2005, "Unable to calculate duration; check-out time is missing.", HttpStatus.BAD_REQUEST),
    DEPARTMENT_NOT_FOUND(2001, "Department not found", HttpStatus.NOT_FOUND),
    DEPARTMENT_SAVE_ERROR(2002, "Error saving department", HttpStatus.INTERNAL_SERVER_ERROR),
    DEPARTMENT_DELETE_ERROR(2003, "Error deleting department", HttpStatus.INTERNAL_SERVER_ERROR),
    MANAGER_NOT_FOUND(2004, "Manager not found", HttpStatus.NOT_FOUND),
    DEPARTMENT_NAME_ALREADY_EXISTS(2005, "Department name already exists", HttpStatus.BAD_REQUEST),
    ;

    ErrorCode(int code, String message, HttpStatusCode statusCode) {
        this.code = code;
        this.message = message;
        this.statusCode = statusCode;
    }

    private final int code;
    private final String message;
    private final HttpStatusCode statusCode;
}
