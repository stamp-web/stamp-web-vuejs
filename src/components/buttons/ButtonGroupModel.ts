export class ButtonGroupModel {
  icon: String = ''
  isToggled: Boolean = false
  label: String = ''
  tooltip: String = ''
  value: any

  constructor() {}

  static newInstance(
    value: any,
    icon: String,
    isToggled: Boolean,
    tooltip: String,
    label: String = ''
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
