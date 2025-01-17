import {countries} from "country-data";
import {differenceInMilliseconds, startOfDay} from "date-fns";

export const handler_url = process.env.NEXT_PUBLIC_HANDLER || 'http://localhost:4500';

export function getRandomInt({max, min = 0}: { max: number, min?: number }) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

export const getAbbreviation = ({num}: { num: number }) => {

    if (num === 1 || num === 21 || num === 31) {
        return num.toString() + 'st'
    } else {
        return num.toString() + 'th'
    }
}

export const monthString = ({num}: { num: number }) => {
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    return months[ num ];
}

export const monthStringShort = ({num}: { num: number }) => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    return months[ num ];
}

export const monthInt = ({month}: { month: string }) => {
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    let finalIndex = 0;
    for (let index = 0; index <= months.length; index++) {
        if (months[ index ].toLocaleLowerCase() === month.toLocaleLowerCase()) {
            finalIndex = index;
        }
    }
    return finalIndex;
}

export const timeFromDate = ({date, am_pm = true}: { date: Date | number | string | any, am_pm: boolean }) => {
    let _date = new Date(date);

    if (am_pm) {
        let hours = _date.getHours();
        let minutes: string | number = _date.getMinutes();
        let ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12;
        minutes = minutes < 10 ? '0' + minutes : minutes;
        return hours + ':' + minutes + ' ' + ampm;
    } else {
        return `${_date.getHours()}:${_date.getMinutes()}`;
    }
}

export const dayStringShort = ({num}: { num: any }) => {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat",]
    return days[ num ];
}

export const dateReader = ({date = Date.now(), day = true, month = true, years = true, weekDay = false}: {
    date?: Date | number | string,
    day?: boolean,
    month?: boolean,
    years?: boolean,
    weekDay?: boolean
}) => {

    let _date = new Date(date);
    let dateString = '';
    if (weekDay) {
        dateString = dateString.concat(dayStringShort({num: _date.getDay()}), ' ')
    }
    if (day) {
        dateString = dateString.concat(_date.getDate().toString(), ' ')
    }
    if (month) {
        dateString = dateString.concat(monthStringShort({num: _date.getMonth()}), ' ')
    }
    if (years) {
        dateString = dateString.concat(_date.getFullYear().toString())
    }

    return dateString;
}

import axios from 'axios';

export async function getCountry() {
    try {
        // Fetch the client's IP address using Axios
        const ipResponse = await axios.get('https://api.ipify.org?format=json');
        const ip = ipResponse.data.ip;
        const apiKey = process.env.NEXT_PUBLIC_IPGEOLOCATION_API_KEY;
        // Try the primary API route first
        try {
            const countryResponse = await axios.get(`https://api.ipgeolocation.io/ipgeo?apiKey=${apiKey}&ip=${ip}`);
            const countryCode = countryResponse.data.country_code2;

            const country = countries[countryCode];
            return {
                name: country.name,
                emoji: country.emoji,
                currency: country.currencies[0],
                latitude: countryResponse.data.latitude,
                longitude: countryResponse.data.longitude,
            };

        } catch (primaryError) {
            console.warn('Primary API failed, attempting secondary API', primaryError);

            const backupCountryResponse = await axios.get("https://freegeoip.app/json/");
            const backupCountryCode = backupCountryResponse.data.country_code;

            const backupCountry = countries[backupCountryCode];
            return {
                name: backupCountry.name,
                emoji: backupCountry.emoji,
                currency: backupCountry.currencies[0],
                latitude: backupCountryResponse.data.latitude,
                longitude: backupCountryResponse.data.longitude,
            };
        }
    } catch (error) {
        // console.error("Error fetching country data: ", error);
        return undefined;
    }
}

export async function createFile({url, name = 'image'}: { url: string, name?: string }) {
    let response = await fetch(url);
    let data = await response.blob();
    let metadata = {
        type: 'image/jpeg'
    };
    // ... do something with the file or return it
    return new File([data], `${name}.jpg`, metadata);
}

export function toMoneyFormat(amount: number) {

    return amount.toLocaleString(undefined, {
        minimumFractionDigits: 2, maximumFractionDigits: 2,
    });
}

export const generatePastMonths = (numMonths: number) => {
    const currentDate = new Date();
    const months = [];

    for (let i = 0; i < numMonths; i++) {
        // Calculate the year and month
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth() + 1; // getMonth() is zero-based

        // Add the year and month to the array
        months.push({year, month});

        // Move to the previous month
        currentDate.setMonth(currentDate.getMonth() - 1);
    }

    return months;
};

export function getRandomSubarray(arr: Array<any>, size: number) {
    let shuffled = arr.slice(0), i = arr.length, temp, index;
    while (i--) {
        index = Math.floor((i + 1) * Math.random());
        temp = shuffled[ index ];
        shuffled[ index ] = shuffled[ i ];
        shuffled[ i ] = temp;
    }
    return shuffled.slice(0, size);
}

export function formatRating(num: number) {
    // If the number is an integer, return it with '.0'
    if (Number.isInteger(num)) {
        return num.toFixed(1);
    }
    // Otherwise, round to two decimal places
    return num.toFixed(2);
}

export const getExchangeRate = async (fromCurrency: string, toCurrency: string) => {
    try {
        const response = await fetch(`https://open.er-api.com/v6/latest/${fromCurrency}`);
        const data = await response.json();
        //https://www.exchangerate-api.com/docs/free
        const exchangeRate = data.rates[ toCurrency ];
        if (!exchangeRate) {
            throw new Error(`Unable to find exchange rate for ${toCurrency}`);
        }
        return exchangeRate;
    } catch (error) {
        return null;
    }
};

export function roundToNearest5(x: number) { return x % 5 < 3 ? (x % 5 === 0 ? x : Math.floor(x / 5) * 5) : Math.ceil(x / 5) * 5 }

export function getFeePercentage(num: number) {
    const minNum = 1866.67;  // num corresponding to the minimum value
    const maxNum = 200;      // num corresponding to the maximum value
    const minValue = 7;      // minimum value
    const maxValue = 15;     // maximum value
    if (num > minNum){
        return minValue;
    } else if (num < maxNum){
        return maxValue;
    }
    // Linear interpolation formula
    return minValue + (maxValue - minValue) * ((minNum - num) / (minNum - maxNum));
}

export function calculateStayLength(date1:string, date2:string){
    // Get the start of the day for both dates
    const startOfDate1 = startOfDay(date1);
    const startOfDate2 = startOfDay(date2);

    // Calculate the difference in milliseconds
    const diffInMs = differenceInMilliseconds(startOfDate1, startOfDate2);

    // Calculate the total difference in days
    const diffInDays = diffInMs / (1000 * 60 * 60 * 24);

    // Round up if there's any partial day
    return Math.ceil(diffInDays);
}


