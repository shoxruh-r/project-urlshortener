require('dotenv').config()
const express = require('express')
const cors = require('cors')
const dns = require('dns')
const app = express()

// Basic Configuration
const port = process.env.PORT || 3000

const shortUrls = []

app.use(cors())

app.use('/public', express.static(`${process.cwd()}/public`))
app.use(express.urlencoded({ extended: false }))

app.get('/', (req, res) => {
  res.sendFile(process.cwd() + '/views/index.html')
})

// You can POST a URL to /api/shorturl and get a JSON response with original_url and short_url properties
app.post('/api/shorturl', (req, res) => {
  const { url } = req.body

  if (url.includes('boilerplate-project-urlshortener.shoxruhr.repl.co'))
    return res.json({ error: "invalid url" })

  const domain = url.split(/https?:\/\/(www.)?/)

  dns
    .lookup(domain[domain.length - 1], error => {
      if (error) return res.json({ error: "invalid url" })

      shortUrls.push(url)
      res.json({ original_url: url, short_url: shortUrls.length })
    })
})

// When you visit /api/shorturl/<short_url>
app.get('/api/shorturl/:shorturl', (req, res) => {
  const url = shortUrls[Number(req.params.shorturl) - 1]

  res.redirect(url)
})

app.listen(port, () => {
  console.log(`Listening on port ${port}`)
})
