import assert from 'assert';
import app from '../../../src/app';

describe('\'project/get-my-projects\' service', () => {
  it('registered the service', () => {
    const service = app.service('project/get-my-projects');

    assert.ok(service, 'Registered the service');
  });
});
