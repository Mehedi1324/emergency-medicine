const express = require('express');
const app = express();
const port = process.env.PORT || 1010;
const cors = require('cors');
require('dotenv').config();

//  Middleware___________

app.use(cors());
app.use(express.json());

// _______________
app.get('/', (req, res) => {
  res.send('Hello node how are you');
});

const { MongoClient, ObjectId } = require('mongodb');
// Replace the uri string with your MongoDB deployment's connection string.
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.cgyk5.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri);
async function run() {
  try {
    await client.connect();
    const database = client.db('Medi-kits');
    const cardCollection = database.collection('card-products');
    const featureCollection = database.collection('feature-products');
    const newCollection = database.collection('new-products');

    // Latest Products ______________

    app.get('/latest', async (req, res) => {
      const cursor = newCollection.find({});
      const product = await cursor.toArray();
      res.send(product);
    });
    // Finding single product from stored products______

    app.get('/product/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const product =
        (await featureCollection.findOne(query)) ||
        (await newCollection.findOne(query));
      res.send(product);
    });

    // Feature Products ______________

    app.get('/feature', async (req, res) => {
      const cursor = featureCollection.find({});
      const product = await cursor.toArray();
      res.send(product);
    });
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log('listening to the port', port);
});
