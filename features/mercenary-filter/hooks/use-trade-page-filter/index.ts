import type {
  ApplyTradePageFilter,
  FilterApplyStatus,
  UseTradePageFilterResult,
} from './types'
import type { FilterDraft } from '@/features/mercenary-filter/model/filter-draft/types'
import { useCallback, useState } from 'react'
import { createFilterConfig } from '@/features/mercenary-filter/model/filter-config'
import { createEmptyFilterDraft } from '@/features/mercenary-filter/model/filter-draft'

export function useTradePageFilter(
  onApplyFilter: ApplyTradePageFilter,
  initialFilterDraft?: FilterDraft,
): UseTradePageFilterResult {
  const [filterApplyStatus, setFilterApplyStatus]
    = useState<FilterApplyStatus>(initialFilterDraft ? 'applied' : 'idle')

  const [filterDraft, setFilterDraft] = useState(
    () => initialFilterDraft ?? createEmptyFilterDraft(),
  )

  const applyFilter = useCallback(async () => {
    setFilterApplyStatus('applying')

    try {
      await onApplyFilter(createFilterConfig(filterDraft))
      setFilterApplyStatus('applied')
    }
    catch {
      setFilterApplyStatus('error')
    }
  }, [filterDraft, onApplyFilter])

  const updateFilterDraft = useCallback((nextFilterDraft: FilterDraft) => {
    setFilterDraft(nextFilterDraft)
    setFilterApplyStatus('idle')
  }, [])

  return {
    applyFilter,
    filterApplyStatus,
    filterDraft,
    setFilterDraft: updateFilterDraft,
  }
}
