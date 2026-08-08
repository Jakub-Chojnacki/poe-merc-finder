export type ConnectionState
  = | { status: 'loading' }
    | { status: 'connected' }
    | { status: 'unsupported' }
