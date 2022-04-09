const { Category } = require('../../models')
const categroyServices = require('../../services/category-services')
const categoryContoller = {
  getCategories: (req, res, next) => {
    categroyServices.getCategories(req, (err, data) => err ? next(err) : res.render('admin/categories', data))
  },
  postCategory: (req, res, next) => {
    categroyServices.postCategory(req, (err, data) => err ? next(err) : res.redirect('/admin/categories'))
  },
  putCategory: (req, res, next) => {
    categroyServices.putCategory(req, (err, data) => err ? next(err) : res.redirect('/admin/categories'))
  },
  deleteCagtegory: (req, res, next) => {
    categroyServices.deleteCagtegory(req, (err, data) => err ? next(err) : res.redirect('/admin/categories'))
  }
}

module.exports = categoryContoller
