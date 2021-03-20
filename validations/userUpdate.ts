import { body } from 'express-validator';

const userUpdateValidation = [
  body('fullName', 'Введите имя')
    .isString()
    .isLength({
      min: 2,
      max: 40,
    }),
];

export default userUpdateValidation;
