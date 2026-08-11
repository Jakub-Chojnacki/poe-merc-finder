import type { MainSidebarProps } from './types'
import type { FilterDraft } from '@/utils/filter-draft/types'
import type { ImportedWarrantFilter } from '@/utils/warrant-import/types'
import { useState } from 'react'
import FilterEditor from '@/components/filter-editor'
import ChevronIcon from '@/components/icons/chevron'
import SavedSetupManager from '@/components/saved-setup-manager'
import { CollapsibleTrigger } from '@/components/ui/collapsible'
import UiTooltip from '@/components/ui/tooltip'
import WarrantImportDialog from '@/components/warrant-import-dialog'
import { useTradePageFilter } from '@/hooks/use-trade-page-filter'
import { hasConfiguredSkillRequirements } from '@/utils/filter-draft'

function formatCount(count: number, label: string): string {
  return `${count} ${label}${count === 1 ? '' : 's'}`
}

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
  const [warrantImportSummary, setWarrantImportSummary] = useState<string>()

  const updateFilterDraft = (filter: FilterDraft): void => {
    setWarrantImportSummary(undefined)
    setFilterDraft(filter)
  }

  const importWarrant = (filter: ImportedWarrantFilter): void => {
    const supportCount = filter.requirements.reduce(
      (count, requirement) => count + requirement.requiredSupports.length,
      0,
    )

    setFilterDraft({
      ...filterDraft,
      ...filter,
    })
    setWarrantImportSummary(
      `Imported ${filter.mercenaryClass} with ${formatCount(filter.requirements.length, 'skill')} and ${formatCount(supportCount, 'linked support')}.`,
    )
  }

  return (
    <main className="panel-shell">
      <header className="panel-header ui-split-header">
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
              <ChevronIcon className="ui-icon-sm" />
            </button>
          </CollapsibleTrigger>
        </UiTooltip>
      </header>

      <div className="warrant-import">
        <WarrantImportDialog
          confirmReplacement={hasConfiguredSkillRequirements(
            filterDraft.requirements,
          )}
          onImport={importWarrant}
        />

        {warrantImportSummary && (
          <p className="warrant-import__status" role="status">
            {warrantImportSummary}
          </p>
        )}
      </div>

      <SavedSetupManager value={filterDraft} onLoad={updateFilterDraft} />

      <FilterEditor
        applyStatus={filterApplyStatus}
        value={filterDraft}
        onApply={applyFilter}
        onChange={updateFilterDraft}
      />
    </main>
  )
}
export default MainSidebar
