const express = require('express')
const passport = require('../../config/passport')
const router = express.Router()
const restaurantController = require('../../controllers/apis/restaurant-controller')
const userController = require('../../controllers/apis/user-controller')
const { apiErrorHandler } = require('../../middleware/error-handler')
const admin = require('./modules/admin')

router.use('/admin', admin)
router.post('/signin', passport.authenticate('local', { session: false }), userController.signIn)
router.get('/restaurants', restaurantController.getRestaurants)
router.use('/', apiErrorHandler)

module.exports = router
