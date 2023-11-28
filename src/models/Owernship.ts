export interface Ownership {
  id: number
  pricePaid: number
  purchased?: Date
  grade: number
  condition: number
  img?: string
  notes?: string
  code: string
  defects: number
  deceptions: number
  cert: boolean
  certImg?: string
  albumRef: number
  sellerRef: number
}
