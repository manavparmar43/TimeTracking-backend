// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
import { Hook, HookContext } from '@feathersjs/feathers';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default (options = {}): Hook => {
  return async (context: HookContext): Promise<HookContext> => {
    if (context.error != null) {
      
      if (context.error.code === 401) {
        context.result = {status: 0, message: 'Not authenticated'};
        if (context.error.message != null && context.error.message === 'User deleted successfully') {
          context.result = {status: 1, message: 'User deleted successfully'};
        }
        else if (context.error.message != null && context.error.message !== 'Not authenticated') {
          context.result = {status: 0, message: `Not authenticated.(${context.error})`};
        }
        context.statusCode = context.error.code;
        context.dispatch = context.result;
      }
      else if (context.error.code === 409) {
        context.result = {status: 1, message: context.error.message};
        context.statusCode = context.error.code;
        context.dispatch = context.result;
      }
      else if (context.error.message === 'validation'){
        context.result = {status: 0, message: 'Validtion Failed', data: context.error.data};
        context.statusCode = context.error.code;
        context.dispatch = context.result;
      }
      else if (context.error.message != null) {
        context.result = {status: 0, message: context.error.message};
        context.statusCode = context.error.code;
        context.dispatch = context.result;
      }
      else {
        context.result = {status: 0, message: 'No record found.'};
        context.statusCode = context.error.code;
        context.dispatch = context.result;
      }
      context.error = null;
      context.dispatch = context.result;
    }
    else if (context.result != null) {
      if (context.result.data != null) {
        context.result =  {
          status: context.result.status ? context.result.status : Array.isArray(context.result.data) && context.result.data.length > 0 ? 1 : 0,
          message: context.result.message ? context.result.message : Array.isArray(context.result.data) && context.result.data.length > 0 ? 'Record found.' : 'No record found.',
          total: context.result.total,
          limit: context.result.limit,
          skip: context.result.skip,
          data: context.result.data
        };
        context.dispatch = context.result;
      }
      else if (context.result.message != null) {
        context.result =  {
          status: 1,
          message: context.result.message
        };
        context.dispatch = context.result;
      }
      else {
        if(context.method == 'patch' || context.method == 'update') {
          if(context.path == 'property-viewing'){
            context.dispatch = {status: 1, message: 'Slot updated successfully.', data: context.result};
          }else{
            context.dispatch = { status: 1, message: 'Record updated successfully.', data: context.result};
          }
        }
        else if(context.method == 'remove') {
          if(context.path == 'property-viewing'){
            context.dispatch = {status: 1, message: 'Slot deleted successfully.', data: context.result};
          }
          else{
            context.dispatch = { status: 1, message: 'Record deleted successfully.', data: context.result};
          }
        }
        else if(context.method == 'create') {
          if (context.path == 'authentication' || context.path == 'authenticationUser') {
            context.dispatch = { status: 1, message: 'loggedIn successfully.', data: context.result };
          }
          else if (context.path == 'uploads-image' || context.path == 'uploads-audio')  {
            context.dispatch = { status: 1, message: 'File uploaded successfully.', data: context.result };
          }
          else if (context.path == 'send-otp')  {
            context.dispatch = { status: 1, message: 'OTP sent successfully.', data: context.result };
          }
          else if (context.path == 'explore'){
            context.dispatch = {status: 1, message: 'Record found successfully.', data:context.result};
          }
          else if(context.path == 'reset-password'){
            context.dispatch = {status: 1, message: 'Password updated successfully', data: context.result};
          }
          else if(context.path == 'property-viewing'){
            context.dispatch = {status: 1, message: 'Slot created successfully.', data: context.result};
          }
          else {
            context.dispatch = { status: 1, message: 'Record created successfully.', data: context.result};
          }
        }
        else {
          context.dispatch = { 
            status: context.result.status ? context.result.status : Array.isArray(context.result) && context.result.length == 0 ? 0 : 1, 
            message: context.result.message ? context.result.message : Array.isArray(context.result) && context.result.length == 0 ? 'No record found.': 'Record found.', 
            data: context.result 
          };
        }
      }
    }
    else if (context.result == null) {
      context.result = { 
        status: 0, 
        message: 'No record found.'
      };
      context.dispatch = context.result;
    }
    return context;
  };
};
