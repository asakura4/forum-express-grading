const { User, Comment, Restaurant, Favorite, Like, Followship } = require('../../models')
const userServices = require('../../services/user-services')
const { imgurFileHandler } = require('../../helpers/file-helpers')
const userController = {
  signUpPage: (req, res) => {
    res.render('signup')
  },
  signUp: (req, res, next) => {
    userServices.signUp(req, (err, data) => {
      if (err) return next(err)
      req.flash('success_messages', 'Account registered successfully!')
      return res.redirect('/signin')
    })
  },
  signInPage: (req, res) => {
    res.render('signin')
  },
  signIn: (req, res) => {
    req.flash('success_messages', '成功登入！')
    res.redirect('/restaurants')
  },
  logout: (req, res) => {
    req.flash('success_messages', '登出成功！')
    req.logout()
    res.redirect('/signin')
  },
  getUser: (req, res, next) => {
    return Promise.all([
      User.findOne({
        include: [
          { model: User, as: 'Followings' },
          { model: User, as: 'Followers' },
          { model: Restaurant, as: 'FavoritedRestaurants' }
        ],
        attributes: { exclude: ['password'] },
        where: {
          id: req.params.id
        }
      }),
      Comment.findAll({
        include: Restaurant,
        where: {
          userId: req.params.id
        },
        nest: true,
        raw: true
      })
    ])
      .then(([user, comments]) => {
        if (!user) {
          throw new Error("User didn't exist!")
        }
        const restaurants = []
        const set = new Set()
        for (const comment of comments) {
          if (!set.has(comment.Restaurant.id)) {
            set.add(comment.Restaurant.id)
            restaurants.push(comment.Restaurant)
          }
        }
        const favoriteRestaurants = []
        for (const favorite of user.FavoritedRestaurants) {
          favoriteRestaurants.push(favorite.toJSON())
        }

        const followings = []
        for (const following of user.Followings) {
          followings.push(following.toJSON())
        }

        const followers = []
        for (const follower of user.Followers) {
          followers.push(follower.toJSON())
        }

        const defaultProfileIcon = `/upload/${process.env.DEFAULT_PROFILE}`
        return res.render('users/profile', {
          user: user.toJSON(),
          sessionUser: req.user,
          defaultProfileIcon,
          restaurants,
          favoriteRestaurants,
          followings,
          followers
        })
      })
      .catch(err => next(err))
  },
  editUser: (req, res, next) => {
    return User.findByPk(req.params.id, {
      nest: true,
      raw: true
    })
      .then(user => {
        if (!user) {
          throw new Error("User didn't exist!")
        }
        return res.render('users/edit', { user })
      })
      .catch(err => next(err))
  },
  putUser: (req, res, next) => {
    const { name } = req.body
    if (!name) {
      throw new Error('User name is required')
    }
    if (req.user.id !== parseInt(req.params.id)) {
      throw new Error('User can only edit his/her own data')
    }

    const { file } = req
    return Promise.all([
      User.findByPk(req.params.id),
      imgurFileHandler(file)
    ])
      .then(([user, filePath]) => {
        if (!user) {
          throw new Error("User didn't exist")
        }
        return user.update({
          name,
          image: filePath || user.image
        })
      })
      .then(() => {
        req.flash('success_messages', '使用者資料編輯成功')
        return res.redirect(`/users/${req.params.id}`)
      })
      .catch(err => next(err))
  },
  addFavorite: (req, res, next) => {
    const { restaurantId } = req.params
    return Promise.all([
      Restaurant.findByPk(restaurantId),
      Favorite.findOne({
        where: {
          userId: req.user.id,
          restaurantId
        }
      })
    ])
      .then(([restaurant, favorite]) => {
        if (!restaurant) {
          throw new Error("Restaurant didn't exist")
        }
        if (favorite) {
          throw new Error('You have favorited this restaurant!')
        }

        return Favorite.create({
          userId: req.user.id,
          restaurantId
        })
          .then(() => res.redirect('back'))
          .catch(err => next(err))
      })
  },
  removeFavorite: (req, res, next) => {
    return Favorite.findOne({
      where: {
        userId: req.user.id,
        restaurantId: req.params.restaurantId
      }
    })
      .then(favorite => {
        if (!favorite) {
          throw new Error("You haven't favorited this restaurant!")
        }

        return favorite.destroy()
      })
      .then(() => res.redirect('back'))
      .catch(err => next(err))
  },
  addLike: (req, res, next) => {
    const { restaurantId } = req.params
    return Promise.all([
      Restaurant.findByPk(restaurantId),
      Like.findOne({
        where: {
          userId: req.user.id,
          restaurantId
        }
      })
    ])
      .then(([restaurant, like]) => {
        if (!restaurant) {
          throw new Error("Restaurant didn't exist")
        }
        if (like) {
          throw new Error('You have liked this restaurant!')
        }
        return Like.create({
          userId: req.user.id,
          restaurantId
        })
          .then(() => res.redirect('back'))
          .catch(err => next(err))
      })
  },
  removeLike: (req, res, next) => {
    return Like.findOne({
      where: {
        userId: req.user.id,
        restaurantId: req.params.restaurantId
      }
    })
      .then(like => {
        if (!like) {
          throw new Error("You haven't favorited this restaurant!")
        }

        return like.destroy()
      })
      .then(() => res.redirect('back'))
      .catch(err => next(err))
  },
  getTopUsers: (req, res, next) => {
    return User.findAll({
      include: [{ model: User, as: 'Followers' }]
    })
      .then(users => {
        console.log(users)
        const result = users
          .map(user => ({
            ...user.toJSON(),
            followerCount: user.Followers.length,
            isFollowed: req.user.Followings.some(f => f.id === user.id)
          }))
          .sort((a, b) => b.followerCount - a.followerCount)
        return res.render('top-users', { users: result })
      })
      .catch(err => next(err))
  },
  addFollowing: (req, res, next) => {
    const { userId } = req.params
    console.log(userId)
    return Promise.all([
      User.findByPk(userId),
      Followship.findOne({
        where: {
          followerId: req.user.id,
          followingId: req.params.userId
        }
      })
    ])
      .then(([user, followship]) => {
        if (!user) {
          throw new Error("User didn't exist")
        }
        if (followship) {
          throw new Error('You have already following this user!')
        }

        return Followship.create({
          followerId: req.user.id,
          followingId: userId
        })
      })
      .then(() => res.redirect('back'))
      .catch(err => next(err))
  },
  removeFollowing: (req, res, next) => {
    return Followship.findOne({
      where: {
        followerId: req.user.id,
        followingId: req.params.userId
      }
    })
      .then(followship => {
        if (!followship) {
          throw new Error("You haven't followed this user!")
        }
        return followship.destroy()
      })
      .then(() => res.redirect('back'))
      .catch(err => next(err))
  }

}

module.exports = userController
