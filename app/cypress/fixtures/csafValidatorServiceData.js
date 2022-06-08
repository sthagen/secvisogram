/**
 * @param {object} params
 * @param {object} params.document
 * @param {object} [params.document.document]
 * @param {string} [params.document.document.title]
 */
export function getValidationResponse({ document: { document } }) {
  if (document?.title === 'my first document') {
    return {
      isValid: false,
      tests: [
        {
          errors: [
            {
              instancePath: '/document',
              message: "Must have property 'category'",
            },
          ],
          infos: [],
          warnings: [],
          isValid: false,
          name: 'csaf_2_0_strict',
        },
      ],
    }
  } else {
    return {
      isValid: true,
      tests: [
        {
          errors: [],
          infos: [],
          warnings: [],
          isValid: true,
          name: 'csaf_2_0_strict',
        },
      ],
    }
  }
}
