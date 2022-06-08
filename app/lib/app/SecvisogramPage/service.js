import APIRequest from '../shared/APIRequest.js'

/**
 * @param {object} params
 * @param {string} params.advisoryId
 * @returns
 */
export async function loadAdvisory({ advisoryId }) {
  const advisoryJSONRes = await new APIRequest(
    new Request(`/api/2.0/advisories/${advisoryId}/`)
  ).send()
  /** @type {{ csaf: string; advisoryId: string; revision: string; documentTrackingId: string }} */
  const advisory = await advisoryJSONRes.json()
  return {
    ...advisory,
    csaf: JSON.parse(advisory.csaf),
  }
}

/**
 * @param {object} params
 * @param {string} params.advisoryId
 * @param {string} params.revision
 * @param {{}} params.csaf
 */
export async function updateAdvisory({ advisoryId, revision, csaf }) {
  const apiURL = new URL(
    `/api/2.0/advisories/${advisoryId}/`,
    window.location.href
  )
  apiURL.searchParams.set('revision', revision)
  await new APIRequest(
    new Request(apiURL.toString(), {
      method: 'PATCH',
    })
  )
    .jsonRequestBody(csaf)
    .send()
}

/**
 * @param {object} params
 * @param {string} params.validatorUrl
 * @param {{}} params.csaf
 * @returns
 */
export async function validate({ validatorUrl, csaf }) {
  const validateResponse = await new APIRequest(
    new Request(validatorUrl + '/api/v1/validate', { method: 'POST' })
  )
    .jsonRequestBody({
      tests: [
        { type: 'test', name: 'csaf_2_0_strict' },
        { type: 'preset', name: 'mandatory' },
        { type: 'preset', name: 'optional' },
        { type: 'preset', name: 'informative' },
      ],
      document: csaf,
    })
    .produces('application/json')
    .send()

  /**
   * @type {{ tests: Array<{ errors: Array<{ instancePath: string; message: string }> }> }}
   */
  const json = await validateResponse.json()
  return json
}
