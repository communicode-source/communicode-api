var $_ = {
  type: 'http://'
  apiDomain: 'localhost:3001',
  homeDomain: 'localhost:3000'
};

function getLink(locus, sub) {
  var follower = '';
  if(sub.constructor === Array) {
    follower = sub.join('/');
  } else {
    follower = sub;
  }
  return $_.host+$_[locus]+follower;
}
