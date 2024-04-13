import Joi from 'joi';

export const urlsCreateSchema = Joi.array().items(Joi.object({
  date: Joi.date().required().label('Date'),
  title: Joi.string().required().label('URL Title'),
  domain: Joi.string().required().label('URL Domain'),
  url: Joi.string().required().label('URL'),
  last_visit_time: Joi.date().label('Last Visit Time'),
  duration: Joi.string().regex(/^([01][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/).label('Duration'),
  browser: Joi.string().label('Browser'),
  created_at_ip: Joi.string()
}));