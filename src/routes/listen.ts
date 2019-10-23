import { Router } from "express";
import { Listen } from '../models/listen';

const router = Router();

const handler = (fn) => async (req, res, next) => {
    try {
      await fn(req, res, next);
    } catch (err) {
      return res.status((err && err.statusCode) || 500).send(err);
    }
  };
  

router.post('/', handler(async (req, res) => {
  const result = await Listen.query().insert({userId: req.body.userId, musicId: req.body.musicId});
  return res.status(200).send(req.body);
}))

export default router;
