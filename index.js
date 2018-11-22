const Value = require('./observable')
const pull = require('pull-stream')

module.exports = function(ssb) {
  return function(revRoot) {
    let drain
    const obs = Value(null, {
      onStartListening: () => {
        pull(
          ssb.revisions.heads(revRoot, {
            live: true,
            sync: false,
            meta: true,
            values: true,
            maxHeads: 1
          }),
          drain
        )
      },
      onStopListening: () => {
        console.log('drain abort')
        drain.abort()
      }
    })
    drain = pull.drain( ({heads, meta}) => {
      const {key, value} = heads[0]
      obs.set({ key, value, meta })
    } )
    return obs
  }
}
