'use strict';

module.exports = function(app) {
  return function(req, res, next) {
    // Perform actions
    const body = req.body;
    app.service('users').create({
    	email: body.email,
    	password: body.password,
        name: body.name
    })
    .then(user => res.redirect('/login.html'))
    .catch(next);
    // next();
  };
};
