import {createConnection} from 'typeorm';

export default class UnitOfWorkFactory {
    async static createAsync() {
        return await createConnection();
    }
}
