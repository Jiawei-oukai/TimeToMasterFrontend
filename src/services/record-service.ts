import { create, getAll, search, searchByEmail, searchByDate } from './record-rest-service';
import Record  from '@/models/record';
import DailyRecord from '@/models/record-daily';
import RecordCreate from '@/models/record-create';

export const createRecord = async (record: RecordCreate) => {
  const goal = await create(record);
  return goal;
}


export const getDailyByEmail = async (email: string): Promise<DailyRecord[]> => {
  let url = '/records/userSearch/dailyTime';
  const query: any = {};
  query.email = email;

  const records = await searchByEmail<DailyRecord>(url, query);
  return records;
}

export const getWeeklyByEmail = async (email: string): Promise<DailyRecord[]> => {
  let url = '/records/userSearch/weeklyTime';
  const query: any = {};
  query.email = email;

  const records = await searchByEmail<DailyRecord>(url, query);
  return records;
}

export const getMonthlyByEmail = async (email: string): Promise<DailyRecord[]> => {
  let url = '/records/userSearch/monthlyTime';
  const query: any = {};
  query.email = email;

  const records = await searchByEmail<DailyRecord>(url, query);
  return records;
}

export const getByDate = async (date: string, email: string): Promise<Record[]> => {
  let url = '/records/search/date';
  const query: any = {
    date: date,
    email: email
  };

  const records = await searchByDate<Record>(url, query);
  return records;
};

export const getDailyByGid = async (gid : String): Promise<DailyRecord[]> => {
  let url = '/records/search/dailyTime';
  const query: any = {};
  query.gid = gid;

  const records = await searchByEmail<DailyRecord>(url, query);
  return records;
}

export const getWeeklyByGid = async (gid : String): Promise<DailyRecord[]> => {
  let url = '/records/search/weeklyTime';
  const query: any = {};
  query.gid = gid;

  const records = await searchByEmail<DailyRecord>(url, query);
  return records;
}

export const getMonthlyByGid = async (gid : String): Promise<DailyRecord[]> => {
  let url = '/records/search/MonthlyTime';
  const query: any = {};
  query.gid = gid;

  const records = await searchByEmail<DailyRecord>(url, query);
  return records;
}

export const getAllRecordByEmail = async (email: string) => {
  const records = await getAll(email);
  return records;
}

// export const searchRecord = async (buttonLabel: string): Promise<Record[]> => {
//   let url = '';
//   let uid = '123456'
//   const query: any = {};

//   if (buttonLabel === 'All') {
//     url = '/records/user/' + uid;
//   } else if (buttonLabel === 'Half Done') {
//     url = '/records/search/progress';
//     query.uid = uid;
//     query.start = 0;
//     query.end = 0.5;
//   } else if (buttonLabel === 'Nearly Done') {
//     url = '/records/search/progress';
//     query.uid = uid;
//     query.start = 0.5;
//     query.end = 0.99;
//   } else if (buttonLabel === 'Completed') {
//     url = '/records/search/progress';
//     query.uid = uid;
//     query.start = 0.99;
//     query.end = 1.001;
//   }

//   const records = await search<Record>(url, query);
//   return records;
// }