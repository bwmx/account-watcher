import { getServer } from '../../server'

import { afterAll, beforeAll, describe, expect, test, vi } from 'vitest'
import { FastifyInstance } from 'fastify'

// TODO: fix these tests, getting errors with build/import, yet works in normal app

// test the watcher account controller here
describe('Test watcher-account-controller.ts', () => {
  test('initialises correctly', () => {
    const server = getServer()
    console.log(server?.printRoutes())
  })
})
