import type {
  ApplyTradePageFilter,
  FilterApplyStatus,
  UseTradePageFilterResult,
} from './types'
import type { FilterDraft } from '@/utils/filter-draft/types'
import { useCallback, useState } from 'react'
import { createFilterConfig } from '@/utils/filter-config'
import { createEmptyFilterDraft } from '@/utils/filter-draft'

export function useTradePageFilter(
  onApplyFilter: ApplyTradePageFilter,
): UseTradePageFilterResult {
  const [filterApplyStatus, setFilterApplyStatus]
    = useState<FilterApplyStatus>('idle')

  const [filterDraft, setFilterDraft] = useState(createEmptyFilterDraft)

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
