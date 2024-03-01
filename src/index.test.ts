import assert from 'node:assert'
import { describe, it } from 'node:test'
import { add } from '.'

describe('add', () => {
  ;[
    { title: '1+1=2', a: 1, b: 1, expected: 2 },
    { title: '2+2=4', a: 2, b: 2, expected: 4 },
    { title: '2+1=3', a: 2, b: 1, expected: 3 },
  ].forEach(({ title, a, b, expected }) =>
    it(title, () => {
      const result = add(a, b)

      assert.equal(result, expected)
    })
  )
})
