DROP DATABASE IF EXIST employee_db
CREATE DATABASE employee_db
USE employee_db

-- department table
CREATE TABLE department(
    id INTEGER PRIMARY KEY AUTO_INCREMENT NOT NULL
    name VARCHAR(30) NOT NULL
)

-- role atable
CREATE TABLE role(
    id INTEGER PRIMARY KEY AUTO_INCREMENT NOT NULL
    title VARCHAR(30) NOT NULL
    salary DECIMAL NOT NULL
    department_id INTEGER NOT NULL
    FOREIGN KEY (department_id)
        REFERENCES department(id)
        ON DELETE CASCADE ON UPDATE CASCADE
)

-- employee table
CREATE TABLE employee(
    id INTEGER PRIMARY KEY AUTO_INCREMENT NOT NULL
    first_name VARCHAR(30) NOT NULL
    last_name VARCHAR(30) NOT NULL
    role_id INTEGER NOT NULL
    FOREIGN KEY (role_id)
        REFERENCES role(id)
        ON DELETE RESTRICT ON UPDATE CASCADE
    manager_id INTEGER NULL
    FOREIGN KEY (manager_id)
        REFERENCES employee(id)
        ON DELETE SET NULL
        ON UPDATE CASCADE
    
)
