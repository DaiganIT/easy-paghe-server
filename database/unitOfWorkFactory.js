import { createConnection, Connection } from 'typeorm';

export class UnitOfWorkFactory {
  /**
   * Creates a new database connection.
   * @returns {Connection} The created connection.
   */
  static async createAsync() {
    return await createConnection().catch(err => console.log(err));
  }
}
