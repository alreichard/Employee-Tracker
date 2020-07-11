DROP DATABASE IF EXISTS employee_db;
CREATE DATABASE employee_db;
USE employee_db;

CREATE TABLE employee(
  id INTEGER(11) PRIMARY KEY AUTO_INCREMENT NOT NULL,
  first_name VARCHAR(30),
  last_name VARCHAR(30),
  role_Id INTEGER(11),
  manager_id INTEGER(11)
  FOREIGN KEY (manager_id) REFERENCES employee(id)
 FOREIGN KEY (role_id) REFERENCES role(id)
  
  
);

CREATE TABLE role(
  id INTEGER(11) PRIMARY KEY AUTO_INCREMENT NOT NULL,
  title VARCHAR(30),
  salary INTEGER(11,2),
  department_id INTEGER(11),
  FOREIGN KEY (department_id) REFERENCES department(id)
  
);

CREATE TABLE department(
  id INTEGER(11) PRIMARY KEY AUTO_INCREMENT NOT NULL,
  name VARCHAR(30),
  
);