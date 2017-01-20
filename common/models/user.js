'use strict';

var app = require('../../server/server');

module.exports = function (User) {
  User.prototype.follow = function (userId, cb) {
    //'this' is the user to follow
    //logged in user is the one who's following
    var follower = this;
    var error;
    User.findById(userId, function (err, userToFollow) {
      if (err) {
        cb(err);
      }
      else if (!userToFollow) {
        error = new Error('Could not find user ' + userId);
        error.status = 404;
        cb(error);
        return;
      }
      else if (follower.id == userToFollow.id) {
        error = new Error('User cannot follow him or herself!');
        error.status = 406;
        cb(error);
        return;
      }
      var Follow = app.models.Follow;
      Follow.findOne({where: {userId: userToFollow.id, followerId: follower.id}}, function (err, fllw) {
        if (fllw) {
          cb(null, fllw);
          return;
        }
        var newFollow = {
          time: new Date(),
          userId: userToFollow.id,
          followerId: follower.id
        };
        Follow.create(newFollow, function (err, instance) {
          if (err) {
            cb(err);
            return;
          }
          cb(null, instance);
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
    var unfollower = this;
    var error;
    User.findById(userId, function (err, userToUnfollow) {
      if (err) {
        cb(err);
      }
      else if (!userToUnfollow) {
        error = new Error('Could not find user ' + userId);
        error.status = 404;
        cb(error);
        return;
      }
      else if (unfollower.id == userToUnfollow.id) {
        error = new Error('User cannot unfollow him or herself!');
        error.status = 406;
        cb(error);
        return;
      }
      var Follow = app.models.Follow;
      Follow.destroyAll({userId: userToUnfollow.id, followerId: unfollower.id}, function (err/*, info*/) {
        if (err) {
          cb(err);
        }
        cb(null, {});
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
