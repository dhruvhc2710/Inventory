const express = require("express");
const { MongoClient, ServerApiVersion } = require("mongodb");
const cors = require("cors");

const app = express();
const port = 3002;

// Middleware
app.use(express.json());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
});


// MongoDB connection
const uri = process.env.MONGO_URI;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

app.post("/update-cigarette", async (req, res) => {
  const { name, qty } = req.body;

  console.log("Received request:", req.body);
  try {
    await client.connect();
    console.log("dbConnected");
    const database = client.db("inventory");
    const collection = database.collection("ciggarates");

    const result = await collection.updateOne(
      { name }, 
      { $set: { name, qty } }, 
      { upsert: true }
    );

    res.status(200).send(result);
  } catch (error) {
    res.status(500).send("Error updating database: " + error.message);
  } finally {
    await client.close();
  }
});

app.get("/get-cigarettes", async (req, res) => {
    try {
      await client.connect();
      console.log("dbConnected");
      const database = client.db("inventory");
      const collection = database.collection("ciggarates");
  
      const cigarettes = await collection.find({}).toArray();
  
      res.status(200).json(cigarettes);
    } catch (error) {
      res.status(500).send("Error fetching data: " + error.message);
    } finally {
      await client.close();
    }
  });
  

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
