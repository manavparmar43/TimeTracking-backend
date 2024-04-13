import assert from 'assert';
import app from '../../../src/app';

describe('\'users/get-users\' service', () => {
  it('registered the service', () => {
    const service = app.service('users/get-users');

    assert.ok(service, 'Registered the service');
  });
});
