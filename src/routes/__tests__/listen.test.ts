process.env.NODE_ENV = 'test';
import { testApi } from '../testUtil';
import listen from '../../data/listen.json';
import { Listen } from '../../models/listen';

describe('listen', () => {
  describe('POST /listen', () => {
    it('returns 400 for empty data', async () => {
      const res = await testApi.post('/v1/listen', undefined);
      expect(res.status).toEqual(400);
    })
    it('returns 400 for invalid data', async () => {
      const res = await testApi.post('/v1/listen', { followerId: null });
      expect(res.status).toEqual(400);
    })
    it('returns 200 for valid data', async () => {
      for (let [userId, musicIds] of Object.entries(listen.userIds)) {
        const results = await Promise.all(musicIds.map((mid) => testApi.post('/v1/listen', { userId: userId, musicId: mid})))
        expect(results.map((r) => r.status)).toEqual(musicIds.map(() => 200));
        await Promise.all(musicIds.map((mid) => Listen.query().where({ userId: userId, musicId: mid }).delete()))
      }
    })
  });
});
