import {faker} from "@faker-js/faker";
const bedTypes = ['King', 'Double', 'Single', 'Sofa']

function hotelsDataGenerator(){
    let hotels = [];
    for(let i = 0; i < 20; i++){
        let rooms = [];
        let price = 0;
        for(let i = 0; i < faker.number.int({max: 6, min: 1}); i++){
            let room = {
                id: i,
                name:  faker.word.sample() + ' Room',
                poster: faker.image.urlLoremFlickr({category: 'hotel'}),
                maxGuests: faker.number.int({max: 7}),
                beds: bedsDataGenerator(),
                amenities: ['pool', 'beach', 'Air Conditioning',],
                price: faker.number.int({max: 1000}),
                discounted: false,
                discount: {
                    oldPrice: 400,
                    dealId: 0,
                    message: ''
                },
                available: 10,
            }
            if (room.price > price){
                price = room.price;
            }
            rooms.push(room);
        }

        const stay = {
            id: i,
            name: 'The ' + faker.person.lastName() + ' Inn',
            price: price,
            rating: faker.number.int({max: 1000}) / 100,
            bath: faker.number.int({max: 10}),
            bed: faker.number.int({max: 10}),
            maxGuests: faker.number.int({max: 10}),
            description: faker.lorem.paragraphs(8),
            type: 'hotel',
            rooms: rooms,
            location: {
                city: faker.location.city(),
                country: faker.location.country(),
            },
            poster: faker.image.urlLoremFlickr({category: 'HotelRoom'}),
            images: [faker.image.urlLoremFlickr({category: 'HotelRoom'}), faker.image.urlLoremFlickr({category: 'HotelRoom'}), faker.image.urlLoremFlickr({category: 'HotelRoom'}), faker.image.urlLoremFlickr({category: 'HotelRoom'})]
        }
        hotels.push(stay);

    }
    return hotels;
}

function bedsDataGenerator(){
    let beds = [];
    for(let i = 0; i < faker.number.int({max: 4, min: 1}); i++){
        let bedType = bedTypes[Math.floor(Math.random() * bedTypes.length)];
        let number = (bedType === 'King' || bedType === 'Sofa')? 1 : (bedType === 'Double') ? 2 : faker.number.int({max: 4});
        beds.push({
            type: bedType,
            number
        })
    }
    return beds;
}

const hotelsData = [
    ...hotelsDataGenerator()
]


export default hotelsData;