import { HooksObject } from '@feathersjs/feathers';
import * as authentication from '@feathersjs/authentication';
import { setField } from 'feathers-hooks-common';

import afterActivityLogCreate from '../../hooks/after-activity-log-create';
import validateDataWithJoi from '../../hooks/validate-data-with-joi';
import { iff } from 'feathers-hooks-common';
import { activityLogCreateSchema } from '../../utils/validation/activity-log-validation';
import manualEntryHook from '../../hooks/manual-entry-hook';
const { authenticate } = authentication.hooks;

export default {
  before: {
    all: [authenticate('jwt')],
    find: [],
    get: [],
    create: [
      iff(
        manualEntryHook(),
        setField({
          as: 'data.fk_user',
          from: 'params.user.id',
        })
      )
      ,
      validateDataWithJoi(activityLogCreateSchema)
    ],
    update: [],
    patch: [],
    remove: [],
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [afterActivityLogCreate()],
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
};