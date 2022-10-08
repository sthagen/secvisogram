import { expect } from 'chai'
import { mandatoryTest_6_1_31 } from '../mandatoryTests.js'
import readExampleFiles from './shared/readExampleFiles.js'

const failingExamples = await readExampleFiles(
  new URL('mandatoryTest_6_1_31/failing', import.meta.url)
)

const validExamples = await readExampleFiles(
  new URL('mandatoryTest_6_1_31/valid', import.meta.url)
)

describe('Mandatory test 6.1.31', function () {
  describe('failing examples', function () {
    for (const [title, failingExample] of failingExamples) {
      it(title, async function () {
        const result = await mandatoryTest_6_1_31(failingExample)

        expect(result.errors).to.have.length.greaterThan(0)
      })
    }
  })

  describe('valid examples', function () {
    for (const [title, validExample] of validExamples) {
      it(title, async function () {
        const result = await mandatoryTest_6_1_31(validExample)

        expect(result.errors).to.haveOwnProperty('length', 0)
      })
    }
  })
})
