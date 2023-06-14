import SpinDraw from "./index.js"

function main(...args: Array<string>) {

  const roles = {
    'Gift A': 0.04,
    'Gift B': 0.36,
    'Gift C': 0.6,
    'Gift D': 3.0,
    'Gift E': 6.0,
    'Gift F': 90.0,
  }
  
  const s = new SpinDraw(new Map(Object.entries(roles)), -1)

  let k: number

  k = 0
  
  for (let _ of new Array(1000)) {
  
    let draw = s.SpinSlow()
  
    if (["Gift A"].includes(draw?.Gift ?? "")) {

      console.log(draw, s.Roles)
      k += 1
    }

    // if (typeof draw?.Gift === "undefined" || draw === null) {

    //   console.log(draw)
    //   k += 1
    // }

    //s.Roles = new Map(Object.entries(roles))
  }

  console.log(s.Views)
  console.log(k)
}

main()
