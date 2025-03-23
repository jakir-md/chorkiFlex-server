require("dotenv").config();
const express = require("express");
const cors = require("cors");

const port = process.env.PORT || 5000;
const app = express();

app.use(cors());
app.use(express.json());

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.hmig4.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

// 12:34 AM
async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });

    const movieCollection = client.db("chorkiFlex").collection("allmovies");
    const userCollection = client.db("chorkiFlex").collection("allusers");
    const favouriteCollection = client
      .db("chorkiFlex")
      .collection("favouritemovies");

    app.get("/movies", async (_req, res) => {
      const movies = movieCollection.find();
      const result = await movies.toArray();
      res.send(result);
    });

    app.get("/featuredmovies", async (req, res) => {
      console.log("featured Hit");
      const movies = movieCollection.find().sort({ rating: -1 }).limit(6);
      const result = await movies.toArray();
      res.send(result);
    });

    app.delete("/movie/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await movieCollection.deleteOne(query);
      res.send(result);
    });

    app.delete("/favourite/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await favouriteCollection.deleteOne(query);
      res.send(result);
    });

    app.post("/movies", async (req, res) => {
      const movie = req.body;
      const result = await movieCollection.insertOne(movie);
      res.send(result);
    });

    app.post("/user", async (req, res) => {
      const email = req.body.email;
      const query = { email };
      const result = await userCollection.findOne(query);
      res.send(result);
    });

    app.put("/user", async (req, res) => {
      const user = req.body;
      const result = await userCollection.insertOne(user);
      res.send(result);
    });

    app.post("/favourite", async (req, res) => {
      const item = req.body;
      const result = await favouriteCollection.insertOne(item);
      res.send(result);
    });

    app.post("/favouriteall", async (req, res) => {
      const favEmail = req.body.email;
      const query = { favEmail };
      const favouriteMovies = favouriteCollection.find(query);
      const result = await favouriteMovies.toArray();
      res.send(result);
    });

    app.get("/details/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await movieCollection.findOne(query);
      res.send(result);
    });

    app.patch("/user", async (req, res) => {
      const user = req.body;
      const filter = { email: user.email };
      const updatedDoc = {
        $set: {
          lastSignInTime: user.lastSignInTime,
        },
      };

      const result = await userCollection.updateOne(filter, updatedDoc);
      res.send(result);
    });

    app.patch("/movie", async (req, res) => {
      const id = req.body.id;
      const filter = { _id: new ObjectId(id) };
      const updateDoc = {
        $set: {
          poster: req.body.poster,
          movieTitle: req.body.movieTitle,
          genre: req.body.genre,
          duration: req.body.duration,
          releaseYear: req.body.releaseYear,
          rating: req.body.rating,
          summary: req.body.summary,
          updateMail: req.body.updateMail
        }
      };

      const result = await movieCollection.updateOne(filter, updateDoc);
      res.send(result);
    });

    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("ChorkiFlex is Connected.");
});

app.listen(port, () => {
  console.log(`Listening from the port number: ${port}`);
});
