import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import uowFactory from '../database/unitOfWorkFactory';
import UserManager from '../managers/userManager';

export default function() {
  passport.use(
    new LocalStrategy(async function(username, password, done) {
      const db = await uowFactory.createAsync();
      const userManager = new UserManager(db);

      try {
        var user = await userManager.getByUserAndPassAsync(username, password);
        if (!user) {
          return done(null, false, {
            message: 'Nome utente o password non validi.',
          });
        }
        return done(null, user);
      } catch (err) {
        console.log(err);
        return done(null, false, {
          message: 'Nome utente o password non validi.',
        });
      }
    }),
  );

  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    userManager.getByIdAsync(id).then((user) => done(null, user));
  });
}
