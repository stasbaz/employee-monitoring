import inquirer from 'inquirer';

export async function viewAllDepartments(connection) {
  const [rows] = await connection.query('SELECT * FROM department');
  console.table(rows);
}

export async function addDepartment(connection) {
  const answer = await inquirer.prompt([
    {
      type: 'input',
      name: 'name',
      message: 'Enter the name of the department:',
    },
  ]);

  const [result] = await connection.query('INSERT INTO department (name) VALUES (?)', [answer.name]);
  console.log('Department added with ID:', result.insertId);
}
