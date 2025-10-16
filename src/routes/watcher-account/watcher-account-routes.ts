import { FastifyInstance, FastifyPluginOptions, FastifyRequest } from 'fastify'

// BAD!!! should be injected as a param in production app
import { watcherAccountRepository } from '../../app'
import { getAccountBalance } from '../../utils/algorand'

/**
 * Encapsulates the routes
 * @param {FastifyInstance} fastify  Encapsulated Fastify Instance
 * @param {Object} _options plugin options, refer to https://fastify.dev/docs/latest/Reference/Plugins/#plugin-options
 */
async function routes(fastify: FastifyInstance, _options: FastifyPluginOptions) {
  fastify.get('/watcherAccounts', async (_request, _reply) => {
    // get all watched accounts in the repo
    const watcherAccounts = await watcherAccountRepository.getAll()

    // transform all, cannot serialize bigint value, so we need to convert ourselves
    const transformed: any[] = []

    watcherAccounts.forEach((watcherAccount) => {
      const a = {
        address: watcherAccount.address,
        balance: Number(watcherAccount.balance),
        lastUpdatedRound: Number(watcherAccount.lastUpdatedRound),
      }

      transformed.push(a)
    })

    return transformed
  })

  const createRequestBodyJsonSchema = {
    type: 'object',
    required: ['address'],
    properties: {
      address: { type: 'string' },
      // could do with further validation
    },
  }

  const schema = {
    body: createRequestBodyJsonSchema,
  }

  // POST - create new watched account in app (vaguely following REST conventions)
  fastify.post(
    '/watcherAccounts',
    { schema },
    async (request: FastifyRequest<{ Body: { address: string } }>, reply) => {
      // get address from request body
      const { address } = request.body
      // get account state
      const { balance, validAsOfRound } = await getAccountBalance(address)
      // create new entry in the repo
      // really this logic should not be in the controller/routes
      // it should be abstracted via a service layer and keep the controllers to processing/parsing and returning a response only
      const created = await watcherAccountRepository.create(address, balance, validAsOfRound)
      // set status code to 201 (created)
      reply.code(201)
      // return new created item, BigInt cannot be serialised so convert ourselves
      return {
        address: created.address,
        balance: Number(created.balance),
        lastUpdatedRound: Number(created.lastUpdatedRound),
      }
    },
  )
}

export default routes
