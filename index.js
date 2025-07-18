import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

import { getBalanceForUser, getNextSpinTimeForUser, spin } from './services/dataService.js'

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())

// API endpoint: get user balance and next spin time
app.get('/api/balance/:userId', (req, res) => {
  const { userId } = req.params
  const balance = getBalanceForUser(userId)
  const nextSpinTime = getNextSpinTimeForUser(userId)
  res.json({ balance, nextSpinTime })
})

// API endpoint: perform a spin for user
app.post('/api/spin/:userId', async (req, res) => {
  const { userId } = req.params
  const reward = await spin(userId)
  if (reward === false) {
    // Still in cooldown
    const nextSpinTime = getNextSpinTimeForUser(userId)
    return res.status(429).json({ error: 'Cooldown active', nextSpinTime })
  }
  res.json({ reward })
})

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log(`🚀 Backend API running at http://localhost:${PORT}`)
})

