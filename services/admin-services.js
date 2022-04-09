const { Restaurant, User, Category } = require('../models')
const { imgurFileHandler } = require('../helpers/file-helpers')
const adminController = {
  getRestaurants: (req, cb) => {
    return Restaurant.findAll({
      raw: true,
      nest: true,
      include: [Category]
    })
      .then(restaurants => cb(null, restaurants))
      .catch(err => cb(err))
  },
  postRestaurant: (req, cb) => {
    const { name, tel, address, openingHours, description, categoryId } = req.body
    if (!name) {
      throw new Error('Restaurant name is required')
    }
    const { file } = req
    imgurFileHandler(file)
      .then(filePath => {
        return Restaurant.create({
          name,
          tel,
          address,
          openingHours,
          description,
          image: filePath || null,
          categoryId
        })
      })
      .then(newRestaurant => cb(null, { restaurant: newRestaurant }))
      .catch(err => cb(err))
  },
  deleteRestaurant: (req, cb) => {
    Restaurant.findByPk(req.params.id)
      .then(restaurant => {
        if (!restaurant) {
          throw new Error("Restaurant didn't exist!")
        }
        return restaurant.destroy()
      })
      .then(deleteRestaurant => cb(null, { restaurant: deleteRestaurant }))
      .catch(err => cb(err))
  },
  createRestaurant: (req, cb) => {
    Category.findAll({
      raw: true
    })
      .then(categories => cb(null, { categories }))
      .catch(err => cb(err))
  },
  getRestaurant: (req, cb) => {
    return Restaurant.findByPk(req.params.id, {
      // raw: true,
      // nest: true,
      include: [Category]
    })
      .then(restaurant => {
        if (!restaurant) {
          throw new Error("Restaurant didn't exist")
        }
        return cb(null, { restaurant: restaurant.toJSON() })
      })
      .catch(err => cb(err))
  },
  editRestaurant: (req, cb) => {
    return Promise.all([
      Restaurant.findByPk(req.params.id, {
        raw: true
      }),
      Category.findAll({ raw: true })
    ])

      .then(([restaurant, categories]) => {
        if (!restaurant) {
          throw new Error("Restaurant didn't exist!")
        }
        return cb(null, { restaurant, categories })
      })
      .catch(err => cb(err))
  },
  putRestaurant: (req, cb) => {
    const { name, tel, address, openingHours, description, categoryId } = req.body
    if (!name) {
      throw new Error('Restaurant name is required')
    }
    const { file } = req
    Promise.all([
      Restaurant.findByPk(req.params.id),
      imgurFileHandler(file)
    ])
      .then(([restaurant, filePath]) => {
        if (!restaurant) {
          throw new Error("Restaurant didn't exist")
        }
        return restaurant.update({
          name,
          tel,
          address,
          openingHours,
          description,
          image: filePath || restaurant.image,
          categoryId
        })
      })
      .then(restaurant => {
        return cb(null, restaurant)
      })
      .catch(err => cb(err))
  },
  getUsers: (req, cb) => {

  }

}

module.exports = adminController
