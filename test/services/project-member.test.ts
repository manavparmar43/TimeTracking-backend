import assert from 'assert';
import app from '../../src/app';

describe('\'project member\' service', () => {
  it('registered the service', () => {
    const service = app.service('project-member');

    assert.ok(service, 'Registered the service');
  });
});
