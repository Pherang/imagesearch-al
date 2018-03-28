const express = require('express'),
      fetch = require('node-fetch'),
      MongoClient = require('mongodb').MongoClient,
      app = express()

const appPort = process.env.PORT || 8080 
const collection = 'searchterms'
const dbUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/imgsearches'

// Google CSE requirements
const apiKey = '?key=AIzaSyCmT28HdQ5rFGu2lmO9NLpcoB_fCf7zJRU'
const cseURL = 'https://www.googleapis.com/customsearch/v1'
const cx = '&cx=009512028575894100740:rcixtm-hojw' 
const qParam = '&q='
const imgSearchType = '&searchType=image'
const filterFields = '&fields=items(title,link,displayLink,snippet)'

//local config
const dbName = 'imgsearches'

//heroku config
//const dbName = 'heroku_dwmfsp7n'

MongoClient.connect(dbUri, (err,client) => {
  const db = client.db(dbName)

  app.get('/', (req,res) => {
    res.send('<h1>Image Search</h1>')
  })

  app.get('/api/imagesearch/:userQuery', (req,res) => {

  let encodedCseUrl=(cseURL+apiKey+cx+imgSearchType+filterFields+qParam+encodeURIComponent(req.params.userQuery))

    fetch(encodedCseUrl).then( (response) => {
      return response.json()
    }).then((response) => {
      
      let answer = JSON.stringify(response, null, 2) // Format the JSON for readability
      res.set('content-type','text/plain')      // Need to do this as content-type HTML ignores spacing
      res.send(answer) 
    }).catch((error) => {
      console.log(error)
      res.status(500).send('Error, error')
    })

    let newDate = new Date(Date.now())

    searchDate = newDate.toUTCString()
    let searchRecord = { term: req.params.userQuery,
                         when: searchDate }
    console.log(JSON.stringify(searchRecord))
    // Store the search term in the database
    db.collection(collection).insertOne(searchRecord)
  })

  app.get('/api/latest/imagesearch/', (req,res) => {
   
    async function getLatest() {

      let termsList = {}
      let latestTerms = await db.collection(collection).find().project({ 'term' : 1, 'when': 1, '_id' : 0}).sort({ when: 1}).toArray()
      
      console.log(latestTerms)  
      //await latestTerms.next()
      //let aTerm = await latestTerms.next()
      //console.log(aTerm)
      termsList = JSON.stringify(latestTerms, null, 2) 
      res.set('Content-Type','text/plain')
      res.send(termsList)
    }

    getLatest().catch( (error) => {
      console.log(error)
      res.status(500).end()
    })

  })

  let server = app.listen(appPort, () => {
    console.log('Server listening on %s.', appPort)
  })

  app.use( (req,res,next) => {
    res.send('Please go to the homepage for instructions')
  })

})
