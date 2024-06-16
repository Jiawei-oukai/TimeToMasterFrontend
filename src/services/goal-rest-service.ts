import Goal  from '../models/goal';
import PartialGoal from "../models/goal-update";

const baseURI = process.env.BE_BASE_URI;

export const getAllByEmail = async (email: string): Promise<Goal[]> => {
    const url = `/goals/userEmail/${email}`;
    const response = await fetch( baseURI + url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });

    const goals: Goal[] = (await response.json()) as Goal[];
    return goals;
}

export const update = async (id: string, partialGoal: PartialGoal) => {
    const url = '/goals/';
    const response = await fetch(baseURI + url + id, {
        method: 'PUT',
        headers: {
        'Content-Type': 'application/json',
        },
        body: JSON.stringify(partialGoal),
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    const updateGoal: Goal = (await response.json()) as Goal;
    return updateGoal;
}


export const search = async <Goal> (url: string, query: any = {} ): Promise<Goal[]> => {
    const params: URLSearchParams = new URLSearchParams(query);
    const response = await fetch( baseURI + url + '?' + params, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });
    const goals: Goal[] = (await response.json()) as Goal[];
    return goals;
}


export const create = async (partialGoal: PartialGoal) => {
    const url = '/goals';
    const response = await fetch(baseURI + url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(partialGoal),
    });
  
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    const newGoal: Goal = (await response.json()) as Goal;
    return newGoal;
}

export const remove = async (id: string) => {
    const url = '/goals/';
    const response = await fetch(baseURI + url + id, {
        method: 'DELETE',
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
}