export enum Deception {
  FAKE_CANCEL = 2,
  FAKE_OVERPRINT = 4,
  FISCAL_REMOVED = 8,
  FORGERY = 16,
  FORGERY_POSSIBLE = 32,
  REPAIRED = 64,
  REPRINT = 128,
  REGUM = 256
}

export class DeceptionHelper {
  public static toString(value: number): string {
    let text = ''
    switch (value) {
      case Deception.FISCAL_REMOVED:
        text = 'Fiscal Cancel Removed'
        break
      case Deception.FAKE_CANCEL:
        text = 'Fake Cancel'
        break
      case Deception.FAKE_OVERPRINT:
        text = 'Fake Overprint'
        break
      case Deception.FORGERY:
        text = 'Forgery'
        break
      case Deception.FORGERY_POSSIBLE:
        text = 'Possible Forgery'
        break
      case Deception.REPAIRED:
        text = 'Repaired'
        break
      case Deception.REPRINT:
        text = 'Reprint'
        break
      case Deception.REGUM:
        text = 'Regummed'
        break
    }
    return text
  }
}
