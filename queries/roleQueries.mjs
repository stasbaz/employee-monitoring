import inquirer from 'inquirer';

export async function viewAllRoles(connection) {
  try {
    const [rows] = await connection.query('SELECT * FROM role');
    console.table(rows);
  } catch (error) {
    console.error('Error viewing roles:', error);
  }
}

export async function addRole(connection) {
  try {
    const answers = await inquirer.prompt([
      {
        type: 'input',
        name: 'title',
        message: 'Enter the title of the role:',
      },
      {
        type: 'number',
        name: 'salary',
        message: 'Enter the salary for the role:',
      },
      {
        type: 'number',
        name: 'department_id',
        message: 'Enter the department ID for this role:',
      },
    ]);

    const [result] = await connection.execute(
      'INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)',
      [answers.title, answers.salary, answers.department_id]
    );

    console.log(`Role "${answers.title}" added with ID ${result.insertId}`);
  } catch (error) {
    console.error('Error adding role:', error);
  }
}