const { Restaurant, User, Category } = require('../models')
const { imgurFileHandler } = require('../helpers/file-helpers')
const adminController = {
  getRestaurants: (req, cb) => {
    Restaurant.findAll({
      raw: true,
      nest: true,
      include: [Category]
    })
      .then(restaurants => cb(null, restaurants))
      .catch(err => cb(err))
  },
  deleteRestaurant: (req, cb) => {
    return Restaurant.findByPk(req.params.id)
      .then(restaurant => {
        if (!restaurant) {
          throw new Error("Restaurant didn't exist!")
        }
        return restaurant.destroy()
      })
      .then(deleteRestaurant => cb(null, { restaurant: deleteRestaurant }))
      .catch(err => cb(err))
  }
}

module.exports = adminController
