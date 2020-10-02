const Value = require('./observable')
const pull = require('pull-stream')

module.exports = function(ssb) {
  return function(revRoot, opts) {
    opts = opts || {}
    const {allowAllAuthors} = opts
    let drain
    const obs = Value(null, {
      onStartListening: () => {
        pull(
          ssb.revisions.heads(revRoot, {
            live: true,
            sync: false,
            meta: true,
            values: true,
            maxHeads: 1,
            allowAllAuthors
          }),
          drain
        )
      },
      onStopListening: () => {
        drain.abort()
      }
    })
    drain = pull.drain( ({heads, meta}) => {
      if (!heads.length) {
        return obs.set(null)
      }
      const {key, value} = heads[0]
      obs.set({ key, value, meta })
    }, err => {
      if (err) console.log(err.message)
    } )
    return obs
  }
}
