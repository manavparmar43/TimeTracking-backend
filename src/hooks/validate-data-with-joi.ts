// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
import { Hook, HookContext } from '@feathersjs/feathers';
import validateDataWithJoi from '../utils/validation';
import { GeneralError } from '@feathersjs/errors';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default (schema: any): Hook => {
  return async (context: HookContext): Promise<HookContext> => {
    const isValid: any = validateDataWithJoi(context.data, schema);
    if (isValid.error) {
      throw new GeneralError('validation', isValid.error);
    }
    return context;
  };
};
