const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const { Client } = require('pg');
const { v4: uuidv4 } = require('uuid');

// Connect to PostgreSQL database
const client = new Client({
    host: 'postgres',
    port: 5432,
    user: 'postgres',
    password: 'super_secret',
    database: 'uns_db'
});
client.connect();
createTables(client);

// Define the Student model
class Student {
    constructor(first_name, last_name, email) {
        this.id = uuidv4();
        this.first_name = first_name;
        this.last_name = last_name;
        this.email = email;
    }
}

// Define the Professor model
class Professor {
    constructor(first_name, last_name, email) {
        this.id = uuidv4();
        this.first_name = first_name;
        this.last_name = last_name;
        this.email = email;
    }
}

var count = 0;

// Use body-parser middleware
app.use(bodyParser.json());

// API endpoint for creating a new student
app.post('/student', (req, res) => {
    count += 1;
    console.log("Counter is at: " + count)
    const { first_name, last_name, email } = req.body;
    // Check if student already exists in the database
    client.query('SELECT * FROM students WHERE email = $1', [email], (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).send('Error checking for existing student');
        } else if (result.rows.length > 0) {
            console.log('Student already exists');
            res.status(409).send('Student already exists');
        } else {
            // Create a new student
            const student = new Student(first_name, last_name, email);
            // Insert student into the database
            client.query('INSERT INTO students (id, first_name, last_name, email) VALUES ($1, $2, $3, $4)',
                [student.id, student.first_name, student.last_name, student.email],
                (err, result) => {
                    if (err) {
                        console.log(err);
                        res.status(500).send('Error inserting student into the database');
                    } else {
                        console.log('Student created');
                        res.status(201).send('Student created');
                    }
                });
        }
    });
});

// API endpoint for creating a new professor
app.post('/professor', (req, res) => {
    count += 1;
    console.log("Counter is at: " + count)

    const { first_name, last_name, email } = req.body;
    // Check if professor already exists in the database
    client.query('SELECT * FROM "professors" WHERE email = $1', [email], (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).send('Error checking for existing professor');
        } else if (result.rows.length > 0) {
            console.log('Professor already exists');
	    	res.status(409).send('Professor already exists');
		} else {
			// Create a new professor
			const professor = new Professor(first_name, last_name, email);
			// Insert professor into the database
			client.query('INSERT INTO "professors" (id, first_name, last_name, email) VALUES ($1, $2, $3, $4)',
				[professor.id, professor.first_name, professor.last_name, professor.email],
				(err, result) => {
					if (err) {
						console.log(err);
						res.status(500).send('Error inserting professor into the database');
					} else {
                        console.log('Professor created');
						res.status(201).send('Professor created');
					}
				});
		}
	});
});

// Start the server
app.listen(3000, () => {
	console.log('Server listening on port 3000');
});

async function createTables(client) {
    try {
        await client.query(`
            CREATE TABLE IF NOT EXISTS students (
                id UUID PRIMARY KEY,
                first_name VARCHAR(255) NOT NULL,
                last_name VARCHAR(255) NOT NULL,
                email VARCHAR(255) UNIQUE NOT NULL
            )
        `);

        await client.query(`
            CREATE TABLE IF NOT EXISTS professors (
                id UUID PRIMARY KEY,
                first_name VARCHAR(255) NOT NULL,
                last_name VARCHAR(255) NOT NULL,
                email VARCHAR(255) UNIQUE NOT NULL
            )
        `);

        console.log('Tables created successfully');
    } catch (err) {
        console.log(err);
    }
}