DELIMITER $$

CREATE TRIGGER `update_cart_total_price` 
AFTER INSERT ON `cart_item`
FOR EACH ROW
BEGIN
    UPDATE `cart`
    SET `total_price` = (
        SELECT SUM(`total_price`)
        FROM `cart_item`
        WHERE `cart_id` = NEW.`cart_id`
    )
    WHERE `cart_id` = NEW.`cart_id`;
END$$

DELIMITER ;

DELIMITER $$

CREATE TRIGGER `update_cart_total_price_after_delete` 
AFTER DELETE ON `cart_item`
FOR EACH ROW
BEGIN
  UPDATE `cart`
  SET `total_price` = (
    SELECT IFNULL(SUM(`total_price`), 0)
    FROM `cart_item`
    WHERE `cart_id` = OLD.`cart_id`
  )
  WHERE `cart_id` = OLD.`cart_id`;
END$$

DELIMITER ;

DELIMITER $$

CREATE TRIGGER `update_cart_total_price_after_update` 
AFTER UPDATE ON `cart_item`
FOR EACH ROW
BEGIN
  UPDATE `cart`
  SET `total_price` = (
    SELECT IFNULL(SUM(`total_price`), 0)
    FROM `cart_item`
    WHERE `cart_id` = NEW.`cart_id`
  )
  WHERE `cart_id` = NEW.`cart_id`;
END$$

DELIMITER ;