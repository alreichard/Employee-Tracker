USE employee_db;

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("creg", "milk", 1, 1), ("vreg", "vilk", 1, 1), ("sreg", "silk", 2, 2,);

INSERT INTO role (title, salary, department_id)
VALUES ("intern", 80, 1), ("engineer", 88, 2), ("employee", 82, 3) ;

INSERT INTO department (name)
VALUES ("dep1", "dep2", "dep3");

