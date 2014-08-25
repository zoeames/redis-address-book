'use strict';

var bcrypt = require ('bcrypt');

function User(){
}

Object.defineProperty(User, 'collection', {
  get: function(){return global.mongodb.collection('users');}
});

User.all = function(cb){
  User.collection.find().toArray(cb);
};

User.register = function(o, cb){
  User.collection.findOne({email:o.email}, function(err, obj){
    if(obj){return cb();}

    o.password = bcrypt.hashSync(o.password, 10);

    User.collection.save(o, cb);
  });
};

module.exports = User;

