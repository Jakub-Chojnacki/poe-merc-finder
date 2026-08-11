import type { MainSidebarProps } from './types'
import FilterEditor from '@/components/filter-editor'
import ChevronIcon from '@/components/icons/chevron'
import SavedSetupManager from '@/components/saved-setup-manager'
import { CollapsibleTrigger } from '@/components/ui/collapsible'
import UiTooltip from '@/components/ui/tooltip'
import WarrantImportDialog from '@/components/warrant-import-dialog'
import { useTradePageFilter } from '@/hooks/use-trade-page-filter'

const MainSidebar: React.FC<MainSidebarProps> = ({
  initialFilterDraft,
  onApplyFilter,
}) => {
  const {
    applyFilter,
    filterApplyStatus,
    filterDraft,
    setFilterDraft,
  } = useTradePageFilter(onApplyFilter, initialFilterDraft)

  return (
    <main className="panel-shell">
      <header className="panel-header">
        <div>
          <p className="panel-eyebrow">Path of Exile Trade</p>
          <h1>Mercenary Support Filter</h1>
        </div>

        <UiTooltip content="Collapse mercenary filter">
          <CollapsibleTrigger asChild>
            <button
              type="button"
              className="sidebar-icon-button"
              aria-label="Collapse mercenary filter"
            >
              <ChevronIcon
                className="sidebar-chevron"
              />
            </button>
          </CollapsibleTrigger>
        </UiTooltip>
      </header>

      <WarrantImportDialog
        onImport={filter => setFilterDraft({
          ...filterDraft,
          ...filter,
        })}
      />

      <SavedSetupManager value={filterDraft} onLoad={setFilterDraft} />

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
