// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
import { Hook } from '@feathersjs/feathers';
import { softDelete } from 'feathers-hooks-common';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default (options = {}): Hook => {
  return softDelete({
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    deletedQuery: async (context) => {
      return { deleted_at: null };
    },
    removeData: async (context) => {
      return {  deleted_at: new Date(), deleted_at_ip: context?.params.ip };
    },
  });
};
