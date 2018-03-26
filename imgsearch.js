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
    let abstractList
    let encodedCseUrl = (cseURL + apiKey + cx + imgSearchType + filterFields + qParam +  encodeURIComponent(req.params.userQuery) )
    fetch(encodedCseUrl).then( (response) => {
      return response.json()
    }).then((response) => {
      console.log(response)
      abstractList = response
      console.log(abstractList)
      let answer = JSON.stringify(abstractList, null, 2)
      console.log(answer)
      res.set('content-type','text/plain')
      res.send(answer) 
      //res.end(answer)
    }).catch((error) => {
      console.log(error)
    })

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
