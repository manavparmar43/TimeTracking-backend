import Joi from 'joi';

export const todoCreateSchema = Joi.object({
  title: Joi.string().required().label('Todo Title'),
  fk_project: Joi.string().uuid().required().label('Project Id'),
  fk_user: Joi.string().uuid().required().label('Member Id'),
  created_at_ip: Joi.string()
});