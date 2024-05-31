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

  let k: number = 0
  
  for (let _ of new Array(1e3)) {
  
    let draw = s.SpinSlow()
  
    if (["Gift D"].includes(draw?.Gift ?? "")) {

      console.log(draw)
      console.log(s.Roles)
      k += 1
    }
  }

  console.log(s.Views)
  console.log(k)
}

main()
