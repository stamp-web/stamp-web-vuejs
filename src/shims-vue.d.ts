declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $orderby: (query: string) => object
  }
}
/* eslint-disable */
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  declare module '*.vue'

  export default component
}
