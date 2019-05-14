import 'babel-polyfill';
import { expect } from 'chai';

import { buildPermission, canRead, canWrite, canCreate } from '../../../utils/permission';

const testCases = [
  {
    permissions: { read: false, write: false, create: false },
    result: 0,
  },
  {
    permissions: { read: false, write: false, create: true },
    result: 1
  },
  {
    permissions: { read: false, write: true, create: false },
    result: 2
  },
  {
    permissions: { read: false, write: true, create: true },
    result: 3
  },
  {
    permissions: { read: true, write: false, create: false },
    result: 4
  },
  {
    permissions: { read: true, write: false, create: true },
    result: 5
  },
  {
    permissions: { read: true, write: true, create: false },
    result: 6
  },
  {
    permissions: { read: true, write: true, create: true },
    result: 7
  }
];
describe('Permissions Utils', () => {
  testCases.forEach(testCase => {
    it('can build the correct value', () => {
      const permission = buildPermission(testCase.permissions);
      expect(permission).to.equal(testCase.result);
    });

    it('can read result is correct', () => {
      const permission = buildPermission(testCase.permissions);
      expect(canRead(permission)).to.equal(testCase.permissions.read);
    });

    it('can write result is correct', () => {
      const permission = buildPermission(testCase.permissions);
      expect(canWrite(permission)).to.equal(testCase.permissions.write);
    });

    it('can create result is correct', () => {
      const permission = buildPermission(testCase.permissions);
      expect(canCreate(permission)).to.equal(testCase.permissions.create);
    });
  });
});