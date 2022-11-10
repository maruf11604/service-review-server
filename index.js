const express = require("express");
const cors = require("cors");
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const port = process.env.PORT || 5000;

//middlewire

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.hai1jds.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri);
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    const serviceCollection = client.db("allServiceReview");
    // .collection("services", "reviews");
    const service = serviceCollection.collection("services");
    const review = serviceCollection.collection("reviews");

    app.get("/services", async (req, res) => {
      const query = {};
      const cursor = service.find(query);
      const services = await cursor.limit(3).toArray();
      res.send(services);
    });

    app.get("/allservices", async (req, res) => {
      const query = {};
      const cursor = service.find(query);
      const services = await cursor.toArray();
      res.send(services);
    });

    app.get("/services/:id", async (req, res) => {
      const id = req.params.id;
      // console.log(data);
      const query = { _id: ObjectId(id) };
      const services = await service.findOne(query);
      res.send(services);
    });

    app.post("/reviews", async (req, res) => {
      const user = req.body;
      console.log(user);
      const result = await review.insertOne(user);
      res.send(result);
    });

    app.get("/reviews", async (req, res) => {
      const query = {};
      const cursor = review.find(query);
      const reviews = await cursor.toArray();
      res.send(reviews);
    });
    app.patch("/reviews/:id", async (req, res) => {
      const id = req.params.id;
      const status = req.body.status;
      const query = {
        _id: ObjectId(id),
      };
      const updateDoc = {
        $set: {
          status: status,
        },
      };
      const result = await review.updateOne(query, updateDoc);
      res.send(result);
    });
    app.delete("/reviews/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await review.deleteOne(query);
      res.send(result);
    });

    app.post("/allservices", (req, res) => {
      const order = req.body;
      const result = service.insertOne(order);
      res.send(result);
    });
  } finally {
  }
}
run().catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.send("service website app is running");
});

app.listen(port, () => {
  console.log(`app listining on port ${port}`);
});
