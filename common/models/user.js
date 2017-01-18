'use strict';

var app = require('../../server/server');

module.exports = function (User) {
  User.prototype.follow = function (userId, cb) {
    //'this' is the user to follow
    //logged in user is the one who's following
    var result = {status: 'success'};
    var follower = this;
    User.findById(userId, function (err, userToFollow) {
      if (err) {
        result.status = 'fail';
        result.reason = 'Could not find user ' + userId;
        cb(null, result);
        return;
      }
      else if (follower.id == userToFollow.id) {
        result.status = 'fail';
        result.reason = 'User cannot follow him or herself!';
        cb(null, result);
        return;
      }
      var Follow = app.models.Follow;
      Follow.findOne({where: {userId: userToFollow.id, followerId: follower.id}}, function (err, fllw) {
        if (fllw) {
          result.status = 'fail';
          result.reason = 'User is already following other user';
          cb(null, result);
          return;
        }
        var newFollow = {
          time: new Date(),
          userId: userToFollow.id,
          followerId: follower.id
        };
        Follow.create(newFollow, function (err, instance) {
          if (err) {
            result.status = 'fail';
            result.reason = 'Could not create the follow';
          }
          else {
            result.data = instance;
          }
          cb(null, result);
        });

      });
    });
  };

  User.remoteMethod('follow', {
    isStatic: false,
    accepts: {arg: 'userId', type: 'number'},
    returns: {arg: 'result', type: 'object'},
    http: {
      path: '/follow',
      verb: 'post'
    }
  });

  User.prototype.unfollow = function (userId, cb) {
    var result = {status: 'success'};
    var unfollower = this;
    User.findById(userId, function (err, userToUnfollow) {
      if (err || !userToUnfollow) {
        result.status = 'fail';
        result.reason = 'Could not find user ' + userId;
        cb(null, result);
        return;
      }
      else if (unfollower.id == userToUnfollow.id) {
        result.status = 'fail';
        result.reason = 'User cannot unfollow him or herself!';
        cb(null, result);
        return;
      }
      var Follow = app.models.Follow;
      Follow.destroyAll({userId: userToUnfollow.id, followerId: unfollower.id}, function (err /*, info*/) {
        if (err) {
          result.status = 'fail';
          result.reason = 'Could not destroy the follow';
        }
        cb(null, result);
      });
    });
  };

  User.remoteMethod('unfollow', {
    isStatic: false,
    accepts: {arg: 'userId', type: 'number'},
    returns: {arg: 'result', type: 'object'},
    http: {
      path: '/unfollow',
      verb: 'post'
    }
  })

};
