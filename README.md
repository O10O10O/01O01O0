# STEAK
Free-to-play casino simulator using fictional **Steakcoin**. Pure HTML/CSS/vanilla JS, no build step.

## Deploy on GitHub Pages
Push this folder to a repo (e.g. `PlaySteak`), then Settings → Pages → Deploy from branch → `main` / root.

## Notes
- Data (username, balance, stats) is saved in `localStorage`; the reset button clears balance and stats.
- Plinko slot multipliers use your max-multiplier table for the edge slots; centre slots are interpolated, so RTP isn't tuned.
- Aviamasters item odds are untuned.
- Leaving a round mid-game forfeits the bet.
