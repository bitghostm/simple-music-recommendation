import { orderBy, find } from 'lodash';
import { getUserFollowees } from '../controllers/followController';
import { getUserMusicHistory } from '../controllers/listenController';
import { NEW_MUSIC_ONLY, MUSIC_SCORE_FACTOR, GENRE_SCORE_FACTOR, MAX_LEVEL }  from '../config/recommendationConfig';
import { MusicCount, MusicScore, GenreCount } from '../types/types';

function getMusicListenCounts(userMusic: string[]): MusicCount {
  return userMusic.reduce((acc: any, musicId: string) => {
    acc[musicId] = (acc[musicId] || 0) + 1;
    return acc;
  }, {});
}
  
function getGenreListenCounts(userMusic: string[], knownGenreCache): GenreCount {
  return userMusic.reduce((acc: any, musicId: string) => {
    const genres = knownGenreCache[musicId] || [];
    for (const genre of genres) {
      acc[genre] = (acc[genre] || 0) + 1;
    }
    return acc;
  }, {});
}
  
function calculateSingleMusicScore(musicId: string, musicListenCounts: MusicCount, genreListenCounts: GenreCount, weight: number, knownGenreCache) {
  let score = 0;
  score += musicListenCounts[musicId] * weight * MUSIC_SCORE_FACTOR;

  const genres = knownGenreCache[musicId] || [];
  for (const genre of genres) {
    if (genreListenCounts[genre]) {
      score += genreListenCounts[genre] * weight * GENRE_SCORE_FACTOR;
    }
  }
  return score;
}
  
function calculateMusicScore(musicListenCounts: MusicCount, genreListenCounts: GenreCount, weight: number, knownGenreCache): MusicScore {
  return Object.keys(musicListenCounts).reduce((acc: any, musicId: string) => {
    acc[musicId] = calculateSingleMusicScore(musicId, musicListenCounts, genreListenCounts, weight, knownGenreCache);
    return acc;
  }, {})
}
  
function mergeMusicScore(original: MusicScore, newScore: MusicScore) {
  return Object.entries(newScore).reduce((acc: any, [musicId, score]) => {
    acc[musicId] = (acc[musicId] || 0) + score;
    return acc;
  }, { ...original });
}
  
//BFS traverse all followees
export async function buildRecommendationScores(userId: string, knownGenreCache) {
  const marked: Set<string> = new Set(userId);
  const queue: Array<{ userId: string, level: number }> = [];
  queue.push({ userId, level: MAX_LEVEL });
  //calculate scores from followees

  let allMusicScore = {} as MusicScore;
  while(queue.length > 0) {
    const currentUser = queue.shift();
    const userMusicHistory = await getUserMusicHistory(currentUser.userId);
    const followees = await getUserFollowees(currentUser.userId);
    
    //count number of times each music has been played
    const musicListenCounts = getMusicListenCounts(userMusicHistory);
    //count number of times each genre has been played
    const genreListenCounts = getGenreListenCounts(userMusicHistory, knownGenreCache);
    
    //calculate recommendation scores
    const userMusicScore = calculateMusicScore(musicListenCounts, genreListenCounts, currentUser.level, knownGenreCache);
    allMusicScore = mergeMusicScore(allMusicScore, userMusicScore)
    
    //traverse all user's followees
    for(const followee of followees) {
      if(!marked.has(followee)) {
        if(currentUser.level > 1) {
          marked.add(followee);
          queue.push({ userId: followee, level: currentUser.level - 1 })
        }
      }
    }
  }
  return allMusicScore;
}
  
export async function getTopFiveRecommendations(musicScore: MusicScore, userId: string) {
  //sort music list base on scores in decending order
  // const sorted = Object.entries(musicScore).sort((a, b) => b[1] - a[1]);
  const musicScoreObj = Object.entries(musicScore).map((ms) => {
    return { musicId: ms[0], score: ms[1] };
  });
  const sorted = orderBy(musicScoreObj, ['score', 'musicId'], ['desc']).map((ms) => ms.musicId);
  let filtered = sorted;
  if(NEW_MUSIC_ONLY) {
    const userMusic = await getUserMusicHistory(userId) || [];
    const userMusicSet = new Set();
    //only add new music that user hasn't listened before
    userMusic.forEach((m) => !userMusicSet.has(m) && userMusicSet.add(m));
  
    filtered = sorted.filter((musicId) => !userMusicSet.has(musicId));
  }
  const topFive = filtered.slice(0, 5);
  return topFive;
}