import { add } from '../dist/index.mjs'
import assert from 'node:assert'
import { describe, it } from 'node:test'

describe('add', () => {
  it('add should work from import', () => {
    assert.equal(add(1, 2), 3)
  })
})
