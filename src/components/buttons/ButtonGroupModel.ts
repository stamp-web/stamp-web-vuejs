export class ButtonGroupModel {
  icon: string = ''
  isToggled: boolean = false
  label: string = ''
  tooltip: string = ''
  value: number | string = ''

  constructor() {}

  static newInstance(
    value: number | string,
    icon: string,
    isToggled: boolean,
    tooltip: string,
    label: string = ''
  ): ButtonGroupModel {
    const obj = new ButtonGroupModel()
    obj.icon = icon
    obj.value = value
    obj.isToggled = isToggled
    obj.tooltip = tooltip
    obj.label = label
    return obj
  }
}
