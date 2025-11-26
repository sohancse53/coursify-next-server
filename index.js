const express = require('express');
const app = express()
const port = process.env.PORT || 5000;
const cors = require('cors');
require('dotenv').config();

// middleware
app.use(cors())
app.use(express.json())



app.get('/',(req,res)=>{
res.send('coursify connected')
})






const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.hjbjloq.mongodb.net/?appName=Cluster0`;

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
    // await client.connect();

    // write apis here
    const db = client.db('coursifyDB');
    const courseCollection = db.collection('course');


    // get all course 
    app.get('/course',async(req,res)=>{
        const {email,search} = req.query;
        console.log(email);
        
        const query = {}
        if(email){
            query.email = email;
        }
        if(search){
          query.title = {$regex:search,$options:"i"};
        }
        const cursor = courseCollection.find(query).sort({date:-1});
        const result = await cursor.toArray();
        res.send(result);
    })

    // get specific course by id
     app.get('/course/:id',async(req,res)=>{
        const id = req.params.id;
        const query = {_id:new ObjectId(id)}
        const result = await courseCollection.findOne(query);
        res.send(result);
    })

    // post a course
    app.post('/course',async(req,res)=>{
        const newCourse = req.body;
        console.log(newCourse);
        const result = await courseCollection.insertOne(newCourse);
        res.send(result);
        
    })

    // delete a course 
    app.delete('/course/:id',async(req,res)=>{
      const id = req.params.id;
      const query = {_id:new ObjectId(id)}
      const result = await courseCollection.deleteOne(query);
      res.send(result);
    })

    // await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);







app.listen(port,()=>{
    console.log('connected at port-',port);
    
})



