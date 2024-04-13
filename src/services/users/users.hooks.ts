import * as feathersAuthentication from '@feathersjs/authentication';
import * as local from '@feathersjs/authentication-local';
import authorize from '../../hooks/authorize';
import validateDataWithJoi from '../../hooks/validate-data-with-joi';
import { userCreateSchema } from '../../utils/validation/user-validation';
import { userEditAdminSchema } from '../../utils/validation/user-edit-admin-validation';
// Don't remove this comment. It's needed to format import lines nicely.

const { authenticate } = feathersAuthentication.hooks;
const { hashPassword, protect } = local.hooks;
export default {
  before: {
    all: [],
    find: [authenticate('jwt')],
    get: [authenticate('jwt')],
    create: [
      validateDataWithJoi(userCreateSchema),   
      authenticate('jwt'),
      authorize('admin'),
      hashPassword('password'),
    ],
    update: [authenticate('jwt'), authorize('admin'), validateDataWithJoi(userEditAdminSchema), hashPassword('password')],
    patch: [authenticate('jwt'), authorize('admin'), validateDataWithJoi(userEditAdminSchema), hashPassword('password')],
    remove: [authenticate('jwt')],
  },

  after: {
    all: [
      // Make sure the password field is never sent to the client
      // Always must be the last hook
      protect('password'),
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
};
