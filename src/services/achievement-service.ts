import  {search} from './achievement-rest-service';
import Achievement  from '../models/achievement';
import AchievementDisplay from "../models/achievement-display";

const achievementURI = '/achievements';
export const getAllAchievement = async () => {
    const achievements = await search<Achievement>(achievementURI, {});
    return achievements;
}

const baseURI = process.env.BE_BASE_URI;

export const searchAchievement = async <T> (url: string, query: any = {} ): Promise<T[]> => {
    const params: URLSearchParams = new URLSearchParams(query);
    const response = await fetch( baseURI + url + '?' + params, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });

    const data: T[] = (await response.json()) as T[];
    return data;
}


export const createAchievement = async (achievementDisplay: AchievementDisplay) => {
    const response = await fetch('http://timetomaster-backend-dev.us-east-1.elasticbeanstalk.com/achievements', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(achievementDisplay),
    });
  
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
}

export const updateAchievement = async (id: string, achievementDisplay: AchievementDisplay) => {
  const response = await fetch(`http://timetomaster-backend-dev.us-east-1.elasticbeanstalk.com/achievements/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      ...achievementDisplay,
      achieved: achievementDisplay.achieved, 
      achievementDate: achievementDisplay.achievementDate, 
      goalId: achievementDisplay.goalId,
    }),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return await response.json();
}

export const deleteAchievement = async (id: string) => {
  const response = await fetch(`http://timetomaster-backend-dev.us-east-1.elasticbeanstalk.com/achievements/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
}
