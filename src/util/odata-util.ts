export class OdataUtil {
  public static createSort(col: string, direction: 'asc' | 'desc') {
    return {
      $orderby: `${col} ${direction}`
    }
  }
}
