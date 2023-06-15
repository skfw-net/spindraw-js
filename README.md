# @skfx/spindraw

- typescript
```ts
import SpinDraw from '@skfx/spindraw';

function main(...args: Array<string>) {

  const roles = {
    'Gift A': 0.1,
    'Gift B': 0.2,
    'Gift C': 0.3,
    'Gift D': 0.4,
    'Gift E': 0.5,
  }
  
  const s = new SpinDraw(new Map(Object.entries(roles)), 0.2)
  
  for (let _ of new Array(10)) {
  
    let draw = s.Spin()
  
    if (["Gift A", "Gift B"].includes(draw?.Gift)) console.log(draw, s.Roles)

    //console.log(draw, s.Roles)

    //s.Roles = new Map(Object.entries(roles))
  }
}

main()
```

- javascript
```js
import SpinDraw from '@skfx/spindraw/out/index.js';

function main(...args) {

  const roles = {
    'Gift A': 0.1,
    'Gift B': 0.2,
    'Gift C': 0.3,
    'Gift D': 0.4,
    'Gift E': 0.5,
  }
  
  const s = new SpinDraw(new Map(Object.entries(roles)), 0.2)
  
  for (let _ of new Array(10)) {
  
    let draw = s.Spin()
  
    if (["Gift A", "Gift B"].includes(draw?.Gift)) console.log(draw, s.Roles)

    //console.log(draw, s.Roles)

    //s.Roles = new Map(Object.entries(roles))
  }
}

main()
```