import type { UseSavedSetupsResult } from './types'
import type { FilterDraft } from '@/features/mercenary-filter/model/filter-draft/types'
import type { SavedSetup } from '@/features/saved-setups/model/saved-setup'
import { useCallback, useEffect, useState } from 'react'
import { SAVED_SETUPS_STORAGE_ITEM } from '@/features/saved-setups/storage/saved-setups'

function sortSetups(setups: SavedSetup[]): SavedSetup[] {
  return setups.toSorted((left, right) => left.name.localeCompare(right.name))
}

function hasName(setup: SavedSetup, name: string): boolean {
  return setup.name.localeCompare(name, undefined, { sensitivity: 'accent' }) === 0
}

export function useSavedSetups(): UseSavedSetupsResult {
  const [savedSetups, setSavedSetups] = useState<SavedSetup[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState<string>()

  useEffect(() => {
    let isActive = true

    SAVED_SETUPS_STORAGE_ITEM.getValue()
      .then((setups) => {
        if (isActive) {
          setSavedSetups(sortSetups(setups))
        }
      })
      .catch(() => {
        if (isActive) {
          setErrorMessage('Saved setups could not be loaded.')
        }
      })
      .finally(() => {
        if (isActive) {
          setIsLoading(false)
        }
      })

    const unwatch = SAVED_SETUPS_STORAGE_ITEM.watch((setups) => {
      if (isActive) {
        setSavedSetups(sortSetups(setups))
      }
    })

    return () => {
      isActive = false
      unwatch()
    }
  }, [])

  const saveSetup = useCallback(async (
    name: string,
    filterDraft: FilterDraft,
  ): Promise<SavedSetup> => {
    setErrorMessage(undefined)

    try {
      const currentSetups = await SAVED_SETUPS_STORAGE_ITEM.getValue()
      const existingSetup = currentSetups.find(setup => hasName(setup, name))
      const savedSetup: SavedSetup = {
        id: existingSetup?.id ?? crypto.randomUUID(),
        name,
        filterDraft: structuredClone(filterDraft),
      }

      const nextSetups = sortSetups([
        ...currentSetups.filter(setup => setup.id !== savedSetup.id),
        savedSetup,
      ])

      await SAVED_SETUPS_STORAGE_ITEM.setValue(nextSetups)
      setSavedSetups(nextSetups)

      return savedSetup
    }
    catch (error) {
      setErrorMessage('The setup could not be saved.')
      throw error
    }
  }, [])

  const deleteSetup = useCallback(async (setupId: string): Promise<void> => {
    setErrorMessage(undefined)

    try {
      const currentSetups = await SAVED_SETUPS_STORAGE_ITEM.getValue()
      const nextSetups = currentSetups.filter(setup => setup.id !== setupId)

      await SAVED_SETUPS_STORAGE_ITEM.setValue(nextSetups)
      setSavedSetups(nextSetups)
    }
    catch (error) {
      setErrorMessage('The setup could not be deleted.')
      throw error
    }
  }, [])

  return {
    deleteSetup,
    errorMessage,
    isLoading,
    savedSetups,
    saveSetup,
  }
}
