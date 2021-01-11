const faker = require('faker');
const { veryFastApi } = require('./async-simulator');

// A completely simulated API -- do not edit

const programmeTypes = {
    'p': 'programme',
    's': 'series',
    'e': 'episode',
    'c': 'clip'
}

const getSummary = async (id, expectedType) => {
    await veryFastApi();

    if (!id) {
        throw new Error("Cannot retrieve summary - no ID provided.")
    }
    
    const type = programmeTypes[id[0]];
    if (type === undefined || expectedType && type !== expectedType) {
        throw new Error('404');
    }

    const brandName = faker.random.word();

    const summary = {
        id,
        type,
        title: faker.lorem.words(3),
        shortSynopsis: faker.lorem.words(10),
        mediumSynopsis: faker.lorem.words(15),
        longSynopsis: faker.lorem.words(25),
        brand: {
            id: `bbc_${brandName.toLowerCase()}`,
            name: `BBC ${brandName}`
          }
    }
    if (type === 'episode') {
        summary.duration = 60 * 60;
    }
    if (type === 'clip') {
        summary.duration = 60 * 5;
    }
    if (type !== 'programme') {
        summary.position = faker.random.number({ min: 0, max: 12 })
    }
    return summary;
}

module.exports = { getSummary }