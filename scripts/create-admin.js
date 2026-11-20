// Creates an admin account, or promotes an existing account to admin.
//
//   npm run create-admin -- --email you@example.com --name "Your Name"
//
// The password is read from ADMIN_PASSWORD, or asked for in the terminal
// (it is not passed as an argument, so it stays out of the shell history).
import dns from 'dns'
import readline from 'node:readline'
import { parseArgs } from 'node:util'
import mongoose from 'mongoose'
import config from '../config/config.js'
import User from '../server/models/user.model.js'

dns.setServers(['8.8.8.8'])

const { values } = parseArgs({
  options: {
    email: { type: 'string' },
    name: { type: 'string' },
  },
})

function askHidden(question) {
  return new Promise((resolve) => {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout })
    rl._writeToOutput = (text) => {
      if (text.includes(question)) rl.output.write(text)
    }
    rl.question(question, (answer) => {
      rl.close()
      process.stdout.write('\n')
      resolve(answer)
    })
  })
}

async function main() {
  const email = (values.email || '').trim()
  if (!email) {
    throw new Error('Pass the account email: npm run create-admin -- --email you@example.com')
  }

  await mongoose.connect(config.mongoUri, { dbName: config.mongoDbName })
  const existing = await User.findOne({ email })

  if (existing) {
    existing.role = 'admin'
    existing.updated = Date.now()
    await existing.save()
    console.log(`${email} is now an admin.`)
    return
  }

  const password = process.env.ADMIN_PASSWORD || (await askHidden('Password (min. 6 characters): '))
  const user = new User({ name: values.name || 'Admin', email, password, role: 'admin' })
  await user.save()
  console.log(`Admin account ${email} was created.`)
}

main()
  .catch((error) => {
    console.error('Could not create the admin:', error.message)
    process.exitCode = 1
  })
  .finally(() => mongoose.disconnect())
