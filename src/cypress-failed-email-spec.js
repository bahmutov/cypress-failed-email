'use strict'

const la = require('lazy-ass')
const is = require('check-more-types')

/* global describe, it */
describe('cypress-failed-email', () => {
  const {formEmail} = require('.')

  const failed = {
    title: 'title',
    testName: 'suite title',
    testError: 'a test fails',
    testCommands: [
      'visit /',
      'fails 100%'
    ]
  }
  const mockGitLabCIenv = {
    CI: 1,
    CI_PROJECT_URL: 'https://server/project',
    CI_BUILD_NAME: 'cypress-failed-email'
  }

  it('forms email without build info', () => {
    const email = formEmail(failed, mockGitLabCIenv)
    const {subject, plainText} = email
    la(is.unemptyString(subject), 'missing email text in', email)
    la(is.unemptyString(plainText), 'missing plain text in', email)

    // console.log(subject)
    // console.log(plainText)
  })
})
