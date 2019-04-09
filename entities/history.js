import { Entity, Column } from 'typeorm';
import { CustomerSpecific } from './customerSpecific';

@Entity()
export class History extends CustomerSpecific {
  @Column('datetime')
  date = '';
  
  @Column('int')
  itemId = 0;

  @Column('varchar')
  type = '';

  @Column('varchar')
  entity = '';

  @Column('text')
  entityWasJson = '';

  @Column('text')
  entityIsJson = '';
}

export const HistoryType = {
  Create: 'Create',
  Update: 'Update',
  Delete: 'Delete'
};