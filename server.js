import config from './config/config.js'
import app from './server/express.js'
// importing dns and setting servers to 8.8.8.8 if it is NEEDED FOR:
// v24.14.x, v24.15.x and above (including v26, v25, v24.15.0, v24.16.0, etc)
// for your computer system configuration if it connects to the database without
// the dns then its okay in that case you don't need the next two line of script on dns.
import dns from 'dns';
dns.setServers(['8.8.8.8'])
import mongoose from 'mongoose'
import PortfolioContent from './server/models/portfolio-content.model.js'
import Project from './server/models/project.model.js'
import Qualification from './server/models/qualification.model.js'
import portfolioSeed from './server/data/portfolio.seed.js'

mongoose.Promise = global.Promise

app.get("/", (req, res) => {
  res.json({ message: "Welcome to My Portfolio application." });
});

// Fills an empty database with the initial portfolio content. Data that is
// already saved is never overwritten.
async function seedContent() {
  const { projects, qualifications, ...pageContent } = portfolioSeed
  const existing = await PortfolioContent.findOne({ key: 'main' }).lean()

  // Projects and qualifications live in their own collections. Older
  // databases kept them inside the portfolio document, so move them over.
  const savedProjects = existing?.content?.projects || projects
  const savedQualifications = existing?.content?.qualifications || qualifications
  if ((await Project.countDocuments()) === 0) {
    await Project.insertMany(savedProjects.map((item, order) => ({ ...item, order })))
  }
  if ((await Qualification.countDocuments()) === 0) {
    await Qualification.insertMany(savedQualifications.map((item, order) => ({ ...item, order })))
  }

  if (!existing) {
    await PortfolioContent.create({ key: 'main', content: pageContent })
    return
  }

  // Add fields that newer versions of the site expect but an older saved
  // document doesn't have yet. Saved values are never replaced.
  const { projects: _p, qualifications: _q, ...savedContent } = existing.content || {}
  const filled = fillMissing(savedContent, pageContent)
  if (filled.changed || existing.content?.projects || existing.content?.qualifications) {
    await PortfolioContent.updateOne({ key: 'main' }, { $set: { content: filled.value } })
  }
}

// Returns `saved` with every key from `defaults` that `saved` is missing.
function fillMissing(saved, defaults) {
  const isObject = (v) => v !== null && typeof v === 'object' && !Array.isArray(v)
  if (saved === undefined) return { value: defaults, changed: true }
  if (!isObject(saved) || !isObject(defaults)) return { value: saved, changed: false }
  let changed = false
  const value = { ...saved }
  for (const key of Object.keys(defaults)) {
    const result = fillMissing(saved[key], defaults[key])
    value[key] = result.value
    changed = changed || result.changed
  }
  return { value, changed }
}

async function startServer() {
  await mongoose.connect(config.mongoUri, { dbName: config.mongoDbName })
  console.log(`Connected to the ${config.mongoDbName} database.`);

  await seedContent()
  console.log('Portfolio content is ready.');

  app.listen(config.port, () => {
    console.info('Server started on port %s.', config.port)
  })
}

startServer().catch((error) => {
  console.error('Could not start the server:', error.message)
  process.exitCode = 1
})
