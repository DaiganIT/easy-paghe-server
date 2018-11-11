import { Connection, createConnection } from 'typeorm';

export class UnitOfWorkFactory {
  static connection;

  /**
   * Creates a new database connection.
   * @returns {Connection} The created connection.
   */
  static async createAsync() {
    if(this.connection)
      return this.connection;

    return this.connection = await createConnection().catch(err => console.log(err));
  }
}
