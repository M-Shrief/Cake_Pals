import { Dayjs } from "dayjs";
import {
  format,
  now,
  add,
  subtract,
  difference,
  timeTo,
  isAfter,
  isSame,
  getDuration,
  addDuration,
} from "../duration";

describe("dealing with timeOperations ", () => {
  it("adding 1 timeUnit Correctly", async () => {
    const time = { days: 1, hours: 10 };
    const addAnHour = add(time, 1, "h").toObject();
    const addADay = add(time, 1, "d").toObject();

    expect(addAnHour).toEqual({
      years: 2023,
      date: 1,
      months: 0,
      hours: 11,
      minutes: 0,
      seconds: 0,
      milliseconds: 0,
    });
    expect(addADay).toEqual({
      years: 2023,
      date: 2,
      months: 0,
      hours: 10,
      minutes: 0,
      seconds: 0,
      milliseconds: 0,
    });
  });

  it("subtracting 1 timeUnit Correctly", () => {
    const time = { days: 2, hours: 10 };
    const subtractAnHour = subtract(time, 1, "h").toObject();
    const subtractADay = subtract(time, 1, "d").toObject();

    expect(subtractAnHour).toEqual({
      years: 2023,
      date: 2,
      months: 0,
      hours: 9,
      minutes: 0,
      seconds: 0,
      milliseconds: 0,
    });
    expect(subtractADay).toEqual({
      years: 2023,
      date: 1,
      months: 0,
      hours: 10,
      minutes: 0,
      seconds: 0,
      milliseconds: 0,
    });
  });

  it("get the TimeDifference Correctly", () => {
    const time1 = { days: 2, hours: 10 };
    const time2 = { days: 1, hours: 10 };

    const dayDiff = difference(time1, time2, "d");
    const hourDiff = difference(time1, time2, "h");

    expect(dayDiff).toEqual(1);
    expect(hourDiff).toEqual(24);
  });
});

describe("dealing with relativeTimes", () => {
  it("test timeTo() operation", async () => {
    const time1 = { days: 2, hours: 10 };
    const time2 = { days: 1, hours: 10 };

    const timeAgo = timeTo(time1, time2);
    const inTime = timeTo(time2, time1);

    expect(timeAgo).toEqual("a day ago");
    expect(inTime).toEqual("in a day");
  });

  it("test isAfter() operation", async () => {
    const time1 = { days: 2, hours: 10 };
    const time2 = { days: 1, hours: 10 };

    const after = isAfter(time1, time2);
    const notAfter = isAfter(time2, time1);

    expect(after).toEqual(true);
    expect(notAfter).toEqual(false);
  });

  it("test isSame() operation", async () => {
    const time1 = { days: 2, hours: 10 };
    const time2 = { days: 2, hours: 9 };

    const sameDay = isSame(time1, time2, "d");
    const notSameHour = isSame(time2, time1, "h");

    expect(sameDay).toEqual(true);
    expect(notSameHour).toEqual(false);
  });
});

describe("Dealing with Durations", () => {
  it("test getDuration() operation", async () => {
    const time1 = { hours: 10 };
    const time2 = { hours: -10 };

    const duration = getDuration(time1).humanize();

    expect(duration).toEqual("10 hours");
  });

  it("test addDuration() operation", async () => {
    const time1 = { hours: 10, minutes: 30 };
    const time2 = { hours: 10, minutes: 20 };
    const time3 = { hours: 10, minutes: -20 };

    const duration1 = addDuration(time1, time2);
    const duration2 = addDuration(time1, time3);

    expect(duration1).toEqual({
      years: 2023,
      date: 19,
      months: 3,
      hours: 20,
      minutes: 50,
      seconds: 0,
      milliseconds: 0,
    });
    expect(duration2).toEqual({
      years: 2023,
      date: 19,
      months: 3,
      hours: 20,
      minutes: 10,
      seconds: 0,
      milliseconds: 0,
    });
  });
});
