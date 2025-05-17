CREATE TABLE Phong (
  MSPHONG INT PRIMARY KEY,
  TenPhong NVARCHAR(255)
);

CREATE TABLE NhanVien (
  MSNV INT PRIMARY KEY,
  HoTen NVARCHAR(255),
  MSPHONG INT,
  FOREIGN KEY (MSPHONG) REFERENCES Phong(MSPHONG)
);

CREATE TABLE BangLuong (
  Thang INT,
  MSNV INT,
  Luong DECIMAL(10, 2),
  PRIMARY KEY (Thang, MSNV),
  FOREIGN KEY (MSNV) REFERENCES NhanVien(MSNV)
);


INSERT INTO Phong(MSPHONG, TenPhong)
VALUES (1, 'HC'),
 (2, 'KD'),
 (3, 'VT');

 INSERT INTO NhanVien(MSNV, HoTen, MSPHONG)
 VALUES (1, 'Lan', 1),
		(2, 'Dung', 1),
		(3, 'Mai', 2),
		(4, 'Chi', 2);

INSERT INTO BangLuong(Thang, MSNV, Luong)
VALUES (6, 1, 100),
	   (6, 2, 120),
	   (6, 3, 80),
	   (6,4,100),
	   (7, 1, 100),
	   (7, 2, 140),
	   (7,3,90),
	   (7,4,100);


SELECT nv.MSNV, nv.HoTen, bl.Luong
FROM BangLuong bl 
JOIN NhanVien nv ON nv.MSNV = bl.MSNV
WHERE nv.MSPHONG = '1' AND bl.Thang = 7;


SELECT p.MSPhong, p.TenPhong, COUNT(nv.MSNV) AS SLNV
FROM Phong p
LEFT JOIN NhanVien nv ON nv.MSPHONG = p.MSPHONG
GROUP BY p.MSPHONG, p.TenPhong

SELECT nv.MSNV, nv.HoTen, bl6.Luong, bl7.Luong
FROM BangLuong bl7
JOIN NhanVien nv ON nv.MSNV = bl7.MSNV
JOIN BangLuong bl6 ON nv.MSNV = bl6.MSNV
WHERE bl7.Thang = 7 AND bl6.Thang = 6 AND bl7.Luong > bl6.Luong;


DROP PROCEDURE IF EXISTS LuongPB;

DELIMITER $$
CREATE PROCEDURE LuongPB(
	IN MSPhong BIGINT,
	IN Thang BIGINT
)
BEGIN
	SELECT
	FROM Phong p
	JOIN NhanVien nv ON p.MSPHONG = nv.MSNV
	JOIN BangLuong bl ON nv.MSNV = bl.MSNV
	WHERE p.MSPHONG = MSPhong


END$$