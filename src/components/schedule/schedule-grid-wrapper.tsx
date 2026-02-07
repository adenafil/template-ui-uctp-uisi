import { ScheduleGrid } from './schedule-grid'
import  scheduleData from 'data-contoh.json'

export function ScheduleGridWrapper() {
    // @ts-ignore
  return <ScheduleGrid initialData={scheduleData} />
}
