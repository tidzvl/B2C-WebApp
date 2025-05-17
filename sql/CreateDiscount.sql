DROP PROCEDURE IF EXISTS CreateDiscount;

DELIMITER $$

CREATE PROCEDURE CreateDiscount(
    IN p_name VARCHAR(255),
    IN p_description TEXT,
    IN p_discountValue DECIMAL(10,2),
    IN p_startDate DATETIME,
    IN p_endDate DATETIME,
    IN p_applyToAll BOOLEAN,
    IN p_categoryId BIGINT,
    IN p_productIds TEXT 
)
BEGIN
    DECLARE v_discountId BIGINT;

    INSERT INTO Discount (name, description, discount_value, start_date, end_date)
    VALUES (p_name, p_description, p_discountValue, p_startDate, p_endDate);

    SET v_discountId = LAST_INSERT_ID();


    IF p_applyToAll THEN
        INSERT INTO discount_products (product_id, discount_id)
        SELECT product_id, v_discountId
        FROM Product;

    ELSEIF p_categoryId IS NOT NULL THEN
		INSERT INTO discount_products (product_id, discount_id)
		SELECT p.product_id, v_discountId
		FROM product p
		JOIN category_products cp ON p.product_id = cp.products_product_id
		WHERE cp.category_category_id = p_categoryId;


    ELSE
        SET @query = CONCAT(
            'INSERT INTO discount_products (product_id, discount_id) ',
            'SELECT product_id, ', v_discountId, ' FROM Product WHERE product_id IN (', p_productIds, ')'
        );

        PREPARE stmt FROM @query;
        EXECUTE stmt;
        DEALLOCATE PREPARE stmt;
    END IF;

    SELECT v_discountId AS discount_id, 'Discount created successfully' AS message;
END$$

DELIMITER ;

CALL CreateDiscount(
    'Discount All Product',
    'Discount all product in product table',
    10.00,
    '2024-12-01 00:00:00',
    '2024-12-31 23:59:59',
    TRUE,
    NULL,
    NULL
);


CALL CreateDiscount(
    'Discount category Laptop',
    'Only Laptop have been discount',
    15.00,
    '2024-12-01 00:00:00',
    '2024-12-31 23:59:59',
    FALSE,
    1,
    NULL
);

CALL CreateDiscount(
    'Discount product id {1, 2, 3}',
    'Discount for selective products',
    20.00,
    '2024-12-01 00:00:00',
    '2023-12-31 23:59:59',
    FALSE,
    NULL,
    '1,2,3'
);
