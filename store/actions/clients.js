export const CLIENT_CONNECTED = 'CLIENT_CONNECTED'
export const CLIENT_DISCONNECTED = 'CLIENT_DISCONNECTED'

export function clientConnected(key, client) {
  return {
    type: CLIENT_CONNECTED,
    key,
    client
  }
}

export function clientDisconnected(key, client) {
  return {
    type: CLIENT_DISCONNECTED,
    key,
    client
  }
}
