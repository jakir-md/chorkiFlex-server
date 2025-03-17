require('dotenv').config();
const express = require('express');
const cors = require('cors');

const port = process.env.PORT || 5000;
const app = express();

app.use(cors());
app.use(express.json());

const { MongoClient, ServerApiVersion } = require('mongodb');

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.hmig4.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

// 12:34 AM
async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });

    const movieCollection = client.db('chorkiFlex').collection('allmovies');
    const userCollection = client.db('chorkiFlex').collection('allusers');

    app.get('/movies', async (_req, res) => {
        const movies = movieCollection.find();
        const result = await movies.toArray();
        res.send(result);
    })

    app.post("/movie", async (req, res) => {
        const movie = req.body;
        const result = await movieCollection.insertOne(movie);
        res.send(result);
    })
    


    // user related routes
    app.put("/user", async (req, res) => {
        const user = req.body;
        const result = await userCollection.insertOne(user);
        res.send(result);
    })

    app.patch("/user", async(req, res)=>{
        const user = req.body;
        const filter = {email:user.email};
        const updatedDoc = {
            $set: {
                lastSignInTime: user.lastSignInTime
            }
        }

        const result = await userCollection.updateOne(filter, updatedDoc);
        res.send(result);
    })


    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.listen(() => {
    console.log(`Listening from the port number: ${port}`);
});