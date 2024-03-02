import { describe, it, mock } from 'node:test'
import assert from 'node:assert'
import { Present } from './Present'
import { Empty } from './Empty'
import { Optional } from './Optional'

describe('Present Optional', () => {
  describe('filter', () => {
    ;[
      {
        title: 'should return Present Optional when predicate always passes',
        value: 12,
        predicate: { test: () => true },
        expectPresent: true,
      },
      {
        title: 'should return Present Optional when predicate passes',
        value: 12,
        predicate: { test: (value: number) => value > 7 },
        expectPresent: true,
      },
      {
        title: 'should return Empty Optional when predicate always fails',
        value: 12,
        predicate: { test: () => false },
        expectPresent: false,
      },
      {
        title: 'should return Empty Optional when predicate passes',
        value: 12,
        predicate: { test: (value: number) => value <= 7 },
        expectPrsent: false,
      },
    ].forEach(({ title, value, predicate, expectPresent }) =>
      it(title, () => {
        const optional: Optional<typeof value> = new Present(value)

        const result = optional.filter(predicate)

        if (expectPresent) {
          assert.equal(
            result instanceof Present,
            true,
            'result is instance of Present class'
          )
          assert.equal(result.get(), value)
        } else {
          assert.equal(
            result instanceof Empty,
            true,
            'result is instance of Empty class'
          )
        }
      })
    )
  })

  describe('flatMap', () => {
    ;[
      {
        title: 'should return Present Optional result from the mapper',
        input: new Present(12),
        expected: new Present('twelve'),
      },
      {
        title: 'should return Empty Optional result from the mapper',
        input: new Present(12),
        expected: new Empty(),
      },
    ].forEach(({ title, input, expected }) =>
      it(title, () => {
        const mapper = { apply: () => expected }

        const result = input.flatMap(mapper)

        assert.equal(result, expected)
      })
    )
  })

  describe('get', () => {
    ;[
      { title: 'should return provided integer', value: 13 },
      { title: 'should return provided boolean', value: false },
      { title: 'should return provided string', value: 'made-up-string' },
      { title: 'should return provided object', value: { hello: 'world' } },
    ].forEach(({ title, value }) =>
      it(title, () => {
        const optional = new Present(value)

        assert.equal(optional.get(), value, title)
      })
    )
  })

  describe('ifPresent', () => {
    it('should call provided action', () => {
      const value = 23
      const optional = new Present(value)
      const mockAction = mock.fn()

      optional.ifPresent({ accept: mockAction })

      assert.equal(
        mockAction.mock.calls.length,
        1,
        'action should be called once'
      )
      assert.equal(
        mockAction.mock.calls[0].arguments.length,
        1,
        'action should be called with single parameter'
      )
      assert.equal(
        mockAction.mock.calls[0].arguments[0],
        value,
        'parameter should match Optional value'
      )
    })
  })

  describe('ifPresentOrElse', () => {
    it('should only call provided action', () => {
      const value = 23
      const optional: Optional<number> = new Present(value)
      const mockAction = mock.fn()
      const mockRunnable = mock.fn()

      optional.ifPresentOrElse({ accept: mockAction }, { run: mockRunnable })

      assert.equal(
        mockAction.mock.calls.length,
        1,
        'action should be called once'
      )
      assert.equal(
        mockAction.mock.calls[0].arguments.length,
        1,
        'action should be called with single parameter'
      )
      assert.equal(
        mockAction.mock.calls[0].arguments[0],
        value,
        'parameter should match Optional value'
      )

      assert.equal(
        mockRunnable.mock.calls.length,
        0,
        'runnable parameter should not be called'
      )
    })
  })

  describe('isEmpty', () => {
    ;[
      { title: 'should return false when provided integer', value: 13 },
      { title: 'should return false when provided boolean', value: false },
      {
        title: 'should return false when provided string',
        value: 'made-up-string',
      },
      {
        title: 'should return false when provided object',
        value: { hello: 'world' },
      },
    ].forEach(({ title, value }) =>
      it(title, () => {
        const optional = new Present(value)

        assert.equal(optional.isEmpty(), false, title)
      })
    )
  })

  describe('isPresent', () => {
    ;[
      { title: 'should return true when provided integer', value: 13 },
      { title: 'should return true when provided boolean', value: false },
      {
        title: 'should return true when provided string',
        value: 'made-up-string',
      },
      {
        title: 'should return true when provided object',
        value: { hello: 'world' },
      },
    ].forEach(({ title, value }) =>
      it(title, () => {
        const optional = new Present(value)

        assert.equal(optional.isPresent(), true, title)
      })
    )
  })

  describe('map', () => {
    ;[
      {
        title: 'should return Present Optional result from the mapper',
        input: new Present(12),
        expected: 'twelve',
      },
    ].forEach(({ title, input, expected }) =>
      it(title, () => {
        const mapper = { apply: () => expected }

        const result = input.map(mapper)

        assert.equal(
          result instanceof Present,
          true,
          'result should be instance of Present'
        )
        assert.equal(result.get(), expected)
      })
    )
  })

  describe('or', () => {
    ;[
      { title: 'should return provided integer', value: 13 },
      { title: 'should return provided boolean', value: false },
      { title: 'should return provided string', value: 'made-up-string' },
      { title: 'should return provided object', value: { hello: 'world' } },
    ].forEach(({ title, value }) =>
      it(title, () => {
        const optional: Optional<typeof value> = new Present(value)
        const mockGet = mock.fn<() => Optional<typeof value>>()

        const result = optional.or({ get: mockGet })

        assert.equal(
          result instanceof Present,
          true,
          'result is instance of Present class'
        )
        assert.equal(result.get(), value, title)
        assert.equal(
          mockGet.mock.calls.length,
          0,
          'Supplier should not have been called'
        )
      })
    )
  })

  describe('orElse', () => {
    ;[
      { title: 'should return provided integer', value: 13, otherValue: 42 },
      {
        title: 'should return provided boolean',
        value: false,
        otherValue: true,
      },
      {
        title: 'should return provided string',
        value: 'made-up-string',
        otherValue: 'other-string',
      },
      {
        title: 'should return provided object',
        value: { hello: 'world' },
        otherValue: { hello: 'failure' },
      },
    ].forEach(({ title, value, otherValue }) =>
      it(title, () => {
        const optional: Optional<typeof value> = new Present(value)

        const result = optional.orElse(otherValue)

        assert.equal(result, value, title)
      })
    )
  })

  describe('orElseGet', () => {
    ;[
      { title: 'should return provided integer', value: 13 },
      { title: 'should return provided boolean', value: false },
      { title: 'should return provided string', value: 'made-up-string' },
      { title: 'should return provided object', value: { hello: 'world' } },
    ].forEach(({ title, value }) =>
      it(title, () => {
        const optional: Optional<typeof value> = new Present(value)
        const mockGet = mock.fn<() => typeof value>()

        const result = optional.orElseGet({ get: mockGet })

        assert.equal(result, value, title)
        assert.equal(
          mockGet.mock.calls.length,
          0,
          'supplier should not have been called'
        )
      })
    )
  })

  describe('orElseThrow', () => {
    ;[
      { title: 'should return provided integer', value: 13 },
      { title: 'should return provided boolean', value: false },
      { title: 'should return provided string', value: 'made-up-string' },
      { title: 'should return provided object', value: { hello: 'world' } },
    ].forEach(({ title, value }) =>
      it(title, () => {
        const optional: Optional<typeof value> = new Present(value)
        const mockGet = mock.fn<() => Error>()

        const result = optional.orElseThrow({ get: mockGet })

        assert.equal(result, value, title)
        assert.equal(
          mockGet.mock.calls.length,
          0,
          'supplier should not have been called'
        )
      })
    )
  })
})
