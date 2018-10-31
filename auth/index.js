import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import uowFactory from '../database/unitOfWork';
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

// var router = express.Router()

// router.post('/api/login', function(req, res, next) {
// 	if (!req.body.username) {
// 		res.status(400);
// 		return res.send({ message: 'Devi inserire la tua email' });
// 	}

// 	if (!req.body.password) {
// 		res.status(400);
// 		return res.send({ message: 'Inserisci la password' });
// 	}

// 	passport.authenticate('local', function(err, user, info) {
// 		if (err) {
// 			return next(err);
// 		}
// 		if (!user) {
// 			res.status(400);
// 			return res.send({ message: info.message });
// 		}

// 		req.logIn(user, function(err) {
// 			if (err) {
// 				return next(err);
// 			}
// 		});

// 		return res.send(user);
// 	})(req, res, next);
// });

// router.post('/api/logout', function(req, res, next) {
// 	req.logout();
// 	return res.send();
// });

// export default router;
