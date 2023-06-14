type int = number
type float = number

export function Sum(...args: Array<float>): float {

  let n: float
  n = 0

  for (let v of args) {

    n += v
  }

  return n
}

export function RanRand(min: float, max: float): float {

  min = min * 100
  max = max * 100
  return Math.round((Math.random() * (max - min)) + min) / 100
}

export function ShuffleArray<T>(data: Array<T>): Array<T> {

  let i: int
  let n: int
  let k: int
  let j: int

  i = 0
  n = data.length
  k = n - 1

  for (i = 0; i < n; i++) {

    j = Math.round(RanRand(0, k))

    
    if (i !== j) {

      [data[i], data[j]] = [data[j], data[i]]
    }
  }

  return data
}

export class Draw {
  
  #named: string
  #value: float
  #index: int

  constructor(named: string, value: float, index: int) {

    this.#named = named
    this.#value = value
    this.#index = index
  }

  get Gift(): string { return this.#named }
  get Dist(): float { return this.#value }
  get Index(): int { return this.#index }
}

export default class SpinDraw {

  #roles: Map<string, float>
  
  #z: float

  #named: Array<string>
  #ranges: Array<float>
  #k: float

  #nodups: Array<string>

  constructor(roles: Map<string, float>, z: float = Number.MAX_SAFE_INTEGER) {

    // initialize
    this.#roles = roles;
    this.#named = Array.from(this.#roles.keys())
    this.#ranges = this.RangeValues(...Array.from(this.#roles.values())) // pre-caches
    this.#k = Sum(...this.#ranges)
    
    // once
    this.#nodups = this.IndexesIntoNamed(this.IndexesOf(z))
    this.#z = z
  }

  RangeValues(...v: Array<float>): Array<float> {

    const temp: Array<float> = new Array

    let p: float
    let m: float

    m = 0

    for (p of v) {

      m += p
      temp.push(m)
    }

    return temp
  }
  
  IndexOf(q: float): int {

    let a: float
    let b: float
    let i: int
    let v: float
    let n: int
  
    v = 0
    n = this.#ranges.length

    for (i = 0; i < n; i++) {
  
      a = v // before
      b = a + this.#ranges[i] // after
      v = b // merging
  
      if (a <= q && q <= b) {
  
        return i
      }
    }
  
    return -1
  }

  IndexesOf(q: float): Array<int> {

    const temp: Array<int> = new Array
  
    let p: float
    let i: int
    let v: float
    let n: int
  
    v = 0
    n = this.#ranges.length
    
    for (i = 0; i < n; i++) {
  
      p = v
      v = p + this.#ranges[i]
  
      // no sorted, check all ranges
      if (p <= q) { // 0.0 <= q, 0.1 <= q, 0.2 <= q, ...
  
        temp.push(i)
      }
    }
  
    return temp
  }

  IndexesIntoNamed(indexes: Array<int>): Array<string> {

    const temp: Array<string> = new Array
  
    let i: int
    let n: int
  
    n = this.#named.length
  
    for (i of indexes) {
  
      if (i < n) {
  
        temp.push(this.#named[i])
      }
    }
  
    return temp
  }

  get Views(): Map<string, float> {

    const entries = Array.from(this.#roles.entries())
    this.#roles = new Map(entries.sort((a: [string, float], b: [string, float]) => a[1] - b[1]))

    this.Update()

    const temp: Map<string, float> = new Map(this.#roles)

    let dist: float | undefined
    let percent: number

    for (let named of this.#named) {

      dist = temp.get(named)
      if (typeof dist !== "undefined") {

        percent = (dist / this.#k) * 100
        temp.set(named, percent)
      }
    }

    return temp
  }

  Update(): void {

    this.#named = Array.from(this.#roles.keys())
    this.#ranges = Array.from(this.#roles.values())
    this.#k = Sum(...this.#ranges)
  }

  RemoveAndUpdate(index: int): void {
  
    // remove
    this.#roles.delete(this.#named[index])
    
    // update
    this.Update()
  }

  Shuffle(): void {

    const entries: Array<[string, float]> = Array.from(this.#roles.entries())
    this.#roles = new Map(ShuffleArray(entries))
    this.Update()
  }

  Spin(): Draw | undefined {

    if (!this.#k) return undefined

    this.Shuffle()
  
    let i: int
    let v: float
  
    v = RanRand(0, this.#k)
    i = this.IndexOf(v)
  
    const named = this.#named[i]

    if (this.#nodups.includes(named)) {
  
      this.RemoveAndUpdate(i)
    }
  
    return new Draw(named, v, i)
  }

  SpinSlow(h: int = 1000): Draw | undefined {

    if (!this.#k) return undefined

    const temp: Array<int> = new Array

    let entry: [string, float]
    let named: string
    let range: float
    let i: float
    let n: float
    let v: float

    n = 0

    for (entry of this.Views.entries()) {

      [named, range] = [entry[0], entry[1]]

      n = Math.floor((range / 100) * h)

      for (i = 0; i < n; i++) {

        temp.push(this.#named.indexOf(named))
      }
    }

    ShuffleArray(temp)

    h = temp.length - 1
    v = RanRand(0, h)
    i = Math.floor(v)

    named = this.#named[temp[i]]
    v = (i / h) * this.#k
    i = this.#named.indexOf(named)

    if (this.#nodups.includes(named)) {

      this.RemoveAndUpdate(i)
    }

    return new Draw(named, v, i)
  }

  get Roles(): Map<string, float> {

    return this.#roles
  }

  set Roles(roles: Map<string, float>) {

    // set new roles
    this.#roles = roles
    this.Update()

    // update nodups
    this.#nodups = this.IndexesIntoNamed(this.IndexesOf(this.#z))
  }
}
