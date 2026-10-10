# BD Political Compass — Final Pre-Launch Check

*Prepared 7 Oct 2026 · Files reviewed: questions.js, scoring.js, WelcomePage, Dashboard, ResultScreen, PersonalityCard, CertificateCard, DemographicsForm, TrendingIssueCard, AxisGrid · Not seen: useAggregateStats, lib/firebase, lib/trendingIssues, the quiz/App wiring, CSS.*

**How to read this:** **P0** = fix before any public link. **P1** = fix before promoting widely. **P2** = polish. Every finding says where it is and what "done" looks like. Items marked *(verified)* were reproduced by running your code; items marked *(read from code)* were not executed; items marked *(unverified)* need an agent to check.

## Implementation status update

The findings below describe the original audit state. The current code now separates response aggregates by question-set/model version, excludes responses marked unreliable from aggregate updates, uses a 30-response minimum for public cohorts, and avoids claiming that volunteer responses represent national opinion. The demographics form now requires explicit consent before optional demographic answers are submitted, discloses pseudonymous response storage, and states that names are not stored with responses. Story-card personality and issue details, and certificate political details, are opt-in. Share filenames and captions no longer reveal bloc keys by default, and certificate language describes participation rather than verification. Mixed/no-clear-match results no longer imply a flattering personality type or display normalized profile shares; Adolf Hitler is excluded from the shareable personality comparisons.

These code changes are not a public-release sign-off. Still required:

- Add reviewed consent/privacy-policy wording, a retention period, and a working deletion/contact route.
- Move aggregate writes behind a trusted service or otherwise prevent public clients from directly changing public statistics; current Firestore rules are not a robust integrity boundary.
- Run the version-aware aggregate backfill and verify the current question/model-version document before relying on live results.
- Validate the optional party-support comparison with real responses only; do not tune model weights using a small or unrepresentative sample.
- Test exported and shared cards on real mobile devices and confirm that all political disclosures remain hidden unless the user opts in.
- Keep the wedge-question list unchanged until the question revisions are complete.

## 1. Summary — the ten things that matter most

| # | Priority | Issue | Section |
| --- | --- | --- | --- |
| 1 | P0 | BNP-leaning respondents are fragile: the model wins them by thin margins and they can fall to Sushil / "Independent Thinker" | 2 |
| 2 | P0 | Scoring list contains Adolf Hitler as a shareable "match"; Subhas Bose is labelled Bangladeshi *(verified)* | 3 |
| 3 | P0 | Public claims that cannot be defended: "100% real-time and cloud-verified… no fake data", "Nationwide", "scientific analysis", "Verified Research Certificate" | 5 |
| 4 | P0 | "100% anonymous" claim while collecting religion, party support, referendum vote, division, age, occupation and (optionally) name | 4 |
| 5 | P0 | Questions, weights and scoring changed several times, but `MODEL_VERSION` is unchanged and old responses may be mixed into live aggregates | 6 |
| 6 | P0 | Leader-photo card and "most agree/disagree" cards publish political lean even though the "tendency" toggle is off by default | 7 |
| 7 | P1 | Party-support answers are stored as Bangla display names and "never read" — the exact data you need to calibrate the model is unused | 2, 4 |
| 8 | P1 | Fallback profiles ("Neutral Observer", "Independent Thinker") flatter users instead of saying "no clear match"; Mixed/NoMatch get `relativeShare: 100` | 3 |
| 9 | P1 | Compass centroids and quadrant labels are not credible as party positions (AL plots slightly libertarian, JI at centre) | 3 |
| 10 | P1 | Disclaimer I added to the welcome page was lost when the page was rewritten; none exists on Dashboard, Result or Certificate | 5 |

## 2. The BNP problem ("I can never land on BNP")

### 2.1 What I tested

I could **not** reproduce your exact failure, because I don't have your answers. I did four role-played BNP supporters, written from commonly stated BNP positions and **not** from the model's weights, and ran them through your current `questions.js` + `scoring.js` *(verified)*:

| Persona | Top bloc | BNP score | Runner-up | Margin |
| --- | --- | --- | --- | --- |
| BNP supporter, typical answers | BNP | 63 | JI 49 | +14 |
| …with strong civil-liberties answers | BNP | 61 | JI 49 / Sushil 47 | +12 |
| …and liberal on religion & minorities | BNP | 57 | **Sushil 52** | **+5 (fragile)** |
| …hedging on AL / July items | BNP | 55 | JI 47 | +8 |

So the model *can* land on BNP, but only when a respondent answers a particular way, and a few liberal answers close the gap. A real person who answers like your attempts does not get BNP. 1,000 randomly jittered copies of persona 1 all landed on BNP, so the problem is systematic (specific items), not random noise.

### 2.2 Likely causes, ranked

1. **BNP's separators are mostly "support the current government" items.** q3 (extortion under current government), q6 (strong opposition exists), q7 (street protests legitimate), q31 (July uprising failed), q32 (implement every Charter proposal) carry 15.5 of BNP's 56.5 total weight (≈27%). A BNP-leaning person who is unhappy with the government, or sceptical of it, answers these "the wrong way" and BNP loses its separators. This measures incumbency sentiment, not BNP identity, and it will drift as the government's popularity changes. *(read from weights table)*
2. **Sushil owns the consensus items.** On q2, q5, q26, q27, q29, q30 (crossfire, police immunity, misinformation laws, media restriction, long detention, internet shutdown) Sushil's weights total ≈21 against ≈3.5 for BNP. Most respondents of every party, including BNP voters who were on the receiving end of these abuses, answer these the same way. Each such answer adds to Sushil and almost nothing to BNP. *(verified: persona 3 above)*
3. **BNP-defining policy positions are weak or shared.** The caretaker item (q8) gives BNP 1 but JI 3 and Student 2, so it favours the other two. The market items (q16–q19) carry at most 2.5. The Bangladeshi-vs-Bengali nationalism divider and the Zia/Mujib recognition issue are not asked at all (q34 only separates BNP from AL and Sushil, because Student and JI answer the same way).
4. **The no-match gate sits close to realistic BNP scores.** `NO_MATCH_THRESHOLD = 52`; hedging BNP respondents score 55–57. A slightly more moderate respondent drops into the "Independent Thinker" profile.
5. **The result page contradicts itself.** The BNP personas plot at about (1, 1), which the compass calls "Centrist", while the BNP centroid is (24, −16), "Authoritarian right". A BNP-leaning respondent therefore sees a *Centrist* headline next to a *Civil Society* bloc. That combination is exactly what you described.
6. **App wiring (unverified).** Confirm: Likert values reach `calculateComprehensiveAnalysis` as integers 1–5 (not 0–4); `questionId` values match; the deployed `scoring.js` is the one I tested; results are recomputed, not cached from an older run.

**What I need from you to close this:** the 40 answers from one of your failed BNP attempts (a list of `q1…q40` with a 1–5 value each). With that I can show exactly which items pulled the result to Sushil.

### 2.3 Fix plan

| Step | Owner | Done when |
| --- | --- | --- |
| a. Query your stored responses: for people whose `partySupport` is BNP, what is the distribution of `primaryBloc`? Do the same for every party. This is a free calibration dataset you already collect. | Agent | You have a 5×5 confusion table from real users, even if n is small |
| b. Store `partySupport` as a stable key (`BNP`, `JI`, `Student`, `AL`, `Sushil`, `Other`, `None`, `Skip`), not the Bangla display name. The code comment says it is "stored verbatim and never read"; renaming a profile will break every join | Agent | New writes use keys; old values mapped once |
| c. Add 4–6 items that separate BNP from *all* other blocs, in neutral wording. Candidate topics: Bangladeshi vs Bengali nationalism; recognition of Ziaur Rahman's role in the 1971 independence announcement (alongside q34); the election-system debate beyond caretaker (e.g. two-chamber structure and PR for the upper house); business and investment climate; politically motivated cases against party leaders; the army's role | You + agent | Each new item has BNP weight ≥ 2.5 in magnitude and opposite sign to at least three other blocs |
| d. Reduce reliance on incumbency items: cap q3, q6, q7, q31 at | w | ≤ 2 for every bloc, or move them to a separate "views on the current government" side-measure that does not feed bloc matching |
| e. Lower the weights of Sushil on consensus items (items where ≥4 of 5 blocs lean the same way): q2, q5, q26, q30, q1 | Agent | Sushil's "consensus mass" falls below 15% |
| f. Make the compass headline and bloc consistent: show the compass as *your* position, and do not show "Centrist" as a headline next to a bloc unless you explain it | Agent | A BNP-leaning respondent never sees contradictory labels |
| g. Run `persona-check.mjs` (attached) after every change. Replace my role-played answer sets with answer sets from real supporters of each party (≥5 per party) | You | ≥80% top-1 accuracy per bloc and ≥10-point margin for typical supporters |

**Caution on the weights:** the bloc weights are editorial estimates for every party, not measurements. Treat my persona results as a smoke test, not proof that BNP supporters will be classified correctly; step (a) is the real test.

## 3. Scoring and personality logic

### 3.1 `scoring.js`

| Finding | Where | Fix |
| --- | --- | --- |
| Fallback profiles were renamed "Neutral Observer" and "Independent Thinker" (★, "your thinking is important for a healthy democracy"). "Independent Thinker" is shown when similarity is low, i.e. when the model *failed to match*; it reads as praise and hides that | `MIXED_PROFILE`, `NO_MATCH_PROFILE` | Use plain copy: "No clear match with these five groups". Do not use a trophy icon |
| Mixed and NoMatch now return `relativeShare: 100`, so any chart that shows shares will print 100% | `primaryBloc` for Mixed/NoMatch | Return `null` and make the UI hide the percentage |
| `MODEL_VERSION` is still `'v3-2026-10'` although personalities, sentiment handling and weights changed | line 17 | Bump on every model or question change and store it with each response |
| Compass centroids derived from weights: AL (−1, 12), JI (3, 7), BNP (24, −16), Sushil (15, 65), Student (−46, 20). AL plots as mildly libertarian and JI at the centre; these will be read as claims about the parties | `BLOC_PROFILES[*].centroid` | Do not plot centroids as party positions; if shown, label "typical supporter in this test" |
| Quadrant spread in simulated respondents: centrist 29%, libertarian-left 28%, libertarian-right 26%, authoritarian-right 15%, authoritarian-left 2% *(verified)* | compass | Acceptable for a test, but expect almost nobody to see "Authoritarian left" |
| Straight-liner and neutral handling works (flagged `reliable:false`) *(verified)* | `quality` | Make sure the aggregate writer actually skips `quality.reliable === false` *(unverified)* |

### 3.2 Personality matching (`MASTER_PERSONALITIES`)

Simulated 6,000 respondents built from the five bloc profiles with noise *(verified; real respondents may differ, but the dead entries come from where the coordinates sit)*:

| Finding | Detail |
| --- | --- |
| **Adolf Hitler is in the list** as an International match (x 75, y −90). He was not the top match in my simulation, but any strongly authoritarian-right respondent can be shown him on a card meant for sharing | Remove. Also remove or exclude any figure responsible for mass atrocities. `persona-check.mjs` fails on this |
| **Subhas Chandra Bose is tagged `nationality: 'Bangladeshi'`.** His own role text says he was an Indian independence leader. He would appear under the "Bangladeshi" label on the card | Change to `Regional`. Review Suhrawardy (born in Midnapore) the same way |
| **10 of 25 figures were never the top match:** Bhashani, Surya Sen, Moni Singh, Shariatullah, Sir Syed, Ambedkar, Gandhi, Hitler, Napoleon, Lee Kuan Yew | Dead entries: their coordinates sit where few respondents land |
| **Heavy concentration:** Fazlul Huq is the top Bangladeshi match for 34.5% of respondents, Abraham Lincoln for 43.6% of international matches; Mujib only 0.5% | The card mostly says "Lincoln / Fazlul Huq" regardless of the person |
| **Pairs sitting on the same point:** Bhashani\~Marx, Surya Sen\~Castro, Moni Singh\~Marx, Shariatullah\~Lee Kuan Yew (≤10 apart) | Ties are decided by tiny differences |
| **Compatibility numbers are inflated:** min 83, median 94, max 99 on the shown card *(verified)*. The formula floors at 30 and ends near 99 whenever any figure is close | Drop the number or show bands ("very close / close") |
| Placements are editorial (Mujib −40/−30, Zia 45/−45, Ershad 30/−60) and contested | State on the card that placements are "illustrative" |

## 4. Privacy and data handling

| Finding | Where | Fix |
| --- | --- | --- |
| "Completely optional and **100% anonymous**" is shown above a form that asks age band, division, religion, gender, education, occupation, party support, referendum vote and (optional) name. Combinations of these are re-identifiable, especially for a small religious or occupational group in one division | DemographicsForm line \~169 | Remove "100%"; say what you collect, why, and what you do not (no phone, no email, no IP stored — **only if true**) |
| Religion, party support and referendum vote are sensitive political/religious data | DemographicsForm | Add an explicit consent sentence, a privacy-policy link, retention period and a deletion route. I am not a lawyer — check the data-protection rules that apply to you |
| "Responses will not be linked to any personal ID" | line \~344 | Confirm the session/anonymous-auth ID is not stored with the response and that the optional `name` is **never** written to the database *(unverified)* |
| Dashboard shows cohort results from 10 respondents (`MIN_PUBLIC_COHORT_SIZE`, "sample below 10") for division × age × religion filters on political opinion data | Dashboard | Raise to 20–30; do not show exact n below the threshold; avoid combinations that let someone subtract two filters to isolate a small group |
| Certificate and PDF/JPG filenames include the bloc key, e.g. `BD_Political_Compass_2026_AL.pdf`, so the file name discloses the party when forwarded | CertificateCard \~189, 208, 270 | Use a neutral filename |
| Share text contains the name, "98% \[party\]" and coordinates | CertificateCard \~236–255, 314 | Default share text without party or name; let the user opt in. "98% BNP" will be read as membership, not similarity |
| Serial formats differ and double up: certificate `BDC-2026-XXXXXXXX`, story card `BDC-XXXXXXXX`; with a `bdc_` session prefix it prints `BDC-BDC_647F` | CertificateCard 133, PersonalityCard | One serial helper that strips the prefix |
| Dashboard uses a live `onSnapshot` listener | Dashboard line \~241 | Fine for a deep-dive page; confirm read cost at your expected traffic |

## 5. Claims and wording that will not survive scrutiny

The site is a voluntary, self-selected survey. Any wording that implies a national, scientific or verified result is an unforced error that critics of any party can use.

| Where | Current wording (gist) | Problem | Suggested replacement |
| --- | --- | --- | --- |
| Dashboard \~578 | "সকল পরিসংখ্যান ১০০% রিয়েল-টাইম এবং ক্লাউড-যাচাইকৃত। কোনো কৃত্রিম বা ফেক ডেটা ব্যবহার করা হয়নি… নতুন বাংলাদেশের জনমত" | Unprovable absolute claim; "নতুন বাংলাদেশ" is a camp slogan | "এখানকার সব সংখ্যা জরিপে অংশ নেওয়া উত্তরদাতাদের জমা দেওয়া উত্তর থেকে হিসাব করা। এটি স্বেচ্ছায় অংশগ্রহণের উদ্যোগ; অংশগ্রহণকারীরা সারা দেশের প্রতিনিধি নন।" |
| Dashboard \~380, 384 | "রিয়েল-টাইম জনমত", "বাংলাদেশের রাজনৈতিক জনমত পরিসংখ্যান" | Implies national opinion | "অংশগ্রহণকারীদের মতামত (লাইভ)" / "অংশগ্রহণকারীদের রাজনৈতিক মতামত: পরিসংখ্যান" |
| Dashboard \~451 and all "জাতীয় নমুনা / national sample" labels | "সমগ্র বাংলাদেশে / Nationwide", "national sample" | A self-selected group is not a national sample | "অংশগ্রহণকারীদের মধ্যে / Among participants", "সব অংশগ্রহণকারী / all participants" |
| ResultScreen \~139 | "বৈজ্ঞানিক বিশ্লেষণের ভিত্তিতে আপনার অবস্থান নিরূপণ" | Overclaim | "৪০টি প্রশ্নে আপনার উত্তর থেকে হিসাব করা হয়েছে, কোন ধারার অবস্থানের সঙ্গে সবচেয়ে বেশি মেলে" |
| ResultScreen \~580 | "দেশের সামগ্রিক জনমতের সাথে নিজের অবস্থান মেলাতে" | Same | "অন্য অংশগ্রহণকারীদের ফলাফলের সঙ্গে মিলিয়ে দেখতে চান?" |
| CertificateCard \~371–375, 503 | "Public Opinion Survey Participation Certificate", "Independent, research-based…", "**Verified** Research Certificate", "get a **verified** certificate" | Nothing is verified; there is no lookup for serial numbers | "অংশগ্রহণ সনদ"; delete "verified" and "research" unless a real verification page exists |
| WelcomePage (current copy) | eyebrow "উন্মুক্ত জনমত জরিপ"; title "আসলে কী চায়?"; "আপনার উত্তর জাতীয় জনমত পরিসংখ্যানেও যুক্ত হবে"; badge "জাতীয় জনমত" | These came back in the agent's rewrite | Eyebrow "রাজনৈতিক কম্পাস ২০২৬"; title "আপনি কোথায়?"; badge "সম্মিলিত ফলাফল" |
| WelcomePage, ResultScreen, Dashboard | Time "প্রায় ৫ মিনিট" | 40 questions in five minutes is optimistic | Time two or three people and use "৫–৭ মিনিট" |
| PersonalityCard \~349, 473; CertificateCard \~236–255 | "উন্মুক্ত জনমত জরিপ" in share text and card header | Same overclaim, now on the most-shared artifact | "বিডি পলিটিক্যাল কম্পাস ২০২৬" |

**Add one disclaimer sentence in all four places** (Welcome, Dashboard, Result, Certificate/Story card): *"এটি স্বেচ্ছায় অংশগ্রহণভিত্তিক উদ্যোগ। অংশগ্রহণকারীরা সারা দেশের প্রতিনিধি নন, তাই এই ফলাফল জাতীয় জনমত জরিপ বা নির্বাচনী পূর্বাভাস নয়। আপনার ফলাফল দেখায় আপনার উত্তর কোন ধারার অবস্থানের সবচেয়ে কাছাকাছি; এটি দলীয় সদস্যপদ বোঝায় না।"*

**"Real-time" vs "live":** the welcome page deliberately reads the aggregate once (snapshot). Keep "সর্বশেষ তথ্য" there; reserve "লাইভ" for the Dashboard, which does subscribe.

## 6. Versioning and data integrity (P0, easy to miss)

- The question set, direction flags, weights, personalities and sentiment handling have changed several times in recent days, and `MODEL_VERSION` has not. Any response stored under an earlier version was scored by different rules, and per-question aggregates such as the q13 and q22 wedge splits may mix **different wordings of the same question id**.
- Before the public launch: (1) bump `MODEL_VERSION` and add `questionSetVersion` to every response; (2) **wipe or segregate all test data** so the first public number is clean; (3) never reuse a question id for a differently worded question — give it a new id; (4) decide whether `quality.reliable === false` responses are stored but excluded from aggregates (recommended).
- `TRACKED_WEDGE_ISSUES[*].title` strings include literal quote characters; check they do not render doubled quotes in `TrendingIssueCard`.

## 7. Story card (PersonalityCard) — carry-over from the earlier audit

| Item | Priority | Status |
| --- | --- | --- |
| Leader match is shown by default while "Show my political tendency" is off by default — the portrait reveals the same lean. Make it opt-in | P0 | Open |
| "Most agree / most disagree" cards publish the user's stance on q13 (inheritance) and q22 (Pakistan military cooperation) with no consent; both showed exactly 50% in the sample (looks like placeholder); topic phrase only, so it reads as the user's own stance | P0 | Open |
| `ISSUE_LABELS` is hard-coded to q13/q22; changing tracked ids shows raw ids like "q31" | P1 | Open |
| Header and footer sit inside Instagram's unsafe zones (top \~250px, bottom \~250–340px); the URL is covered by the reply bar | P1 | Open |
| Text of 13–22px becomes 5–8px on a phone; use ≥30px body, ≥26px labels | P1 | Open |
| "আমার বাংলাদেশ যেখানে" statements are canned and polished, and block 8's left statement still describes "social protection" although the pole is now "existing system and current special protections" | P1 | Open |
| 2× PNG = 2160×3840, \~5.9 MB; use scale 1 or JPEG \~0.9; include the URL in the share text | P1 | Open |
| html2canvas ignores `filter: drop-shadow` (preview ≠ PNG) and `letterSpacing` on Bangla text can break conjuncts | P2 | Open |
| Compatibility percentages unlabeled | P1 | Open (see 3.2) |

## 8. Other components

**TrendingIssueCard** *(read from code)*

- The landing page's hook is the split on the two most inflammatory statements (equal inheritance; military cooperation with Pakistan). Screenshotted without context, "62% disagree" becomes "Bangladeshis reject equal inheritance." Show n and "among participants" on the card, or keep these on the Dashboard only (P1).
- The statement area is a fixed 7.4rem box with a 5-line clamp. The long Bangla q13 and q22 texts may truncate on narrow phones; test at 360px width (P2).

**AxisGrid** *(read from code)*

- `AXIS_DESCRIPTIONS` is keyed `gov / econ / civil / religion / diplomacy / culture / env / tech`, but the lookup uses `block.key` (`state_power`, `democracy`, `religion_society`…). Nothing matches, so the written descriptions never show; the card falls back to `block.subtitle`. Three keys (`culture`, `env`, `tech`) do not correspond to any block (P2).
- Block 8's left pole is now "বিদ্যমান কাঠামো", which is not in `POLE_TEXT_TO_ICON`, so the lookup falls back to `pole-unregulated` — an "unregulated market" icon next to an "existing structure" label (P1). Block 5 has the same text-map mismatch but falls back to a suitable icon.
- The `title.replace(/নীতি|বিষয়ক/g,'')` hack will remove those words anywhere they appear in a title (P2).

**DemographicsForm** *(read from code)*

- Option labels mix Bangla and English in parentheses; Bangla mode should be Bangla-only (P2).
- The party-support list is built from `BLOC_PROFILES` names, so adding or renaming a bloc silently changes the form (see 2.3b).

**ResultScreen / CertificateCard**

- For `Mixed` and `NoMatch` the certificate prints "50% Neutral Observer" or a similarity percentage, which is meaningless. Hide the percentage and the "second-highest match" line for those outcomes (P1).

## 9. Release gates (suggested)

1. `persona-check.mjs` passes; ≥80% top-1 accuracy per party using real supporter answer sets.
2. A 50–100 person soft launch spanning all camps, with the optional party-support question on. Compute the party × result confusion table before going public.
3. All items marked P0 above closed; disclaimer visible on four surfaces.
4. Test data wiped; `MODEL_VERSION` and `questionSetVersion` stored on every response.
5. Privacy text reviewed against what the code actually stores (name, IDs, IP, logs).
6. Share artifacts reviewed on a real phone (Instagram story preview), including a long Bangla nickname.

## 10. What I could not verify

- Your exact failing BNP answers (needed for 2.2).
- Aggregation, auth and storage code (`lib/firebase`, `useAggregateStats`): whether unreliable responses are excluded, what is stored with each response, and the cohort-size logic.
- Rendered output in Bangla. This environment has no Bengali font, so I checked wording and layout logic from code and screenshots only.
- Whether the 50% figures on the story card are real data or a placeholder.

*Attachment: `persona-check.mjs` — run `node persona-check.mjs` from the project root (adjust the two import paths at the top if your folders differ). It currently reports 3 failures: BNP margin fragile (persona 3), Bose nationality, Hitler in the list.*
