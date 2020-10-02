const Heads = require('.')
const pull = require('pull-stream')
const multicb = require('multicb')
const {test, msg, rndKey} = require('ssb-revisions/test/test-helper')

test('observe a message', (t, db) => {
  const heads = Heads(db)

  const keyA = rndKey()
  const keyA1 = rndKey()
  const a = msg(keyA)
  const a1 = msg(keyA1, keyA, [keyA])

  append(db, [a], seqs => {
    const obs = heads(keyA)
    let count = 0
    const abort = obs(kvm => {
      t.deepEqual(kvm.meta, {
        incomplete: false,
        forked: false,
        change_requests: 0
      })
      if (count == 0) {
        t.equal(kvm.key, keyA)
        t.deepEqual(kvm.value, a.value)
      } else if (count == 1) {
        t.equal(kvm.key, keyA1)
        t.deepEqual(kvm.value, a1.value)
        abort()
        t.end()
      }
      count++
    })
    append(db, [a1], seqs => {
    })
  })
})

function append(db, msgs, cb) {
  pull(
    pull.values(msgs),
    pull.asyncMap( (m, cb) => {
      db.append(m, cb)
    }),
    pull.collect( (err, seqs)=>{
      if (err) throw err
      cb(seqs)
    })
  )
}
