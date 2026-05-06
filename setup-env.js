#!/usr/bin/env node
// Usage: node setup-env.js
const readline = require('readline')
const crypto = require('crypto')
const fs = require('fs')
const path = require('path')
const bcrypt = require('bcryptjs')

const rl = readline.createInterface({ input: process.stdin, output: process.stdout })

function ask(question) {
  return new Promise((resolve) => rl.question(question, resolve))
}

async function main() {
  console.log('\n=== Marathon Tracker — Configuration initiale ===\n')
  console.log('Le mot de passe sera visible ici (script local uniquement).\n')

  const password = await ask('Choisis ton mot de passe (8+ caract.) : ')
  rl.close()

  if (!password || password.trim().length < 8) {
    console.error('❌ Mot de passe trop court (8 caractères minimum)')
    process.exit(1)
  }

  const pw = password.trim()
  console.log('\n⏳ Génération du hash bcrypt (quelques secondes)…')
  const hash = await bcrypt.hash(pw, 12)
  const jwt = crypto.randomBytes(64).toString('hex')

  const envPath = path.join(__dirname, '.env.local')
  // Escape $ signs so Next.js dotenv doesn't interpolate bcrypt's $2b$12$ prefix as env vars
  const escapedHash = hash.replace(/\$/g, '\\$')
  const content = `APP_PASSWORD_HASH=${escapedHash}\nJWT_SECRET=${jwt}\n\n# Rempli après : vercel env pull .env.local\nBLOB_READ_WRITE_TOKEN=\n`

  fs.writeFileSync(envPath, content, 'utf-8')

  console.log('\n✅ .env.local créé avec succès !')
  console.log(`   Mot de passe : "${pw}"`)
  console.log('   Lance le serveur : npm run dev')
  console.log('   Ouvre : http://localhost:3000\n')
}

main().catch((e) => { console.error(e.message); process.exit(1) })
