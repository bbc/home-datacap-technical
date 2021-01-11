const { getAncestors } = require('../backends/relational-db');
const { getSummary } = require('../backends/summary-api');
const { getProgrammeSummary } = require('./programme-summary');

jest.mock('../backends/relational-db');
jest.mock('../backends/summary-api');

const testParams = { path: { id: 'mock-id' } };

getAncestors.mockImplementation(() => ['root-id', 'parent-id']);

getSummary.mockImplementation(
    () => ({
        type: 'episode',
        title: 'mock title',
        shortSynopsis: 'mock short synopsis',
        duration: 123,
        position: 4,
        brand: {
            id: 'mock-brand',
            name: 'Mock Brand'
        }
    })
);

it('returns 404 when content does not exist', async () => {
    getSummary.mockImplementationOnce(() => { throw new Error('404'); });

    const expected = {
        status: 404,
        message: 'Summary not found.'
    };

    const actual = await getProgrammeSummary(testParams);

    expect(actual).toEqual(expected);
});

it('returns a full summary', async () => {
    const expected = {
        status: 200,
        data: {
            id: 'mock-id',
            type: 'episode',
            title: 'mock title',
            synopsis: 'mock short synopsis',
            duration: 123,
            position: 4,
            seriesId: 'parent-id',
            programmeId: 'root-id',
            brand: {
                id: 'mock-brand',
                name: 'Mock Brand'
            }
        }
    }

    const actual = await getProgrammeSummary(testParams);

    expect(actual).toEqual(expected);
});

it("returns ancestors as 'null' if not present", async () => {
    getAncestors.mockImplementationOnce(() => []);

    const expected = {
        status: 200,
        data: {
            seriesId: null,
            programmeId: null,
        }
    }

    const actual = await getProgrammeSummary(testParams);

    expect(actual).toMatchObject(expected);
});