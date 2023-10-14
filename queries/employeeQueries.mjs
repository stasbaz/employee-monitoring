import inquirer from 'inquirer';

export async function viewAllEmployees(connection) {
  const [rows] = await connection.query('SELECT * FROM employee');
  console.table(rows);
}

export async function addEmployee(connection) {
  try {
    const answers = await inquirer.prompt([
      {
        type: 'input',
        name: 'first_name',
        message: 'Enter the first name of the employee:',
      },
      {
        type: 'input',
        name: 'last_name',
        message: 'Enter the last name of the employee:',
      },
      {
        type: 'number',
        name: 'role_id',
        message: 'Enter the role ID for this employee:',
      },
      {
        type: 'number',
        name: 'manager_id',
        message: 'Enter the manager ID for this employee (leave empty if none):',
      },
    ]);

    const [result] = await connection.execute(
      'INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)',
      [answers.first_name, answers.last_name, answers.role_id, answers.manager_id || null]
    );

    console.log(`Employee "${answers.first_name} ${answers.last_name}" added with ID ${result.insertId}`);
  } catch (error) {
    console.error('Error adding employee:', error);
  }
}