function jsonToObject<T extends object>(classType: new() => T, jsonObj: object) {
  type TKey = keyof T
  type KKey = keyof typeof jsonObj
  let result = new classType()
  for (const key in result) {
    if (key in jsonObj) {
      if (typeof result[key as TKey] === 'number')
        result[key as TKey] = Number(jsonObj[key as KKey]) as any
      else if (typeof result[key as TKey] === 'string')
        result[key as TKey] = String(jsonObj[key as KKey]) as any
      else if (typeof result[key as TKey] === 'boolean')
        result[key as TKey] = Boolean(jsonObj[key as KKey]) as any
      else
        result[key as TKey] = jsonObj[key as KKey] as any
    }
  }
  return result
}

export default jsonToObject