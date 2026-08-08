import FilterEditor from '@/components/filter-editor'
import { useTradePageFilter } from '@/hooks/use-trade-page-filter'
import { getConnectionView } from './get-connection-view'

const MainSidebar: React.FC = () => {
  const {
    checkConnection,
    connection,
    filterDraft,
    filterSyncStatus,
    refreshTradePage,
    setFilterDraft,
  } = useTradePageFilter()

  const connectionView = getConnectionView(
    connection.status,
    filterSyncStatus,
  )

  const handleConnectionAction = () => {
    if (connectionView.action === 'refresh') {
      refreshTradePage()
      return
    }

    checkConnection()
  }

  return (
    <main className="panel-shell">
      <header className="panel-header">
        <div>
          <p className="panel-eyebrow">Path of Exile Trade</p>
          <h1>Mercenary Support Filter</h1>
        </div>

        <span
          className={`status-badge status-badge--${connection.status}`}
          aria-live="polite"
        >
          {connectionView.statusLabel}
        </span>
      </header>

      <section className="connection-card" aria-labelledby="connection-title">
        <h2 id="connection-title">
          {connectionView.title}
        </h2>
        <p>
          {connectionView.description}
        </p>

        <button
          type="button"
          onClick={handleConnectionAction}
        >
          {connectionView.actionLabel}
        </button>
      </section>

      <FilterEditor value={filterDraft} onChange={setFilterDraft} />
    </main>
  )
}
export default MainSidebar
