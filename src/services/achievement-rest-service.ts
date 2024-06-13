const baseURI = 'http://timetomaster-backend-dev.us-east-1.elasticbeanstalk.com';

export const search = async <T> (url: string, query: any = {} ): Promise<T[]> => {
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