import { gt, valid } from 'semver'

/**
 * @param {unknown} doc
 */
export default function (doc) {
  /** @type {Array<{ message: string; instancePath: string }>} */
  const errors = []
  let isValid = true

  if (preconditionMatches(doc)) {
    const sortedNumbers = Array.from(
      new Set(
        doc.document.tracking.revision_history
          .slice()
          .sort(
            (a, z) => new Date(a.date).getTime() - new Date(z.date).getTime()
          )
          .map((e) => valid(e.number) ?? `${e.number}.0.0`)
      ).keys()
    ).filter((n) => valid(n) !== null)
    const isAscending = sortedNumbers.every(
      (number, index, all) => index === 0 || gt(number, all[index - 1])
    )
    if (!isAscending) {
      isValid = false
      errors.push({
        instancePath: `/document/tracking/revision_history`,
        message: 'the items must be in ascending order according to the date',
      })
    }
  }

  return { errors, isValid }
}

/**
 * @param {any} doc
 * @returns {doc is { document: { tracking: { revision_history: Array<{ number: string; date: string }> } } }}
 */
const preconditionMatches = (doc) =>
  Array.isArray(doc?.document?.tracking?.revision_history) &&
  doc.document.tracking.revision_history.every(
    (/** @type {any} */ r) =>
      typeof r.number === 'string' && typeof r.date === 'string'
  )
