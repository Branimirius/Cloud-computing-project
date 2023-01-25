const express = require('express');
const bodyParser = require('body-parser');
const { Client } = require('pg');

const app = express();
app.use(bodyParser.json());

const client = new Client({
  host: 'hostname',
  port: 5432,
  user: 'username',
  password: 'password',
  database: 'dbname'
});
client.connect();

app.post('/student', (req, res) => {
  const { name, email } = req.body;
  // Check if the student exists in the database
  client.query('SELECT * FROM students WHERE name = $1 AND email = $2', [name, email], (err, result) => {
    if (err) {
      return res.status(500).send(err);
    }
    if (result.rows.length === 0) {
      // If student does not exist, insert student into the database
      client.query('INSERT INTO students(name, email) VALUES($1, $2)', [name, email], (err, result) => {
        if (err) {
          return res.status(500).send(err);
        }
        return res.status(201).send({ message: 'Student added.' });
      });
    } else {
      return res.status(200).send(result.rows[0]);
    }
  });
});


app.listen(3000, () => console.log('Server started on port 3000'));