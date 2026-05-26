import { test, describe } from 'node:test'
import { strictEqual } from 'node:assert'

import { reverse, average } from './for_testing.js'

test('reverse of a', () => {
  const result = reverse('a')

  strictEqual(result, 'a')
})

test('reverse of react', () => {
  const result = reverse('react')

  strictEqual(result, 'tcaer')
})

test('reverse of saippuakauppias', () => {
  const result = reverse('saippuakauppias')

  strictEqual(result, 'saippuakauppias')
})

describe('average', () => {

    test('of many is calulated correctly', () => {
        const result = average([1, 2, 3, 4, 5])
        strictEqual(result, 3)
    }  )


    test('average of one value is the value itself', () => {
        const result = average([1])
        strictEqual(result, 1)
    })

  test('average of empty array is zero', () => {
    const result = average([])
    strictEqual(result, 0)
  })
})