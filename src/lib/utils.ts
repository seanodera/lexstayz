import {countries} from "country-data";



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

    return months[num];
}

export const monthStringShort = ({num}: { num: number }) => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    return months[num];
}

export const monthInt = ({month}: { month: string }) => {
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    let finalIndex = 0;
    for (let index = 0; index <= months.length; index++) {
        if (months[index].toLocaleLowerCase() === month.toLocaleLowerCase()) {
            finalIndex = index;
        }
    }
    return finalIndex;
}

export const timeFromDate = ({date, am_pm = true}: {date: Date, am_pm: boolean}) => {
    let _date = new Date(date);

    if (am_pm){
        let hours = _date.getHours();
        let minutes: string | number = _date.getMinutes();
        let ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        minutes = minutes < 10 ? '0'+minutes : minutes;
        return hours + ':' + minutes + ' ' + ampm;
    } else {
        return `${_date.getHours()}:${_date.getMinutes()}`;
    }
}

export const dayStringShort = ({num}: { num: any }) => {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat",]
    return days[num];
}

export const dateReader = ({date = Date.now(), month = true, years = true, weekDay = false} :{date?: Date | number| string, month?: boolean , years?: boolean , weekDay?: boolean}) => {

    let _date = new Date(date);
    let dateString = '';
    if (weekDay) {
        dateString = dateString.concat(dayStringShort({num: _date.getDay()}), ' ')
    }
    dateString = dateString.concat(_date.getDate().toString(), ' ')
    if (month) {
        dateString = dateString.concat(monthStringShort({num: _date.getMonth()}), ' ')
    }
    if (years) {
        dateString = dateString.concat(_date.getFullYear().toString())
    }

    return dateString;
}

export async function getCountry() {
    try {
        // Fetch the client's IP address
        const ipResponse = await fetch('https://api.ipify.org?format=json');
        const ipData = await ipResponse.json();
        const ip = ipData.ip;

        // Fetch the country using the IP address
        const countryResponse = await fetch(`https://ipapi.co/${ip}/json/`);
        const countryData = await countryResponse.json();
        const countryCode = countryData.country;

        // Get country information from country-data package
        const country = countries[countryCode];

        return {
            name: country.name,
            emoji: country.emoji,
            currency: country.currencies[0]
        };
    } catch (error) {
        console.error("Error fetching country data: ", error);
        return undefined;
    }
}

export function serviceCountries() {
    let list = ['KE', 'GH', 'UK','CY']
    return list.map((e) => countries[e])
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

export function toMoneyFormat(amount: number ) {

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
        months.push({ year, month });

        // Move to the previous month
        currentDate.setMonth(currentDate.getMonth() - 1);
    }

    return months;
};

function getRandomSubarray(arr: Array<any>, size: number) {
    let shuffled = arr.slice(0), i = arr.length, temp, index;
    while (i--) {
        index = Math.floor((i + 1) * Math.random());
        temp = shuffled[ index ];
        shuffled[ index ] = shuffled[ i ];
        shuffled[ i ] = temp;
    }
    return shuffled.slice(0, size);
}


export const getExchangeRate = async (fromCurrency:string, toCurrency:string) => {
    try {
        const response = await fetch(`https://open.er-api.com/v6/latest/${fromCurrency}`);
        const data = await response.json();
        console.log(data)
        //https://www.exchangerate-api.com/docs/free
        const exchangeRate = data.rates[toCurrency];
        if (!exchangeRate) {
            throw new Error(`Unable to find exchange rate for ${toCurrency}`);
        }
        return exchangeRate;
    } catch (error) {
        console.error("Error fetching exchange rate: ", error);
        return null;
    }
};


