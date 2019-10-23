import { Router } from 'express';
import music from '../data/music.json';
import { buildRecommendationScores, getTopFiveRecommendations } from './helpers';

const router = Router();

const knownGenreCache = Object.entries(music).reduce((acc: any, [musicId, genres]) => {
  acc[musicId] = genres;
  return acc;
}, {})

const handler = (fn) => async (req, res, next) => {
  try {
    await fn(req, res, next);
  } catch (err) {
    return res.status((err && err.statusCode) || 500).send(err);
  }
};

router.get('/', handler(async (req, res) => {
  const userId = req.query.userId;  
  //adding scores base on 
  //1. user genre listen count
  //2. followees music and genre listen count (maximum followee degree is defined in MAX_LEVEL. Default is set to 3 which is 2nd degree)
  const score = await buildRecommendationScores(userId, knownGenreCache);
  const topFive = await getTopFiveRecommendations(score, userId);
  
  return res.status(200).send(topFive);
}))
 
export default router;
