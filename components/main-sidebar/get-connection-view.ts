import type {
  ConnectionState,
  FilterSyncStatus,
} from '@/hooks/use-trade-page-filter/types'

interface ConnectionView {
  action: 'check' | 'refresh'
  actionLabel: string
  description: string
  statusLabel: string
  title: string
}

export function getConnectionView(
  connectionStatus: ConnectionState['status'],
  filterSyncStatus: FilterSyncStatus,
): ConnectionView {
  if (connectionStatus === 'loading') {
    return {
      action: 'check',
      actionLabel: 'Check again',
      description: 'Navigate to a Path of Exile trade search, then check the connection again.',
      statusLabel: 'Checking',
      title: 'Looking for a trade search',
    }
  }

  if (connectionStatus === 'connected') {
    if (filterSyncStatus === 'error') {
      return {
        action: 'refresh',
        actionLabel: 'Refresh trade page',
        description: 'This tab is running an older version of the extension content script.',
        statusLabel: 'Connected',
        title: 'Refresh the trade page',
      }
    }

    if (filterSyncStatus === 'synced') {
      return {
        action: 'check',
        actionLabel: 'Check again',
        description: 'Manual filters are synced with the trade page.',
        statusLabel: 'Connected',
        title: 'Connected to the trade page',
      }
    }

    return {
      action: 'check',
      actionLabel: 'Check again',
      description: 'Manual filters are ready to configure.',
      statusLabel: 'Connected',
      title: 'Connected to the trade page',
    }
  }

  return {
    action: 'check',
    actionLabel: 'Check again',
    description: 'Navigate to a Path of Exile trade search, then check the connection again.',
    statusLabel: 'Not connected',
    title: 'Open a supported PoE trade search',
  }
}
