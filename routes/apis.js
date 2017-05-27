require('../models/user')
var express = require('express')
var router = express.Router()
var mongoose = require('mongoose')
var Users = mongoose.model('User')

router.post('/loginr', function(req, res, next) {
  if ((!req.body.user) || (!req.body.passwd)) {
    console.log('資料不完整')
    req.session.rlErro = 1
    req.session.rlErroType = 1
    res.redirect('/users/register')
    return
  }

  Users.findOne({
    username: req.body.user
  }).exec((err, user) => {
    if (err) {
      console.log('Fail to find DB.')
      return
    }
    if (user) {
      console.log('名稱已被使用')
      req.session.rlErro = 1
      req.session.rlErroType = 2
      res.redirect('/users/register')
      return
    }
    req.session.name = req.body.user
    req.session.passwd = req.body.passwd
    req.session.logined = true
    new Users({
      username: req.session.name,
      passwd: req.session.passwd,
      score: 0,
    }).save(function(err) {
      if (err) {
        console.log('Fail to save to DB.')
        return
      }
      console.log('Save to DB.')
    })
    console.log('註冊成功')
    res.redirect('/')
  })
})

router.post('/login', function(req, res, next) {
  if ((!req.body.user) || (!req.body.passwd)) {
    console.log('資料不完整')
    req.session.rlErro = 1
    req.session.rlErroType = 1
    res.redirect('/users/register')
    return
  }
  req.session.name = req.body.user
  Users.findOne({
    username: req.body.user
  }).exec((err, user) => {
    if (err) {
      console.log('Fail to find DB.')
      return
    }
    if (!user) {
      console.log('名稱不存在')
      req.session.rlErro = 1
      req.session.rlErroType = 4
      res.redirect('/users/register')
      return
    }
    if (req.body.passwd == user.passwd) {
      req.session.logined = true
      console.log('登入成功')
      res.redirect('/')
    } else {
      console.log('密碼錯誤')
      req.session.rlErro = 1
      req.session.rlErroType = 3
      res.redirect('/users/register')
    }
  })
})

router.post('/score', function(req, res, next) {
  Users.findOne({
    username: req.session.name
  }, function(err, user) {
    if (err) throw err
    if (!user) {
      console.log('名稱不存在')
      req.session.rlErro = 1
      req.session.rlErroType = 4
      return
    }
    if (user.score < req.body.score) {
      user.score = req.body.score
      user.save(function(err) {
        if (err) {
          console.log('Fail to save to DB.')
          return
        }
        console.log('Save to DB.')
      })
    }
  })
  res.redirect('/')
})
module.exports = router
