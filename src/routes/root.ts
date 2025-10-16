import { FastifyInstance, FastifyPluginOptions } from 'fastify'

/**
 * Encapsulates the routes
 * @param {FastifyInstance} fastify  Encapsulated Fastify Instance
 * @param {Object} _options plugin options, refer to https://fastify.dev/docs/latest/Reference/Plugins/#plugin-options
 */
async function routes(fastify: FastifyInstance, _options: FastifyPluginOptions) {
  fastify.get('/', async (_request: any, _reply: any) => {
    return { message: 'Hello, world!' }
  })
}

export default routes
