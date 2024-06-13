import  {getAllByEmail, create, search, update, remove} from './goal-rest-service';
import PartialGoal from "../models/goal-update";

export const getAllGoalByEmail = async (email: string) => {
  const goals = await getAllByEmail(email);
  return goals;
}

export const createGoal = async (partialGoal: PartialGoal) => {
  const goal = await create(partialGoal);
  return goal;
}

export const updateGoal = async (id: string, partialGoal: PartialGoal) => {
  const goal = await update(id, partialGoal);
  return goal;
}

export const deleteGoal = async (id: string) => {
  remove(id);
}


export const searchGoal = async <Goal> (buttonLabel: string, email: string): Promise<Goal[]> => {
  let url = '';
  const query: any = {};

  if( buttonLabel === 'All') {
      url = '/goals/userEmail/' + email;
  } else if(buttonLabel === 'Half Done') {
      url = '/goals/search/progress';
      query.email = email;
      query.start = 0.25;
      query.end = 0.75;
  } else if(buttonLabel === 'Nearly Done') {
      url = '/goals/search/progress';
      query.email = email;
      query.start = 0.75;
      query.end = 0.99;
  } else if(buttonLabel === 'Completed') {
    url = '/goals/search/progress';
    query.email = email;
    query.start = 0.99;
    query.end = 1.001;
}

  const goals = await search<Goal>(url, query);
  return goals;
}