const express = require("express");
const app = express();
const MongoClient = require("mongodb").MongoClient;
const ObjectID = require("mongodb").ObjectID;
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();

// Define Port Number
const port = process.env.PORT || 8080;

// Use Cors and bodyParser
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World");
});

// MongoDB Connection
const uri = process.env.MONGODB_URL;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
client.connect((err) => {
  console.log(
    `${!!err ? "Database Connection Failed" : "Database Connection Successful"}`
  );
  const todosCollection = client.db("ToDo_App").collection("todos");

  // Get All Todos
  app.get("/todos", (req, res) => {
    todosCollection.find({}).toArray((err, todos) => {
      if (err) {
        res.send(err);
      } else {
        res.send(todos);
      }
    });
  });

  // Insert Todo
  app.post("/todos", (req, res) => {
    todosCollection.insertOne(req.body, (err, result) => {
      if (err) {
        res.send(err);
      } else {
        res.send(result);
      }
    });
  });

  // Update Todo
  app.patch("/todos/:id", (req, res) => {
    todosCollection.updateOne(
      { _id: ObjectID(req.params.id) },
      { $set: { status: req.body.status } },
      (err, result) => {
        if (err) {
          res.send(err);
        } else {
          res.send(result);
        }
      }
    );
  });

  // Delete Todo
  app.delete("/todos/:id", (req, res) => {
    todosCollection.deleteOne(
      { _id: ObjectID(req.params.id) },
      (err, result) => {
        if (err) {
          res.send(err);
        } else {
          res.send(result);
        }
      }
    );
  });
});

app.listen(port, () => {
  console.log(`App Listening at http://localhost:${port}`);
});
