import type { GeneratedSearchProps } from './types'
import { useTradeSearchLink } from '@/hooks/use-trade-search-link'
import {
  COPY_LINK_BUTTON_LABELS,
  GENERATE_LINK_BUTTON_LABELS,
} from '@/hooks/use-trade-search-link/const'

const GeneratedSearchContent: React.FC<GeneratedSearchProps> = ({
  filterDraft,
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
    <section
      className="generated-search"
      aria-labelledby="generated-search-title"
    >
      <div>
        <p className="section-kicker">Path of Exile query</p>
        <h3 id="generated-search-title">Linked search</h3>
      </div>

      <p className="generated-search__description">
        Generate an Instant Buyout search requiring each skill and its required linked supports. Optional supports stay in the local matcher.
      </p>

      <button
        type="button"
        className="button generate-link-button"
        disabled={status === 'generating'}
        onClick={() => generateLink()}
      >
        {GENERATE_LINK_BUTTON_LABELS[status]}
      </button>

      {generatedLink && (
        <div className="generated-search__result">
          <p className="generated-search__url" title={generatedLink}>
            {generatedLink}
          </p>

          <div className="generated-search__actions">
            <a
              className="button generated-search__open"
              href={generatedLink}
              target="_blank"
              rel="noreferrer"
            >
              Open search
            </a>
            <button
              type="button"
              className="button"
              onClick={() => copyLink()}
            >
              {COPY_LINK_BUTTON_LABELS[status]}
            </button>
          </div>
        </div>
      )}

      {warningMessage && (
        <p className="generated-search__warning" role="status">
          {warningMessage}
        </p>
      )}

      {errorMessage && (
        <p className="generated-search__error" role="alert">
          {errorMessage}
        </p>
      )}
    </section>
  )
}

const GeneratedSearch: React.FC<GeneratedSearchProps> = props => (
  <GeneratedSearchContent
    key={JSON.stringify(props.filterDraft)}
    {...props}
  />
)

export default GeneratedSearch
