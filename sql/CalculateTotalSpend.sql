DELIMITER $$

CREATE FUNCTION CalculateTotalSpend(
    p_customer_id BIGINT, 
    p_start_date DATE, 
    p_end_date DATE
) 
RETURNS DOUBLE
DETERMINISTIC
BEGIN

    DECLARE v_total DOUBLE DEFAULT 0;
    DECLARE done INT DEFAULT FALSE;
    DECLARE v_order_id CHAR(36); 
    DECLARE v_order_total DOUBLE;
    DECLARE v_customer_exists INT;


    DECLARE order_cursor CURSOR FOR
        SELECT order_id, total_amount
        FROM orders
        WHERE customer_id = p_customer_id
        AND order_date BETWEEN p_start_date AND p_end_date;


    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;


    SELECT COUNT(*) INTO v_customer_exists
    FROM customers
    WHERE customer_id = p_customer_id;

    IF v_customer_exists = 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Customer ID does not exist.';
    END IF;


    OPEN order_cursor;


    read_loop: LOOP
        FETCH order_cursor INTO v_order_id, v_order_total;

        IF done THEN
            LEAVE read_loop;
        END IF;


        SET v_total = v_total + v_order_total;
    END LOOP;


    CLOSE order_cursor;


    RETURN v_total;
END $$

DELIMITER ;