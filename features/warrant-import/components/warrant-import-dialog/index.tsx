import type { WarrantImportDialogProps } from './types'
import { useId, useState } from 'react'
import { parseMercenaryWarrant } from '@/features/warrant-import/model/warrant-parser'
import formatCount from '@/shared/format-count'
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
} from '@/shared/ui/dialog'
import CloseIcon from '@/shared/ui/icons/close'
import { WARRANT_ICON_PATH } from './const'

const WarrantImportDialog: React.FC<WarrantImportDialogProps> = ({
  confirmReplacement,
  onImport,
}) => {
  const warrantFieldId = useId()
  const [isOpen, setIsOpen] = useState(false)
  const [warrantText, setWarrantText] = useState('')
  const [errorMessage, setErrorMessage] = useState<string>()
  const [pendingFilter, setPendingFilter]
    = useState<ReturnType<typeof parseMercenaryWarrant>>()

  const updateOpen = (open: boolean): void => {
    setIsOpen(open)

    if (!open) {
      setWarrantText('')
      setErrorMessage(undefined)
      setPendingFilter(undefined)
    }
  }

  const completeImport = (
    filter: ReturnType<typeof parseMercenaryWarrant>,
  ): void => {
    onImport(filter)
    updateOpen(false)
  }

  const handleImport = (): void => {
    setErrorMessage(undefined)

    try {
      const filter = parseMercenaryWarrant(warrantText)

      if (confirmReplacement) {
        setPendingFilter(filter)
        return
      }

      completeImport(filter)
    }
    catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : 'The warrant could not be imported.',
      )
    }
  }

  const skillCount = pendingFilter?.requirements.length ?? 0
  const supportCount = pendingFilter?.requirements.reduce(
    (count, requirement) => count + requirement.requiredSupports.length,
    0,
  ) ?? 0

  return (
    <DialogRoot open={isOpen} onOpenChange={updateOpen}>
      <DialogTrigger asChild>
        <button type="button" className="warrant-import-button">
          <img
            className="warrant-import-button__icon"
            src={browser.runtime.getURL(WARRANT_ICON_PATH)}
            alt="poe-warrant"
          />
          <span className="warrant-import-button__label">
            <strong>Import a Mercenary Warrant</strong>
            <small>Paste an item copied in-game to fill this filter.</small>
          </span>
          <span className="warrant-import-button__arrow" aria-hidden="true">
            →
          </span>
        </button>
      </DialogTrigger>

      <DialogContent className="form-dialog warrant-import-dialog">
        <header className="ui-split-header">
          <div>
            <DialogTitle className="form-dialog__title">
              {pendingFilter
                ? 'Replace current filter?'
                : 'Import Mercenary Warrant'}
            </DialogTitle>
            <DialogDescription className="form-dialog__description form-dialog__description--header">
              {pendingFilter
                ? (
                    <>
                      Importing
                      {' '}
                      <strong>{pendingFilter.mercenaryClass}</strong>
                      {' '}
                      with
                      {' '}
                      {formatCount(skillCount, 'skill')}
                      {' '}
                      and
                      {' '}
                      {formatCount(supportCount, 'linked support')}
                      {' '}
                      will replace every configured skill and
                      support. This cannot be undone.
                    </>
                  )
                : (
                    <>
                      Copy the warrant in-game and paste it below. Its build,
                      skills, and linked supports will fill the filter.
                    </>
                  )}
            </DialogDescription>
          </div>

          <DialogClose asChild>
            <button
              type="button"
              className="form-dialog__close"
              aria-label="Close warrant import dialog"
            >
              <CloseIcon className="ui-icon-sm" />
            </button>
          </DialogClose>
        </header>

        {!pendingFilter && (
          <label className="field" htmlFor={warrantFieldId}>
            <span>Warrant text</span>
            <textarea
              id={warrantFieldId}
              value={warrantText}
              rows={12}
              spellCheck={false}
              placeholder="Item Class: Map Fragments…"
              onChange={event => setWarrantText(event.target.value)}
            />
          </label>
        )}

        {!pendingFilter && errorMessage && (
          <p className="ui-form-error" role="alert">
            {errorMessage}
          </p>
        )}

        <div className="form-dialog__actions">
          {pendingFilter
            ? (
                <>
                  <button
                    type="button"
                    className="button"
                    onClick={() => setPendingFilter(undefined)}
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    className="button form-dialog__primary"
                    onClick={() => completeImport(pendingFilter)}
                  >
                    Replace filter
                  </button>
                </>
              )
            : (
                <>
                  <DialogClose asChild>
                    <button type="button" className="button">Cancel</button>
                  </DialogClose>
                  <button
                    type="button"
                    className="button form-dialog__primary"
                    disabled={!warrantText.trim()}
                    onClick={handleImport}
                  >
                    {confirmReplacement ? 'Continue' : 'Import warrant'}
                  </button>
                </>
              )}
        </div>
      </DialogContent>
    </DialogRoot>
  )
}

export default WarrantImportDialog
