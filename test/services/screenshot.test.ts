import assert from 'assert';
import app from '../../src/app';

describe('\'screenshot\' service', () => {
  it('registered the service', () => {
    const service = app.service('screenshot');

    assert.ok(service, 'Registered the service');
  });
});
