const faker = require('faker');
const { slowApi } = require('./async-simulator');

// A completely simulated API -- do not edit

const generateSchedule = () => {
    const start = faker.date.soon();
    const end = new Date(start.getTime() + (60 * 60 * 1000));
    const service = faker.random.word();
    const mediaType = faker.random.arrayElement(['video', 'audio_video']);
    return {
        start,
        end,
        services: [
            {
                id: `bbc_${service.toLowerCase()}`,
                name: `BBC ${service}`,
                type: mediaType === 'video' ? 'TV' : 'Radio',
                mediaType
            }
        ]
    }
}

const getBroadcasts = async (id) => {
    await slowApi();
    
    return Array(faker.random.number({min: 0, max: 3})).fill(0).map(generateSchedule);
}

module.exports = { getBroadcasts }