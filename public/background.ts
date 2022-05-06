/// <reference no-default-lib="true" />
/// <reference lib="esnext" />
/// <reference lib="webworker" />

import { open as openDB } from './db'
import { getScores } from './get-scores'
import type { Score } from './models'

type DB = ReturnType<typeof openDB> extends Promise<infer D> ? D : never

const UPDATE_PERIOD = 60 * 1000 // ms

// NOTE: top-level await will be cool someday
setupBackgroundSyncProcess().catch(e => {
  console.error('error setting up the background sync process', e)
})

async function setupBackgroundSyncProcess(): Promise<void> {
  const db = await openDB()
  const runSync = () => {
    sync(db).catch(e => {
      console.error('error running background sync process', e)
    })
  }

  runSync()

  setInterval(runSync, UPDATE_PERIOD)
}

async function sync(db: DB): Promise<void> {
  console.group('sync')

  let response

  try {
    response = await getScores()
  } catch (e) {
    console.groupEnd()
    throw e
  }

  console.debug('getScores', response)

  const scoresMap: Map<number, Score> = response.scores.reduce((acc, score) => {
    acc.set(score.id, score)
    return acc
  }, new Map())

  const tx = db.transaction('scores', 'readwrite')
  let didUpdate = false

  console.debug({ tx })

  try {
    let cursor = await tx.store.openCursor()

    console.debug({ cursor })

    while (cursor) {
      if (scoresMap.has(cursor.key)) {
        // NOTE: ignore scores we already have locally
        scoresMap.delete(cursor.key)
      } else {
        // NOTE: delete scores missing from the response
        console.debug('deleting score', cursor.key)
        await cursor.delete()
        didUpdate = true
      }

      cursor = await cursor.continue()
    }

    // NOTE: add scores we don't already have locally
    for (const score of Array.from(scoresMap.values())) {
      console.debug('adding score', score)
      await tx.store.add(score)
      didUpdate = true
    }

    console.debug('done syncing')
    await tx.done

    if (didUpdate) {
      self.postMessage({ type: 'scoresUpdated' })
    }
  } catch (e) {
    console.error('could not persist scores', e)

    try {
      // NOTE: if it's already aborted, then calling abort will throw
      tx.abort()
    } catch (e) {
      console.error('already aborted, ignoring', e)
    } finally {
      console.debug('aborted tx')
    }
  } finally {
    console.groupEnd()
  }
}
