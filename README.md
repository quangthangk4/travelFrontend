docker run container mysql  

docker run ^
-e MYSQL_ROOT_PASSWORD=123456 ^
-v mysql-flights:/var/lib/mysql ^
--name mysqsl-container-1 ^
-p 3307:3306 ^
-d mysql:8.0.41-debian



## tạo database
create database travel;

CREATE TABLE travel (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(255)
);

insert into travel (name,phone)
values("thang","0399728845")

select * from travel;
