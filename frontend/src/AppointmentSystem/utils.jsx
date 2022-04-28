const addDays = (prevDate, noOfDays) => {
    return new Date(prevDate.getTime() + noOfDays * 24 * 60 * 60 * 1000);
};

const addMinutes = (prevTime, noOfMins) => {
    return new Date(prevTime.getTime() + noOfMins * 60 * 1000);
};

const printableDate = (fullDate) => {
    //   console.log(date.getDate());
    //   console.log(date.getMonth());
    //   console.log(date.getFullYear());
    let finalDate = "";
    const date = fullDate.getDate();
    if (date < 10) finalDate += "0" + date;
    else finalDate += date;

    finalDate += "/";

    const month = fullDate.getMonth();
    if (month < 10) finalDate += "0" + month;
    else finalDate += month;

    finalDate += "/";

    const year = fullDate.getFullYear();
    finalDate += year;

    const days = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
    ];

    finalDate += `\n${days[fullDate.getDay()]}`;

    //   console.log(finalDate);
    return finalDate;
};

const printableTime = (time) => {
    let finalTime = "";
    const hours = time.getHours();
    const minutes = time.getMinutes();
    let ampm = "am";

    if (hours < 10) finalTime += "0" + hours;
    else if (hours > 12) {
        finalTime += hours - 12;
        ampm = "pm";
    } else finalTime += hours;

    finalTime += ":";

    if (minutes < 10) finalTime += "0" + minutes;
    else finalTime += minutes;
    finalTime += " " + ampm;

    //   console.log(finalTime);
    return finalTime;
};

export { printableDate, printableTime, addDays, addMinutes };