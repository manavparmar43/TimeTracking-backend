// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
import { Hook, HookContext } from '@feathersjs/feathers';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default (options = {}): Hook => {
  return async (context: HookContext): Promise<HookContext> => {
    if (context.params?.files) {
      const screenshots = context.params?.files;
      const createdImages = await Promise.allSettled(screenshots.map(async (singleImage:any)=>{
        return await context.app.service('screenshot').create(
          { 
            fk_activity_log: context.result.id, 
            original_file_name: singleImage.originalname,
            file_path: singleImage.path,
          },
          context.params
        );
      }));

      //log rejected promises
      createdImages.forEach((createdImage:any)=>{
        if(createdImage.status === 'rejected'){
          console.log('error',`${createdImage.status} image not created`);
        }
      });
    }
    return context;
  };
};
