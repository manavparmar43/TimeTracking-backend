import assert from 'assert';
import app from '../../src/app';

describe('\'urls\' service', () => {
  it('registered the service', () => {
    const service = app.service('urls');

    assert.ok(service, 'Registered the service');
  });
});
