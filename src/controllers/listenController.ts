import { Listen } from '../models/listen';

export async function getUserMusicHistory(userId: string) {
  const musicByUser = await Listen.query().select('musicId').where('userId', userId);
  return musicByUser.map((m) => m.musicId);
}