import { Router } from 'express';
import passport from '../core/passport';
import usersController from '../controllers/usersController';
import userUpdateValidation from '../validations/userUpdate';

const router = Router();

router.get('/', usersController.getUsers);

router.post('/search', passport.authenticate('jwt', { session: false }), usersController.searchUsers);

router.get('/me', passport.authenticate('jwt', { session: false }), usersController.getMe);

router.patch('/me', passport.authenticate('jwt', { session: false }), userUpdateValidation, usersController.updateMe);

router.post('/me/follow', passport.authenticate('jwt', { session: false }), usersController.followUser);

router.get('/:id', usersController.getById);

module.exports = router;
