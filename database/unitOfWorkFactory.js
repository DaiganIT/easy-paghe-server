import { Connection, ConnectionOptions, createConnection } from 'typeorm';

export class UnitOfWorkFactory {
  /**
   * @type {Connection}
   */
  static connection;

  /**
   * Creates a new database connection.
   * @param {ConnectionOptions} options The connection options.
   * @returns {Connection} The created connection.
   */
  static async createAsync(options) {
    if(this.connection && this.connection.isConnected)
      return this.connection;

    this.connection = await createConnection(options).catch(err => console.log(err));
    return this.connection;
  }
}
