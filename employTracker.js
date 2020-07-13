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
            choices: ["View all employees", "Change manager", "Change employee job", "Add employees", "add roles", "add department", "Remove employees", "Department total salary", "exit"]
        }
    ]).then(function ({ menuChoice }) {
        // console.log(menuChoice);

        switch (menuChoice) {
            case "View all employees":
                viewEmployee();
                break;
            case "Change manager":
                changeManager();
                break;
            case "Change employee job":
                changeJob();
                break;
            case "Add employees":
                addEmployee();
                break;
            case "Remove employees":
                DeleteEmployee()
                break;
            case "add roles":
                addRole();
                break;
            case "add department":
                addDepartment();
                break;
            case "Department total salary":
                summer();
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
        console.table(data)
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
                name: "addDepartment",
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
    let roleId = ""
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
                name: "employName",
                type: "input"

        }]).then(function(change) {
               
                naming = change.employName.split(" ")
                console.log(naming)
                connection.query("SELECT id FROM role WHERE title = ?", [change.newJob], function (err, data) {
                    if (err)
                        throw err; 
                        roleId = data
             console.log(Object.keys(data) + "!!!!!!!!!!!!!!!!!!")
           
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

                    console.log(`${updateData.affectedRows} job was changed.`);

                    mainMenu();
                });
            })
        })
    })
}

function changeManager() {
    let naming = [];
    let newManager = [];
    let ManagerId;
    connection.query("SELECT * FROM employee", function (err, employeeData) {
        if (err)
            throw err;



        for (let i = 0; i < employeeData.length; i++) {
            newManager.push(`${employeeData[i].first_name} ${employeeData[i].last_name}`);

        }

        inquirer.prompt([
            {
                message: "Who is the new manager?",
                name: "newManager",
                type: "list",
                choices: newManager

            },
            {
                message: "What is the name of the employee who will recieve the new manager?",
                name: "employName",
                type: "input"

        }]).then(function (change) {
                naming = change.employName.split(" ")
                newManager = change.newManager.split(" ")
                connection.query("SELECT id FROM employee WHERE first_name = ? AND last_name = ?", [newManager[0], newManager[1]], function(data) { roleId = 2
             console.log(data + "!!!!!!!!!!!!!!!!!!")
           
                connection.query("UPDATE employee SET ?  WHERE ? AND ?", [
                    {
                        manager_Id: ManagerId
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

function DeleteEmployee() {
    let naming = [];
    let delet = [];
    
    connection.query("SELECT * FROM employee", function (err, employeeData) {
        if (err)
            throw err;



        for (let i = 0; i < employeeData.length; i++) {
            delet.push(`${employeeData[i].first_name} ${employeeData[i].last_name}`);

        }
        inquirer.prompt([
            {
                message: "Who is the new manager?",
                name: "DeleteEmp",
                type: "list",
                choices: delet

            }]).then(function(dat){
                naming = dat.DeleteEmp.split(" ")
                connection.query("DELETE FROM employee WHERE first_name = ? AND last_name = ?", [naming[0], naming[1]], function (err) {
                    if (err)
                        throw err; 
                    mainMenu()
            })
    })
    })
}

function summer(){
    let naming = [];
    let total = 0;
    connection.query("SELECT * FROM role", function (err, employeeData) {
        if (err)
            throw err;



        for (let i = 0; i < employeeData.length; i++) {
            naming.push(employeeData[i].title);

        }

        
       

 inquirer.prompt([
            {
                message: "What job would you like to check?",
                name: "nameIT",
                type: "list",
                choices: naming

            }]).then(function(dat){
                
                

               
    
    connection.query("SELECT * FROM role WHERE title = ?", [dat.naming], function(err, employeeData) {
        if (err)
            throw err;



        for (let i = 0; i < employeeData.length; i++) {
           total = total + (employeeData[i].salary);

        }
        console.log(employeeData)
        console.log(`this job pays employees a total of ${total} dollars.`)
    })
    })
})
}