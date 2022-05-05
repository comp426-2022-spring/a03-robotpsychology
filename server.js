const express = require("express")
const minimist = require("minimist")
const Coin = require("./modules/coin.js")

const app = express()
const args = minimist(process.argv.slice(2))
const port = args.port || 5000

const server = app.listen(port, () => {
  console.log(`App is running on ${port}`)
})

const logging = (req, res, next) => {
  console.log(`${req.ip} - - `)
  next()
}

app.get("/app/", (req, res) => {
  console.log("hello")
  // Respond with status 200
  res.statusCode = 200

  // Respond with status message "OK"
  res.statusMessage = "OK"
  res.writeHead(res.statusCode, { "Content-Type": "text/plain" })
  res.end(`${res.statusCode} ${res.statusMessage}`)
})

// regex version
app.get("/app/echo/:number([0-9]{1,4})", (req, res) => {
  res.status(200).json({ message: req.params.number })
})

app.get("/app/flip/", (req, res) => {
  const flip = Coin.coinFlip()
  res.status(200).header({ "Content-Type": "text/json" }).json({ flip: flip })
})

app.get("/app/flips/:number([0-9]{1,4})", (req, res) => {
  try {
    const flips = Coin.coinFlips(req.params.number)
    const flipCount = Coin.countFlips(flips)
    res
      .status(200)
      .header({ "Content-Type": "text/json" })
      .json({ raw: flips, summary: flipCount })
  } catch {
    res.statusCode = 400
    res.statusMessage = "Invalid argument. Argument must be a number."
    res.writeHead(res.statusCode, { "Content-Type": "text/plain" })
    res.end(`${res.statusCode} ${res.statusMessage}`)
  }
})

// regex version
app.get("/app/flip/call/:guess(heads|tails)/", (req, res) => {
  const game = Coin.flipACoin(req.params.guess)
  res.status(200).header({ "Content-Type": "text/json" }).json(game)
})

app.use(logging)

// Default response for any other request
// This must be at the end
app.use(function (req, res) {
  res.status(404).send("404 NOT FOUND")
})
