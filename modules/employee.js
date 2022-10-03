const { connect } = require("../db/connection");
const inquirer = require('inquirer');
const { getTitle } = require('../modules/role');
const { default: Choices } = require("inquirer/lib/objects/choices");

// gets all employees within database
async function getEmployee() {
    const db = await connect();
    const [employees] = await db.query('SELECT * FROM employees');
    return employees;
    
}
// gets all employees incluyding role and department sections and exports as array
async function dispEmployee() {
    const db = await connect();

    const [employees] = await db.query(`SELECT e.id, e.first_name AS "First Name", e.last_name AS "Last Name", r.title AS "Role Title", r.salary AS Salary, d.department AS "Department Name", IFNULL(CONCAT (em.first_name,' ',em.last_name),"No Manager") AS Manager
    FROM employees e
    LEFT OUTER JOIN employees em ON e.manager_id = em.id
    JOIN roles r ON e.role_id = r.id
    JOIN departments d ON r.department_id = d.id`);
    return employees;
}
// exports data within employee from database as object with name and value
async function getEmpName() {
    const emp = await getEmployee();
    const empChoice = [];
    emp.forEach((emp) => {
      let qObj = {
        name: emp.first_name + " " + emp.last_name,
        value: emp.id,
      };
      empChoice.push(qObj);
    });
    qObj = {
        name: 'no manager',
        value: null,
    };
    empChoice.push(qObj);
    return empChoice;
}
// adds employee to database
async function addEmployee() {
    await inquirer.prompt([
        {
            type: 'input',
            message: "Please enter employee first name",
            name: 'firstName'
        },
        {
            type: 'input',
            message: "Please enter employee last name",
            name: 'lastName'
        },
        {
            type: 'list',
            message: 'Please choose role',
            name: 'role',
            choices: await getTitle(),
        },
        {
            type: 'list',
            message: 'Please enter employee manager',
            name: 'manager',
            choices: await getEmpName(),
        }
    ])
    .then(async (answer) =>{
        const db = await connect();
        let manager = answer.manager; 
        if(manager === 'null') {
            manager = null;
        }
        
        await db.query('INSERT INTO `employee_tracker`.`employees` (`first_name`, `last_name`, `role_id`, `manager_id`) VALUES (?, ?, ?, ?)', [answer.firstName, answer.lastName, answer.role, answer.manager]);

    })
}
// updates role of selected employee
async function updateEmployee() {
    await inquirer.prompt([
		{
			type: 'list',
			message: 'Which employee has changed roles?',
			name: 'employee',
			choices: await getEmpName()
		},
		{
			type: 'list',
			message: 'Which role are you moving this employee into?',
			name: 'role',
			choices: await getTitle()
		}
	])
    .then(async (answer) => {
        const db = await connect();
        await db.query(`UPDATE employees SET role_id = ? WHERE id = ?`, [answer.role, answer.employee]);
    })
}
// updates manager of selected employee
async function updateManager() {
	await inquirer.prompt([
		{
			type: 'list',
			message: 'Which employee has changed manager?',
			name: 'employee',
			choices: await getEmpName()
		},
		{
			type: 'list',
			message: 'Who does the employee now report to?',
			name: 'manager',
			choices: await getEmpName()
		},
	])
    .then(async (answer) => {
        const db = await connect();
		db.query(`UPDATE employees SET manager_id = ? WHERE id = ?`, [answer.manager, answer.employee]);
	})
}
// gets all employees with specified manager id and exportsd as array
async function viewByManager(manager) {

    const db = await connect();
    const query = `SELECT e.id, e.first_name AS "First Name", e.last_name AS "Last Name", r.title AS "Role Title", r.salary AS Salary, d.department AS "Department Name", IFNULL(CONCAT (em.first_name,' ',em.last_name),"No Manager") AS Manager
    FROM employees e
    LEFT OUTER JOIN employees em ON e.manager_id = em.id
    JOIN roles r ON e.role_id = r.id
    JOIN departments d ON r.department_id = d.id
    WHERE e.manager_id = ?`;

    const [viewManagers] = await db.query(query, [manager]);
    return viewManagers;
  }
// delets an employee from database
  async function deleteEmployee() {
	await inquirer.prompt([
		{
			type: 'list',
			message: 'Which Employee do you want to delete?',
			name: 'employee',
			choices: await getEmpName()
		},
	])
  .then(async (answer) =>{
        const db = await connect();
		await db.query(`DELETE FROM employees WHERE employees.id = ?`, [answer.employee]);
  })
}

module.exports = { getEmployee, addEmployee, dispEmployee, getEmpName, updateEmployee, updateManager, viewByManager, deleteEmployee}; // exports functions