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
        type: "list",
        name: "options",
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
        updateManager();
      }

      if (choices == "Delete employee") {
        deleteEmployee();
      }

      if (choices == "View all roles") {
        showRole();
      }

      if (choices == "Add role") {
        addRole();
      }

      if (choices == "Delete role") {
        deleteRole();
      }

      if (choices == "View all departments") {
        viewDepartment();
      }

      if (choices == "Add department") {
        addDepartment();
      }

      if (choices == "Delete department") {
        deleteDepartment();
      }

      if (choices == "View employees by department") {
        showDepartmentEmployee();
      }

      if (choices == "View department budget") {
        showBudget();
      }

      if (choices == "Quit") {
        db.end();
      }
    });
};
