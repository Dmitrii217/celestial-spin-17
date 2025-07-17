import express from 'express'
import cors from 'cors'
import path from 'path'
import { fileURLToPath } from 'url'
import { Low } from 'lowdb'
import { JSONFile } from 'lowdb/node'

// Setup __dirname
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Setup LowDB to read the same db.json as the bot
const file = path.join(__dirname, '../bot/db.json')
const adapter = new JSONFile(file)
const db = new Low(adapter, { users: {} })

// Init Express
const app = express()
app.use(cors()) // allow frontend to call API
const PORT = 3000

// Read the DB on server start
await db.read()

// GET /api/balance/:userId — returns balance + nextSpin
app.get('/api/balance/:userId', async (req, res) => {
  const userId = req.params.userId
  const user = db.data.users[userId]

  if (!user) {
    return res.json({ balance: 0, nextSpinTime: 0 })
  }

  const { balance, lastSpin } = user
  const nextSpinTime = lastSpin + 4 * 60 * 60 * 1000 // 4 hours later

  return res.json({ balance, nextSpinTime })
})

app.listen(PORT, () => {
  console.log(`🚀 Backend API running at http://localhost:${PORT}`)
})

