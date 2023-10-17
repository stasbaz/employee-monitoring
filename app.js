import inquirer from 'inquirer';
import mysql from 'mysql2/promise';
import * as departmentQueries from './queries/departmentQueries.js';
import * as roleQueries from './queries/roleQueries.js';
import * as employeeQueries from './queries/employeeQueries.js';

async function mainMenu(connection) {
  while (true) {
    const choices = [
      'View all departments',
      'View all roles',
      'View all employees',
      'Add a department',
      'Add a role',
      'Add an employee',
      'Update an employee role',
      'Exit',
    ];

    const answers = await inquirer.prompt([
      {
        type: 'list',
        name: 'choice',
        message: 'What would you like to do?',
        choices,
      },
    ]);

    switch (answers.choice) {
      case 'View all departments':
        await departmentQueries.viewAllDepartments(connection);
        break;
      case 'View all roles':
        await roleQueries.viewAllRoles(connection);
        break;
      case 'View all employees':
        await employeeQueries.viewAllEmployees(connection);
        break;
      case 'Add a department':
        await departmentQueries.addDepartment(connection);
        break;
      case 'Add a role':
        await roleQueries.addRole(connection);
        break;
      case 'Add an employee':
        
        const [roleRows] = await connection.query('SELECT id, title FROM role');
        const [managerRows] = await connection.query('SELECT first_name, last_name, id FROM employee WHERE role_id = 1 OR role_id = 4 OR role_id = 6 OR role_id = 7')
        await employeeQueries.addEmployee(connection, roleRows, managerRows);
        
        break;
      case 'Update an employee role':
        await employeeQueries.updateEmployeeRole(connection);
        break;
      case 'Exit':
        console.log('Goodbye!');
        connection.end();
        process.exit();
        break;
    }
  }
}

async function init() {
  try {
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'employees_db',
    });

    await connection.connect();
    console.log('Connected to the database.');
    mainMenu(connection);
  } catch (error) {
    console.error('Error connecting to the database:', error);
  }
}

init();
