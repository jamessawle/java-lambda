import { describe, it, mock } from 'node:test'
import assert from 'node:assert'
import { Empty, NoSuchElementError } from './Empty'
import { Optional } from './Optional'
import { Present } from './Present'

describe('Empty', () => {
  describe('filter', () => {
    it('should return Empty', () => {
      const optional: Optional<number> = new Empty()
      const mockTest = mock.fn<(value: number) => boolean>()

      const result = optional.filter({ test: mockTest })

      assert.equal(result, optional)
      assert.equal(
        mockTest.mock.calls.length,
        0,
        'predicate test method should not have been called'
      )
    })
  })

  describe('flatMap', () => {
    it('should return Empty', () => {
      const optional: Optional<number> = new Empty()
      const mockApply = mock.fn<(value: number) => Optional<string>>()

      const result = optional.flatMap({ apply: mockApply })

      assert.equal(result, optional)
      assert.equal(
        mockApply.mock.calls.length,
        0,
        'mapper apply method should not have been called'
      )
    })
  })

  describe('get', () => {
    it('should throw NoSuchElementError', () => {
      const optional: Optional<number> = new Empty()

      try {
        optional.get()
        assert.fail('get should throw NoSuchElementError on Empty Optional')
      } catch (error) {
        assert.equal(
          error instanceof NoSuchElementError,
          true,
          'error should be of type NoSuchElementError'
        )
      }
    })
  })

  describe('ifPresent', () => {
    it('should be a no-op', () => {
      const optional: Optional<number> = new Empty()
      const mockAccept = mock.fn<(input: number) => void>()

      optional.ifPresent({ accept: mockAccept })

      assert.equal(
        mockAccept.mock.calls.length,
        0,
        'consumer accept method should not have been called'
      )
    })
  })

  describe('ifPresentOrElse', () => {
    it('should call Runnable parameter', () => {
      const optional: Optional<number> = new Empty()
      const mockAccept = mock.fn<(input: number) => void>()
      const mockRun = mock.fn()

      optional.ifPresentOrElse({ accept: mockAccept }, { run: mockRun })

      assert.equal(
        mockRun.mock.calls.length,
        1,
        'runnable run method should have been called once'
      )
      assert.equal(
        mockAccept.mock.calls.length,
        0,
        'consumer accept method should not have been called'
      )
    })
  })

  describe('isEmpty', () => {
    it('should return true', () => {
      const optional: Optional<boolean> = new Empty()

      assert.equal(optional.isEmpty(), true)
    })
  })

  describe('isPresent', () => {
    it('should return false', () => {
      const optional: Optional<boolean> = new Empty()

      assert.equal(optional.isPresent(), false)
    })
  })

  describe('map', () => {
    it('should return Empty Optional', () => {
      const optional: Optional<Float32Array> = new Empty()
      const mockApply = mock.fn<(value: Float32Array) => boolean>()

      const result = optional.map(mockApply)

      assert.equal(
        result instanceof Empty,
        true,
        'should return Empty Optional'
      )
      assert.equal(
        mockApply.mock.calls.length,
        0,
        'mapper apply method should not have been called'
      )
    })
  })

  describe('or', () => {
    it('should return alternate Optional', () => {
      const optional: Optional<number> = new Empty()
      const expected = new Present(12)
      const mockGet = mock.fn(() => expected)

      const result = optional.or({ get: mockGet })

      assert.equal(result, expected)
      assert.equal(
        mockGet.mock.calls.length,
        1,
        'supplier get method should be called once'
      )
    })
  })

  describe('orElse', () => {
    it('should return else value', () => {
      const optional: Optional<string> = new Empty()
      const expected = 'else'

      const result = optional.orElse(expected)

      assert.equal(result, expected)
    })
  })

  describe('orElseGet', () => {
    it('should return supplier value', () => {
      const optional: Optional<number> = new Empty()
      const expected = 12
      const mockGet = mock.fn(() => expected)

      const result = optional.orElseGet({ get: mockGet })

      assert.equal(result, expected)
      assert.equal(
        mockGet.mock.calls.length,
        1,
        'supplier get method should be called once'
      )
    })
  })

  describe('orElseThrow', () => {
    describe('when no supplier provided', () => {
      it('should throw NoSuchElementError', () => {
        const optional: Optional<number> = new Empty()

        try {
          optional.orElseThrow()
          assert.fail('NoSuchElementError should have been thrown')
        } catch (error) {
          assert.equal(
            error instanceof NoSuchElementError,
            true,
            'error should be of type NoSuchElementError'
          )
        }
      })
    })

    describe('when supplier provided', () => {
      it('should throw supplied Error', () => {
        const optional: Optional<number> = new Empty()
        const expectedError = new Error('Supplied Error')
        const mockGet = mock.fn<() => Error>(() => expectedError)

        try {
          optional.orElseThrow({ get: mockGet })
          assert.fail('NoSuchElementError should have been thrown')
        } catch (error) {
          assert.equal(error, expectedError)
          assert.equal(
            mockGet.mock.calls.length,
            1,
            'error supplier get method should have been called once'
          )
        }
      })
    })
  })
})
