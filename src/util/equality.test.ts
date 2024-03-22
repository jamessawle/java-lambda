import assert from 'node:assert'
import { describe, it } from 'node:test'
import { isEqual } from './equality'

describe('equality', () => {
  describe('isEqual', () => {
    ;[
      { first: null, second: null, expected: true },
      { first: undefined, second: undefined, expected: true },
      { first: null, second: undefined, expected: false },
      { first: undefined, second: null, expected: false },
      { first: 'undefined', second: undefined, expected: false },
      { first: 'undefined', second: 'undefined', expected: true },
      { first: 1, second: 1, expected: true },
      { first: 1, second: 4, expected: false },
      { first: 3.123, second: 3.123, expected: true },
      { first: 3.1234567, second: 3.123, expected: false },
      { first: false, second: false, expected: true },
      { first: true, second: true, expected: true },
      { first: true, second: false, expected: false },
      { first: false, second: false, expected: true },
      { first: [], second: [], expected: true },
      { first: [], second: [1], expected: false },
      { first: [1], second: [1], expected: true },
      { first: [1, 2, 3], second: [1, 3, 'string'], expected: false },
      { first: [1, 2, 'string'], second: [1, 3, 'string'], expected: false },
      {
        first: [1, '2', null, { object: 1 }],
        second: [1, '2', null, { object: 1 }],
        expected: true,
      },
      {
        first: [1, 2, { object: 1 }],
        second: [1, 2, { object: 'string' }],
        expected: false,
      },
      { first: {}, second: {}, expected: true },
      { first: {}, second: { test: 1 }, expected: false },
      { first: { test: 1 }, second: {}, expected: false },
      { first: { test: 1 }, second: { test: 1 }, expected: true },
      { first: { test: 1 }, second: { test: 2 }, expected: false },
      {
        first: { test: 1, deep: { test: 2 } },
        second: { test: 1, deep: { test: 2 } },
        expected: true,
      },
      {
        first: { test: 1, deep: { test: 'string' } },
        second: { test: 1, deep: { test: 2 } },
        expected: false,
      },
    ].forEach(({ first, second, expected }) =>
      it(`'${JSON.stringify(first)}'==='${JSON.stringify(second)}' = ${expected}`, () => {
        const result = isEqual(first as unknown, second as unknown)

        assert.equal(result, expected)
      })
    )
  })
})
