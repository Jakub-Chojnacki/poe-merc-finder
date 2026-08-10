import type { SavedSetupManagerProps } from './types'
import { useId, useMemo, useState } from 'react'
import { useSavedSetups } from '@/hooks/use-saved-setups'
import { SETUP_NAME_MAX_LENGTH } from './const'

const SavedSetupManager: React.FC<SavedSetupManagerProps> = ({
  onLoad,
  value,
}) => {
  const nameFieldId = useId()
  const setupFieldId = useId()
  const [setupName, setSetupName] = useState('')
  const [selectedSetupId, setSelectedSetupId] = useState('')
  const [isExpanded, setIsExpanded] = useState(true)
  const [isMutating, setIsMutating] = useState(false)
  const {
    deleteSetup,
    errorMessage,
    isLoading,
    savedSetups,
    saveSetup,
  } = useSavedSetups()

  const selectedSetup = useMemo(
    () => savedSetups.find(setup => setup.id === selectedSetupId),
    [savedSetups, selectedSetupId],
  )

  const handleSave = async (): Promise<void> => {
    const name = setupName.trim()

    if (!name) {
      return
    }

    setIsMutating(true)

    try {
      const savedSetup = await saveSetup(name, value)

      setSetupName(savedSetup.name)
      setSelectedSetupId(savedSetup.id)
    }
    catch {
      // The hook exposes the storage error in the manager UI.
    }
    finally {
      setIsMutating(false)
    }
  }

  const handleLoad = (): void => {
    if (selectedSetup) {
      onLoad(structuredClone(selectedSetup.filterDraft))
    }
  }

  const handleDelete = async (): Promise<void> => {
    if (!selectedSetup) {
      return
    }

    setIsMutating(true)

    try {
      await deleteSetup(selectedSetup.id)
      setSelectedSetupId('')
    }
    catch {
      // The hook exposes the storage error in the manager UI.
    }
    finally {
      setIsMutating(false)
    }
  }

  const isBusy = isLoading || isMutating

  return (
    <details
      className="saved-setups"
      open={isExpanded}
      onToggle={event => setIsExpanded(event.currentTarget.open)}
    >
      <summary className="saved-setups__header">
        <div>
          <p className="section-kicker">Reusable configurations</p>
          <h2 id="saved-setups-title">Saved setups</h2>
        </div>
      </summary>

      <div className="saved-setups__content">
        <div className="field">
          <label htmlFor={nameFieldId}>Setup name</label>
          <div className="saved-setups__save-row">
            <input
              id={nameFieldId}
              type="text"
              value={setupName}
              maxLength={SETUP_NAME_MAX_LENGTH}
              onChange={event => setSetupName(event.target.value)}
              placeholder="Kineticist Endgame"
            />
            <button
              type="button"
              className="button"
              disabled={isBusy || !setupName.trim()}
              onClick={() => handleSave()}
            >
              Save current
            </button>
          </div>
          <small>Saving with an existing name updates that setup.</small>
        </div>

        <div className="field">
          <label htmlFor={setupFieldId}>Saved setup</label>
          <div className="saved-setups__load-row">
            <div className="saved-setups__select">
              <select
                id={setupFieldId}
                value={selectedSetupId}
                disabled={isBusy || savedSetups.length === 0}
                onChange={(event) => {
                  const setupId = event.target.value
                  const setup = savedSetups.find(candidate => candidate.id === setupId)

                  setSelectedSetupId(setupId)

                  if (setup) {
                    setSetupName(setup.name)
                  }
                }}
              >
                <option value="">
                  {isLoading ? 'Loading…' : 'Choose a setup'}
                </option>
                {savedSetups.map(setup => (
                  <option key={setup.id} value={setup.id}>{setup.name}</option>
                ))}
              </select>
            </div>

            <button
              type="button"
              className="button"
              disabled={isBusy || !selectedSetup}
              onClick={handleLoad}
            >
              Load
            </button>
            <button
              type="button"
              className="button saved-setups__delete-button"
              disabled={isBusy || !selectedSetup}
              onClick={() => handleDelete()}
            >
              Delete
            </button>
          </div>
        </div>

        {errorMessage && (
          <p className="saved-setups__error" role="alert">{errorMessage}</p>
        )}
      </div>
    </details>
  )
}

export default SavedSetupManager
