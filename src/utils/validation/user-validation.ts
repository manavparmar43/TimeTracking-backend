import Joi from 'joi';

export const userCreateSchema = Joi.array().items(Joi.object({
  email: Joi.string().email().required().label('Email').messages({
    'string.required': 'Email is required.'
  }),
  role: Joi.string().valid('admin','member').required().label('Role').messages({
    'string.required': 'Role is required.',
  }),
  first_name: Joi.string().label('First Name'),
  middle_name: Joi.string().label('Middle Name'),
  last_name: Joi.string().label('Last Name'),
  job: Joi.string().uuid().label('Job'),
  technology: Joi.string().uuid().label('Technology'),
  password: Joi.string().min(8).regex(/^(?=.*\d)(?=.*[a-z])(?=.*[a-zA-Z]).{8,}$/i).required().label('Password').messages({
    'string.min': 'Password must be of minimum length 8.',
    'string.required': 'Password is required.',
    'string.pattern.base': 'Password must have a capital, small and special character.'
  }),
  created_at_ip: Joi.string()
}));