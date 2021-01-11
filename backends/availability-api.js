const faker = require('faker');
const { moderatelyFastApi } = require('./async-simulator');

// A completely simulated API -- do not edit

const getAvailability = async () => {
    await moderatelyFastApi();
    
    const from = faker.date.past(7);
    const until = faker.random.arrayElement([faker.date.recent(), faker.date.future(), null]);
    return {
        from,
        until,
        isAvailable: until === null || until > new Date(),
    }
}

module.exports = { getAvailability }