SET @acc_id = "asdasasd-awdasdasdas";
SET @user_name = "khonagbaowgioquenem";

SELECT @acc_id;
INSERT INTO account (account_id, user_name, password, role)
VALUE(@acc_id, @user_name, "password@123", "CUSTOMER" );

-- SELECT * FROM account WHERE  account_id = @acc_id;

CALL `electronics`.`InsertCustomer`(
"xóm dừa",
"avt.jpg",
"1990-04-10",
"asd",
"e2xaaassa@exam.com",
"Tin",
"MALE", 
"Nguyen", 
"098987782722", 
@acc_id
 );

SELECT * FROM customer WHERE account_id = @acc_id;
