const { getAncestors, getProgrammeEpisodeIds, getSeriesEpisodeIds } = require('../backends/relational-db');
const { getSummary } = require('../backends/summary-api');

const takePage = (items, pageNumber) => {
    const start = (pageNumber - 1) * 10;
    const end = (pageNumber * 10);
    return items.slice(start, end);
};

const transformSummary = ({
    id,
    programmeId,
    seriesId,
    type,
    title,
    shortSynopsis,
    duration,
    position,
    brand
}) => ({
    id,
    type,
    title,
    synopsis: shortSynopsis,
    duration,
    position,
    seriesId,
    programmeId,
    brand
});

const getProgrammeEpisodes = async (params) => {
    try {
        const { querystring: { programme, series, page = 1 } } = params;
        const pageNumber = parseInt(page, 10);
        if (pageNumber < 1 || isNaN(pageNumber)) {
            return {
                status: 400,
                message: "Invalid page."
            }
        }
        if ((programme && series) || (!programme && !series)) {
            return {
                status: 400,
                message: "Specify exactly one of 'programme' or 'series' query parameter."
            }
        }

        const results = await (
            programme ?
                getProgrammeEpisodeIds(programme) :
                getSeriesEpisodeIds(series)
        );
        const resultsPage = takePage(results, pageNumber);
        const summaries  = await Promise.all(
            resultsPage.map(
                (id) => Promise.all([getSummary(id), getAncestors(id)])
            )
        );
        const items = summaries.map(
            ([summary, ancestors]) => transformSummary(
                {
                    ...summary,
                    programmeId: programme || ancestors[0],
                    seriesId: series || ancestors[1]
                }
            )
        )

        return {
            status: 200,
            data: {
                page: {
                    current: pageNumber,
                    total: Math.ceil(results.length / 10),
                    totalItems: results.length
                },
                items
            }
        }
    } catch (err) {
        console.error(err.stack);
        return {
            status: 500,
            message: 'Internal Server Error'
        }
    }
}

module.exports = { getProgrammeEpisodes };