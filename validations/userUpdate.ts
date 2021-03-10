import { body } from 'express-validator';

const userUpdateValidation = [
  body('fullName', 'Введите имя')
    .isString()
    .isLength({
      min: 2,
      max: 40,
    }),
  body('biography', 'Введите текст твита')
    .isString()
    .isLength({
      max: 280,
    })
    .withMessage('Максимальная длина твита 280 символов'),
];

export default userUpdateValidation;
