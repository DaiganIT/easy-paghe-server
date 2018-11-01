import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { UserManager } from '../managers/userManager';

export default function() {
  passport.use(
    new LocalStrategy(async function(username, password, done) {
      const userManager = new UserManager();
      try {
        var user = await userManager.getByUserAndPassAsync(username, password);
        if (!user) {
          return done(null, false, { message: 'INVALID_CREDENTIALS' });
        }
        return done(null, user);
      } catch (err) {
        console.log(err);
        return done(null, false, { message: 'INVALID_CREDENTIALS' });
      }
    }),
  );

  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(async function(id, done) {
    const userManager = new UserManager();
    const user = await userManager.getByIdAsync(id);
    done(null, user);
  });
}
