import express from 'express'
import qualificationCtrl from '../controllers/qualification.controller.js'
import authCtrl from '../controllers/auth.controller.js'

const router = express.Router()

// Public: anyone can view qualifications.
// Protected: adding, updating and deleting.
router.route('/api/qualifications')
  .get(qualificationCtrl.list)
  .post(authCtrl.requireSignin, qualificationCtrl.create)
  .delete(authCtrl.requireSignin, qualificationCtrl.removeAll)

router.route('/api/qualifications/:qualificationId')
  .get(qualificationCtrl.read)
  .put(authCtrl.requireSignin, qualificationCtrl.update)
  .delete(authCtrl.requireSignin, qualificationCtrl.remove)

router.param('qualificationId', qualificationCtrl.qualificationByID)

export default router
