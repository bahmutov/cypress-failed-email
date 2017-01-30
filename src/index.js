'use strict'

const la = require('lazy-ass')
const is = require('check-more-types')
const os = require('os')
const gitlab = require('gitlab-build-info')(process.env)
// TODO add other CIs: Travis, Jenkins

const osName = `OS: ${os.platform()} - ${os.hostname()} - ${os.release()}`

const hasTestName = failed => is.unemptyString(failed.testName)

// failed: information collected by "cypress-failed-log"
function formEmail (failed) {
  la(is.object(failed),
    'missing failed test contents', failed)
  la(hasTestName(failed), 'missing test name', failed)
  la(is.strings(failed.testCommands), 'missing test commands log', failed)
  la(is.unemptyString(failed.testError), 'missing failed test error', failed)

  const buildInfo = gitlab.collectionInformation()
  // TODO support emails without any build information
  la(is.object(buildInfo), 'missing build info')

  let plainText = `
This is automated email - one of end to end tests has failed.
Please do not hate me - I am just a messenger; fix your stuff.

Details are below.
==================
Test name: "${failed.title}"
Test full name: "${failed.testName}"
Error: "${failed.testError}"
`

  const buildText = buildInfo.toString()

  const testCommandsLog = `
====================================
 Test commands
 The failed command is on the top
====================================
` + failed.testCommands.reverse().join('\n') + '\n'

  plainText += buildText
  plainText += osName
  plainText += '\n' + testCommandsLog

  const subject = buildInfo.buildName
  ? `Oh NO!!! Failed test ${buildInfo.projectName}:${buildInfo.buildName}`
  : `Oh NO!!! Failed test ${buildInfo.projectName}:${failed.testName}`

  return {
    plainText,
    subject
  }
}

module.exports = {
  osName,
  formEmail
}
