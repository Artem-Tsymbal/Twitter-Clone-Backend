import { Router } from 'express';
import passport from '../core/passport';
import usersController from '../controllers/usersController';
import registrationValidation from '../validations/sign-up';

const router = Router();

router.post('/register', registrationValidation, usersController.create);

router.get('/verify', registrationValidation, usersController.verify);

router.post('/login', passport.authenticate('local'), usersController.giveOutJWT);

module.exports = router;
