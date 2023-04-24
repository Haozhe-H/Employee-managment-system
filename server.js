const mysql = require("mysql2");
const inquirer = require("inquirer");
const cTable = require("console.table");
const Connection = require("mysql2");

require("dotenv").config();

// connect to DB
const db = mysql.createConnection(
  {
    host: "localhost",
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  },
  console.log(`Connected to the employee_db database.`)
);

// throw starting message after Connection
db.connect((err) => {
  if (err) throw err;
  afterConnection();
});

// throw prompts after message
const afterConnection = () => {
  console.log("|===========================|");
  console.log("|                           |");
  console.log("|      Employee Manager     |");
  console.log("|                           |");
  console.log("|===========================|");
  userPrompt();
};

const userPrompt = () => {
  inquirer
    .prompt([
      {
        type: "rawlist",
        name: "choices",
        message: "What would you like to do?",
        choices: [
          "View all employees",
          "Add employee",
          "Update employee role",
          "Update employee manager",
          "Delete employee",
          "View all roles",
          "Add role",
          "Delete role",
          "View all departments",
          "Add department",
          "Delete department",
          "View employees by department",
          "View department budget",
          "Quit",
        ],
      },
    ])
    .then((ans) => {
      const { choices } = ans;

      if (choices == "View all employees") {
        showEmployee();
      }

      if (choices == "Add employee") {
        addEmployee();
      }

      if (choices == "Update employee role") {
        updateRole();
      }

      if (choices == "Update employee manager") {
        // updateManager();
      }

      if (choices == "Delete employee") {
        // deleteEmployee();
      }

      if (choices == "View all roles") {
        // showRole();
      }

      if (choices == "Add role") {
        // addRole();
      }

      if (choices == "Delete role") {
        // deleteRole();
      }

      if (choices == "View all departments") {
        // viewDepartment();
      }

      if (choices == "Add department") {
        // addDepartment();
      }

      if (choices == "Delete department") {
        // deleteDepartment();
      }

      if (choices == "View employees by department") {
        // showDepartmentEmployee();
      }

      if (choices == "View department budget") {
        // showBudget();
      }

      if (choices == "Quit") {
        db.end();
      }
    });
};

// show employee
const showEmployee = async () => {
  console.log("Showing all employees.  \n=============================");
  const query = `
    SELECT employee.id,
      employee.first_name,
      employee.last_name,
      role.title,
      department.name AS department,
      role.salary,
      CONCAT(manager.first_name, ' ', manager.last_name) AS manager
    FROM employee
      LEFT JOIN role ON employee.role_id = role.id
      LEFT JOIN department ON role.department_id = department.id
      LEFT JOIN employee manager ON employee.manager_id = manager.id
    `;

  try {
    const [data] = await db.promise().query(query);
    console.table(data);
    userPrompt();
  } catch (error) {
    console.log(error);
  }
};

// add employee
const addEmployee = async () => {
  console.log("Adding an employee.  \n=============================");
  // name input
  try {
    const ans = await inquirer.prompt([
      {
        type: "input",
        name: "firstName",
        message: "What's the first name of the new employee?",
        validate: (input) => {
          if (input) {
            return true;
          } else {
            console.log("Please enter the first name of the new employee.");
            return false;
          }
        },
      },

      {
        type: "input",
        name: "lastName",
        message: "What's the last name of the new employee?",
        validate: (input) => {
          if (input) {
            return true;
          } else {
            console.log("Please enter the last name of the new employee.");
            return false;
          }
        },
      },
    ]);

    const params = [ans.firstName, ans.lastName];

    // add role
    const roleQuery = `SELECT role.id, role.title FROM role`;

    const [rows] = await db.promise().query(roleQuery);
    const roles = rows.map(({ id, title }) => ({
      name: title,
      value: id,
    }));

    const roleChoice = await inquirer.prompt([
      {
        type: "list",
        name: "role",
        message: "What's the role of the new employee?",
        choices: roles,
      },
    ]);
    const role = roleChoice.role;
    params.push(role);

    // add manager
    const managerQuery = `SELECT * FROM employee`;

    const [managerRows] = await db.promise().query(managerQuery);

    const managers = managerRows.map(({ id, first_name, last_name }) => ({
      name: `${first_name} ${last_name}`,
      value: id,
    }));

    const managerChoice = await inquirer.prompt([
      {
        type: "list",
        name: "manager",
        message: "Who's the manager of the new employee?",
        choices: managers,
      },
    ]);
    const manager = managerChoice.manager;
    params.push(manager);

    const query = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUE (?, ?, ?, ?)`;

    const [results] = await db.promise().query(query, params);
    console.log("New employee has been added.");

    showEmployee();
  } catch (error) {
    console.log(error);
  }
};

// update role
updateRole = async () => {
  try {
    // select employee
    const query = `SELECT * FROM employee`;
    const [data] = await db.promise().query(query);
    const employees = data.map(({ id, first_name, last_name }) => ({
      name: `${first_name} ${last_name}`,
      value: id,
    }));

    const ans = await inquirer.prompt([
      {
        type: "list",
        name: "name",
        message: "Which employee would you want to update?",
        choices: employees,
      },
    ]);

    let employee = ans.name;

    const params = [];
    params.push(employee);

    // select role
    const roleQuery = `SELECT * FROM role`;
    const [rows] = await db.promise().query(roleQuery);
    const roles = rows.map(({ id, title }) => ({ name: title, value: id }));

    const roleChoice = await inquirer.prompt([
      {
        type: "list",
        name: "role",
        message: "What's the new role of this employee?",
        choices: roles,
      },
    ]);

    const role = roleChoice.role;
    params.push(role);

    // swap position, update role where employee is
    employee = params[0];
    params[0] = role;
    params[1] = employee;

    const updateQuery = `UPDATE employee SET role_id = ? WHERE id = ?`;
    await db.promise().query(updateQuery, params);
    console.log("Employee has been updated.");

    showEmployee();
  } catch (error) {
    console.log(error);
  }
};
