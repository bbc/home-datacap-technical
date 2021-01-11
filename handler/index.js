const { getProgrammeSummary } = require('./programme-summary');
const { getProgrammeEpisodes } = require('./programme-episodes');
const { getEpisodeDetail } = require('./programme-episode');

const routes = {
  '/programmes/{id}': getProgrammeSummary,
  '/programmes/episodes': getProgrammeEpisodes,
  '/programmes/episodes/{id}': getEpisodeDetail,
}

const notFound = () => ({ status: 404, message: "Invalid route."});

const measureExecutionTime = startTime => new Date() - startTime;

exports.handler = async (request, context, callback) => {
  const startTime = new Date();
  const { resourcePath, params } = request;
  
  const route = routes[resourcePath] || notFound;
  
  const response = await route(params, context);

  callback({
    ...response,
    meta: {
      executionTime: measureExecutionTime(startTime)
    }
  });
};
