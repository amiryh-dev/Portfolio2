import express from 'express'
import qualificationCtrl from '../controllers/qualification.controller.js'
import authCtrl from '../controllers/auth.controller.js'

const router = express.Router()

// Public: anyone can view qualifications.
// Admin only: adding, updating and deleting.
router.route('/api/qualifications')
  .get(qualificationCtrl.list)
  .post(authCtrl.requireSignin, authCtrl.requireAdmin, qualificationCtrl.create)
  .delete(authCtrl.requireSignin, authCtrl.requireAdmin, qualificationCtrl.removeAll)

router.route('/api/qualifications/:qualificationId')
  .get(qualificationCtrl.read)
  .put(authCtrl.requireSignin, authCtrl.requireAdmin, qualificationCtrl.update)
  .delete(authCtrl.requireSignin, authCtrl.requireAdmin, qualificationCtrl.remove)

router.param('qualificationId', qualificationCtrl.qualificationByID)

export default router
