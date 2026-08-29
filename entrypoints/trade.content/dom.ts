import type {
  ListingEvaluation,
  MercenarySkill,
  MercenarySupport,
  RequirementEvaluation,
  SupportNameEvaluation,
} from './types'
import type { FilterConfig, SkillRequirement } from '@/features/mercenary-filter/model/filter-config/types'
import { normalizeMercenarySkillName } from '@/shared/mercenary-data'
import {
  BADGE_LABELS,
  BADGE_VARIANT_CLASSES,
  DECORATION_CLASSES,
  LINE_DECORATION_CLASSES,
  LISTING_DECORATION_CLASSES,
  LISTING_SELECTOR,
  LISTING_STATUS_CLASSES,
  MERCENARY_MOD_SELECTOR,
} from './const'

function normalizeGemName(value: string): string {
  return value.trim().toLocaleLowerCase()
}

function getDirectDivChildren(element: Element): Element[] {
  return [...element.children].filter(child => child.tagName === 'DIV')
}

function getLineName(element: Element): string {
  return element.querySelector('span')?.textContent?.trim() ?? ''
}

function parseMercenaryBlock(block: Element): MercenarySkill | undefined {
  const [skillElement, ...supportElements] = getDirectDivChildren(block)

  if (!skillElement) {
    return
  }

  const skillName = getLineName(skillElement)

  if (!skillName) {
    return
  }

  const supports = supportElements.reduce<MercenarySupport[]>((result, element) => {
    const name = getLineName(element)

    if (name) {
      result.push({ name, element })
    }

    return result
  }, [])

  return {
    name: skillName,
    element: skillElement,
    supports,
  }
}

function parseMercenarySkills(listing: Element): MercenarySkill[] {
  return [...listing.querySelectorAll(MERCENARY_MOD_SELECTOR)]
    .map(parseMercenaryBlock)
    .filter(skill => skill !== undefined)
}

function evaluateSupportNames(
  supportsByName: ReadonlyMap<string, MercenarySupport>,
  requestedNames: string[],
): SupportNameEvaluation {
  return requestedNames.reduce<SupportNameEvaluation>(
    (result, requestedName) => {
      const support = supportsByName.get(normalizeGemName(requestedName))

      if (support) {
        result.matched.push(support)
      }
      else {
        result.missing.push(requestedName)
      }

      return result
    },
    { matched: [], missing: [] },
  )
}

function evaluateRequirement(
  mercenarySkills: MercenarySkill[],
  requirement: SkillRequirement,
): RequirementEvaluation {
  const skill = mercenarySkills.find(
    candidate => (
      normalizeMercenarySkillName(candidate.name)
      === normalizeMercenarySkillName(requirement.skill)
    ),
  )

  if (!skill) {
    return {
      requirement,
      matchedSkill: undefined,
      matchedRequiredSupports: [],
      missingRequiredSupports: requirement.requiredSupports,
      matchedOptionalSupports: [],
      missingOptionalSupports: requirement.optionalSupports,
    }
  }

  const supportsByName = new Map(
    skill.supports.map(support => [normalizeGemName(support.name), support]),
  )
  const required = evaluateSupportNames(
    supportsByName,
    requirement.requiredSupports,
  )
  const optional = evaluateSupportNames(
    supportsByName,
    requirement.optionalSupports,
  )

  return {
    requirement,
    matchedSkill: skill,
    matchedRequiredSupports: required.matched,
    missingRequiredSupports: required.missing,
    matchedOptionalSupports: optional.matched,
    missingOptionalSupports: optional.missing,
  }
}

function evaluateListing(
  mercenarySkills: MercenarySkill[],
  requirements: SkillRequirement[],
): ListingEvaluation {
  const requirementsEvaluated = requirements.map(
    requirement => evaluateRequirement(mercenarySkills, requirement),
  )
  const matchedSkills = requirementsEvaluated.filter(
    evaluation => evaluation.matchedSkill !== undefined,
  ).length

  const matchedRequiredSupports = requirementsEvaluated.reduce(
    (total, evaluation) => total + evaluation.matchedRequiredSupports.length,
    0,
  )

  const totalRequiredSupports = requirements.reduce(
    (total, requirement) => total + requirement.requiredSupports.length,
    0,
  )
  const matchedOptionalSupports = requirementsEvaluated.reduce(
    (total, evaluation) => total + evaluation.matchedOptionalSupports.length,
    0,
  )

  const totalOptionalSupports = requirements.reduce(
    (total, requirement) => total + requirement.optionalSupports.length,
    0,
  )

  const passedRequired = requirementsEvaluated.every(evaluation => (
    evaluation.matchedSkill !== undefined
    && evaluation.missingRequiredSupports.length === 0
  ))

  const matchedEveryOptional = requirementsEvaluated.every(
    evaluation => evaluation.missingOptionalSupports.length === 0,
  )

  return {
    status: passedRequired
      ? matchedEveryOptional ? 'perfect' : 'match'
      : 'fail',
    requirements: requirementsEvaluated,
    counts: {
      matchedSkills,
      totalSkills: requirements.length,
      matchedRequiredSupports,
      totalRequiredSupports,
      matchedOptionalSupports,
      totalOptionalSupports,
    },
  }
}

function clearListingDecorations(listing: Element): void {
  listing.classList.remove(...LISTING_DECORATION_CLASSES)
  listing.querySelector(`.${DECORATION_CLASSES.badge}`)?.remove()

  LINE_DECORATION_CLASSES.forEach((className) => {
    listing.querySelectorAll(`.${className}`).forEach((element) => {
      element.classList.remove(className)
    })
  })
}

function highlightEvaluation(evaluation: ListingEvaluation): void {
  evaluation.requirements.forEach((requirement) => {
    requirement.matchedSkill?.element.classList.add(DECORATION_CLASSES.skill)

    requirement.matchedRequiredSupports.forEach((support) => {
      support.element.classList.add(DECORATION_CLASSES.requiredSupport)
    })

    requirement.matchedOptionalSupports.forEach((support) => {
      if (!support.element.classList.contains(DECORATION_CLASSES.requiredSupport)) {
        support.element.classList.add(DECORATION_CLASSES.optionalSupport)
      }
    })
  })
}

function formatCounts(evaluation: ListingEvaluation): string {
  const { counts } = evaluation

  const parts = [
    `Skills ${counts.matchedSkills}/${counts.totalSkills}`,
    `Required ${counts.matchedRequiredSupports}/${counts.totalRequiredSupports}`,
  ]

  if (counts.totalOptionalSupports > 0) {
    parts.push(
      `Optional ${counts.matchedOptionalSupports}/${counts.totalOptionalSupports}`,
    )
  }

  return parts.join(' • ')
}

function createBadgeTitle(evaluation: ListingEvaluation): string {
  if (evaluation.status === 'perfect') {
    return 'All requested skills, required supports, and optional supports are present.'
  }

  if (evaluation.status === 'match') {
    const missingOptional = evaluation.requirements
      .filter(requirement => requirement.missingOptionalSupports.length > 0)
      .map(requirement => (
        `${requirement.requirement.skill}: ${requirement.missingOptionalSupports.join(', ')}`
      ))

    return `Missing optional supports:\n${missingOptional.join('\n')}`
  }

  const failures = evaluation.requirements.flatMap((requirement) => {
    if (!requirement.matchedSkill) {
      return [`Missing skill: ${requirement.requirement.skill}`]
    }

    if (requirement.missingRequiredSupports.length > 0) {
      return [
        `${requirement.requirement.skill} missing: ${requirement.missingRequiredSupports.join(', ')}`,
      ]
    }

    return []
  })

  return failures.join('\n')
}

function addBadge(listing: Element, evaluation: ListingEvaluation): void {
  const badge = document.createElement('div')

  badge.classList.add(
    DECORATION_CLASSES.badge,
    BADGE_VARIANT_CLASSES[evaluation.status],
  )
  badge.textContent = `${BADGE_LABELS[evaluation.status]} • ${formatCounts(evaluation)}`
  badge.title = createBadgeTitle(evaluation)

  const target = listing.querySelector('.right .details')
    ?? listing.querySelector('.right')
    ?? listing

  target.prepend(badge)
}

function decorateListing(
  listing: Element,
  evaluation: ListingEvaluation,
  hideFailures: boolean,
): void {
  listing.classList.add(LISTING_STATUS_CLASSES[evaluation.status])

  if (hideFailures && evaluation.status === 'fail') {
    listing.classList.add(DECORATION_CLASSES.hidden)
  }

  highlightEvaluation(evaluation)
  addBadge(listing, evaluation)
}

export function clearTradeFilter(root: ParentNode = document): void {
  root.querySelectorAll(LISTING_SELECTOR).forEach(clearListingDecorations)
}

export function applyTradeFilter(
  filter: FilterConfig,
  root: ParentNode = document,
): void {
  clearTradeFilter(root)

  if (filter.requirements.length === 0) {
    return
  }

  root.querySelectorAll(LISTING_SELECTOR).forEach((listing) => {
    const evaluation = evaluateListing(
      parseMercenarySkills(listing),
      filter.requirements,
    )

    decorateListing(listing, evaluation, filter.hideFailures)
  })
}

export function nodeContainsTradeListing(node: Node): boolean {
  return node instanceof Element
    && (node.matches(LISTING_SELECTOR) || node.querySelector(LISTING_SELECTOR) !== null)
}
