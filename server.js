const mysql = require("mysql2");
const inquirer = require("inquirer");
const cTable = require("console.table");

require("dotenv").config();

// const {showEmployee} = require('./utils/showEmployee')

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
          // "Add employee",
          // "Update employee role",
          // "Update employee manager",
          // "Delete employee",
          // "View all roles",
          // "Add role",
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
        showDepartment();
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
  console.log(
    "Updating the role of an employee.  \n============================="
  );
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

    const params = [employee];

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

// update manager
updateManager = async () => {
  console.log(
    "Updating the manager of an employee.  \n============================="
  );
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
    const params = [employee];

    // select manager
    const managerQuery = `SELECT * FROM employee`;
    const [rows] = await db.promise().query(managerQuery);
    const managers = rows.map(({ id, first_name, last_name }) => ({
      name: `${first_name} ${last_name}`,
      value: id,
    }));

    const managerChoice = await inquirer.prompt([
      {
        type: "list",
        name: "manager",
        message: "Who is the new manager of the employee?",
        choices: managers,
      },
    ]);

    const manager = managerChoice.manager;
    params.push(manager);

    // swap position, update manager where employee is
    employee = params[0];
    params[0] = manager;
    params[1] = employee;

    // update manager
    const updateQuery = `UPDATE employee SET manager_id = ? WHERE id = ?`;
    await db.promise().query(updateQuery, params);

    console.log("Employee has been updated.");

    showEmployee();
  } catch (error) {
    console.error(error);
  }
};

// delete employee
deleteEmployee = async () => {
  console.log("Deleting an employee.  \n=============================");
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
        message: "Which employee would you want to delete?",
        choices: employees,
      },
    ]);

    const employee = ans.name;

    // delete query
    const deleteQuery = `DELETE FROM employee WHERE id = ?`;
    const [result] = await db.promise().query(deleteQuery, employee);

    console.log(`Employee ${employee} has been deleted!`);

    showEmployee();
  } catch (error) {
    console.error(error);
  }
};

// show roles
const showRole = async () => {
  console.log("Showing all roles.  \n=============================");
  const query = `
    SELECT role.id,
      role.title,
      department.name AS department
    FROM role
      INNER JOIN department ON role.department_id = department.id
    `;

  try {
    const [data] = await db.promise().query(query);
    console.table(data);
    userPrompt();
  } catch (error) {
    console.log(error);
  }
};

// add role
const addRole = async () => {
  console.log("Adding a new role.  \n=============================");
  try {
    const ans = await inquirer.prompt([
      {
        type: "input",
        name: "role",
        message: "Which role do you want to add?",
        validate: (input) => {
          if (input) {
            return true;
          } else {
            console.log("Please enter a role.");
            return false;
          }
        },
      },

      {
        type: "input",
        name: "salary",
        message: "What's the salary of this role?",
        validate: (input) => {
          if (!isNaN(input)) {
            return true;
          } else {
            console.log("Please enter the salary for this new role.");
            return false;
          }
        },
      },
    ]);

    const params = [ans.role, ans.salary];

    // select department
    const query = `SELECT name, id FROM department`;

    const [data] = await db.promise().query(query);
    const departments = data.map(({ name, id }) => ({ name: name, value: id }));

    const deptChoice = await inquirer.prompt([
      {
        type: "list",
        name: "dept",
        message: "Which department is this role belong to?",
        choices: departments,
      },
    ]);

    const department = deptChoice.dept;
    params.push(department);

    // insert role query
    const roleQuery = `INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)`;

    const [result] = await db.promise().query(roleQuery, params);

    console.log(`Added ${ans.role} to system.`);

    showRole();
  } catch (error) {
    console.error(error);
  }
};

// delete role
deleteRole = async () => {
  console.log("Deleting a role.  \n=============================");

  try {
    const query = `SELECT * FROM role`;
    const [data] = await db.promise().query(query);

    const roles = data.map(({ title, id }) => ({ name: title, value: id }));

    const roleChoice = await inquirer.prompt([
      {
        type: 'list',
        name: 'role',
        message: "Which role do you want to delete?",
        choices: roles
      }
    ]);

    const role = roleChoice.role;

    const employeeQuery = `SELECT COUNT(*) as count FROM employee WHERE role_id = ?`;
    const [[employeeCount]] = await db.promise().query(employeeQuery, role);

    if (employeeCount.count > 0) {
      console.log(`Cannot delete role ${role}. ${employeeCount.count} employees have this role.`);
      return;
    }

    const deleteQuery = `DELETE FROM role WHERE id = ?`;

    const [result] = await db.promise().query(deleteQuery, role);

    console.log(`Role ${role} has been deleted.`);

    showRole();
  } catch (error) {
    console.log(error);
  }
};

// show department
const showDepartment = async () => {
  console.log("Showing all departments.  \n=============================");
  const query = `
    SELECT employee.first_name,
      employee.last_name,
      department.name AS department
    FROM employee
      LEFT JOIN role ON employee.role_id = role.id
      LEFT JOIN department ON role.department_id = department.id
    `;

  try {
    const [data] = await db.promise().query(query);
    console.table(data);
    userPrompt();
  } catch (error) {
    console.log(error);
  }
};
