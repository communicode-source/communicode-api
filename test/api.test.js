var status = require('http-status');
var mute = require('mute');
var assert = require('assert');
var loopback = require('loopback');

describe('Communicode API Testing', function () {
  var supertest = require('supertest');
  var server = require('../server/server');
  var api = supertest(server);

  before(function () {
    mute(process.stderr);
  });

  beforeEach(function (done) {
    done();
  });

  describe('Users', function () {

    var loginAsUser = function (u, p, cb) {
      api.post('/api/users/login').send({username: u, password: p}).expect(status.OK).end(function (err, res) {
        if (err) {
          cb(err);
        }
        cb(null, res.body.id);
      });
    };

    var logoutUser = function (user, cb) {
      api.post('/api/users/logout').query(user.token).expect(status.NO_CONTENT, cb);
    };

    describe('Access Control', function () {
      var admin = {token: {}};
      var developer1 = {token: {}};
      var developer2 = {token: {}};
      var nonprofit1 = {token: {}};
      var nonprofit2 = {token: {}};

      describe('Log in', function () {
        it('log in as admin', function (done) {
          loginAsUser('admin', 'admin', function (err, token) {
            if (err) {
              return done(err);
            }
            admin.token.access_token = token;
            done();
          })
        });

        it('log in as developers', function (done) {
          loginAsUser('test1', 'test1', function (err, token) {
            if (err) {
              return done(err);
            }
            developer1.token.access_token = token;
            loginAsUser('test2', 'test2', function (err, token2) {
              if (err) {
                return done(err);
              }
              developer2.token.access_token = token2;
              done();
            });
          })
        });

        it('log in as nonprofits', function (done) {
          loginAsUser('nonprofit1', 'nonprofit1', function (err, token) {
            if (err) {
              return done(err);
            }
            nonprofit1.token.access_token = token;
            loginAsUser('nonprofit2', 'nonprofit2', function (err, token2) {
              if (err) {
                return done(err);
              }
              nonprofit2.token.access_token = token2;
              done()
            });
          });
        });
      });

      describe('User Profiles', function () {
        it('list users as admin', function (done) {
          api.get('/api/users').query(admin.token).expect(status.OK).end(function (err, res) {
            if (err) {
              return done(err);
            }
            //Just make sure that an array of users is actually returned
            assert.equal(res.body.constructor, Array);
            done();
          });
        });

        it('fail to list users as developer', function (done) {
          api.get('/api/users').query(developer1.token).expect(status.UNAUTHORIZED, done);
        });

        it('fail to list users as nonprofit', function (done) {
          api.get('/api/users').query(nonprofit1.token).expect(status.UNAUTHORIZED, done);
        });

        it('view own profile as admin', function (done) {
          api.get('/api/users/self').query(admin.token).expect(status.OK).end(function (err, res) {
            if (err) {
              return done(err);
            }
            assert.equal(res.body.constructor, Object);
            admin.data = res.body;
            admin.data.token = admin.token;
            admin = admin.data;
            done();
          });
        });

        it('view own profile as developer', function (done) {
          api.get('/api/users/self').query(developer1.token).expect(status.OK).end(function (err, res) {
            if (err) {
              return done(err);
            }
            assert.equal(res.body.constructor, Object);
            developer1.data = res.body;
            developer1.data.token = developer1.token;
            developer1 = developer1.data;
            done();
          });
        });

        it('view own profile as developer2', function (done) {
          api.get('/api/users/self').query(developer2.token).expect(status.OK).end(function (err, res) {
            if (err) {
              return done(err);
            }
            assert.equal(res.body.constructor, Object);
            developer2.data = res.body;
            developer2.data.token = developer2.token;
            developer2 = developer2.data;
            done();
          });
        });

        it('view own profile as nonprofit', function (done) {
          api.get('/api/users/self').query(nonprofit1.token).expect(status.OK).end(function (err, res) {
            if (err) {
              return done(err);
            }
            assert.equal(res.body.constructor, Object);
            nonprofit1.data = res.body;
            nonprofit1.data.token = nonprofit1.token;
            nonprofit1 = nonprofit1.data;
            done();
          });
        });

        it('view own profile as nonprofit2', function (done) {
          api.get('/api/users/self').query(nonprofit2.token).expect(status.OK).end(function (err, res) {
            if (err) {
              return done(err);
            }
            assert.equal(res.body.constructor, Object);
            nonprofit2.data = res.body;
            nonprofit2.data.token = nonprofit2.token;
            nonprofit2 = nonprofit2.data;
            done();
          });
        });

        it('view other developer profile', function (done) {
          api.get('/api/users/' + developer2.id).query(developer1.token).expect(status.OK, done);
        });

        it('view other nonprofit profile', function (done) {
          api.get('/api/users/' + nonprofit1.id).query(developer1.id).expect(status.OK, done);
        });
      });

      describe('Followers', function () {

        it('follow someone', function (done) {
          api.post('/api/users/self/follow').query(developer1.token).send({userId: nonprofit1.id}).expect(status.OK, done);
        });

        it('view own followings', function (done) {
          api.get('/api/users/self/following').query(developer1.token).expect(status.OK).end(function (err, res) {
            if (err) {
              return done(err);
            }
            assert.equal(res.body.constructor, Array);
            done();
          });
        });

        it('view someone else\'s followings', function (done) {
          api.get('/api/users/' + developer1.id + '/following').query(nonprofit1.token).expect(status.OK).end(function (err, res) {
            if (err) {
              return done(err);
            }
            assert.equal(res.body.constructor, Array);
            done();
          });
        });

        it('view own followers', function (done) {
          api.get('/api/users/self/followers').query(nonprofit1.token).expect(status.OK).end(function (err, res) {
            if (err) {
              return done(err);
            }
            assert.equal(res.body.constructor, Array);
            done();
          })
        });

        it('view someone else\'s followers', function (done) {
          api.get('/api/users/' + nonprofit1.id + '/followers').query(developer1.token).expect(status.OK).end(function (err, res) {
            if (err) {
              return done(err);
            }
            assert.equal(res.body.constructor, Array);
            done();
          });
        });

        it('fail to follow self', function (done) {
          api.post('/api/users/self/follow').query(developer1.token).send({userId: developer1.id}).expect(status.NOT_ACCEPTABLE, done);
        });

        it('unfollow someone', function (done) {
          api.post('/api/users/self/unfollow').query(developer1.token).send({userId: nonprofit1.id}).expect(status.OK, done);
        });
      });

      describe('Projects -- Tests not yet implemented!', function () {

      });

      describe('Messages -- Tests not yet implemented!', function () {

      });

      describe('Notifications -- Tests not yet implemented!', function () {

      });

      describe('Matches -- Tests not yet implemented!', function () {

      });

      describe('Log out', function () {
        it('log out all users', function (done) {
          logoutUser(admin, function () {
            logoutUser(developer1, function () {
              logoutUser(developer2, function () {
                logoutUser(nonprofit1, function () {
                  logoutUser(nonprofit2, done)
                })
              });
            });
          });
        });
      });

    });
  });
});
