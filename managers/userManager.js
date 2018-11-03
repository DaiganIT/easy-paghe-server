import moment from 'moment';
import validator from 'validator';
import bcrypt from 'bcrypt';
import randomstring from 'randomstring';
import Mailer from '../mail/mailer';
import { User } from '../entities/user';
import { AddUserDto } from '../models/addUserDto';
import { UnitOfWorkFactory } from '../database/unitOfWorkFactory';
import { Error, REQUIRED, INVALID, PASSWORD_MISMATCH, INVALID_CODE } from '../utils/errors';
import { BaseManager } from './baseManager';

export class UserManager extends BaseManager {
	/**
	 * Creates a new user.
	 * @param {AddUserDto} userModel
	 */
	async addAsync(userModel, customerId) {
		validateUser(userModel);

		let db = await UnitOfWorkFactory.createAsync();

		try {
			// duplicate check
			const duplicateUser = await db.getRepository(User).findOne({ email: userModel.email });
			if (duplicateUser)
				throw {
					key: 'email',
					code: 'DUPLICATE',
					message: 'already exists',
				};
		} finally {
			await db.close();
		}

		db = await UnitOfWorkFactory.createAsync();
		let customer;
		// get customer
		try {
			customer = await db.getRepository(Customer).findOne({ id: customerId });
			if(!customer)
				throw {
					key: 'customer',
					code: 'INVALID',
					message: 'customer is invalid'
				};
		} finally {
			await db.close();
		}

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
		user.customer = customer;
		user.active = false;
		user.activationCode = randomstring.generate(50);
		user.activationCodeValidity = moment()
			.add(1, 'hours')
			.utc()
			.unix();

		await super.saveAsync(User, user);

		Mailer.sendActivationMessage(user.email, user.activationCode);
	}

	/**
	 * Gets a user by id.
	 * @param {number} id
	 */
	async getByIdAsync(id) {
		return await super.getByIdAsync(User, 'user', (queryBuilder) => {
			return queryBuilder
				.innerJoinAndSelect(`${user}.customer`, 'customer');
		});
	}

	/**
	 * Activates the user with the given code and sets the password.
	 * @param {string} code The activation code.
	 * @param {PasswordResetDto} passwordResetDto The password reset dto.
	 */
	async activateUserAsync(code, passwordResetDto) {
		validatePasswordReset(code, passwordResetDto);

		const db = await UnitOfWorkFactory.createAsync();
		try {
			let user = await db.getRepository(User).findOne({ activationCode: code });
			if (user) {
				if (codeIsValid(user)) {
					user.active = true;
					user.password = await bcrypt.hash(passwordResetDto.password, 10);
					user.activationCode = null;
					user.activationCodeValidity = null;
					await db.getRepository(User).save(user);
				}
				throw [new Error(EXPIRED_CODE, 'Activation code has expired', 'code')];
			} else {
				throw [new Error(INVALID_CODE, 'Activation code is invalid', 'code')];
			}
		} finally {
			await db.close();
		}
	}

	/**
	 * Gets the user by username.
	 * @param {string} username The username.
	 */
	async getByUsernameAsync(username) {
		const db = await UnitOfWorkFactory.createAsync();

		try {
			return await db.getRepository(User).findOne({ email: username });
		} finally {
			await db.close();
		}
	}

	/**
	 * Gets the user by user and password.
	 * @param {string} username The username.
	 * @param {string} password The password.
	 */
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

	/**
	 * Deletes the user by id.
	 * @param {string} id The user id.
	 */
	async deleteAsync(id) {
		super.deleteAsync(User, 'user', id);
	}
}

/**
 * Identifies if the code is valid.
 * @param {User} user
 */
function codeIsValid(user) {
	return moment.unix(user.activationCodeValidity) >= moment().utc();
}

/**
 * Validates the user dto.
 * @param {AddUserDto} user
 */
function validateUser(user) {
	const errors = [];
	if (!user.email || validator.isEmpty(user.email)) errors.push(new Error(REQUIRED, 'must be provided', 'email'));
	if (!validator.isEmail(user.email)) errors.push(new Error(INVALID, 'is invalid', 'email'));
	if (!user.name || validator.isEmpty(user.name)) errors.push(new Error(REQUIRED, 'must be provided', 'name'));
	if (!user.type || validator.isEmpty(user.type)) errors.push(new Error(REQUIRED, 'must be provided', 'type'));
	if (errors.length > 0) throw errors;
}

/**
 * Validates the user dto.
 * @param {string} code
 * @param {PasswordResetDto} passwordResetDto
 */
function validatePasswordReset(code, passwordResetDto) {
	const errors = [];
	if (!code || validator.isEmpty(code)) errors.push(new Error(REQUIRED, 'must be provided', 'code'));
	if (!passwordResetDto.password || validator.isEmpty(passwordResetDto.password))
		errors.push(new Error(REQUIRED, 'must be provided', 'password'));
	if (!passwordResetDto.passwordRetype || validator.isEmpty(passwordResetDto.passwordRetype))
		errors.push(new Error(REQUIRED, 'must be provided', 'passwordRetype'));
	if (passwordResetDto.password !== passwordResetDto.passwordRetype)
		errors.push(new Error(PASSWORD_MISMATCH, 'passwords do not match', 'password'));
	if (errors.length > 0) throw errors;
}
