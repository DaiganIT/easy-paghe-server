import {createConnection, Connection} from 'typeorm';

export default class UnitOfWorkFactory {
    /**
     * Creates a new database connection.
     * @returns {Connection} The created connection.
     */
    async static createAsync() {
        return await createConnection();
    }
}
