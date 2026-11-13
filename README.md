# Victor Nwoke — Creative Portfolio + Evaluation Lab

This is a static, dependency-free implementation. The existing portfolio has been enhanced with a standalone interactive creative evaluation exercise.

## Open locally

Run a local server at the repository root:

```sh
python3 -m http.server 8080
```

Visit `http://localhost:8080/` and open **Evaluation lab**, or go to `http://localhost:8080/lab/`.

## What the lab demonstrates

- A detailed **fictional** FIELDWORK workshop brief
- Two separately designed, synthetic HTML/CSS submissions
- Desktop/mobile review modes
- Seven editable rubric criteria with weights totalling 100%
- Evidence notes for each submission / criterion
- Weighted scoring (`sum(score / 5 × weight)`)
- Critical-requirement flags that block the readiness verdict without masking the numeric score
- Locally saved rubric state (browser localStorage, no server or analytics)
- Printable report, Markdown export, JSON export and reset functionality

All fictional content is clearly labelled. This is **not** an official Mercor rubric and does not claim to evaluate outputs from any named model or client.

## Hosting / deployment

The attached ChatGPT-site original uses `.openai/hosting.json` with `static.directory: dist`.
A `dist/` mirror of the complete site is included so it can be hosted without a build step.
To update the hosted site, upload/replace the site through the appropriate platform tooling. This archive is not a live deployment.

## Acceptance checks

Serve locally, check routes `/` and `/lab/`, select each section, edit rubric scores and evidence, flag and unflag critical issues, view both device modes, export Markdown/JSON, reset, and print the report.

## Source files

- `/index.html`, `/styles.css`: existing portfolio with integrated lab feature
- `/lab/index.html`: full evaluation lab
- `/lab/lab.css`: responsive design system
- `/lab/lab.js`: interactive scoring, reporting and state
- `/assets/`: previously generated portfolio PDFs
- `/dist/`: deployable static mirror

## Attribution

Original portfolio demonstration prepared for Victor Nwoke. Synthetic client and original example designs; no commercial commission or external evaluation results are implied.
