export type ConnectionState
  = | { status: 'loading' }
    | { status: 'connected' }
    | { status: 'unsupported' }

export type FilterSyncStatus = 'idle' | 'syncing' | 'synced' | 'error'
