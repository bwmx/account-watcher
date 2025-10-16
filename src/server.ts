// routes
import Fastify, { FastifyInstance } from 'fastify'

import watcherAccountRoutes from './routes/watcher-account/watcher-account-routes'
import rootRoutes from './routes/root'

// separated from main app so this can be tested more easily
export function getServer(): FastifyInstance {
  const fastify = Fastify({
    logger: true,
  })

  // register relevant routes
  fastify.register(rootRoutes)
  fastify.register(watcherAccountRoutes)

  return fastify
}
