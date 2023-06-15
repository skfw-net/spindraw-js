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

  return (Math.random() * (max - min)) + min
}

export function ShuffleArray<T>(data: Array<T>): Array<T> {

  let i: int
  let n: int
  let k: int
  let j: int

  i = 0
  n = data.length
  k = n - 1
  n = Math.ceil(n / 2)

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

  constructor(named: string, value: float) {

    this.#named = named
    this.#value = value
  }

  get Gift(): string { return this.#named }
  get Dist(): float { return this.#value }
}

export default class SpinDraw {

  #roles: Map<string, float>
  
  #z: float

  #named: Array<string>
  #ranges: Array<float>
  #k: float

  #nodups: Array<string>

  constructor(roles: Map<string, float>, z: float = Number.MAX_SAFE_INTEGER) {

    let values: Array<float> = new Array;

    // init
    this.#roles = roles;
    this.#named = Array.from(this.#roles.keys())

    // update
    values = Array.from(this.#roles.values())
    this.#ranges = this.RangeValues(...values) // pre-caches
    this.#k = Sum(...values)
    
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
      //b = a + this.#ranges[i] // after
      b = this.#ranges[i] // after
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
      //v = p + this.#ranges[i]
      v = this.#ranges[i]
  
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

    let values: Array<float> = new Array

    this.#named = Array.from(this.#roles.keys())

    values = Array.from(this.#roles.values())
    this.#ranges = this.RangeValues(...values) // pre-caches
    this.#k = Sum(...values)
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

  Spin(): Draw | null {

    let named: string
    let i: int
    let v: float

    if (0 < this.#k) {

      this.Shuffle()
    
      v = RanRand(0, this.#k)
      i = this.IndexOf(v)
    
      named = this.#named[i]
  
      if (this.#nodups.includes(named)) {
    
        this.RemoveAndUpdate(i)
      }
    
      return new Draw(named, v)
    }

    return null
  }

  SpinSlow(h: int = 1000): Draw | null {

    const temp: Array<int> = new Array

    let entry: [string, float]
    let named: string
    let range: float
    let i: float
    let n: float
    let v: float

    if (0 < this.#k) {
  
      n = 0
  
      for (entry of this.Views.entries()) {
  
        [named, range] = [entry[0], entry[1]]
  
        n = Math.round((range / 100) * h)
  
        for (i = 0; i < n; i++) {
  
          temp.push(this.#named.indexOf(named))
        }
      }
  
      ShuffleArray(temp)
  
      h = temp.length - 1
      v = RanRand(0, h)
      i = Math.round(v)
      v = (i / h) * this.#k
      i = temp[i]

      named = this.#named[i]
  
      if (this.#nodups.includes(named)) {
  
        this.RemoveAndUpdate(i)
      }
  
      return new Draw(named, v)
    }

    return null
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
