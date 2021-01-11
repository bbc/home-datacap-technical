const { getAncestors, getProgrammeEpisodeIds, getSeriesEpisodeIds } = require('../backends/relational-db');
const { getSummary } = require('../backends/summary-api');
const { getProgrammeEpisodes } = require('./programme-episodes');

jest.mock('../backends/relational-db');
jest.mock('../backends/summary-api');

getAncestors.mockImplementation(() => ['root-id', 'parent-id']);

getProgrammeEpisodeIds.mockImplementation(() => ['episode1', 'episode2', 'episode3']);

getSeriesEpisodeIds.mockImplementation(() => ['episode2', 'episode3']);

getSummary.mockImplementation(
    () => ({
        id: 'mock-id',
        type: 'episode',
        title: 'mock title',
        shortSynopsis: 'mock short synopsis',
        duration: 60,
        position: 1,
        brand: {
            id: 'mock-brand',
            name: 'Mock Brand'
        }
    })
);

it('rejects invalid inputs', async () => {
    const invalidInputs = [
        { querystring: {} },
        { querystring: { programme: 'programme-id', series: 'series-id' } },
        { querystring: { programme: 'programme-id', page: '-1' } },
        { querystring: { programme: 'programme-id', page: 'x' } },
    ];

    const expected = {
        status: 400
    };

    const actuals = await Promise.all(invalidInputs.map(getProgrammeEpisodes));

    expect.assertions(invalidInputs.length);
    actuals.forEach(actual => { expect(actual).toMatchObject(expected)});
})

it('returns summaries for a programme', async () => {
    const expectedSummary = {
        id: 'mock-id',
        type: 'episode',
        title: 'mock title',
        synopsis: 'mock short synopsis',
        duration: 60,
        position: 1,
        seriesId: 'parent-id',
        programmeId: 'programme-id',
        brand: {
            id: 'mock-brand',
            name: 'Mock Brand'
        }
    }
    const expected = {
        status: 200,
        data: {
            items: [
                expectedSummary,
                expectedSummary,
                expectedSummary
            ]
        }
    };
    

    const actual = await getProgrammeEpisodes({ querystring: { programme: 'programme-id' }});

    expect(actual).toMatchObject(expected);
});

it('returns summaries for a series', async () => {
    const expectedSummary = {
        id: 'mock-id',
        type: 'episode',
        title: 'mock title',
        synopsis: 'mock short synopsis',
        duration: 60,
        position: 1,
        seriesId: 'series-id',
        programmeId: 'root-id',
        brand: {
            id: 'mock-brand',
            name: 'Mock Brand'
        }
    }
    const expected = {
        status: 200,
        data: {
            items: [
                expectedSummary,
                expectedSummary
            ]
        }
    };
    

    const actual = await getProgrammeEpisodes({ querystring: { series: 'series-id' }});

    expect(actual).toMatchObject(expected);
});

it('returns the page count', async () => {
    getProgrammeEpisodeIds.mockImplementationOnce(() => Array(71).fill('episode'));

    const actual = await getProgrammeEpisodes({ querystring: { programme: 'programme-id', page: 4 }});

    const expected = {
        status: 200,
        data: {
            page: {
                current: 4,
                total: 8,
                totalItems: 71
            }
        }
    };

    expect(actual).toMatchObject(expected);
});