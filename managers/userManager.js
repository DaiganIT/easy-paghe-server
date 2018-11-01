import moment from 'moment';
import validator from 'validator';
import bcrypt from 'bcrypt';
import randomstring from 'randomstring';
import fs from 'fs';
import util from 'util';
//import Mailer from '../mail/mailer';
import { User } from '../entities/user';
import { Connection } from 'typeorm';

const unlinkAsync = util.promisify(fs.unlink);

const saltRounds = 10;

export class UserManager {
  /**
   * Creates a new UserManager.
   * @param {Connection} db The database.
   */
  constructor(db) {
    if (!db instanceof Connection) throw 'Database is not a valid object';
    this.db = db;
  }

  addAsync(userModel) {
    validateUser(userModel);
    const hashPromise = bcrypt.hash(userModel.password, saltRounds);

    return hashPromise.then((hash) => {
      userModel.password = hash;
      //generate activation code
      userModel.active = userModel.active || false;
      if (!userModel.active) {
        userModel.activationCode = randomstring.generate(50);
        userModel.activationCodeValidity = moment()
          .add(1, 'hours')
          .utc()
          .unix();
      }

      const user = new User();
      user.username = userModel.username;
      user.password = userModel.password;
      user.name = userModel.username.split('@')[0];
      user.active = userModel.active;
      user.activationCode = userModel.activationCode;
      user.activationCodeValidity = userModel.activationCodeValidity;

      return this.db
        .getRepository(User)
        .save(user)
        .then((user) => {
          if (!user.active)
            Mailer.sendActivationMessage(user.username, user.activationCode);
          return user;
        })
        .catch((err) => console.log(err));
    });
  }

  async getByIdAsync(id) {
    return await this.db.getRepository(User).findOne(id);
  }

  getUserInfoAsync(id) {
    return this.db
      .getRepository(User)
      .createQueryBuilder('user')
      .addSelect(
        (s) =>
          s
            .select('count(*)')
            .from('deal_likes_user', 'dlu')
            .where('dlu.userId = user.id')
            .andWhere('user.id = :userId', { userId: id }),
        'user_totalLikes',
      )
      .addSelect(
        (s) =>
          s
            .select('count(*)')
            .from('deal', 'd')
            .where('d.userId = :userId', { userId: id }),
        'user_totalDeals',
      )
      .where('user.id = :userId', { userId: id })
      .getOne();
  }

  async activateUserAsync(code) {
    let user = await this.db
      .getRepository(User)
      .findOne({ activationCode: code });
    if (user) {
      if (moment.unix(user.activationCodeValidity) >= moment().utc()) {
        user.active = true;
        return this.db.getRepository(User).save(user);
      }

      throw new InvalidOperationException('Codice di attivazione scaduto');
    }

    throw new InvalidOperationException('Codice di attivazione non trovato');
  }

  async resendActivationAsync(userId) {
    const user = await getByIdAsync(userId);

    user.activationCode = randomstring.generate(50);
    user.activationCodeValidity = moment().add(1, 'hours');

    await this.db.getRepository(User).save(user);

    Mailer.sendActivationMessage(user.username, user.activationCode);
  }

  async updateProfilePictureAsync(file, userId) {
    const user = await this.getByIdAsync(userId);

    const oldPath = user.picture;
    user.picture = file.path;

    return await this.db
      .getRepository(User)
      .save(user)
      .then((u) => {
        if (oldPath) unlinkAsync(oldPath).then(() => u);
        else return u;
      })
      .catch((err) => console.log(err));
  }

  async getByUsernameAsync(username) {
    return await this.db
      .getRepository(User)
      .findOne({ username: username })
      .catch(() => null);
  }

  async getByUserAndPassAsync(username, password) {
    const user = await this.getByUsernameAsync(username);
    if (!user || !user.active) return null;

    const passwordCorrect = await bcrypt.compare(password, user.password);
    if (passwordCorrect) {
      return { id: user.id, username: user.username };
    } else {
      return null;
    }
  }
}

function validateUser(user) {
  const errors = [];
  if (validator.isEmpty(user.username))
    errors.push({ key: 'username', message: 'Inserisci un valore' });
  if (!validator.isEmail(user.username))
    errors.push({ key: 'username', message: 'Deve essere una email valida' });
  if (validator.isEmpty(user.password))
    errors.push({ key: 'password', message: 'Inserisci una password' });
  if (validator.isLength(user.password, { min: 8 }))
    errors.push({ key: 'password', message: 'Deve essere almeon 8 caratteri' });

  if (errors.length > 0) throw new ValidationException(errors);
}
