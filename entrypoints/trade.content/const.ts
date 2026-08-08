import type { ListingStatus } from './types'

export const HIGHLIGHT_DELAY_MS = 200

export const LISTING_SELECTOR = '.row[data-id]'
export const MERCENARY_MOD_SELECTOR = '.item-mod.item-mod--mercenary'

export const DECORATION_CLASSES = {
  badge: 'poe-merc-finder-badge',
  badgeFail: 'poe-merc-finder-badge--fail',
  badgeMatch: 'poe-merc-finder-badge--match',
  badgePerfect: 'poe-merc-finder-badge--perfect',
  hidden: 'poe-merc-finder-listing--hidden',
  listingFail: 'poe-merc-finder-listing--fail',
  listingMatch: 'poe-merc-finder-listing--match',
  listingPerfect: 'poe-merc-finder-listing--perfect',
  optionalSupport: 'poe-merc-finder-highlight--optional',
  requiredSupport: 'poe-merc-finder-highlight--required',
  skill: 'poe-merc-finder-highlight--skill',
} as const

export const LISTING_DECORATION_CLASSES = [
  DECORATION_CLASSES.hidden,
  DECORATION_CLASSES.listingFail,
  DECORATION_CLASSES.listingMatch,
  DECORATION_CLASSES.listingPerfect,
]

export const LINE_DECORATION_CLASSES = [
  DECORATION_CLASSES.optionalSupport,
  DECORATION_CLASSES.requiredSupport,
  DECORATION_CLASSES.skill,
]

export const BADGE_LABELS = {
  fail: '✕ FAIL',
  match: '✓ MATCH',
  perfect: '★ PERFECT',
} as const satisfies Record<ListingStatus, string>

export const BADGE_VARIANT_CLASSES = {
  fail: DECORATION_CLASSES.badgeFail,
  match: DECORATION_CLASSES.badgeMatch,
  perfect: DECORATION_CLASSES.badgePerfect,
} as const satisfies Record<ListingStatus, string>

export const LISTING_STATUS_CLASSES = {
  fail: DECORATION_CLASSES.listingFail,
  match: DECORATION_CLASSES.listingMatch,
  perfect: DECORATION_CLASSES.listingPerfect,
} as const satisfies Record<ListingStatus, string>
