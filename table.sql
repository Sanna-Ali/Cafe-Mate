USE cafe;
create table user(
    id int primary key AUTO_INCREMENT,
    name varchar(222),
    contactNumber varchar(20),
    email varchar(50),
    password varchar(250),
    status varchar(20), 
    role varchar(20), 
    UNIQUE (email)
);
insert into user(name,contactNumber,email,password,status,role) values
("Admin","0994203048","sanayali2019@gmail.com","admin","true","admin")


USE cafe
create table category(
    id int NOT NULL AUTO_INCREMENT,
    name varchar(255) NOT NULL,
    primary key(id)
)

USE cafe  
create table product (
    id int NOT NULL AUTO_INCREMENT,
    name varchar(222) NOT NULL,
    categoryId int NOT NULL,
    description varchar(222),
    price int,
    status varchar (22),
    primary key(id)
);
use cafe
create table bill(
    id  int not null AUTO_INCREMENT,
    uuid varchar(200) not null,
    name varchar(255) not null,
    email varchar(255) not null,
    contactNumber varchar(20) not null, 
    paymentMethod varchar(50) not null,
    total int not null,
    productDetails JSON default null,
    createdBy varchar(255) not null, 
    primary key(id)
) 
-- npm i ejs html-pdf path uuid