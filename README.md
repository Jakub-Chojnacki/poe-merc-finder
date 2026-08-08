# PoE Merc Finder

A Chrome extension that adds a collapsible filter panel to Path of Exile trade
searches for matching mercenaries by skills and their linked supports.

## Mercenary data

The checked-in `data/mercenaries.json` file contains mercenary classes and
skill pools parsed from [PoE Wiki](https://www.poewiki.net/wiki/Mercenary),
plus exact support labels from the official
[Path of Exile trade metadata](https://www.pathofexile.com/api/trade/data/stats).

Refresh the dataset after either source changes:

```sh
pnpm data:update
```

The generator validates minimum class and support counts before replacing the
JSON file, so a source markup change fails instead of silently producing an
empty dataset.
