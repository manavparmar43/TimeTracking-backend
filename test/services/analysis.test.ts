import assert from 'assert';
import app from '../../src/app';

describe('\'analysis\' service', () => {
  it('registered the service', () => {
    const service = app.service('analysis');

    assert.ok(service, 'Registered the service');
  });
});
