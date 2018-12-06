tre-watch-heads
---
Observe mutable ssb messages

``` js
const WatchHeads = require('tre-watch-heads')
const h = require('mutant/html-element')
const computed = require('mutant/computed')

// pass your ssb client instance
const head = WatchHeads(ssb)

// head() takes a revisionRoot and returns a mutant-compatible observable
// This is how you get the revisionRoot from any ssb message, mutated or not
const revRoot = kv.value.content.revisionRoot || kv.key

// html will update in realtime whenever we receive a new revision of this particular message
document.body.appendChild(
  h('div', 'latest version', computed(head(revRoot), kv => {
    return kv && kv.value.content.text
  }))
)

// When the element is removed from the dom, the underlying pull-stream
// will be aborted automatically

```

License: ISC
