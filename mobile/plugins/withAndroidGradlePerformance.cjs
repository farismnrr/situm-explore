const { withGradleProperties } = require('expo/config-plugins')

function setProperty(items, key, value) {
  const existing = items.find(item => item.type === 'property' && item.key === key)
  if (existing) {
    existing.value = value
    return
  }
  items.push({ type: 'property', key, value })
}

module.exports = function withAndroidGradlePerformance(config) {
  return withGradleProperties(config, next => {
    setProperty(next.modResults, 'org.gradle.daemon', 'true')
    setProperty(next.modResults, 'org.gradle.caching', 'true')
    setProperty(next.modResults, 'org.gradle.jvmargs', '-Xmx2048m -XX:MaxMetaspaceSize=1024m -Dfile.encoding=UTF-8')
    return next
  })
}
