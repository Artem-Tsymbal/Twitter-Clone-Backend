import { Router } from 'express';
import tweetsController from '../controllers/tweetsController';
import passport from '../core/passport';
import tweetCreationValidation from '../validations/tweetCreation';

const router = Router();



router.get('/', tweetsController.get);

router.get('/following', passport.authenticate('jwt'), tweetsController.getFollowingUsers);

router.post('/', passport.authenticate('jwt'), tweetCreationValidation, tweetsController.create);

router.delete('/:id', passport.authenticate('jwt'), tweetsController.delete);

router.patch('/:id', passport.authenticate('jwt'), tweetCreationValidation, tweetsController.update);

router.get('/:id', tweetsController.getById);

router.get('/:id/favorite', passport.authenticate('jwt'), tweetsController.getFavorite);

router.get('/user/:id', tweetsController.getUserTweets);

router.get('/:id/like', passport.authenticate('jwt'), tweetsController.like);



module.exports = router;
