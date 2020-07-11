const inquirer = require("inquirer");
const mysql = require("mysql");
const cTable = require('console.table');

var connection = mysql.createConnection({
    host: "localhost",
    // Your port; if not 3306
    port: 3306,
    // Your username
    user: "root",
    // Your password
    password: "alreicha",
    database: "employee_db"
});

connection.connect(function (err) {
    if (err)
        throw err;

    console.log("Track your Employees");
    console.log("---------------------\n");

    mainMenu();
});
function mainMenu() {
    inquirer.prompt([
        {
            message: "Please select an option below:",
            name: "menuChoice",
            type: "list",
            choices: ["View all employees", "View employees by deparment", "View Employees by manager", "Add employees", "add roles", "add department", "Remove employees", "exit"]
        }
    ]).then(function ({ menuChoice }) {
        // console.log(menuChoice);

        switch (menuChoice) {
            case "View all employees":
                viewEmployee();
                break;
            case "View employees by deparment":
                viewDepartment();
                break;
            case "View Employees by manager":
                viewManager();
                break;
            case "Add employees":
                addEmployee();
                break;
            case "Remove employees":
                removeEmployee();
                break;
            case "add roles":
                addRole();
                break;
            case "add department":
                addDepartment();
                break;

            case "EXIT":
                connection.end();
                break;
        }
    });
}
function viewEmployee() {
    connection.query("SELECT * FROM employee INNER JOIN role ON role.id = employee.role_id INNER JOIN department ON department.id = role.department_id", function (err, data) {
        if (err) throw err;
        // console.log(iceCreamData);
        console.log(data)
    })

}

function addEmployee() {
    connection.query("SELECT title FROM role", function (err, employeeData) {
        if (err)
            throw err;

        let roleChoices = [];

        for (let i = 0; i < employeeData.length; i++) {
            roleChoices.push(employeeData[i]);
        }
    })
    connection.query("SELECT * FROM employee", function (err, employeeData) {
        if (err)
            throw err;

        let managerChoices = [];

        for (let i = 0; i < employeeData.length; i++) {
            managerChoices.push(`${employeeData[i].firstName} ${employeeData[i].lastName}`);
        }
    })
    inquirer.prompt([
        {
            message: "Please enter a new role.",
            name: "firstName",
            type: "input",

        },
        {
            message: "Please enter a salary for this role.",
            name: "lastName",
            type: "input",

        },
        {
            message: "Please indicate employee role:",
            name: "theRole",
            type: "list",
            choices: [roleChoices]
        },
        {
            message: "Please indicate employee manager:",
            name: "theManager",
            type: "list",
            choices: [managerChoices, "None"]
        }
    ]).then(function (employee) {

        connection.query("INSERT INTO employee (first_name, last_name, manager_id, role_id) VALUES (?, ?, SELECT id FROM role WHERE title = ?, SELECT id FROM employee WHERE title = ?) ", [employee.firstName, employee.lastName, employee.theManager, employee.theRole], function (err, data) {
            if (err)
                throw err;

            console.log(`${data.affectedRows} added!`);

            mainMenu();
        });

    })

}

function addRole() {
    inquirer.prompt([
        {
            message: "Please enter a new role.",
            name: "addRole",
            type: "input",

        },
        {
            message: "Please enter a salary for this role.",
            name: "addSalary",
            type: "input",

        },
        {
            message: "Please enter a department for this role",
            name: "addDepartment ",
            type: "input",

        }

    ]).then(function (enter) {
        connection.query("INSERT INTO role (title, salary, despartment_id) VALUES (?, ?, (SELECT id FROM department WHERE name=?))", [enter.addRole, parseFloat(enter.addSalary, enter.addDepartment)], function (err, data) {
            if (err)
                throw err;

            console.log(`${data.affectedRows} added!`);

            mainMenu();
        })
    })
}

function addDepartment() {
    inquirer.prompt(
        {
            message: "Please enter a new role.",
            name: "addDep",
            type: "input",

        }).then(function (department) {
            connection.query("INSERT INTO department (name) VALUES (?)", [department.addDep], function (err, data) {
                if (err)
                    throw err;

                console.log(`${data.affectedRows} added!`);

                mainMenu();
            })
        })
}