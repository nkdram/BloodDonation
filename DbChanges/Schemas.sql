-- User Table to Maintain User Information

CREATE TABLE tbl_users (
id SERIAL PRIMARY KEY,
  firstname varchar(150) DEFAULT NULL,
  lastname varchar(100) DEFAULT NULL,
  displayname varchar(255) DEFAULT NULL,
  email varchar(255) NOT NULL,
  username varchar(100) NOT NULL,
  roles varchar(100) NOT NULL,
  password varchar(255) NOT NULL,
  salt varchar(255) NOT NULL,
  updated timestamp DEFAULT NULL,
  created timestamp NOT NULL,
  active boolean NOT NULL,
  resetPasswordToken varchar(255) DEFAULT NULL,
  resetPasswordExpires timestamp DEFAULT NULL,
  token char(36) DEFAULT NULL
)


CREATE TABLE IF NOT EXISTS tbl_user_activity (
id bigint unsigned NOT NULL primary key,
  loginDate timestamp NOT NULL,
  userID bigint unsigned DEFAULT NULL
)

CREATE TABLE tbl_products (
  id  SERIAL PRIMARY KEY,
  prodid text NOT NULL,
  title text DEFAULT NULL,
  store text DEFAULT NULL,
  price numeric DEFAULT NULL,
  toplevelcategory text DEFAULT NULL,
  subcategory text DEFAULT NULL
)


-- Views

create or replace view vw_groupedProducts
as
SELECT store,toplevelcategory,avg(price) as total
FROM tbl_products group by store,toplevelcategory
order by toplevelcategory,store;

create or replace view vw_groupedProductsByCategory
as
select  toplevelcategory as category,string_agg(store,',') as stores,string_agg(cast(total as text),',') as averageprice
 from vw_groupedProducts
 group by toplevelcategory
