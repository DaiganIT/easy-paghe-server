export class Error {

  /**
   * Creates a new error.
   * @param {string} code The error code.
   * @param {string} message The error message.
   * @param {string} key Optional key parameter for validation errors.
   */
  constructor(code, message, key) {
    this.code = code;
    this.message = message;
    this.key = key;
  }

  code = '';
  message = '';
  key = undefined;
}

export const REQUIRED = 'REQUIRED';
export const INVALID = 'INVALID';
export const INVALID_CODE = 'INVALID_CODE';
export const PASSWORD_MISMATCH = 'PASSWORD_MISMATCH';