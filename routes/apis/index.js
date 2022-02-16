const express = require('express')
const router = express.Router()
const restaurantController = require('../../controllers/apis/restaurant-controller')
const { generalErrorHandler } = require('../../middleware/error-handler')
const passport = require('../../config/passport')
const admin = require('./modules/admin')

router.use('/admin', admin)
router.get('/restaurants', restaurantController.getRestaurants)

module.exports = router
