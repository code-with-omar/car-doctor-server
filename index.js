const express = require('express')
const cors = require('cors')
const jwt = require('jsonwebtoken')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb')
require('dotenv').config()
const app = express()
const port = process.env.PORT || 5000;

//middleware

app.use(cors({
    //this origin and credentials set up for cookies becouse cookies is work in same port but my server and client side ar work in difference port 
    origin: ['http://localhost:5173'],
    credentials: true

}));
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.yziu76d.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
        await client.connect();
        const serviceCollection = client.db("carDoctor").collection("services")
        const bookingCollection = client.db("carDoctor").collection("bookings")
        const productCollection = client.db("carDoctor").collection("products")
        const productOrderCollection = client.db("carDoctor").collection("productsOrders")
        // create webtoken
        app.post('/jwt', async (req, res) => {
            const user = req.body
            const token = jwt.sign(user, process.env.ACCESS_TOKEN, { expiresIn: '1h' })
            res
                .cookie('token', token, {
                    httpOnly: true,
                    secure: false,
                    sameSite: 'none',

                })
                .send({ success: true })
        })
        app.get('/services', async (req, res) => {
            const cursor = serviceCollection.find();
            const result = await cursor.toArray()
            res.send(result)
        })

        // find single service with specific data
        app.get('/order/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const options = {
                projection: { service_id: 1, title: 1, price: 1, img: 1 },
            };
            const result = await serviceCollection.findOne(query, options)
            res.send(result)
        })
        // find single service 
        app.get('/service/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await serviceCollection.findOne(query)
            res.send(result)
        })
        // Add single service
        app.post('/addServices', async (req, res) => {
            const services = req.body;
            if (Array.isArray(services)) {
                const result = await serviceCollection.insertMany(services);
                res.send(result);
            } else {
                const result = await serviceCollection.insertOne(services);
                res.send(result);
            }
        });
        // customer order create API
        app.post('/bookings', async (req, res) => {
            const booking = req.body;
            const result = await bookingCollection.insertOne(booking)
            res.send(result)
        })
        // single booking find
        app.get('/bookings', async (req, res) => {

            let query = {};
            if (req.query.email) {
                query = { email: req.query.email }
            }
            const result = await bookingCollection.find(query).toArray();
            res.send(result)
        })

        // Update
        app.patch('/bookings/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) }
            const updatedBooking = req.body;
            const updateDoc = {
                $set: {
                    status: updatedBooking.status
                },
            };
            const result = await bookingCollection.updateOne(filter, updateDoc)
            res.send(result)
        })

        // delete booking
        app.delete('/bookings/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await bookingCollection.deleteOne(query);
            res.send(result)
        })

        // products  post
        app.post('/productsCreates', async (req, res) => {
            const products = req.body;
            const result = await productCollection.insertOne(products);
            res.send(result)
        })
        // products find api
        app.get('/products', async (req, res) => {
            const cursor = productCollection.find();
            const result = await cursor.toArray()
            res.send(result)
        })
        // products single  api

        app.get('/products/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await productCollection.findOne(query)
            res.send(result)
        })
        // product order api
        app.post('/productsOrder', async (req, res) => {
            const productsOrder = req.body;
            const result = await productOrderCollection.insertOne(productsOrder)
            res.send(result)
        })
        //find order product
        app.get('/orders', async (req, res) => {

            let query = {};
            if (req.query.email) {
                query = { email: req.query.email }
            }
            const result = await productOrderCollection.find(query).toArray();
            res.send(result)
        })

        // delete products order
        app.delete('/orders/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await productOrderCollection.deleteOne(query);
            res.send(result)
        })
        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('Server is running')
})
app.listen(port, () => {
    console.log(`Car doctor server is running in port ${port}`)
}) 