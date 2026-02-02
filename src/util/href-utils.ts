export function findBasePath(path: string) {
  if (path === '/') return '/'
  return path.replace(/\/[^\/]+\/?$/, '/')
}
