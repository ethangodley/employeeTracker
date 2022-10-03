const { connect } = require("../db/connection");
const inquirer = require('inquirer');
const { getDepID } = require("./department");

async function getRole() {
    const db = await connect();
    const [roles] = await db.query('SELECT * FROM roles');
    return roles;
}
async function dispRole() {
    const db = await connect();
    const [roles] = await db.query('SELECT roles.id, roles.title, roles.salary, departments.department FROM roles INNER JOIN departments ON roles.department_id=departments.id');
    return roles;
}
async function getTitle() {
    const titles = await getRole();
    const roleChoice = [];
    titles.forEach((titles) => {
      let qObj = {
        name: titles.title,
        value: titles.id,
      };
      roleChoice.push(qObj);
    });
    return roleChoice;
}
async function addRole() {
    await inquirer.prompt([
        {
            type: 'input',
            message: "Please enter role title",
            name: 'title'
        },
        {
            type: 'input',
            message: 'Please enter salary of role without $',
            name: 'salary'
        },
        {
            type: 'list',
            message: 'Please enter department for role',
            name: 'department',
            choices: await getDepID(),
        }
    ])
    .then(async (answer) => {
        const db = await connect();
        await db.query('INSERT INTO `employee_tracker`.`roles` (`title`, `salary`, `department_id`) VALUES (?, ?, ?)', [answer.title, answer.salary, answer.department]);

    })
}

module.exports = {getRole, addRole, getTitle, dispRole};
