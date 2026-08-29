import type { FilterActionsProps } from './types'
import { useTradeSearchLink } from '@/features/trade-search/hooks/use-trade-search-link'
import {
  COPY_LINK_BUTTON_LABELS,
  GENERATE_LINK_BUTTON_LABELS,
} from '@/features/trade-search/hooks/use-trade-search-link/const'
import UiTooltip from '@/shared/ui/tooltip'
import { APPLY_BUTTON_LABELS } from './const'

const FilterActions: React.FC<FilterActionsProps> = ({
  applyStatus,
  filterDraft,
  onApply,
}) => {
  const {
    copyLink,
    errorMessage,
    generateLink,
    generatedLink,
    status,
    warningMessage,
  } = useTradeSearchLink(filterDraft)

  return (
    <footer className="filter-actions" aria-label="Filter actions">
      <div className="filter-actions__buttons">
        <button
          type="button"
          className="filter-actions__apply"
          aria-live="polite"
          disabled={applyStatus === 'applying'}
          onClick={() => onApply()}
        >
          {APPLY_BUTTON_LABELS[applyStatus]}
        </button>

        <UiTooltip content="Required supports are included; optional supports stay local.">
          <button
            type="button"
            className="filter-actions__generate"
            disabled={status === 'generating'}
            onClick={() => generateLink()}
          >
            {GENERATE_LINK_BUTTON_LABELS[status]}
          </button>
        </UiTooltip>
      </div>

      {generatedLink && (
        <div className="filter-actions__result" role="status">
          <span>Search link ready</span>

          <div className="filter-actions__result-buttons">
            <button type="button" onClick={() => copyLink()}>
              {COPY_LINK_BUTTON_LABELS[status]}
            </button>
            <a href={generatedLink} target="_blank" rel="noreferrer">
              Open ↗
            </a>
          </div>
        </div>
      )}

      {warningMessage && (
        <p className="filter-actions__warning" role="status">
          {warningMessage}
        </p>
      )}

      {errorMessage && (
        <p className="filter-actions__error" role="alert">
          {errorMessage}
        </p>
      )}
    </footer>
  )
}

export default FilterActions
