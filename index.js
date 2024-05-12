const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const { MongoClient, ObjectId } = require('mongodb');
require('dotenv').config();
const jwt = require('jsonwebtoken');

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection URL
const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        // Connect to MongoDB
        await client.connect();
        console.log("Connected to MongoDB");

        const db = client.db('portfolio');
        const collection = db.collection('users');
        const skillsCollection = db.collection('skills');
        const projectsCollection = db.collection('projects');
        const blogsCollection = db.collection('blogs');


        // User Registration
        app.post('/api/v1/register', async (req, res) => {
            const { name, email, password } = req.body;

            // Check if email already exists
            const existingUser = await collection.findOne({ email });
            if (existingUser) {
                return res.status(400).json({
                    success: false,
                    message: 'User already exists'
                });
            }

            // Hash the password
            const hashedPassword = await bcrypt.hash(password, 10);

            // Insert user into the database
            await collection.insertOne({ name, email, password: hashedPassword });

            res.status(201).json({
                success: true,
                message: 'User registered successfully'
            });
        });

        // User Login
        app.post('/api/v1/login', async (req, res) => {
            const { email, password } = req.body;

            // Find user by email
            const user = await collection.findOne({ email });
            if (!user) {
                return res.status(401).json({ message: 'Invalid email or password' });
            }

            // Compare hashed password
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                return res.status(401).json({ message: 'Invalid email or password' });
            }
            // Generate JWT token
            const token = jwt.sign({ email: user.email, name: user.name }, process.env.JWT_SECRET, { expiresIn: process.env.EXPIRES_IN });

            res.json({
                success: true,
                message: 'Login successful',
                token
            });
        });


        // ----------inset skills data into database-------------
        app.post('/api/v1/skill', async (req, res) => {
            const body = req.body
            const result = await skillsCollection.insertOne(body);
            res.json(result)
        })

        // Get all skills
        app.get('/api/v1/skill', async (req, res) => {
            const result = await skillsCollection.find().toArray();
            res.json(result)
        });

        // Delete Skills by using id
        app.delete("/api/v1/skill/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await skillsCollection.deleteOne(query)
            res.send(result)
        })


        // Get single skills searching by Id
        app.get('/api/v1/skill/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await skillsCollection.findOne(query)
            res.json(result)
        })

        // update skill data form database-----------//
        app.patch('/api/v1/skill/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const updateSkill = req.body;
            const skill = {
                $set: {
                    ...updateSkill
                }
            }
            const result = await skillsCollection.updateOne(query, skill)
            res.json(result)

        })


        // ----------inset projects data into database-------------
        app.post('/api/v1/project', async (req, res) => {
            const body = req.body
            const result = await projectsCollection.insertOne(body);
            res.json(result)
        })

        // Get single project searching by Id
        app.get('/api/v1/project/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await projectsCollection.findOne(query)
            res.json(result)
        })

        // Get all projects
        app.get('/api/v1/project', async (req, res) => {
            const result = await projectsCollection.find().toArray();
            res.json(result)
        });

        // Delete Projects by using id
        app.delete("/api/v1/project/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await projectsCollection.deleteOne(query)
            res.send(result)
        })

         // update skill data form database-----------//
         app.patch('/api/v1/project/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const updateSkill = req.body;
            const toys = {
                $set: {
                    ...updateSkill
                }
            }
            const result = await projectsCollection.updateOne(query, toys)
            res.json(result)

        })


        // ----------inset blogs data into database-------------
        app.post('/api/v1/blog', async (req, res) => {
            const body = req.body
            const result = await blogsCollection.insertOne(body);
            res.json(result)
        })


        // Get all blogs
        app.get('/api/v1/blog', async (req, res) => {
            const result = await blogsCollection.find().toArray();
            res.json(result)
        });

        // Delete Projects by using id
        app.delete("/api/v1/blog/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await blogsCollection.deleteOne(query)
            res.send(result)
        })

        // Get blog searching by Id
        app.get('/api/v1/blog/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await blogsCollection.findOne(query)
            res.json(result)
        })

         // update skill data form database-----------//
         app.patch('/api/v1/blog/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const updateBlog = req.body;
            const blog = {
                $set: {
                    ...updateBlog
                }
            }
            const result = await blogsCollection.updateOne(query, blog)
            res.json(result)

        })






        // Start the server
        app.listen(port, () => {
            console.log(`Server is running on `);
        });

    } finally {
    }
}

run().catch(console.dir);

// Test route
app.get('/', (req, res) => {
    const serverStatus = {
        message: 'Server is running smoothly',
        timestamp: new Date()
    };
    res.json(serverStatus);
});