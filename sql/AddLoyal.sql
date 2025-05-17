DROP PROCEDURE IF EXISTS AddLoyaltyPoints;

DELIMITER $$

CREATE PROCEDURE AddLoyaltyPoints(
    IN p_customer_id BIGINT,      
    IN p_transaction_amount DOUBLE 
)
BEGIN
    DECLARE v_loyalty_id BIGINT;
    DECLARE v_current_points INT;
    DECLARE v_points_to_add INT;


    SET v_points_to_add = FLOOR(p_transaction_amount / 100);


    SELECT loyalty_id, points INTO v_loyalty_id, v_current_points
    FROM loyalty
    WHERE customer_id = p_customer_id
    LIMIT 1;


    IF v_loyalty_id IS NULL THEN
        INSERT INTO loyalty (customer_id, points, accumulation_number, created_at)
        VALUES (p_customer_id, v_points_to_add, 1, NOW());
    ELSE
        UPDATE loyalty
        SET points = v_current_points + v_points_to_add,
            accumulation_number = accumulation_number + 1
        WHERE loyalty_id = v_loyalty_id;
    END IF;
END $$

DELIMITER ;

CALL AddLoyaltyPoints(100, 250.00);
