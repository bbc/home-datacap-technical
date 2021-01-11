const faker = require('faker');
const delay = async (ms) => new Promise(resolve => setTimeout(resolve, ms));

module.exports = {
    veryFastApi: () => delay(faker.random.number({ min: 10, max: 50 })),
    fastApi: () => delay(faker.random.number({ min: 300, max: 600 })),
    moderatelyFastApi: () => delay(faker.random.number({ min: 800, max: 1200 })),
    slowApi: () => delay(faker.random.number({ min: 2000, max: 4000 }))
}