import { Low } from 'lowdb'
import { JSONFile } from 'lowdb/node'

const adapter = new JSONFile('../db.json')
const db = new Low(adapter)
await db.read()
db.data ||= { users: {} }

function getUser(userId) {
  db.data.users[userId] ||= { balance: 0, lastSpin: 0 }
  return db.data.users[userId]
}

export async function getBalance(userId) {
  const user = getUser(userId)
  return user.balance
}

export async function getNextSpinTime(userId) {
  const user = getUser(userId)
  const cooldownMs = 4 * 60 * 60 * 1000
  return Math.max(user.lastSpin + cooldownMs - Date.now(), 0)
}
