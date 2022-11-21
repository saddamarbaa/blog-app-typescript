import { it, vi, expect } from 'vitest'

import { sendFetchHttpRequest } from '../src/utils/helper'

const successResponseData = {
	data: { testKey: 'testData' },
	success: true,
	error: false,
	message: 'success',
	status: 200,
}

const testFetch = vi.fn((url, options) => {
	return new Promise((resolve, reject) => {
		const testResponse = {
			ok: true,
			json() {
				return new Promise((resolve, reject) => {
					resolve(successResponseData)
				})
			},
		}
		resolve(testResponse)
	})
})

vi.stubGlobal('fetch', testFetch)

it('should return any available response data', () => {
	const testData = { key: 'test' }
	return expect(
		sendFetchHttpRequest(`/api/v1/posts`, 'GET', testData),
	).resolves.toEqual(successResponseData)
})
