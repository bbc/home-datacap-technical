const { getAncestors } = require('../backends/relational-db');
const { getSummary } = require('../backends/summary-api');
const { getAvailability } = require('../backends/availability-api');
const { getBroadcasts } = require('../backends/broadcast-api');

const getEpisodeDetail = async (params) => {
    const { path: { id } } = params;
    try {
        const [ episodeSummary, ancestors, availability, broadcasts ] = await Promise.all([
            getSummary(id, 'episode'),
            getAncestors(id),
            getAvailability(id),
            getBroadcasts(id)
        ]);
        const { title, shortSynopsis, mediumSynopsis, longSynopsis, duration, position, brand } = episodeSummary;
        const [ programmeId, seriesId ] = ancestors;
        const [ seriesSummary, programmeSummary ] = await(
            Promise.all([
                getSummary(programmeId),
                getSummary(seriesId)
            ])
        );
        return {
            status: 200,
            data: {
                id,
                title,
                synopsis: {
                    short: shortSynopsis,
                    medium: mediumSynopsis,
                    long: longSynopsis,
                },
                duration,
                position,
                series: {
                    id: seriesId,
                    title: seriesSummary.title
                },
                programme: {
                    id: programmeId,
                    title: programmeSummary.title
                },
                brand,
                availability,
                nextBroadcast: broadcasts.length && broadcasts[0] || null
            }
        }
    } catch (err) {
        if (err.message === '404') {
            return {
                status: 404,
                message: 'Episode not found.'
            }
        }
        console.error(err.stack);
        return {
            status: 500,
            message: "Internal Server Error"
        }
    }
}

module.exports = { getEpisodeDetail };