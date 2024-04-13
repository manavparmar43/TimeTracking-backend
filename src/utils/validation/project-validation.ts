import Joi from 'joi';

export const projectCreateSchema = Joi.object({
  name: Joi.string().required().label('Project Name'),
  is_internal: Joi.boolean().label('Is Internal Project'),
  fk_client: Joi.string().uuid().label('Client Id'),
  estimated_hours: Joi.number().label('Estimated Hours'),
  created_at_ip: Joi.string()
});