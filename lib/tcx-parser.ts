import { parseStringPromise } from 'xml2js'
import type { Session, Lap, HRZones } from './types'
import { getZone } from './training-zones'

const NS = 'http://www.garmin.com/xmlschemas/TrainingCenterDatabase/v2'
const NS_EXT = 'http://www.garmin.com/xmlschemas/ActivityExtension/v2'

function safeNum(val: unknown): number {
  const n = Number(val)
  return isNaN(n) ? 0 : n
}

function getVal(obj: Record<string, unknown> | null | undefined, ...keys: string[]): unknown {
  if (!obj) return undefined
  for (const k of keys) {
    if (obj[k] !== undefined) return obj[k]
  }
  return undefined
}

// xml2js returns arrays even for single items; normalize to first element
function first<T>(val: T | T[]): T {
  return Array.isArray(val) ? val[0] : val
}

export interface ParsedTcx {
  date: string
  distance: number      // km
  duration: number      // seconds
  avgPace: number       // sec/km
  avgHR: number
  maxHR: number
  avgCadence: number    // spm
  elevationGain: number
  laps: Lap[]
  hrZones: HRZones
}

export async function parseTcx(xml: string): Promise<ParsedTcx> {
  const result = await parseStringPromise(xml, {
    explicitArray: true,
    ignoreAttrs: false,
    trim: true,
  })

  const tcdb = result['TrainingCenterDatabase'] ?? result[`ns2:TrainingCenterDatabase`]
  const activities = first(tcdb?.Activities ?? tcdb?.['ns2:Activities'])
  const activity = first((activities as Record<string, unknown>)?.Activity ?? (activities as Record<string, unknown>)?.['ns2:Activity'])
  if (!activity) throw new Error('No activity found in TCX')

  const actObj = activity as Record<string, unknown[]>
  const lapNodes: Record<string, unknown[]>[] = (actObj.Lap ?? actObj['ns2:Lap'] ?? []) as Record<string, unknown[]>[]

  // Extract start date from first lap attribute or Id
  const idNode = first(actObj.Id ?? actObj['ns2:Id']) as string | undefined
  const startTime = idNode ?? ''
  const date = startTime.split('T')[0] ?? new Date().toISOString().split('T')[0]

  const laps: Lap[] = []
  let totalHRSum = 0
  let totalHRCount = 0
  let maxHR = 0
  let totalElevGain = 0
  let totalCadenceSum = 0
  let totalCadenceCount = 0
  const hrZones: HRZones = { z1: 0, z2: 0, z3: 0, z4: 0, z5: 0 }

  for (let i = 0; i < lapNodes.length; i++) {
    const lap = lapNodes[i]
    const dist = safeNum(first(lap.DistanceMeters ?? lap['ns2:DistanceMeters'])) / 1000
    const time = safeNum(first(lap.TotalTimeSeconds ?? lap['ns2:TotalTimeSeconds']))
    const avgHRNode = first(lap.AverageHeartRateBpm ?? lap['ns2:AverageHeartRateBpm']) as Record<string, unknown[]>
    const maxHRNode = first(lap.MaximumHeartRateBpm ?? lap['ns2:MaximumHeartRateBpm']) as Record<string, unknown[]>
    const avgHR = avgHRNode ? safeNum(first(avgHRNode.Value ?? avgHRNode['ns2:Value'])) : 0
    const lapMaxHR = maxHRNode ? safeNum(first(maxHRNode.Value ?? maxHRNode['ns2:Value'])) : 0
    if (lapMaxHR > maxHR) maxHR = lapMaxHR

    // Cadence from extensions
    let cadence = 0
    const extensions = first(lap.Extensions ?? lap['ns2:Extensions']) as Record<string, unknown[]> | undefined
    if (extensions) {
      const lx = first(extensions['ns3:LX'] ?? extensions['TPX'] ?? extensions['ns2:Extensions']) as Record<string, unknown[]> | undefined
      if (lx) {
        const rc = first(lx['ns3:RunCadence'] ?? lx['RunCadence'])
        if (rc !== undefined) cadence = safeNum(rc) * 2  // half-steps → spm
      }
    }

    const pace = dist > 0 ? time / dist : 0

    laps.push({ index: i + 1, distance: dist, time, avgHR, maxHR: lapMaxHR, avgPace: pace, cadence })

    if (avgHR > 0) { totalHRSum += avgHR * time; totalHRCount += time }
    if (cadence > 0) { totalCadenceSum += cadence; totalCadenceCount++ }

    // HR zones from trackpoints
    const track = first(lap.Track ?? lap['ns2:Track']) as Record<string, unknown[]> | undefined
    if (track) {
      const points: Record<string, unknown[]>[] = (track.Trackpoint ?? track['ns2:Trackpoint'] ?? []) as Record<string, unknown[]>[]
      for (const pt of points) {
        const hrNode = first(pt.HeartRateBpm ?? pt['ns2:HeartRateBpm']) as Record<string, unknown[]> | undefined
        if (hrNode) {
          const hr = safeNum(first(hrNode.Value ?? hrNode['ns2:Value']))
          if (hr > 0) {
            const zone = getZone(hr)
            hrZones[zone] += 1  // 1 second per trackpoint (approximate)
          }
        }
        // Elevation
        const alt = first(pt.AltitudeMeters ?? pt['ns2:AltitudeMeters'])
        if (alt !== undefined) {
          // Simple positive elevation sum not tracked per point here
        }
      }
    }
  }

  const totalDistance = laps.reduce((s, l) => s + l.distance, 0)
  const totalTime = laps.reduce((s, l) => s + l.time, 0)
  const avgHR = totalHRCount > 0 ? Math.round(totalHRSum / totalHRCount) : 0
  const avgPace = totalDistance > 0 ? totalTime / totalDistance : 0
  const avgCadence = totalCadenceCount > 0 ? Math.round(totalCadenceSum / totalCadenceCount) : 0

  return {
    date,
    distance: Math.round(totalDistance * 100) / 100,
    duration: Math.round(totalTime),
    avgPace: Math.round(avgPace),
    avgHR,
    maxHR,
    avgCadence,
    elevationGain: totalElevGain,
    laps,
    hrZones,
  }
}
