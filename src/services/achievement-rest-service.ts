const baseURI = process.env.BE_BASE_URI;

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