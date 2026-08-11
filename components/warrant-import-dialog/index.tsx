import type { PublicPath } from 'wxt/browser'
import type { WarrantImportDialogProps } from './types'
import { useId, useState } from 'react'
import CloseIcon from '@/components/icons/close'
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { parseMercenaryWarrant } from '@/utils/warrant-import'

const WARRANT_ICON_PATH = '/icons/mercenary-warrant.png' as PublicPath

const WarrantImportDialog: React.FC<WarrantImportDialogProps> = ({
  onImport,
}) => {
  const warrantFieldId = useId()
  const [isOpen, setIsOpen] = useState(false)
  const [warrantText, setWarrantText] = useState('')
  const [errorMessage, setErrorMessage] = useState<string>()

  const updateOpen = (open: boolean): void => {
    setIsOpen(open)

    if (!open) {
      setWarrantText('')
      setErrorMessage(undefined)
    }
  }

  const handleImport = (): void => {
    setErrorMessage(undefined)

    try {
      onImport(parseMercenaryWarrant(warrantText))
      updateOpen(false)
    }
    catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : 'The warrant could not be imported.',
      )
    }
  }

  return (
    <DialogRoot open={isOpen} onOpenChange={updateOpen}>
      <DialogTrigger asChild>
        <button type="button" className="warrant-import-button">
          <img
            className="warrant-import-button__icon"
            src={browser.runtime.getURL(WARRANT_ICON_PATH)}
            alt=""
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

      <DialogContent className="setup-code-dialog warrant-import-dialog">
        <header className="setup-code-dialog__header">
          <div>
            <DialogTitle className="setup-code-dialog__title">
              Import Mercenary Warrant
            </DialogTitle>
            <DialogDescription className="setup-code-dialog__description">
              Copy the warrant in-game and paste it below. Its build, skills,
              and linked supports will replace the current requirements.
            </DialogDescription>
          </div>

          <DialogClose asChild>
            <button
              type="button"
              className="setup-code-dialog__close"
              aria-label="Close warrant import dialog"
            >
              <CloseIcon className="setup-code-dialog__close-icon" />
            </button>
          </DialogClose>
        </header>

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

        {errorMessage && (
          <p className="setup-code-dialog__error" role="alert">
            {errorMessage}
          </p>
        )}

        <div className="setup-code-dialog__actions">
          <DialogClose asChild>
            <button type="button" className="button">Cancel</button>
          </DialogClose>
          <button
            type="button"
            className="button setup-code-dialog__primary"
            disabled={!warrantText.trim()}
            onClick={handleImport}
          >
            Import warrant
          </button>
        </div>
      </DialogContent>
    </DialogRoot>
  )
}

export default WarrantImportDialog
