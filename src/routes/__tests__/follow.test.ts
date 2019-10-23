process.env.NODE_ENV = 'test';
import follows from '../../data/follows.json';
import { testApi } from '../testUtil';
import { Follow } from '../../models/follow';

describe('follow', () => {
  describe('POST /follow', () => {
    it('returns 400 for empty data', async () => {
      const res = await testApi.post('/v1/follow', undefined);
      expect(res.status).toEqual(400);
    })
    it('returns 400 for invalid data', async () => {
      const res = await testApi.post('/v1/follow', { followerId: null });
      expect(res.status).toEqual(400);
    })
    it('returns 200 for valid data', async () => {
      await Promise.all(follows.operations.map(async (f) => {
        const data = { followerId: f[0], userId: f[1] };
        const res = await testApi.post('/v1/follow', { followerId: f[0], userId: f[1] });
        expect(res.status).toEqual(200);
        expect(res.body).toEqual(data)
        await Follow.query().where({ followerId: f[0], userId: f[1] }).delete()
      }));
    })
  });
});
