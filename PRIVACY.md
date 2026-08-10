# Privacy Policy for PoE Merc Finder

Effective date: August 10, 2026

PoE Merc Finder is a browser extension that filters mercenary listings on the
Path of Exile Trade website. This policy explains what information the
extension handles and how it is used.

## Information handled by the extension

PoE Merc Finder handles the following information locally in the user's
browser:

- The visible content of Path of Exile mercenary trade listings, including
  skill and linked-support names. This content is read only to evaluate and
  highlight listings according to the user's filters.
- Filter configurations entered by the user, including setup names, selected
  mercenary classes, skills, and support gems.
- A bounded history of recent generated Path of Exile search IDs and their
  filter configurations, used to restore local highlighting when those links
  are opened.
- Interface preferences, such as whether the extension panel is collapsed.

## Storage and use

Named filter setups, recent generated-search configurations, and interface
preferences are stored with Chrome's local extension storage. The information
is used only to provide the extension's filtering, highlighting, search-link,
saved-setup, and interface features.

Users can delete individual named setups from the extension. Removing the
extension also removes data stored by the extension from Chrome.

## Data sharing and transmission

When the user selects **Generate search link**, the extension sends the
configured skill and required-support trade stat IDs directly to the Path of
Exile Trade search API operated by Grinding Gear Games. This request is needed
to create the official search URL. Optional supports, saved setup names, and
interface preferences are not included in that request.

PoE Merc Finder does not transmit user data or website content to the
developer or to any service other than the user-requested Path of Exile Trade
search. It does not include analytics, advertising, tracking, or telemetry. It
does not sell user data.

The extension's use of information is limited to providing its user-facing
features and complies with the Chrome Web Store User Data Policy, including the
Limited Use requirements.

## Permissions

PoE Merc Finder uses:

- Access to Path of Exile Trade search pages to add its panel and evaluate the
  mercenary listings visible on those pages.
- The `storage` permission to save named filter setups and interface
  preferences, as well as recent generated-search configurations, locally.

## Third-party services

The extension operates on the Path of Exile Trade website, which is provided by
Grinding Gear Games and is governed by its own terms and privacy practices.
PoE Merc Finder is not affiliated with, endorsed by, or associated with
Grinding Gear Games.

## Changes to this policy

This policy may be updated if the extension's behavior changes. The effective
date above will be revised when an update is published.

## Contact

Questions or concerns can be submitted through the project's
[GitHub issue tracker](https://github.com/Jakub-Chojnacki/poe-merc-finder/issues).
