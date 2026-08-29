import type { MainSidebarProps } from './types'
import type { FilterDraft } from '@/features/mercenary-filter/model/filter-draft/types'
import type { ImportedWarrantFilter } from '@/features/warrant-import/model/warrant-parser/types'
import { useState } from 'react'
import FilterEditor from '@/features/mercenary-filter/components/filter-editor'
import { useTradePageFilter } from '@/features/mercenary-filter/hooks/use-trade-page-filter'
import { hasConfiguredSkillRequirements } from '@/features/mercenary-filter/model/filter-draft'
import SavedSetupManager from '@/features/saved-setups/components/saved-setup-manager'
import WarrantImportDialog from '@/features/warrant-import/components/warrant-import-dialog'
import formatCount from '@/shared/format-count'
import { CollapsibleTrigger } from '@/shared/ui/collapsible'
import ChevronIcon from '@/shared/ui/icons/chevron'
import UiTooltip from '@/shared/ui/tooltip'

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
