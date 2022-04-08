const commentService = require('../../services/comment-services')
const commentController = {
  postComment: (req, res, next) => {
    commentService.postComment(req, (err, restaurantId) => err ? next(err) : res.redirect(`/restaurants/${restaurantId}`))
  },
  deleteComment: (req, res, next) => {
    commentService.deleteComment(req, (err, restaurantId) => err ? next(err) : res.redirect(`/restaurants/${restaurantId}`))
  }
}

module.exports = commentController
