import inquirer from 'inquirer';

export async function viewAllEmployees(connection) {
  const query = `
    SELECT
      e.id AS id,
      e.first_name AS first_name,
      e.last_name AS last_name,
      r.title AS title,
      r.salary AS salary,
      d.name AS department,
      CONCAT(IFNULL(m.first_name, 'N/A'), ' ', IFNULL(m.last_name, 'N/A')) AS manager
    FROM employee AS e
    LEFT JOIN role AS r ON e.role_id = r.id
    LEFT JOIN department AS d ON r.department_id = d.id
    LEFT JOIN employee AS m ON e.manager_id = m.id;
  `;

  const [rows] = await connection.query(query);
  console.table(rows);
}

export async function addEmployee(connection, roles, managers) {
  try {
    const managersChoices = (managers && Array.isArray(managers))
      ? managers.map((manager) => ({
          name: `${manager.first_name} ${manager.last_name}`,
          value: manager.id,
        }))
      : [];

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
        type: 'list',
        name: 'role_id',
        message: 'Select the employee\'s role:',
        choices: roles.map((role) => ({
          name: role.title,
          value: role.id,
        })),
      },
      {
        type: 'list',
        name: 'manager_id',
        message: 'Select the employee\'s manager (or "None"):',
        choices: managers.map((manager)=>({
          name: manager.first_name + " " + manager.last_name,
          value: manager.id
        }))
      },
    ]);

    const managerId = answers.manager_id === 'None' ? null : answers.manager_id;

    const [result] = await connection.execute(
      'INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)',
      [answers.first_name, answers.last_name, answers.role_id, managerId]
    );

    console.log(`Added ${answers.first_name} ${answers.last_name} to the database with ID ${result.insertId}`);
  } catch (error) {
    console.error('Error adding employee:', error);
  }
}


export async function updateEmployeeRole(connection, roles, employees) {
  try {
    const answers = await inquirer.prompt([
      {
        type: 'number',
        name: 'employee_id',
        message: 'Enter the ID of the employee you want to update:',
      },
      {
        type: 'number',
        name: 'new_role_id',
        message: 'Enter the new role ID for the employee:',
      },
    ]);

    await connection.execute(
      'UPDATE employee SET role_id = ? WHERE id = ?',
      [answers.new_role_id, answers.employee_id]
    );

    console.log('Employee role updated.');
  } catch (error) {
    console.error('Error updating employee role:', error);
  }
}