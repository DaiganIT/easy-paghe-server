import 'reflect-metadata';
import express from 'express';
import session from 'express-session';
import passport from 'passport';
import bodyParser from 'body-parser';
import path from 'path';
import initPassportStrategy from './auth';
import useRoutes from './routes/routes';

const app = express();

app.use(express.static('../easy-paghe/dist/'));
app.use(
  session({
    secret: 'easy-paghe-secret',
    saveUninitialized: false,
    resave: true,
  }),
);
app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

initPassportStrategy();
useRoutes(app);

app.get('*', function(request, response) {
  response.sendFile(path.resolve('../easy-paghe/dist', 'index.html'));
});

app.listen(4000);
console.log('app is listening');
