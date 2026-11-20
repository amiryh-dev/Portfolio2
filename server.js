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
  } else if (existing.content?.projects || existing.content?.qualifications) {
    await PortfolioContent.updateOne(
      { key: 'main' },
      { $unset: { 'content.projects': '', 'content.qualifications': '' } },
    )
  }
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
