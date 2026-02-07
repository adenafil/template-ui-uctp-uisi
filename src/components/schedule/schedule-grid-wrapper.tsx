import { ScheduleGrid } from './schedule-grid'
import  scheduleData from 'data-contoh.json'

interface ScheduleGridWrapperProps {
  zoomLevel?: number
}

export function ScheduleGridWrapper({ zoomLevel = 1 }: ScheduleGridWrapperProps) {
    // @ts-ignore
  return <ScheduleGrid initialData={scheduleData} zoomLevel={zoomLevel} />
}
