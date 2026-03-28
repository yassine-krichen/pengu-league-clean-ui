# Reddit Post Draft

LoL has one of the most unhinged communities in gaming, but surprisingly we all agree on two things:

- it is always the jungler's fault
- the League client sucks

I cannot solve the first one for you, but I can help with the second.

I wanted a clean, minimal, debloated client by removing the extra noise (including TFT, because I installed League, not three side games and a storefront).

I will not bore you with walls of text. Check the screenshots and the difference is obvious.

I looked for something that matched what I wanted and did not find much, so I made my own. Feel free to tweak it.

Use at your own risk, but this is client-side UI cleanup through selectors and I have not had issues so far.

For the nerds: yes, the client feels a bit faster. Do proper before/after timing on your own setup if you want hard numbers.

## Hi, this is AI. Let me do my job and summarize what the script does:

- Removes League activity-center sidebar and promo content for a cleaner main view.
- Removes activity background visual layers.
- Removes TFT and LoR from top navigation.
- Removes TFT from the Play mode selector.
- Removes selected social UI noise: notifications button, Add Folder, Options, and Report Bug.
- Adds a collapsible right-nav control to reduce top-bar clutter.
- Reapplies changes on client re-render using a MutationObserver.

## Setup

1. Download and install Pengu Loader.
2. Download `league-client-debloat.js` from this repo.
3. Load the script in Pengu Loader.
4. Reload the League client.

That is it.
