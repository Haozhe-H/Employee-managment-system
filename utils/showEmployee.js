const mysql = require("mysql2");
const cTable = require("console.table");

require("dotenv").config();

const db = mysql.createConnection(
    {
      host: "localhost",
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    },
    console.log(`Connected to the employee_db database.`)
  );

// show employee
const showEmployee = async (userPrompt) => {
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
    // userPrompt();
  } catch (error) {
    console.log(error);
  }
};

module.exports = {showEmployee}