const express = require('express'),
      MongoClient = require('mongodb').MongoClient,
      app = express()

const appPort = process.env.PORT || 8080 
const collection = 'searchterms'
const dbUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/imgsearches'

//local config
const dbName = 'imgsearches'

//heroku config
//const dbName = 'heroku_dwmfsp7n'

MongoClient.connect(dbUri, (err,client) => {
  const db = client.db(dbName)

  app.get('/', (req,res) => {
    res.send('<h1>Image Search</h1>')
  })

  app.get('/api/imagesearch/', (req,res) => {
    res.send('<h2>Find images!</h2>')
  })

  app.get('/api/latest/imagesearch/', (req,res) => {
    res.send('<h2>Latest Searches</h2>')
  })

  let server = app.listen(appPort, () => {
    console.log('Server listening on %s.', appPort)
  })

  app.use( (req,res,next) => {
    res.send('Please go to the homepage for instructions')
  })

})
