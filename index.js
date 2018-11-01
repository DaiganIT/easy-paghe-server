import express from 'express';
import session from 'express-session';
import passport from 'passport';
import bodyParser from 'body-parser';
import path from 'path';
import initPassport from './auth';
import loginRoutes from './routes/loginRoutes';
import userRoutes from './routes/userRoutes';

const app = express();

app.use(express.static('../ultimeofferte/dist/'));
app.use(
	session({
		secret: 'easy-paghe-secret',
		saveUninitialized: false,
		resave: true,
	}),
);
app.use(passport.initialize());
app.use(passport.session());

initPassport();

app.use('/api/auth', loginRoutes)
app.use('/api/users', userRoutes);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/api/user', function(req, res, next) {
	if (req.isAuthenticated()) {
		return res.send(req.user);
	} else {
		res.status(401);
		return res.send();
	}
});

app.get('*', function(request, response) {
	response.sendFile(path.resolve('../ultimeofferte.web.code/dist', 'index.html'));
});

app.listen(4000);
console.log('app is listening');
