import assert from 'node:assert'
import { describe, it } from 'node:test'
import { Optional } from './Optional'
import { Empty } from './Empty'
import { Present } from './Present'

describe('Optional', () => {
  describe('Optional.empty', () => {
    it('should return Empty Optional', () => {
      const result = Optional.empty()

      assert.equal(
        result instanceof Empty,
        true,
        'result should be an instance of Empty Optional'
      )
    })
  })

  describe('Optional.of', () => {
    it('should return Present Optional', () => {
      const value = 12

      const result = Optional.of(value)

      assert.equal(
        result instanceof Present,
        true,
        'result should be an instance of Present Optional'
      )
      assert.equal(result.get(), value)
    })
  })

  describe('Optional.ofNullable', () => {
    describe('given a null input', () => {
      it('should return Empty Optional', () => {
        const result = Optional.ofNullable(null)

        assert.equal(
          result instanceof Empty,
          true,
          'result should be instance of Empty Optional'
        )
      })
    })

    describe('given an undefined input', () => {
      it('should return Empty Optional', () => {
        const result = Optional.ofNullable(undefined)

        assert.equal(
          result instanceof Empty,
          true,
          'result should be instance of Empty Optional'
        )
      })
    })

    describe('given an actual input', () => {
      it('should return Present Optional', () => {
        const value = 'value'

        const result = Optional.ofNullable(value)

        assert.equal(
          result instanceof Present,
          true,
          'result should be instance of Present Optional'
        )
        assert.equal(result.get(), value)
      })
    })
  })
})
