import React from 'react'

const columns = [
  { label: '1', time: '7:30 - 8:20', isBreak: false },
  { label: '2', time: '8:20 - 9:10', isBreak: false },
  { label: '3', time: '9:10 - 10:00', isBreak: false },
  { label: '4', time: '10:00 - 10:50', isBreak: false },
  { label: '5', time: '10:50 - 11:40', isBreak: false },
  { label: 'Istirahat', time: '11:40 - 12:30', isBreak: true },
  { label: '6', time: '12:30 - 13:20', isBreak: false },
  { label: '7', time: '13:20 - 14:10', isBreak: false },
  { label: '8', time: '14:10 - 15:00', isBreak: false },
  { label: 'Istirahat', time: '15:00 - 15:30', isBreak: true },
  { label: '9', time: '15:30 - 16:20', isBreak: false },
  { label: '10', time: '16:20 - 17:10', isBreak: false },
  { label: '11', time: '17:10 - 18:00', isBreak: false },
  { label: 'Istirahat', time: '18:00 - 18:30', isBreak: true },
  { label: '12', time: '18:30 - 19:20', isBreak: false },
  { label: '13', time: '19:20 - 20:10', isBreak: false },
  { label: '14', time: '20:10 - 21:00', isBreak: false },
]

interface ScheduleEntry {
  startCol: number
  span: number
  name: string
  room: string
  teacher: string
  bgColor: string
  textColor?: string
  diagonal?: {
    color1: string
    color2: string
  }
}

interface DayData {
  label: string
  entries: ScheduleEntry[]
}

const days: DayData[] = [
  {
    label: 'Mo',
    entries: [
      {
        startCol: 0,
        span: 4,
        name: 'K',
        room: 'G4 R1',
        teacher: 'NGT / TGR',
        bgColor: '',
        diagonal: { color1: '#C8C800', color2: '#00C8C8' },
      },
    ],
  },
  {
    label: 'Tu',
    entries: [
      {
        startCol: 3,
        span: 2,
        name: 'Pemrograman 1',
        room: 'Lab 2',
        teacher: 'MNI',
        bgColor: '#FF00FF',
      },
      {
        startCol: 6,
        span: 3,
        name: 'Pemrograman 1',
        room: 'Lab 2',
        teacher: 'MNI',
        bgColor: '#00C8C8',
      },
    ],
  },
  {
    label: 'We',
    entries: [
      {
        startCol: 6,
        span: 3,
        name: 'Statistika Dasar',
        room: 'G3 R4',
        teacher: 'FNH',
        bgColor: '#00C8C8',
      },
      {
        startCol: 10,
        span: 3,
        name: 'Matematika Diskret',
        room: 'G3 R4',
        teacher: 'NGT / MZF',
        bgColor: '',
        diagonal: { color1: '#C000C0', color2: '#00C000' },
      },
    ],
  },
  {
    label: 'Th',
    entries: [
      {
        startCol: 10,
        span: 2,
        name: 'Agama',
        room: 'G4 R1',
        teacher: 'MNF',
        bgColor: '#8B6914',
        textColor: '#FFFFFF',
      },
    ],
  },
  {
    label: 'Fr',
    entries: [
      {
        startCol: 6,
        span: 2,
        name: 'Pengantar Teknologi Informasi',
        room: 'G4 R2',
        teacher: 'NGT / TGR',
        bgColor: '#008080',
        textColor: '#FFFFFF',
      },
    ],
  },
  {
    label: 'Sa',
    entries: [],
  },
]

function ScheduleCell({ entry }: { entry: ScheduleEntry }) {
  const bgStyle: React.CSSProperties = entry.diagonal
    ? {
        background: `linear-gradient(to bottom right, ${entry.diagonal.color1} 50%, ${entry.diagonal.color2} 50%)`,
      }
    : { backgroundColor: entry.bgColor }

  const isShortName = entry.name.length <= 3
  const textColor = entry.textColor || '#000000'

  return (
    <td
      colSpan={entry.span}
      className="border border-black p-0"
      style={bgStyle}
    >
      <div
        className="flex flex-col justify-between h-full p-1"
        style={{ minHeight: '110px', color: textColor }}
      >
        <div className="flex-1 flex items-center justify-center">
          <span
            className={`font-bold text-center leading-tight text-black ${
              isShortName ? 'text-3xl' : 'text-[11px]'
            }`}
          >
            {entry.name}
          </span>
        </div>
        <div className="flex justify-between w-full text-black text-[8px] gap-1">
          <span className="font-semibold">{entry.room}</span>
          <span>{entry.teacher}</span>
        </div>
      </div>
    </td>
  )
}

function DayRow({ day }: { day: DayData }) {
  const entryStarts = new Map<number, ScheduleEntry>()
  const occupied = new Set<number>()

  for (const entry of day.entries) {
    entryStarts.set(entry.startCol, entry)
    for (let i = entry.startCol; i < entry.startCol + entry.span; i++) {
      occupied.add(i)
    }
  }

  const cells: React.ReactNode[] = []
  let col = 0

  while (col < columns.length) {
    const entry = entryStarts.get(col)
    if (entry) {
      cells.push(<ScheduleCell key={col} entry={entry} />)
      col += entry.span
    } else if (!occupied.has(col)) {
      cells.push(
        <td
          key={col}
          className="border border-black"
          style={{ minHeight: '80px' }}
        />
      )
      col++
    } else {
      col++
    }
  }

  return (
    <tr>
      <td
        className="border-2 border-black p-8 font-bold text-3xl text-center align-middle"
        style={{ minWidth: '70px', backgroundColor: '#FFFFFF', color: '#000000' }}
      >
        {day.label}
      </td>
      {cells}
    </tr>
  )
}

export default function Timetable() {
  return (
    <div className="p-4 min-h-screen" style={{ backgroundColor: '#FFFFFF', color: '#000000' }}>
      {/* Title */}
      <div className="text-center mb-1">
        <h1 className="text-base font-normal" style={{ color: '#000000' }}>
          Jadwal Kuliah Semester Gasal T.A. 2025/2026
        </h1>
        <h2 className="text-2xl font-bold" style={{ color: '#000000' }}>IF-1A</h2>
      </div>

      {/* UISI1 label */}
      <div className="text-xs mb-1" style={{ color: '#000000' }}>UISI1</div>

      {/* Timetable */}
      <div className="overflow-x-auto border-2 border-black">
        <table
          className="border-collapse w-full table-fixed"
          style={{ minWidth: '1100px' }}
        >
          <colgroup>
            <col style={{ width: '70px' }} />
            {columns.map((c, i) => (
              <col
                key={i}
                style={{ width: c.isBreak ? '45px' : '70px' }}
              />
            ))}
          </colgroup>

          <thead>
            <tr>
              <th
                className="border border-black"
                style={{ backgroundColor: '#FFFFFF' }}
              />
              {columns.map((col, i) => (
                <th
                  key={i}
                  className="border border-black p-0.5 text-center align-top p-4"
                  style={{ backgroundColor: '#FFFFFF', color: '#000000' }}
                >
                  <div className="flex flex-col items-center">
                    <span
                      className={
                        col.isBreak
                          ? 'text-[15px] leading-tight font-normal'
                          : 'text-lg font-bold'
                      }
                    >
                      {col.label}
                    </span>
                    <span className="text-[8.5px] font-bold leading-tight" style={{ color: '#00000' }}>
                      {col.time}
                    </span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {days.map((day, i) => (
              <DayRow key={i} day={day} />
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="flex justify-between mt-1 text-[10px]" style={{ color: '#000000' }}>
        <span>Timetable generated: 26/09/2025</span>
        <span>aSc Timetables</span>
      </div>
    </div>
  )
}
