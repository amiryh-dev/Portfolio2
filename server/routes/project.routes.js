import express from 'express'
import projectCtrl from '../controllers/project.controller.js'
import authCtrl from '../controllers/auth.controller.js'

const router = express.Router()

// Public: anyone can view projects.
// Admin only: adding, updating and deleting.
router.route('/api/projects')
  .get(projectCtrl.list)
  .post(authCtrl.requireSignin, authCtrl.requireAdmin, projectCtrl.create)
  .delete(authCtrl.requireSignin, authCtrl.requireAdmin, projectCtrl.removeAll)

router.route('/api/projects/:projectId')
  .get(projectCtrl.read)
  .put(authCtrl.requireSignin, authCtrl.requireAdmin, projectCtrl.update)
  .delete(authCtrl.requireSignin, authCtrl.requireAdmin, projectCtrl.remove)

router.param('projectId', projectCtrl.projectByID)

export default router
