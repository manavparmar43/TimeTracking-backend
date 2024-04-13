import assert from 'assert';
import app from '../../../src/app';

describe('\'users/profile\' service', () => {
  it('registered the service', () => {
    const service = app.service('users/profile');

    assert.ok(service, 'Registered the service');
  });
});
