// Application hooks that run for every service
// Don't remove this comment. It's needed to format import lines nicely.

import { disallow, setField, setNow } from 'feathers-hooks-common';
import softDelete from './hooks/soft-delete';
import * as local from '@feathersjs/authentication-local';
import paginateAll from './hooks/paginate-all';
import removeDeletedAt from './hooks/remove-deleted-at';
import finallyAllHook from './hooks/finally-all-hook';
const { protect } = local.hooks;

export default {
  before: {
    all: [paginateAll(), removeDeletedAt()],
    find: [],
    get: [],
    create: [
      setField({
        from: 'params.ip',
        as: 'data.created_at_ip',
      }),
    ],
    update: [disallow()],
    patch: [
      setField({
        as: 'data.updated_at_ip',
        from: 'params.ip',
      }),
    ],
    remove: [setNow('updated_at'), softDelete()],
  },

  after: {
    all: [
      protect(
        'password',
        'created_at',
        'updated_at',
        'deleted_at',
        'created_at_ip',
        'updated_at_ip',
        'deleted_at_ip'
      ),
    ],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: [],
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: [],
  },
  finally: {
    all: [finallyAllHook()],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: [],
  },
};
