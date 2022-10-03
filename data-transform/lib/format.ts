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