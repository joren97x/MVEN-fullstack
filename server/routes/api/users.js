const express = require('express')
const mongodb = require('mongodb')
const {MongoClient, ServerApiVersion} = require('mongodb')
const uri = "mongodb+srv://joren:ataypiste@cluster0.mxuwv7e.mongodb.net/?retryWrites=true&w=majority"

const router = express.Router()

router.get('/', async (req, res) => {
    const users = await loadCustomerCollection()
    // res.send(await users.find({}).toArray())
    res.send(await users.find().toArray())
})

router.post('/', async (req, res) => {
  const users = await loadCustomerCollection()
  await users.insertOne({
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    email: req.body.email,
    created_at: new Date()
  })
  res.status(201).send()
})

router.delete('/:id', async (req, res) => {
    const users = await loadCustomerCollection()
    await users.deleteOne({_id: new mongodb.ObjectId(req.params.id) })
    res.status(200).send()
})

router.put('/:id', async (req, res) => {
  const users = await loadCustomerCollection()
  await users.updateOne({
    _id: new mongodb.ObjectId(req.params.id)
  }, {
    $set: {
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      email: req.body.email
    }
  })
  res.status(200).send()
})

async function loadCustomerCollection() {
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
          await client.connect();
          // Send a ping to confirm a successful connection
          await client.db("admin").command({ ping: 1 });
          console.log("Pinged your deployment. You successfully connected to MongoDB!");
        } finally {
          // Ensures that the client will close when you finish/error
          await client.close();
        }
      }
      run().catch(console.log('ok pre 200'));
      return client.db('crm_db').collection('users')
}

module.exports = router