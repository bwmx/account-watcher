import { getServer } from '../../server'

import { afterAll, beforeAll, describe, expect, test } from 'vitest'
import algosdk from 'algosdk'

// TODO: fix these tests, getting errors with build/import, yet works in normal app

// test the watcher account controller here
describe('Test watcher-account-controller.ts', () => {
  test('initialises correctly', () => {
    const server = getServer()
    console.log(server?.printRoutes())
  })

  test('can add an account to the watcher', async () => {
    const server = getServer()

    const address = algosdk.generateAccount().addr.toString()

    const response = await server.inject({
      method: 'POST',
      url: '/watcherAccounts',
      body: {
        address: address,
      },
    })

    // should be created
    expect(response.statusCode).toBe(201)
    expect(response.json).toBeDefined()
  })

  test('can query all tracked accounts and their state', async () => {
    const server = getServer()

    const response = await server.inject({
      method: 'GET',
      url: '/watcherAccounts',
    })

    // ok
    expect(response.statusCode).toBe(200)
    expect(response.json).toEqual([])
  })
})
