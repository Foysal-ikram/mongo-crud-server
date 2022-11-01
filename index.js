const express = require('express') ;
const cors = require('cors') ;
const app = express() ;
const port = process.env.PORT || 5000 ;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

// ----------Middle wire-------
app.use(cors()) ;
app.use(express.json());
//  ---------------------------- //

// ---------Mongodb Connection erver-------


const uri = "mongodb+srv://crud-client:qrDjOqOVO50tcoQs@cluster0.tngy8ld.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
 
async function run(){
 
  try{
    const userCollection = client.db('nodeMongoCrud').collection('users') ;

    // -----------------post kora data API hisabe dekhanor jonno. Eta na korle data Mongodb te save hb kintu api hisabe dekhabe na------------
    app.get('/users', async (req, res) => {
      const query = {};
      const cursor = userCollection.find(query);
      const users = await cursor.toArray();
      res.send(users);
  });
// -----------------------------------------end-----------------------------------------------------------------------------------------------------

  app.get('/users/:id' , async (req, res)=>{
    const id = req.params.id ;
    const query = { _id: ObjectId(id)};
    const user = await userCollection.findOne(query) ;
    res.send(user)
    //ekhane amra 1ta single id er jonno alada route banailam. jekhane gele oi 1ta object k pabo

  })



  // -----------------Post data from client side---------
  //ekhane data post hb. mongodb te User create hb. but API create hb na. API create korte hl (app.get + query) diye banate hb. Uporer moto
    app.post('/users', async (req, res) => {
      const user = req.body;
      console.log(user);
      const result = await userCollection.insertOne(user)
      res.send(result);
  });
  // -----------------Post data ends-----------------

  app.delete('/users/:id' , async (req,res)=>{
    const id = req.params.id ;
    console.log('trying to delete: ' , id)
    const query = {_id: ObjectId(id)} ;
    const result = await userCollection.deleteOne(query)
    res.send(result)
  })

// ---------------------------Data update start------------
app.put('/users/:id', async (req, res) => {
  const id = req.params.id;
  const filter = { _id: ObjectId(id) };
  const user = req.body;
  const option = {upsert: true};
  const updatedUser = {
      $set: {
          name: user.name,
          email: user.email
      }
  }
  const result = await userCollection.updateOne(filter, updatedUser, option);
  res.send(result);
})


  }
  finally{

  }
 }
run().catch(console.dir) ;

app.get('/' , (  req , res) => {
 res.send('Hello from mongo crud ')
})



app.listen(port , ()=>{
    console.log(`Listening to port ${port}`)
})

// password : qrDjOqOVO50tcoQs    
// username : crud-client