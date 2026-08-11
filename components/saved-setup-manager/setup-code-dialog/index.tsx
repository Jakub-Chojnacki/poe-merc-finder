import type { SetupCodeDialogProps } from './types'
import { useId, useMemo, useState } from 'react'
import CloseIcon from '@/components/icons/close'
import ExportIcon from '@/components/icons/export'
import ImportIcon from '@/components/icons/import'
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import IconButton from '@/components/ui/icon-button'
import {
  exportSavedSetupCode,
  importSavedSetupCode,
} from '@/utils/saved-setup-code'
import {
  SETUP_CODE_DIALOG_COPY_LABELS,
  SETUP_CODE_DIALOG_ERRORS,
} from './const'

type CopyStatus = keyof typeof SETUP_CODE_DIALOG_COPY_LABELS

const SetupCodeDialog: React.FC<SetupCodeDialogProps> = (props) => {
  const codeFieldId = useId()
  const [isOpen, setIsOpen] = useState(false)
  const [importCode, setImportCode] = useState('')
  const [copyStatus, setCopyStatus] = useState<CopyStatus>('idle')
  const [isImporting, setIsImporting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string>()
  const exportCode = useMemo(() => (
    props.mode === 'export' && props.setup
      ? exportSavedSetupCode(props.setup)
      : ''
  ), [props])
  const isExport = props.mode === 'export'

  const updateOpen = (open: boolean): void => {
    setIsOpen(open)

    if (!open) {
      setCopyStatus('idle')
      setErrorMessage(undefined)
      setImportCode('')
    }
  }

  const handleCopy = async (): Promise<void> => {
    setCopyStatus('copying')
    setErrorMessage(undefined)

    try {
      await navigator.clipboard.writeText(exportCode)
      setCopyStatus('copied')
    }
    catch {
      setCopyStatus('idle')
      setErrorMessage(SETUP_CODE_DIALOG_ERRORS.copy)
    }
  }

  const handleImport = async (): Promise<void> => {
    if (props.mode !== 'import') {
      return
    }

    setErrorMessage(undefined)

    let importedSetup

    try {
      importedSetup = importSavedSetupCode(importCode)
    }
    catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : SETUP_CODE_DIALOG_ERRORS.import,
      )
      return
    }

    setIsImporting(true)

    try {
      await props.onImport(importedSetup)
      updateOpen(false)
    }
    catch {
      setErrorMessage(SETUP_CODE_DIALOG_ERRORS.import)
    }
    finally {
      setIsImporting(false)
    }
  }

  return (
    <DialogRoot open={isOpen} onOpenChange={updateOpen}>
      <DialogTrigger asChild>
        <IconButton
          label={isExport ? 'Export selected setup' : 'Import setup'}
          disabled={props.disabled || (isExport && !props.setup)}
        >
          {isExport ? <ExportIcon /> : <ImportIcon />}
        </IconButton>
      </DialogTrigger>

      <DialogContent className="form-dialog setup-code-dialog">
        <header className="ui-split-header">
          <div>
            <DialogTitle className="form-dialog__title">
              {isExport ? 'Export setup' : 'Import setup'}
            </DialogTitle>
            <DialogDescription className="form-dialog__description form-dialog__description--header">
              {isExport
                ? 'Copy this code to share the selected setup.'
                : 'Paste a setup code. An existing setup with the same name will be updated.'}
            </DialogDescription>
          </div>

          <DialogClose asChild>
            <button
              type="button"
              className="form-dialog__close"
              aria-label="Close setup code dialog"
            >
              <CloseIcon className="ui-icon-sm" />
            </button>
          </DialogClose>
        </header>

        <label className="field" htmlFor={codeFieldId}>
          <span>Setup code</span>
          <textarea
            id={codeFieldId}
            value={isExport ? exportCode : importCode}
            readOnly={isExport}
            rows={7}
            spellCheck={false}
            placeholder={isExport ? undefined : 'PMF1:…'}
            onFocus={event => isExport && event.currentTarget.select()}
            onChange={event => setImportCode(event.target.value)}
          />
        </label>

        {errorMessage && (
          <p className="ui-form-error" role="alert">
            {errorMessage}
          </p>
        )}

        <div className="form-dialog__actions">
          <DialogClose asChild>
            <button type="button" className="button">Cancel</button>
          </DialogClose>

          {isExport
            ? (
                <button
                  type="button"
                  className="button form-dialog__primary"
                  disabled={copyStatus === 'copying'}
                  onClick={() => handleCopy()}
                >
                  {SETUP_CODE_DIALOG_COPY_LABELS[copyStatus]}
                </button>
              )
            : (
                <button
                  type="button"
                  className="button form-dialog__primary"
                  disabled={isImporting || !importCode.trim()}
                  onClick={() => handleImport()}
                >
                  {isImporting ? 'Importing…' : 'Import setup'}
                </button>
              )}
        </div>
      </DialogContent>
    </DialogRoot>
  )
}

export default SetupCodeDialog
