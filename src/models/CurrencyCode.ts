export enum CurrencyCode {
  USD = 'USD',
  CAD = 'CAD',
  AUD = 'AUD',
  JPY = 'JPY',
  EUR = 'EUR',
  GBP = 'GBP',
  SEK = 'SEK',
  ITL = 'ITL',
  DEM = 'DEM'
}
export class CurrencyTools {
  static formatRegex(code: CurrencyCode, disp: boolean = true) {
    let regex = /^\d*$/i
    const stdInput = /^\d*(\.\d{1,2})?$/i
    switch (code) {
      case CurrencyCode.USD:
      case CurrencyCode.AUD:
      case CurrencyCode.CAD:
      case CurrencyCode.GBP:
        regex = disp ? /^\d*(\.\d{1,2})?$/i : stdInput
        break
      case CurrencyCode.EUR:
        regex = disp ? /^\d*(,\d{1,2})?$/i : stdInput
        break
      case CurrencyCode.JPY:
      case CurrencyCode.ITL:
        regex = disp ? /^\d{1,3}(,\d{3})*(\.\d{2})?$/i : stdInput
        break
      case CurrencyCode.SEK:
        regex = disp ? /^\d{1,3}(.\d{3})*(,\d{2})?$/i : stdInput
        break
    }
    return regex
  }

  static asCurrencyString(value: number, currency: string = CurrencyCode.USD): string {
    const minFractions = currency === CurrencyCode.JPY ? 0 : 2
    let text = ''
    if (currency && !isNaN(value) && value) {
      text = value.toLocaleString('en', {
        style: 'currency',
        currencyDisplay: 'symbol',
        currency: currency,
        minimumFractionDigits: minFractions
      })
    }
    return text
  }
}
