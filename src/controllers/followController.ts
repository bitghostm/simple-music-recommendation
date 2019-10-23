import { Follow } from '../models/follow';

export async function getUserFollowees(userId: string) {
    const followsByUser = await Follow.query().select('userId').where('followerId', userId);
    return followsByUser.map((f) => f.userId);
}
