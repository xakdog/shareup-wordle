import { useEffect } from 'preact/hooks'
import { useBackground } from '../background-context'

export type MessageHandlers = {
  onScoresUpdated?(): void
}

export const useMessages = (handlers: MessageHandlers) => {
  const worker = useBackground()

  useEffect(() => {
    if (!worker) { return }

    const onMessage = ev => {
      console.debug('got worker message', ev)

      if (ev.data.type === 'scoresUpdated') {
        handlers?.onScoresUpdated()
      }
    }

    worker.addEventListener('message', onMessage)

    return () => worker.removeEventListener('message', onMessage)
  }, [worker, handlers.onScoresUpdated])
}
