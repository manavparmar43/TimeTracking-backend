import assert from 'assert';
import app from '../../src/app';

describe('\'lookup\' service', () => {
  it('registered the service', () => {
    const service = app.service('lookup');

    assert.ok(service, 'Registered the service');
  });
});
