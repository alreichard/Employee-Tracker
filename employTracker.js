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
            choices: ["View all employees", "View employees by deparment", "Change employee job", "Add employees", "add roles", "add department", "Remove employees", "exit"]
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
            case "Change employee job":
                changeJob();
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
    let roleChoices = [];
    let managerChoices = [];
    let nameName
    connection.query("SELECT * FROM role", function (err, employeeData) {
        if (err)
            throw err;



        for (let i = 0; i < employeeData.length; i++) {
            roleChoices.push(employeeData[i].title);
        }


        connection.query("SELECT * FROM employee", function (err, employeeData) {
            if (err)
                throw err;



            for (let i = 0; i < employeeData.length; i++) {
                managerChoices.push(`${employeeData[i].first_name} ${employeeData[i].last_name}`);

            }


            console.log(`${managerChoices} are console logged`)
            inquirer.prompt([
                {
                    message: "Please indicate employee first name:",
                    name: "firstName",
                    type: "input",

                },
                {
                    message: "Please indicate employee last name:",
                    name: "lastName",
                    type: "input",

                },

                {
                    message: "Please indicate employee role:",
                    name: "theRole",
                    type: "list",
                    choices: roleChoices
                },
                {
                    message: "Please indicate employee manager:",
                    name: "theManager",
                    type: "list",
                    choices: managerChoices
                }
            ]).then(function (employee) {
                nameName = employee.theManager.split(" ")
                // connection.query("SELECT id FROM role WHERE title = ?", [employee.theRole], function(data) {
                //     console.log(data + "---------------------fslkjdsjsjdf")

                // })
                // console.log(employee.theRole + "<<<<<<<<<<<<<<<" + firstName)
                connection.query("INSERT INTO employee (first_name, last_name, manager_id, role_id) VALUES (?, ?, (SELECT id FROM (SELECT * FROM employee) as something WHERE first_name = ? AND last_name = ?), (SELECT id FROM role WHERE title = ?)) ", [employee.firstName, employee.lastName, nameName[0], nameName[1], employee.theRole], function (err, data) {
                    if (err)
                        throw err;

                    console.log(`${data.affectedRows} added!`);

                    mainMenu();
                });

            })
        })
    })
}

function addRole() {
    let newRole = [];
    connection.query("SELECT * FROM department", function (err, employeeData) {
        if (err)
            throw err;



        for (let i = 0; i < employeeData.length; i++) {
            newRole.push(employeeData[i].name);
        }
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
                type: "list",
                choices: newRole

            }

        ]).then(function (enter) {
            
            connection.query("INSERT INTO role (title, salary, department_id) VALUES (?, ?, (SELECT id FROM department WHERE name=?))", [enter.addRole, parseFloat(enter.addSalary), enter.addDepartment], function (err, data) {
                if (err)
                    throw err;

                console.log(`${data.affectedRows} added!`);

                mainMenu();
            })
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
function changeJob() {
    let naming = [];
    let newJob = [];
    let roleId = "filler"
    connection.query("SELECT * FROM role", function (err, employeeData) {
        if (err)
            throw err;



        for (let i = 0; i < employeeData.length; i++) {
            newJob.push(employeeData[i].title);
        }

        inquirer.prompt([
            {
                message: "What is the new job?",
                name: "newJob",
                type: "list",
                choices: newJob

            },
            {
                message: "What is the name of the employee?",
                name: "emplyName",
                type: "input"

        }]).then(function (change) {
                naming = change.emplyName.split(" ")
                connection.query("SELECT id FROM role WHERE title = ?", [change.newJob], function(data) { roleId = 2
             console.log(data + "!!!!!!!!!!!!!!!!!!")
           
                connection.query("UPDATE employee SET ?  WHERE ? AND ?", [
                    {
                        role_Id: roleId
                    },
                    {
                        first_name: naming[0]

                    },
                    { last_name: naming[1] }
                ], function (err, updateData) {
                    if (err)
                        throw err;

                    console.log(`${updateData.affectedRows} product was bid on! New price accepted!`);

                    mainMenu();
                });
            })
        })
    })
}