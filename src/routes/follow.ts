import { Router } from "express";
import { Follow } from '../models/follow';

const router = Router();

const handler = (fn) => async (req, res, next) => {
  try {
    await fn(req, res, next);
  } catch (err) {
    return res.status((err && err.statusCode) || 500).send(err);
  }
};

router.post('/', handler(async (req, res) => {
  const result = await Follow.query().insert({ userId: req.body.userId, followerId: req.body.followerId});
  return res.status(200).send(req.body);
}))
 
export default router;
