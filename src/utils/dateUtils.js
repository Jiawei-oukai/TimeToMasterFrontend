import { eachDayOfInterval, format } from 'date-fns';

export const getDateRange = (startDate, endDate) => {
    return eachDayOfInterval({ start: startDate, end: endDate }).map(date => format(date, 'MM-dd'));
};

export const fillMissingDates = (records, dateRange) => {
    const recordsMap = records.reduce((map, record) => {
        const formattedDate = record.recordsDate.slice(5);
        map[formattedDate] = { ...record, recordsDate: formattedDate };
        return map;
    }, {});

    return dateRange.map(date => {
        return recordsMap[date] || { goalId: records[0].goalId, goalName: records[0].goalName, recordsDate: date, totalHours: 0 };
    });
};