import { Entity, Column } from 'typeorm';
import { CustomerSpecific } from './customerSpecific';

@Entity()
export class History extends CustomerSpecific {
  @Column('varchar')
  date = '';
  
  @Column('number')
  itemId = 0;

  @Column('varchar')
  type = '';

  @Column('varchar')
  entity = '';

  @Column('varchar')
  entityWasJson = '';

  @Column('varchar')
  entityIsJson = '';
}

export const HistoryType = {
  Create: 'Create',
  Update: 'Update',
  Delete: 'Delete'
};

export const HistoryEntity = {
  Company: 'Company',
  Person: 'Person',
  User: 'User'
};