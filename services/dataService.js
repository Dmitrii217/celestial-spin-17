import { Low } from 'lowdb'
import { JSONFile } from 'lowdb/node'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Path to JSON file — adjust as needed for your project
const file = path.join(__dirname, '../../db.json')
const adapter = new JSONFile(file)

// Pass default data as second argument to Low constructor to avoid "missing default data"
const db = new Low(adapter, { users: {} })

// Init DB and ensure default data exists
await db.read()
await db.write()  // This will create the file with default if it doesn't exist

export function getBalanceForUser(userId) {
  const user = db.data.users[userId]
  return user ? user.balance || 0 : 0
}

export function getNextSpinTimeForUser(userId) {
  const user = db.data.users[userId]
  return user ? user.lastSpin + 4 * 60 * 60 * 1000 : 0
}

export function canSpin(userId) {
  return Date.now() >= getNextSpinTimeForUser(userId)
}

export async function spin(userId) {
  if (!canSpin(userId)) return false

  const reward = Math.floor(Math.random() * 901) + 100 // 100-1000 tokens reward

  if (!db.data.users[userId]) {
    db.data.users[userId] = { balance: 0, lastSpin: 0 }
  }

  db.data.users[userId].balance += reward
  db.data.users[userId].lastSpin = Date.now()

  await db.write()

  return reward
}

