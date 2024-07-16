import {faker} from "@faker-js/faker";

function hotelsDataGenerator(){
    let hotels = [];
    for(let i = 0; i < 20; i++){
        hotels.push( {
            id: i,
            name: 'The ' + faker.person.lastName() + ' Inn',
            price: faker.number.int({max: 1000}),
            rating: faker.number.int({max: 1000})/ 100,
            bath: faker.number.int({max: 10}),
            bed: faker.number.int({max: 10}),
            maxGuests: faker.number.int({max: 10}),
            location: {
                city: faker.location.city(),
                country: faker.location.country(),
            },
            poster: faker.image.urlLoremFlickr({category: 'HotelRoom'})
        });
    }
    return hotels;
}


const hotelsData = [
    ...hotelsDataGenerator()
]


export default hotelsData;