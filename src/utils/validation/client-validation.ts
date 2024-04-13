import Joi from 'joi';

export const clientCreateSchema = Joi.object({
  name: Joi.string().required().label('Client Name'),
  contact: Joi.string().label('Contact'),
  email: Joi.string().email().required().label('Email').messages({
    'string.required': 'Email is required.'
  }),
  created_at_ip: Joi.string()
});