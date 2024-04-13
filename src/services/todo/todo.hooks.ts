import { HooksObject } from '@feathersjs/feathers';
import * as authentication from '@feathersjs/authentication';
import validateDataWithJoi from '../../hooks/validate-data-with-joi';
import { todoCreateSchema } from '../../utils/validation/todo-validation';
import addAssociations from '../../hooks/add-associations';
// Don't remove this comment. It's needed to format import lines nicely.

const { authenticate } = authentication.hooks;
const getDetailAssociation = addAssociations({
  models:[
    {
      model: 'users',
      attributes: ['email','first_name','last_name'],
      where: { deleted_at:null },
      required: false,
    },
    {
      model: 'project',
      attributes: ['name'],
      where: { deleted_at:null },
      required: true,
    },
    
  ]
});
export default {
  before: {
    all: [ authenticate('jwt') ],
    find: [getDetailAssociation],
    get: [],
    create: [validateDataWithJoi(todoCreateSchema)],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
};
