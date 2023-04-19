// npx ts-node src/utils/duration.ts
import dayjs, { Dayjs, ConfigType, ManipulateType } from "dayjs";
import duration, { DurationUnitType } from "dayjs/plugin/duration";
import objectSupport from "dayjs/plugin/objectSupport";
import relativeTime from "dayjs/plugin/relativeTime";
import toObject from "dayjs/plugin/toObject";

// to support use object as dates
dayjs.extend(objectSupport);
// to reform dates to Objects { years: 2023,months: 3,date: 18,hours: 1,minutes: 30 }
dayjs.extend(toObject);

// getTime & format
export const now = dayjs();

type formatUnits = "DD-MM-YYYY" | "HH-mm"; //  Day:DD - Month:MM - Year:YYYY - hours:HH - minutes:mm
export const format = (time: ConfigType, format: formatUnits) =>
  dayjs(time).format(format);

// Operations
export const add = (time: ConfigType, num: number, unit: ManipulateType) =>
  dayjs(time).add(num, unit); // now.add(2, 'M')

export const subtract = (time: ConfigType, num: number, unit: ManipulateType) =>
  dayjs(time).subtract(num, unit); // now.subtract(2, 'M')

export const difference = (
  time1: ConfigType,
  time2: ConfigType,
  unit: ManipulateType
) => dayjs(time1).diff(time2, unit); // now.diff('2022-06-05', 'month')

// Deal with relativeTimes
dayjs.extend(relativeTime);

export const timeTo = (time1: ConfigType, time2: ConfigType) =>
  dayjs(time1).to(time2); // time1 > time2 ? x year ago: in x years

export const isAfter = (
  time1: ConfigType,
  time2: ConfigType,
  unit?: ManipulateType
) => dayjs(time1).isAfter(time2, unit); // time1 > time2 ? true : false

export const isSame = (
  time1: ConfigType,
  time2: ConfigType,
  unit: ManipulateType
) => dayjs(time1).isSame(time2, unit);

// Durations (Humanized)
dayjs.extend(duration);

interface time {
  milliseconds?: number;
  seconds?: number;
  minutes?: number;
  hours?: number;
  days?: number;
  months?: number;
  years?: number;
  weeks?: number;
}

export const getDuration = (
  time: time // time > 0 ? a duration in the future : a duration in the past
) => dayjs.duration(time);

export const addDuration = (time1: ConfigType, time2: ConfigType) =>
  dayjs(time1)
    .add(dayjs.duration({ ...(time2 as {}) }))
    .toObject();
