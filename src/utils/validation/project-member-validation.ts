import Joi from 'joi';

export const projectMemberCreateSchema = Joi.array().items(Joi.object({
  fk_user: Joi.string().uuid().required().label('Member Id'),
  fk_project: Joi.string().uuid().required().label('Project Id'),
  created_at_ip: Joi.string()
}));