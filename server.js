const express = require('express')
const mongoose = require('mongoose')
const ShortUrl = require('./models/shortUrl')
const shortUrl = require('./models/shortUrl')
const app = express()

mongoose.connect('mongodb://localhost/urlShortener', {
  useNewUrlParser: true, useUnifiedTopology: true
})

app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: false }))

app.get('/', async (req, res) => {
  const shortUrls = await ShortUrl.find()
  res.render('index', { shortUrls: shortUrls })
})

app.post('/shortUrls', async (req, res) => {
  try{
    await ShortUrl.create({ full: req.body.fullUrl })
    res.redirect('/')
  }
  catch(err){
    console.log(err)
    res.redirect('/')
  }
})

app.get('/:shortUrl', async (req, res) => {
  const shortUrl = await ShortUrl.findOne({ short: req.params.shortUrl })
  if (shortUrl == null) return res.sendStatus(404)

  shortUrl.clicks++
  shortUrl.save()

  res.redirect(shortUrl.full)
})
app.post('/shortUrls/:id', async (req, res) => {
  try{
    await ShortUrl.findByIdAndDelete(req.params.id)
    res.redirect('/')
  }
  catch(err){
    console.log(err)
    res.redirect('/')
  }
})
//update method
app.post('/shortUrls/:id', async (req, res) => {
  try{
    await ShortUrl.findByIdAndUpdate(req.params.id, { full: req.body.fullUrl })
    res.redirect('/')
  }
  catch(err){
    console.log(err)
    res.redirect('/')
  }
})





app.listen(process.env.PORT || 3000);