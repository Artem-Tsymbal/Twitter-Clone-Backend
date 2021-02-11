import { body } from 'express-validator';

const tweetCreationValidation = [
  body('text', 'Введите текст твита')
    .isString()
    .isLength({
      max: 280,
    })
    .withMessage('Максимальная длина твита 280 символов'),
];

export default tweetCreationValidation;
