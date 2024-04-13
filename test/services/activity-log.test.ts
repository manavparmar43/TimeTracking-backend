import assert from 'assert';
import app from '../../src/app';

describe('\'activity-log\' service', () => {
  it('registered the service', () => {
    const service = app.service('activity-log');

    assert.ok(service, 'Registered the service');
  });
});
