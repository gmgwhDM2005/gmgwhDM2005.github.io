# Bus-Fleet site (GitHub Pages)


Static site for community-maintained bus fleet lists. Deploy by pushing these files to a GitHub repo and enabling GitHub Pages (branch `main` or `gh-pages`).


## Setup
1. Create a repository (e.g. `bus-fleets`) and push these files to the `main` branch.
2. In `script.js` change `REPO_OWNER` and `REPO_NAME` to your GitHub account and repo.
3. Optionally add a `fleets.json` file in the root. The site will fetch `./fleets.json`.
4. Enable GitHub Pages in the repository settings (use the `main` branch or `gh-pages`).


## How the public can contribute
- **Open a pre-filled GitHub Issue**: the site opens a prefilled issue page where users can submit a fleet suggestion. Maintainers can then merge suggestions.
- **Create a Pull Request**: the site opens GitHub's "Create new file" page with JSON content prefilled. The contributor can create a branch and PR to add their JSON file under `contrib/`.


Maintainers should periodically run a small script to merge `contrib/*.json` into `fleets.json` or accept PRs where the maintainer edits `fleets.json`.