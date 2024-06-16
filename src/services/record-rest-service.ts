import Record  from '../models/record';
import RecordCreate from '@/models/record-create';

const baseURI = process.env.BE_BASE_URI;

export const create = async (record: RecordCreate) => {
    const url = '/records';
    const response = await fetch(baseURI + url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(record),
    });
  
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    const newRecord: Record = (await response.json()) as Record;
    return newRecord;
}

// not in used
export const getAll = async (email: string): Promise<Record[]> => {
    const url = `/records/${email}`;
    const response = await fetch( baseURI + url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });

    const records: Record[] = (await response.json()) as Record[];
    return records;
}

export const search = async <Record> (url: string, query: any = {} ): Promise<Record[]> => {
    const params: URLSearchParams = new URLSearchParams(query);
    const response = await fetch( baseURI + url + '?' + params, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });
    const records: Record[] = (await response.json()) as Record[];
    return records;
}

export const searchByEmail = async <DailyRecord> (url: string, query: any = {} ): Promise<DailyRecord[]> => {
    const params: URLSearchParams = new URLSearchParams(query);
    const response = await fetch( baseURI + url + '?' + params, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });
    const records: DailyRecord[] = (await response.json()) as DailyRecord[];
    return records;
}

export const searchByGid = async <DailyRecord> (url: string, query: any = {} ): Promise<DailyRecord[]> => {
    const params: URLSearchParams = new URLSearchParams(query);
    const response = await fetch( baseURI + url + '?' + params, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });
    const records: DailyRecord[] = (await response.json()) as DailyRecord[];
    return records;
}

export const searchByDate = async <Record> (url: string, query: any = {} ): Promise<Record[]> => {
    const params: URLSearchParams = new URLSearchParams(query);
    const response = await fetch( baseURI + url + '?' + params, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });
    const records: Record[] = (await response.json()) as Record[];
    return records;
}



export const remove = async (id: string) => {
    const url = '/records/';
    const response = await fetch(baseURI + url + id, {
        method: 'DELETE',
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
}