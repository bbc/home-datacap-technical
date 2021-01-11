const { getAncestors } = require('../backends/relational-db');
const { getSummary } = require('../backends/summary-api');
const { getAvailability } = require('../backends/availability-api');
const { getBroadcasts } = require('../backends/broadcast-api');
const { getEpisodeDetail } = require('./programme-episode');

jest.mock('../backends/relational-db');
jest.mock('../backends/summary-api');
jest.mock('../backends/availability-api');
jest.mock('../backends/broadcast-api');

const testParams = { path: { id: 'mock-id' } };

getAncestors.mockImplementation(() => ['root-id', 'parent-id']);

getSummary.mockImplementation(
    () => ({
        type: 'episode',
        title: 'mock title',
        shortSynopsis: 'mock short synopsis',
        mediumSynopsis: 'mock medium synopsis',
        longSynopsis: 'mock long synopsis',
        duration: 123,
        position: 4,
        brand: {
            id: 'mock-brand',
            name: 'Mock Brand'
        }
    })
);

getAvailability.mockImplementation(
    () => ({
        from: new Date('2000-01-01'),
        until: null,
        isAvailable: true,
    })
);

getBroadcasts.mockImplementation(
    () => [
        {
            start: new Date('2021-02-01T01:00:00.0Z'),
            end: new Date('2021-02-01T02:00:00.0Z'),
            services: [
                {
                    id: 'mock-service',
                    name: 'Mock Service',
                    type: 'TV',
                    mediaType: 'audio_video'
                }
            ]
        }
    ]
);

it('returns 404 when content does not exist', async () => {
    getSummary.mockImplementationOnce(() => { throw new Error('404'); });

    const expected = {
        status: 404,
        message: 'Episode not found.'
    };

    const actual = await getEpisodeDetail(testParams);

    expect(actual).toEqual(expected);
});

it('returns a full response', async () => {
    const expected = {
        status: 200,
        data: {
            id: 'mock-id',
            title: 'mock title',
            synopsis: {
                short: 'mock short synopsis',
                medium: 'mock medium synopsis',
                long: 'mock long synopsis',
            },
            duration: 123,
            position: 4,
            series: {
                id: 'parent-id',
                title: 'mock title'
            },
            programme: {
                id: 'root-id',
                title: 'mock title'
            },
            brand: {
                id: 'mock-brand',
                name: 'Mock Brand'
            },
            availability: {
                from: new Date('2000-01-01T00:00:00.000Z'),
                until: null,
                isAvailable: true,   
            },
            nextBroadcast: {
                start: new Date('2021-02-01T01:00:00.000Z'),
                end: new Date('2021-02-01T02:00:00.000Z'),
                services: [
                    {
                        id: 'mock-service',
                        name: 'Mock Service',
                        type: 'TV',
                        mediaType: 'audio_video',
                    },
                ]
            }
        }
    }

    const actual = await getEpisodeDetail(testParams);

    expect(actual).toEqual(expected);
});

it("returns a response with broadcasts as 'null' if not present", async () => {
    getBroadcasts.mockImplementationOnce(() => []);
    
    const expected = {
        status: 200,
        data: {
            nextBroadcast: null
        }
    }

    const actual = await getEpisodeDetail(testParams);

    expect(actual).toMatchObject(expected);
});