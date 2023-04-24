const inquirer = require("inquirer")


inquirer.prompt([
    {
        type:"list",
        message:"options",
        name:"selection",
        choices:["1","2","3"]
    }
]).then (response => {
    console.log(response)
})