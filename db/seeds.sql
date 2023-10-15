INSERT INTO department (name) VALUES
  ('HR'),
  ('Finance'),
  ('Marketing');

INSERT INTO role (title, salary, department_id) VALUES
  ('HR Manager', 60000, 1),
  ('Accountant', 50000, 2),
  ('Marketing Specialist', 55000, 3),
  ('Marketing Manager', 65000, 3);

INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES
  ('John', 'Doe', 1, NULL), 
  ('Alice', 'Smith', 2, 1),
  ('Bob', 'Johnson', 3, NULL),
  ('Eve', 'Davis', 4, 3);