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
//   startPrompt();
};

// const startPrompt = () => {
//     inquirer.prompt([
//         {
//             type: 'list'
//         }
//     ])
// }
