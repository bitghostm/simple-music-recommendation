process.env.NODE_ENV = 'test';

import follows from '../../data/follows.json';
import listen from '../../data/listen.json';
import { doesNotReject } from 'assert';
import { testApi } from '../testUtil';
import { Follow } from '../../models/follow';
import { Listen } from '../../models/listen';

describe('recommendation', () => {
  describe('GET /recommendation', () => {
    test('recommendation for user a', async () => {
      await Promise.all(follows.operations.map((f) => testApi.post('/v1/follow', { followerId: f[0], userId: f[1] })));
      for (let [userId, musicIds] of Object.entries(listen.userIds)) {
        await Promise.all(musicIds.map((mid) => testApi.post('/v1/listen', { userId: userId, musicId: mid})))
      }
      const results = await Follow.query();
      const listenResults = await Listen.query();

      const res = await testApi.get('/v1/recommendation', { userId: 'a' });
      console.log('recommended: ', res.body);
      expect(res.body).toEqual(['m7', 'm4', 'm9', 'm8', 'm11']);
    });
  });
});
