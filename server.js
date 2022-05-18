const express = require("express");
const app = express();
const MongoClient = require("mongodb").MongoClient;
const ObjectID = require("mongodb").ObjectID;
const cors = require("cors");
require("dotenv").config();

// Define Port Number
const port = process.env.PORT || 8080;

// Use Cors and bodyParser
app.use(cors({
  "origin": "*",
  "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
  "preflightContinue": false,
  "optionsSuccessStatus": 204
}));
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

  // Get Specific User Todo
  app.get("/todos", (req, res) => {
    todosCollection.find({ email: req.query.email }).toArray((err, todos) => {
      if (err) {
        res.send(err);
      } else {
        res.send(todos);
      }
    });
  });

  // Get All Todos
  app.get("/all-todos", (req, res) => {
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
        res.send({
          status: 1,
          message: "Todo Inserted Successfully",
        });
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
          res.send({
            status: 1,
            message: "Todo Updated Successfully",
          });
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
          res.send({
            status: 1,
            message: "Todo Deleted Successfully",
          });
        }
      }
    );
  });
});

app.listen(port, () => {
  console.log(`App Listening at http://localhost:${port}`);
});
