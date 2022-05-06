import type { ScoresResponse } from './models'

const API_URI_SCORES = 'https://wordle.shareup.fun/scores'

const getRealScoresFromNetwork = async () =>
  fetch(API_URI_SCORES, {
    // TODO: auth token shouldn't be hard-coded
    // Storing it in IndexedDB is also not ideal
    // The best way to fix it is to:
    //   1. authenticate via separate endpoint
    //   2. set HTTP-only cookie
    headers: { 'X-Authorization': 'KIRILL-SIDELEV-8FDA42BB' },
    // Fetch will not send cookies by default hence
    credentials: 'same-origin'
  })

export async function getScores(): Promise<ScoresResponse> {
  console.debug('getting scores…')

  const response = await getRealScoresFromNetwork()

  if (response.ok) {
    const json = await response.json()
    return json as ScoresResponse
  } else {
    throw new Error('failed to get scores')
  }
}
