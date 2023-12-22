const express = require('express')
const app = express()
const port = process.env.PORT || 5000;
const cors = require('cors');

// middleware
app.use(cors())
app.use(express.json())
require('dotenv').config()


const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.6rjuyq3.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        // await client.connect();

        // database
        const database = client.db("ALLTaskes");
        const taskcollections = database.collection("AllTask");
        const todotaskcollections = database.collection("ToDoTask");
        const donetaskcollections = database.collection("DoneTask");


        // all users for admin
        app.get('/tasks', async (req, res) => {
            const cursor = taskcollections.find()
            const result = await cursor.toArray();
            res.send(result)

        })
        // taskpost
        app.post('/tasks', async (req, res) => {
            const task = req.body;
            const result = await taskcollections.insertOne(task);
            res.send(result)

        })

        app.get('/tasks/:id', async (req, res) => {
            const email = req.params.id
            const query = { useremail: email };
            const user = await taskcollections.find(query).toArray();
            res.send(user)
          })

        // todotaskpost
        app.post('/todotasks', async (req, res) => {
            const task = req.body;
            const result = await todotaskcollections.insertOne(task);
            res.send(result)

        })

        app.get('/todotasks/:id', async (req, res) => {
            const email = req.params.id
            const query = { useremail: email };
            const user = await todotaskcollections.find(query).toArray();
            res.send(user)
          })

        // done task
        app.post('/donetasks', async (req, res) => {
            const task = req.body;
            const result = await donetaskcollections.insertOne(task);
            res.send(result)

        })
        app.get('/donetasks/:id', async (req, res) => {
            const email = req.params.id
            const query = { useremail: email };
            const user = await donetaskcollections.find(query).toArray();
            res.send(user)
        })
        

        // Send a ping to confirm a successful connection
        // await client.db("admin").command({ ping: 1 });
        // console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Users management server is running')
})

app.listen(port, () => {
    console.log(`Server is running on ${port}`)
})
