import assert from 'assert';
import app from '../../src/app';

describe('\'widgets\' service', () => {
  it('registered the service', () => {
    const service = app.service('widgets');

    assert.ok(service, 'Registered the service');
  });
});
