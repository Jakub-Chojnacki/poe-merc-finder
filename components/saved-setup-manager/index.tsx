import type { SavedSetupManagerProps } from './types'
import type { ImportedSavedSetup } from '@/utils/saved-setup-code/types'
import { useId, useMemo, useState } from 'react'
import CheckIcon from '@/components/icons/check'
import TrashIcon from '@/components/icons/trash'
import {
  CollapsibleContent,
  CollapsibleRoot,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import IconButton from '@/components/ui/icon-button'
import UiSelect from '@/components/ui/select'
import { useSavedSetups } from '@/hooks/use-saved-setups'
import { SETUP_NAME_MAX_LENGTH } from './const'
import SetupCodeDialog from './setup-code-dialog'

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

  const handleImport = async (
    importedSetup: ImportedSavedSetup,
  ): Promise<void> => {
    setIsMutating(true)

    try {
      const savedSetup = await saveSetup(
        importedSetup.name,
        importedSetup.filterDraft,
      )

      setSetupName(savedSetup.name)
      setSelectedSetupId(savedSetup.id)
    }
    finally {
      setIsMutating(false)
    }
  }

  const isBusy = isLoading || isMutating

  return (
    <CollapsibleRoot
      className="saved-setups"
      open={isExpanded}
      onOpenChange={setIsExpanded}
    >
      <CollapsibleTrigger asChild>
        <button type="button" className="saved-setups__header">
          <h2 id="saved-setups-title">Saved setups</h2>
        </button>
      </CollapsibleTrigger>

      <CollapsibleContent className="saved-setups__content">
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
            <UiSelect
              id={setupFieldId}
              className="saved-setups__select"
              value={selectedSetupId}
              disabled={isBusy || savedSetups.length === 0}
              options={savedSetups.map(setup => ({
                label: setup.name,
                value: setup.id,
              }))}
              placeholder={isLoading ? 'Loading…' : 'Choose a setup'}
              onChange={(setupId) => {
                const setup = savedSetups.find(
                  candidate => candidate.id === setupId,
                )

                setSelectedSetupId(setupId)

                if (setup) {
                  setSetupName(setup.name)
                }
              }}
            />

            <div
              className="saved-setups__actions"
              role="group"
              aria-label="Saved setup actions"
            >
              <IconButton
                label="Load selected setup"
                disabled={isBusy || !selectedSetup}
                onClick={handleLoad}
              >
                <CheckIcon />
              </IconButton>

              <SetupCodeDialog
                mode="import"
                disabled={isBusy}
                onImport={handleImport}
              />
              <SetupCodeDialog
                mode="export"
                disabled={isBusy}
                setup={selectedSetup}
              />

              <IconButton
                label="Delete selected setup"
                variant="danger"
                disabled={isBusy || !selectedSetup}
                onClick={() => handleDelete()}
              >
                <TrashIcon />
              </IconButton>
            </div>
          </div>
        </div>

        {errorMessage && (
          <p className="ui-form-error" role="alert">{errorMessage}</p>
        )}
      </CollapsibleContent>
    </CollapsibleRoot>
  )
}

export default SavedSetupManager
