import type { ApplyTradePageFilter } from '@/hooks/use-trade-page-filter/types'
import FilterEditor from '@/components/filter-editor'
import { useTradePageFilter } from '@/hooks/use-trade-page-filter'

interface MainSidebarProps {
  onApplyFilter: ApplyTradePageFilter
  onCollapse: () => void
}

const MainSidebar: React.FC<MainSidebarProps> = ({
  onApplyFilter,
  onCollapse,
}) => {
  const {
    applyFilter,
    filterApplyStatus,
    filterDraft,
    setFilterDraft,
  } = useTradePageFilter(onApplyFilter)

  return (
    <main className="panel-shell">
      <header className="panel-header">
        <div>
          <p className="panel-eyebrow">Path of Exile Trade</p>
          <h1>Mercenary Support Filter</h1>
        </div>

        <button
          type="button"
          className="sidebar-icon-button"
          aria-label="Collapse mercenary filter"
          title="Collapse mercenary filter"
          onClick={onCollapse}
        >
          <span aria-hidden="true">›</span>
        </button>
      </header>

      <FilterEditor
        applyStatus={filterApplyStatus}
        value={filterDraft}
        onApply={applyFilter}
        onChange={setFilterDraft}
      />
    </main>
  )
}
export default MainSidebar
