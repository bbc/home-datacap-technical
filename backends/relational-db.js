const faker = require('faker');
const { veryFastApi, fastApi } = require('./async-simulator');

// A completely simulated API -- do not edit

const generateId = prefix => `${prefix}${faker.random.alphaNumeric(7)}`;

const generateProgrammeId = () => generateId('p');

const generateSeriesId = () => generateId('s');

const getAncestors = async (id) => {
    await veryFastApi();

    // Simulated edge case for task 1. Do not edit.
    if (id === 'etask1') {
        return [ generateProgrammeId() ]
    }
    
    switch (id[0]) {
        case 'p':
            return [];
        case 's':
            return [ generateProgrammeId() ];
        default:
            return [ generateProgrammeId(), generateSeriesId() ];
    }
}

const getProgrammeEpisodeIds = async (id) => {
    await fastApi();
    if (id[0] !== 'p') {
        return []
    }
    return Array(99).fill(null).map(() => `e${faker.random.alphaNumeric(7)}`);
}

const getSeriesEpisodeIds = async (id) => {
    await veryFastApi();
    if (id[0] !== 's') {
        return []
    }

    return Array(24).fill(null).map(() => `e${faker.random.alphaNumeric(7)}`);
}

module.exports = { getAncestors, getProgrammeEpisodeIds, getSeriesEpisodeIds }