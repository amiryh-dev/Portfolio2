import express from 'express'
import userCtrl from '../controllers/user.controller.js'
import authCtrl from '../controllers/auth.controller.js'

const router = express.Router()

// Public: sign up and list users. Protected: remove all users.
router.route('/api/users')
  .get(userCtrl.list)
  .post(userCtrl.create)
  .delete(authCtrl.requireSignin, userCtrl.removeAll)

// Protected: must be signed in; can only update/delete your own account
router.route('/api/users/:userId')
  .get(authCtrl.requireSignin, userCtrl.read)
  .put(authCtrl.requireSignin, authCtrl.hasAuthorization, userCtrl.update)
  .delete(authCtrl.requireSignin, authCtrl.hasAuthorization, userCtrl.remove)

router.param('userId', userCtrl.userByID)

export default router
