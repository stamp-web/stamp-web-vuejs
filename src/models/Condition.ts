export const enum Condition {
  MINT = 0,
  MINT_NH = 1,
  USED = 2,
  CTO = 3,
  MINT_NG = 4,
  MINT_HH = 5,
  COVER = 6,
  ON_PAPER = 7,
  MANUSCRIPT = 8
}
export class ConditionHelper {
  static toString(value: number): string {
    let text = ''
    switch (value) {
      case Condition.MINT:
        text = 'Mint'
        break
      case Condition.MINT_NH:
        text = 'Mint (NH)'
        break
      case Condition.MINT_NG:
        text = 'Mint (No gum)'
        break
      case Condition.MINT_HH:
        text = 'Mint (heavily hinged)'
        break
      case Condition.CTO:
        text = 'Cancel to Order'
        break
      case Condition.USED:
        text = 'Used'
        break
      case Condition.COVER:
        text = 'Used on Cover'
        break
      case Condition.MANUSCRIPT:
        text = 'Manuscript Cancel'
        break
      case Condition.ON_PAPER:
        text = 'Used on Paper'
        break
    }
    return text
  }
}
