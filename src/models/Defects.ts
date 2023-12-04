export enum Defects {
  THIN = 2,
  TORN = 4,
  TONED_PAPER = 8,
  CREASED = 16,
  SCUFFED = 32,
  PINHOLE = 64,
  SHORT_PERF = 128,
  STUNTED_PERF = 256,
  CLIPPED = 512,
  FADING = 1024,
  BLEEDING = 2048,
  INK_STAIN = 4096,
  CHANGELING = 8192,
  CRACKED_GUM = 16384,
  TONED_GUM = 32768,
  HEAVILY_HINGED = 65536,
  ALBUM_TRANSFER = 131072,
  PAPER_ADHESION = 262144,
  SOILED = 524288
}

export class DefectsHelper {
  public static toString(value: number): string {
    let text = ''
    switch (value) {
      case Defects.THIN:
        text = 'Thinned'
        break
      case Defects.TORN:
        text = 'Torn'
        break
      case Defects.TONED_PAPER:
        text = 'Paper Toned'
        break
      case Defects.CREASED:
        text = 'Creased'
        break
      case Defects.SCUFFED:
        text = 'Scuff Marks'
        break
      case Defects.PINHOLE:
        text = 'Pinhole'
        break
      case Defects.SHORT_PERF:
        text = 'Short Perforations'
        break
      case Defects.STUNTED_PERF:
        text = 'Stunted Perforations'
        break
      case Defects.CLIPPED:
        text = 'Paper Clipped'
        break
      case Defects.FADING:
        text = 'Color Fading'
        break
      case Defects.BLEEDING:
        text = 'Color Bleeding'
        break
      case Defects.INK_STAIN:
        text = 'Ink Stains'
        break
      case Defects.CHANGELING:
        text = 'Color Changeling'
        break
      case Defects.CRACKED_GUM:
        text = 'Cracked Gum'
        break
      case Defects.TONED_GUM:
        text = 'Toned Gum'
        break
      case Defects.HEAVILY_HINGED:
        text = 'Heavily Hinged'
        break
      case Defects.ALBUM_TRANSFER:
        text = 'Album Transfer'
        break
      case Defects.PAPER_ADHESION:
        text = 'Paper Adhesion'
        break
      case Defects.SOILED:
        text = 'Soiled Paper'
        break
    }
    return text
  }
}
