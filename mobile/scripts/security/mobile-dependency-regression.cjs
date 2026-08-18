const assert = require('node:assert/strict')

const imageSize = require('image-size')
const { findBox } = require('image-size/dist/types/utils.js')
const uuid = require('uuid')
const xcode = require('xcode')

const icnsWithZeroLengthEntry = Buffer.from([
  0x69, 0x63, 0x6e, 0x73, 0x00, 0x00, 0x00, 0x10,
  0x49, 0x43, 0x4f, 0x4e, 0x00, 0x00, 0x00, 0x00,
])

assert.throws(() => imageSize(icnsWithZeroLengthEntry), /Invalid ICNS image entry length/)

const zeroLengthBox = Buffer.from([
  0x00, 0x00, 0x00, 0x00, 0x6a, 0x78, 0x6c, 0x70,
])
assert.equal(findBox(zeroLengthBox, 'missing', 0), undefined)
assert.deepEqual(findBox(zeroLengthBox, 'jxlp', 0), { name: 'jxlp', offset: 0, size: 8 })

const tinyBox = Buffer.from([
  0x00, 0x00, 0x00, 0x04, 0x6d, 0x65, 0x74, 0x61,
])
assert.equal(findBox(tinyBox, 'meta', 0), undefined)

const oversizedBox = Buffer.from([
  0x00, 0x00, 0x00, 0x20, 0x6d, 0x65, 0x74, 0x61,
])
assert.equal(findBox(oversizedBox, 'meta', 0), undefined)

const generatedUuid = uuid.v4()
assert.match(generatedUuid, /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/)
assert.equal(typeof xcode.project, 'function')

console.log('mobile dependency regression checks passed')
