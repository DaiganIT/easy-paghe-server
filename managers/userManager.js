import moment from 'moment';
import validator from 'validator';
import bcrypt from 'bcrypt';
import randomstring from 'randomstring';
import fs from 'fs';
import util from 'util';
//import Mailer from '../mail/mailer';
import { User } from '../entities/user';
import { AddUserDto } from '../models/addUserDto';
import { UnitOfWorkFactory } from '../database/unitOfWorkFactory';

const unlinkAsync = util.promisify(fs.unlink);
const saltRounds = 10;

export class UserManager {
  /**
   * Creates a new user.
   * @param {AddUserDto} userModel
   */
  async addAsync(userModel) {
    validateUser(userModel);

    const db = await UnitOfWorkFactory.createAsync();

    // duplicate check
    var duplicateUser = await db
      .getRepository(User)
      .findOne({ email: userModel.email });
    if (duplicateUser)
      throw {
        key: 'email',
        code: 'DUPLICATE',
        message: 'already exists',
      };

    userModel.activationCode = randomstring.generate(50);
    userModel.activationCodeValidity = moment()
      .add(1, 'hours')
      .utc()
      .unix();

    const user = new User();
    user.email = userModel.email;
    user.password = 'Change Required';
    user.name = userModel.name;
    user.type = userModel.type;
    user.active = false;
    user.activationCode = randomstring.generate(50);
    user.activationCodeValidity = moment()
      .add(1, 'hours')
      .utc()
      .unix();

    await db.getRepository(User).save(user);
    await db.close();
    //Mailer.sendActivationMessage(user.username, user.activationCode);
  }

  async getByIdAsync(id) {
    const db = await UnitOfWorkFactory.createAsync();
    const user = await db.getRepository(User).findOne(id);
    await db.close();
    return user;
  }

  async activateUserAsync(code) {
    const db = await UnitOfWorkFactory.createAsync();
    let user = await db.getRepository(User).findOne({ activationCode: code });
    if (user) {
      if (codeIsValid(user)) {
        user.active = true;
        return db.getRepository(User).save(user);
      }
      await db.close();
      throw { code: 'INVALID_CODE' };
    }
    await db.close();
    throw { code: 'INVALID_CODE' };
  }

  async resendActivationAsync(userId) {
    const user = await getByIdAsync(userId);

    if (!codeIsValid(user)) {
      user.activationCode = randomstring.generate(50);
      user.activationCodeValidity = moment().add(1, 'hours');

      const db = await UnitOfWorkFactory.createAsync();
      await db.getRepository(User).save(user);
      await db.close();
    }

    Mailer.sendActivationMessage(user.username, user.activationCode);
  }

  async getByUsernameAsync(username) {
    const db = await UnitOfWorkFactory.createAsync();
    const user = await db
      .getRepository(User)
      .findOne({ username: username })
      .catch(() => null);
    await db.close();
    return user;
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

function codeIsValid(user) {
  return moment.unix(user.activationCodeValidity) >= moment().utc();
}

/**
 * Validates the user dto.
 * @param {AddUserDto} user
 */
function validateUser(user) {
  const errors = [];
  if (!user.email || validator.isEmpty(user.email))
    errors.push({
      key: 'email',
      code: 'REQUIRED',
      message: 'must be provided',
    });
  if (!validator.isEmail(user.email))
    errors.push({ key: 'email', code: 'INVALID', message: 'is invalid' });

  if (!user.name || validator.isEmpty(user.name))
    errors.push({
      key: 'name',
      code: 'REQUIRED',
      message: 'must be provided',
    });

  if (!user.type || validator.isEmpty(user.type))
    errors.push({
      key: 'type',
      code: 'REQUIRED',
      message: 'must be provided',
    });

  if (errors.length > 0) throw errors;
}
