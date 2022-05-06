# Solution

I aimed to make improvements with minimal intervention, 
like I would do in real work.


## Fetching data from API

I've used fetch to get data. getRealScoresFromNetwork was
implemented as suggested in TODO.


### Storing the secrets

I've hardcoded API token for the test purposes. I've considered
two ways to fix it:
  1. Storing secrets in indexedDB
  2. HTTP-only cookie + Access-Control-Allow-Origin

First way would be vulnerable to stealing a token. So I would 
prefer to change the API to accept a cookie + create an 
authentication endpoint.

### credentials: 'same-origin'

By-default fetch will not send cookies. It could be fixed by
adding a parameter `{ credentials: 'same-origin' }


## Periodical updates

setupBackgroundSyncProcess will fetch API every minute.

### useMessages

To abstract communication with background worker `useMessages`
was created.

## Chrome extensions bug

There was a bug. Webworker tried to cache chrome extensions.
So I just fixed that with checking for http/s url scheme.

# Improvements

If I had more time, I would:

  1. Use green and yellow color to highlight letters
  2. Use websockets, so we have realtime updates
  3. Store secrets properly
  4. Improve number of requests to the API at the page load
  5. Added error state in UI for useFetched
  6. Test it more deliberately
