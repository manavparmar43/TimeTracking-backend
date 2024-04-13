import assert from 'assert';
import app from '../../../src/app';

describe('\'export-csv/download\' service', () => {
  it('registered the service', () => {
    const service = app.service('export-csv/download');

    assert.ok(service, 'Registered the service');
  });
});
