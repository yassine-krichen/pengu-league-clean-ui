# League Client Debloat (Pengu Loader)

A lightweight Pengu Loader script that removes League activity-center clutter and adds a collapsible right navigation section.

## Features

- Removes the entire League activity sidebar (including Patch Notes list).
- Removes League center activity content for an empty canvas.
- Removes League activity background image and blend layer.
- Removes top navigation TFT and LoR entries.
- Removes TFT selector cards from the Play interface.
- Removes social notifications, Add Folder, Options, and Report Bug buttons.
- Adds a right-nav collapse toggle (`>` / `<`) for the top-right nav block.
- Persists right-nav collapsed state in `localStorage`.

## File

- `league-client-debloat.js`: Main tweak script.

## Install

1. Open your Pengu Loader custom scripts folder.
2. Place `league-client-debloat.js` in that folder.
3. Enable/reload the script from Pengu Loader.
4. Restart or reload the League client UI if needed.

## Behavior Notes

- The script uses a `MutationObserver`, so removed elements are removed again if the client redraws the UI.
- Right-nav collapse state key: `penguRightNavCollapsed`.

## Troubleshooting

- If an element survives after a client patch, inspect it and add its class selector to the removal list.
- If the script does not load, confirm Pengu Loader points to the same script filename.
