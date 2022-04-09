const { Restaurant, User, Category } = require('../../models')
const { imgurFileHandler } = require('../../helpers/file-helpers')
const adminServices = require('../../services/admin-services')
const adminController = {
  getRestaurants: (req, res, next) => {
    adminServices.getRestaurants(req, (err, restaurants) => err ? next(err) : res.render('admin/restaurants', { restaurants }))
  },
  createRestaurant: (req, res, next) => {
    adminServices.createRestaurant(req, (err, categories) => err ? next(err) : res.render('admin/create-restaurant', categories))
  },
  postRestaurant: (req, res, next) => {
    adminServices.postRestaurant(req, (err, data) => {
      if (err) return next(err)
      req.flash('success_messages', 'restaurant was successfully created')
      return res.redirect('/admin/restaurants', data)
    })
  },
  getRestaurant: (req, res, next) => {
    adminServices.getRestaurant(req, (err, restaurant) => {
      if (err) return next(err)
      console.log(restaurant)
      return res.render('admin/restaurant', restaurant)
    })
  },
  editRestaurant: (req, res, next) => {
    adminServices.editRestaurant(req, (err, { restaurant, categories }) => err ? next(err) : res.render('admin/edit-restaurant', { restaurant, categories }))
  },
  putRestaurant: (req, res, next) => {
    adminServices.putRestaurant(req, (err, data) => {
      if (err) return next(err)
      req.flash('success_messages', 'restaurant was updated successfully')
      return res.redirect('/admin/restaurants', data)
    })
  },
  deleteRestaurant: (req, res, next) => {
    adminServices.deleteRestaurant(req, (err, data) => err ? next(err) : res.redirect('/admin/restaurants', data))
  },
  getUsers: (req, res, next) => {
    return User.findAll({
      raw: true
    })
      .then(users => res.render('admin/users', { users }))
      .catch(err => next(err))
  },
  patchUser: (req, res, next) => {
    return User.findByPk(req.params.id)
      .then(user => {
        if (!user) {
          throw new Error("User didn't exist!")
        }
        if (user.email === 'root@example.com') {
          req.flash('error_messages', '禁止變更 root 權限')
          return res.redirect('back')
        }
        user.isAdmin = !user.isAdmin
        // return user.save({ fields: ['isAdmin'] })
        //   .then(user => {
        //     return user.reload()
        //   })
        return user.update({
          isAdmin: user.isAdmin
        })
      })
      .then(() => {
        req.flash('success_messages', '使用者權限變更成功')
        return res.redirect('/admin/users')
      })
      .catch(err => next(err))
  }
}

module.exports = adminController
