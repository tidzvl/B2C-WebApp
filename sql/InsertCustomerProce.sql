DROP PROCEDURE IF EXISTS InsertCustomer;

DELIMITER $$

CREATE PROCEDURE InsertCustomer(
        IN p_address VARCHAR(255),
        IN p_avatar VARCHAR(255),
        IN p_birthday DATE,
        IN p_citizen_id VARCHAR(255),
        IN p_email VARCHAR(255),
        IN p_first_name VARCHAR(255),
        IN p_gender ENUM('FEMALE', 'MALE'),
        IN p_last_name VARCHAR(255),
        IN p_phone VARCHAR(255),
        IN p_account_id VARCHAR(255)
    )
    IF TIMESTAMPDIFF(YEAR, p_birthday, CURDATE()) < 18 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Customer must be at least 18 years old.';
    END IF;

    IF NOT p_email REGEXP '^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$' THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Invalid email format.';
    END IF;

    IF NOT p_phone REGEXP '^[0-9]+$' THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Invalid phone number format.';
    END IF;
    INSERT INTO `customer` 
    (address, avatar, birthday, citizen_id, email, first_name, gender, last_name, phone, account_id)
    VALUES (p_address, p_avatar, p_birthday, p_citizen_id, p_email, p_first_name, p_gender, p_last_name, p_phone, p_account_id);
    
DELIMITER ;