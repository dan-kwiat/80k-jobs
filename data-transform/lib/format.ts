export function snakeCase(str: string) {
  return str.replace(/ /g, "_").replace(/\W/g, "").toLowerCase()
}

export function slugify(str: string) {
  return str
    .replace(/ /g, "_")
    .replace(/\W/g, "")
    .replace(/_/g, "-")
    .toLocaleLowerCase()
}

export function filterId(filterType: string, filterName: string) {
  return slugify(`${filterType} ${filterName}`)
}

export function dequote(str: string): string {
  if (!str) return ""
  if (str[0] === '"' && str[str.length - 1] === '"') {
    return str.substring(1, str.length - 1)
  }
  return str
}

export function padZeroes(str: string, length: number = 2): string {
  let paddedString = str
  while (paddedString.length < length) {
    paddedString = "0" + paddedString
  }
  return paddedString
}

export function getDomain(url: string): string {
  let arr = url?.split("://") ?? null
  let domain = arr[arr.length - 1]?.split("/")[0]?.split("?")[0]
  return domain ?? ""
}
