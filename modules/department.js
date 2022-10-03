const { connect } = require("../db/connection");
const inquirer = require('inquirer');

// selects all departments in database
async function getDepartment() {
    const db = await connect();
    const [departments] = await db.query('SELECT * FROM departments');
    return departments;
}
// exports data within department from database as object with name and value
async function getDepID() {
    const dept = await getDepartment();
    const deptChoice = [];
    dept.forEach((dept) => {
      let qObj = {
        name: dept.department,
        value: dept.id,
      };
      deptChoice.push(qObj);
    });
    return deptChoice;
}
// adds a department to database
async function addDepartment(department) {
    const db = await connect();
    await db.query('INSERT INTO `employee_tracker`.`departments` (`department`) VALUES (?)', department);
}
// gets all employees within a database for export
async function viewByDepartment(department) {

  const db = await connect();
	const query = `SELECT e.id, e.first_name AS "First Name", e.last_name AS "Last Name", r.title AS "Role Title", r.salary AS Salary, d.department AS "Department Name", IFNULL(CONCAT (em.first_name,' ',em.last_name),"No Manager") AS Manager
	FROM employees e
	LEFT OUTER JOIN employees em ON e.manager_id = em.id
	JOIN roles r ON e.role_id = r.id
	JOIN departments d ON r.department_id = d.id
	WHERE d.id = ?`;

	const [empInDept] = await db.query(query, [department]);
  return empInDept;
}
// gets total value of employees salaries eithin selected department and exports as array
async function viewDeptBudget(department) {

  const db = await connect();
  const query = `SELECT d.department, SUM(r.salary) AS "Utilized Budget"
	FROM employees e
	JOIN roles r on e.role_id = r.id
	JOIN departments d ON r.department_id = d.id
	Where d.id = ?`;

	const [deptBudget] = await db.query(query, [department]);
  return deptBudget;
}
module.exports = { getDepartment, addDepartment, getDepID, viewByDepartment, viewDeptBudget}; // exports functions
