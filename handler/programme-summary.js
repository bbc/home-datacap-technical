const { getAncestors } = require('../backends/relational-db');
const { getSummary } = require('../backends/summary-api');

const getProgrammeSummary = async (params) => {
    const { path: { id } } = params;
    try {
        const { type, title, shortSynopsis, duration, position, brand } = await getSummary(id);
        const [ programmeId, seriesId ] = await getAncestors(id);
        return {
            status: 200,
            data: {
                id,
                type,
                title,
                synopsis: shortSynopsis,
                duration,
                position,
                seriesId: seriesId || null,
                programmeId: programmeId || null,
                brand
            }
        }
    } catch (err) {
        if (err.message === '404') {
            return {
                status: 404,
                message: 'Summary not found.'
            }
        }
        console.error(err.stack);
        return {
            status: 500,
            message: 'Internal Server Error'
        }
    }
}

module.exports = { getProgrammeSummary };