import Joi from 'joi';

export const activityLogCreateSchema = Joi.object({
  fk_user: Joi.string().uuid().required().label('User Id'),
  fk_project: Joi.string().uuid().required().label('Project Id'),
  fk_todo: Joi.string().uuid().label('Todo Id'),
  date: Joi.date().required().label('Date'),
  start_time: Joi.string().required().regex(/^([01][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/).label('Start Time'),
  end_time: Joi.string().required().regex(/^([01][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/).label('End Time'),
  duration: Joi.string().required().regex(/^([01][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/).label('Duration'),
  idle_time: Joi.string().required().regex(/^([01][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/).label('Idle Time'),
  screen_activity: Joi.array(),
  created_at_ip: Joi.string()
});