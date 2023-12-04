export const enum Grade {
  XF = 0,
  VF = 1,
  FVF = 2,
  F = 3,
  VG = 4,
  D = 5,
  CTS = 6
}

export class GradeHelper {
  static toString(value: number): string {
    let text = ''
    switch (value) {
      case Grade.XF:
        text = 'Extra-Fine (XF)'
        break
      case Grade.VF:
        text = 'Very-Fine (VF)'
        break
      case Grade.FVF:
        text = 'Fine-Very-Fine (FVF)'
        break
      case Grade.F:
        text = 'Fine (F)'
        break
      case Grade.VG:
        text = 'Very-Good (VG)'
        break
      case Grade.D:
        text = 'Damaged (D)'
        break
      case Grade.CTS:
        text = 'Cut-To-Shape (CTS)'
        break
    }
    return text
  }
}
