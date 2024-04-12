import BaseService from '@/services/BaseService'
import { ReportResult } from '@/models/ReportResult'
import axios from 'axios'
import { ReportType } from '@/models/ReportType'
import { EnumHelper } from '@/util/object-utils'

class ReportService extends BaseService<void> {
  constructor() {
    super()
  }
  getResourceName(): string {
    return 'reports'
  }

  async executeReport(reportType: ReportType, options: any = {}): Promise<ReportResult> {
    const opts = { ...options }
    opts.$reportType = EnumHelper.enumToString(ReportType, reportType)
    const response = await axios.get(this.createURI(opts))
    const result = new ReportResult()
    result.code = response.data.code
    result.value = Number.parseFloat(response.data.value)
    return result
  }
}

export default new ReportService()
