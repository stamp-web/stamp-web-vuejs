export default function stampCount(rowObject: any) {
  const count = rowObject.value
  return count > 1 ? `${count} Stamps` : count > 0 ? `${count} Stamp` : ''
}
