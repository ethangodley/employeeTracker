// imports

const { getRandomValues } = require("crypto");
const inquirer = require("inquirer");
const { getDepartment } = require('./modules/department');
const { viewByDepartment } = require('./modules/department');
const { viewDeptBudget } = require('./modules/department');
const { addDepartment } = require('./modules/department');
const { getDepID } = require('./modules/department')
const { addRole } = require('./modules/role');
const { dispRole } = require('./modules/role');
const { dispEmployee } = require('./modules/employee');
const { deleteEmployee } = require('./modules/employee');
const { addEmployee } = require('./modules/employee');
const { updateEmployee } = require('./modules/employee');
const { updateManager } = require('./modules/employee');
const { viewByManager } = require('./modules/employee');
const { getEmpName } = require('./modules/employee');


// task selection menu
async function main() {
    return await inquirer.prompt([
        {
            type: 'list',
            message: 'Please select an option from the menu',
            name: 'task',
            choices: [
                'view all departments',
                'view by department',
                'view all roles',
                'view all employees',
                'view by manager', 
                'view department budget',
                'add role',
                'add department',
                'add employee',
                'update employee role',
                'update employee manager',
                'delete employee',
                'exit'
            ]
        },
        {
            message: 'What is the department name?',
            type: 'input',
            name: 'departmentName',
            when: (answer) => answer.task === 'add department',
        },
        {
            message: 'Which Departments employees would you like to view?',
            type: 'list',
            name: 'department',
            choices: await getDepID(),
            when: (answer) => answer.task === 'view by department',
        },
        {
            message: 'Which managers employees would you like to view?',
            type: 'list',
            name: 'manager',
            choices: await getEmpName(),
            when: (answer) => answer.task === 'view by manager',
        },
        {
            message: 'Which department budget would you like to view?',
            type: 'list',
            name: 'budget',
            choices: await getDepID(),
            when: (answer) => answer.task === 'view department budget',
        }
    ])
    .then(async (answer) => { // each task directs the user to the relevant imported function to complete the specified task
        switch(answer.task){
            case 'view all departments':
                const departments = await getDepartment();
                console.table(departments);
                break;
            case 'view by department':
                const viewDept = await viewByDepartment(answer.department);
                console.table(viewDept);
                break;
            case 'view all roles':
                const roles = await dispRole();
                console.table(roles);
                break;
            case 'view all employees':
                const employees = await dispEmployee();
                console.table(employees);
                break;
            case 'view by manager':
                const viewManager = await viewByManager(answer.manager);
                console.table(viewManager);
                break;
            case 'view department budget': 
                const viewBudget = await viewDeptBudget(answer.budget);
                console.table(viewBudget);
                break;
            case 'add department':
                const department = await addDepartment(answer.departmentName);
                break;
            case 'add role':
                const role = await addRole();
                break;

            case 'add employee':
                const employee = await addEmployee();
                break;
            case 'update employee role':
                const newRole = await updateEmployee();
                break;
            case 'update employee manager':
                const newManager = await updateManager();
                break;
            case 'delete employee':
                const delEmp = await deleteEmployee();
                console.log("successfully deleted department");
                break;
            case 'exit':
                process.exit(0);
        }
        await main(); // once task completed, open primary menu again
    })
}
main(); // start app