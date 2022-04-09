const categroyServices = require('../../services/category-services')
const categoryContoller = {
  getCategories: (req, res, next) => {
    categroyServices.getCategories(req, (err, data) => err ? next(err) : res.json(data))
  },
  postCategory: (req, res, next) => {
    categroyServices.postCategory(req, (err, data) => err ? next(err) : res.json(data))
  },
  putCategory: (req, res, next) => {
    categroyServices.putCategory(req, (err, data) => err ? next(err) : res.json(data))
  },
  deleteCagtegory: (req, res, next) => {
    categroyServices.deleteCagtegory(req, (err, data) => err ? next(err) : res.json(data))
  }
}

module.exports = categoryContoller
