/**
 Copyright 2025 Jason Drake

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
 */

export class PdfGenerator {
  constructor() {}

  pdfMaker: unknown
  vfsFonts: unknown

  initialize(): Promise<void> {
    if (!this.pdfMaker) {
      const vfsFonts = () => import('pdfmake/build/vfs_fonts')
      const pdfMake = () => import('pdfmake/build/pdfmake')
      return Promise.all([pdfMake(), vfsFonts()]).then((result) => {
        this.pdfMaker = result[0]
        this.vfsFonts = result[1]
      })
    } else {
      return Promise.resolve()
    }
  }

  printReport(opts: object) {
    this.initialize()
      .then(() => {
        const docDefinition = opts
        this.pdfMaker.createPdf(docDefinition, null, null, this.vfsFonts).print()
      })
      .catch((e) => {
        console.log(e)
      })
  }
}
