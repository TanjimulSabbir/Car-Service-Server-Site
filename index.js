const express = require("express");
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require("cors");
require('dotenv').config();
const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log("Listening to port", port);
})

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.hbxlbdz.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        const userCollections = client.db("carService").collection("services");
        const OrderUserCollections = client.db("carService").collection("order");

        app.get("/services", async (req, res) => {
            const query = {};
            const cursor = userCollections.find(query);
            const result = await cursor.toArray();
            res.send(result)
        });
        app.get("/services/:id", async (req, res) => {
            const id = req.params.id
            const query = { _id: ObjectId(id) };
            const cursor = await userCollections.findOne(query);
            // const result =  cursor.toArray();
            res.send(cursor)
        });

        // post data to database
        app.post("/services", async (req, res) => {
            const userData = req.body;
            const result = await userCollections.insertOne(userData);
            res.send(result)
        })

        // Delete data
        app.delete("/services/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const DeleteResult = await userCollections.deleteOne(query);
            res.send(DeleteResult)
        });

        // Update data
        app.put("/services/:id", async (req, res) => {
            const id = req.params.id;
            const userData = req.body;
            const query = { _id: ObjectId(id) };
            const options = { upsert: true };
            const UpdatedDoc = {
                $set: userData
            }
            const UpdateUser = await userCollections.updateOne(query, UpdatedDoc, options);
            res.send(UpdateUser);
            console.log(
                `${UpdateUser.matchedCount} document(s) matched the filter, updated ${UpdateUser.modifiedCount} document(s)`,
            );
        });

        // order post

        app.post("/order", async (req, res) => {
            const userData = req.body;
            const result = await OrderUserCollections.insertOne(userData);
            res.send(result)
        });
        // order get
        app.get("/order", async (req, res) => {
            const email = req.query.email;
            console.log(email);
            const query = { email: email };
            const cursor = OrderUserCollections.find(query);
            const result = await cursor.toArray();
            res.send(result)
        })
    }
    finally {

    }
}
run().catch(console.dir)

app.get("/", (req, res) => {
    console.log("DB is connected")
    res.send("Car Server is Running")
})