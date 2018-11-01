import express from 'express';
import passport from 'passport';

var router = express.Router();

router.post('login', function(req, res, next) {
  if (!req.body.username) {
    res.status(400);
    return res.send({ message: 'Devi inserire la tua email' });
  }

  if (!req.body.password) {
    res.status(400);
    return res.send({ message: 'Inserisci la password' });
  }

  passport.authenticate('local', function(err, user, info) {
    if (err) {
      return next(err);
    }
    if (!user) {
      res.status(400);
      return res.send({ message: info.message });
    }

    req.logIn(user, function(err) {
      if (err) {
        return next(err);
      }
    });

    return res.send(user);
  })(req, res, next);
});

router.post('logout', function(req, res, next) {
  req.logout();
  return res.send();
});

export default router;
