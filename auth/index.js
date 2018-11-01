import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { UnitOfWorkFactory } from '../database/unitOfWorkFactory';
import { UserManager } from '../managers/userManager';

export default function() {
  passport.use(
    new LocalStrategy(async function(username, password, done) {
      const db = await UnitOfWorkFactory.createAsync();
      const userManager = new UserManager(db);

      try {
        var user = await userManager.getByUserAndPassAsync(username, password);
        await db.close();
        if (!user) {
          return done(null, false, { message: 'INVALID_CREDENTIALS' });
        }
        return done(null, user);
      } catch (err) {
        console.log(err);
        await db.close();
        return done(null, false, { message: 'INVALID_CREDENTIALS' });
      }
    }),
  );

  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(async function(id, done) {
    const db = await UnitOfWorkFactory.createAsync();
    const userManager = new UserManager(db);

    const user = await userManager.getByIdAsync(id);
    await db.close();

    done(null, { id: '1' });
  });
}
