# PoE Merc Finder

PoE Merc Finder is a Chrome extension that adds linked-support filtering to
mercenary searches on the [Path of Exile Trade](https://www.pathofexile.com/trade)
website.

The trade site can find mercenaries that have a particular skill or support
gem, but it cannot require those supports to be linked to a specific skill. This extensions allows you to high-light matching patterns.

![PoE Merc Finder filtering mercenary listings](docs/example.png)

## Features

- Filter mercenaries by skill and the support gems linked to that skill.
- Paste a copied in-game Mercenary Warrant to fill its build, skills, and
  linked supports into the filter automatically.
- Separate required supports from optional, nice-to-have supports.
- Generate an official trade search where every required support is linked to
  its configured skill.
- Highlight matching skills and supports directly in each trade listing.
- Mark listings as perfect matches, partial matches, or failures and show match
  counts.
- Optionally hide listings that are missing required skills or supports.
- Choose mercenary classes and skills from the scraped dataset, with compact
  searchable multi-selects for support gems.
- Limit skill choices to the selected mercenary class, with a confirmation
  before changing class when configured skills or supports would be reset.
- Show each mercenary's house crest alongside its class in the selector.
- Save configurations locally under custom names, then load, update, or delete
  them later.
- Export saved setups as portable codes and import codes shared by other users.
- Open or close the extension panel from the browser toolbar.
- Automatically move alongside the Better Trading panel when both extensions
  are active.

## Usage

1. Open a mercenary search on the Path of Exile Trade website.
2. Open the PoE Merc Finder panel from the browser toolbar.
3. Optionally choose a mercenary class to narrow the skill suggestions, or
   select **Import a Mercenary Warrant** to import a warrant copied in-game.
4. Add one or more skills and enter their required or optional linked supports.
5. Select **Apply filters** to evaluate the visible trade listings, or select
   **Generate search link** to create a new Instant Buyout search for the
   configured skills and required supports.
6. Open or copy the generated link. When opened in the same browser profile,
   the extension restores the optional supports and local highlighting rules.
7. Optionally give the configuration a name and select **Save current** to use
   it again later.
8. Select a saved setup and use **Export** to copy a portable code, or use
   **Import** to save a code from another user. Importing a code with an
   existing setup name updates that setup.

Saved setups, recent generated-search configurations, and panel preferences are
stored locally by the extension. Generating a link sends the required skill and
support criteria directly to the Path of Exile Trade search API; the extension
does not send them anywhere else. Setup codes are generated and read entirely
in the browser; they contain the setup name and its filter configuration.

See the [privacy policy](PRIVACY.md) for complete details about local data
handling and extension permissions.

## Development

The extension is built with [WXT](https://wxt.dev/), React, and TypeScript.
Install dependencies and start the Chrome development build with:

```sh
pnpm install
pnpm dev
```

Load the generated `.output/chrome-mv3` directory as an unpacked extension from
`chrome://extensions`, with **Developer mode** enabled.

Useful commands:

```sh
pnpm lint       # Check source formatting and lint rules
pnpm compile    # Run TypeScript without emitting files
pnpm build      # Create a production Chrome build
pnpm zip        # Create the Chrome Web Store upload archive
pnpm data:update
```

## Mercenary data

The checked-in `data/mercenaries.json` file contains mercenary classes and skill
pools parsed from
[PoE Wiki](https://www.poewiki.net/wiki/Mercenary), plus exact support labels
from the official
[Path of Exile trade metadata](https://www.pathofexile.com/api/trade/data/stats).
The four house crests are downloaded from the wiki and bundled with the
extension; it does not fetch them while the user browses trade listings.

Run `pnpm data:update` to refresh the dataset after either source changes. The
generator validates minimum class and support counts and requires all four
house crests before replacing generated files, so a source markup change fails
instead of silently producing incomplete data.

## Disclaimer
This extension is not affiliated with, endorsed by, 
or associated with Grinding Gear Games
