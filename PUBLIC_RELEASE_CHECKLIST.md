# Public Release Checklist

Items still to complete before opening the survey to the public:

- [ ] Review the survey questions, party descriptions, match scoring, and methodology with independent Bangladesh-based researchers; clearly label editorial estimates and limitations.
- [ ] Publish a plain-language privacy notice covering collected answers, demographics, analytics, retention, deletion requests, and how aggregate results are produced.
- [ ] Review Firestore security rules, production configuration, quotas, backups, and recovery procedures; test both permitted and denied access.
- [ ] Add production smoke checks for survey submission, skipped demographics, result rendering, dashboard aggregation, and unavailable-network/error states.
- [ ] Run `npm run backfill:stats -- --key="C:/secure/service-account.json"` in dry-run mode, review the cohort counts, then rerun with `--key="C:/secure/service-account.json" --apply` before launch so demographic filters include historical responses. Keep the service-account key outside the repository.
- [ ] Test the 9:16 card export and image sharing on current iOS and Android browsers, including Instagram and Facebook share flows and the download fallback.
- [ ] Complete keyboard, screen-reader, reduced-motion, contrast, and mobile/desktop checks in both Bangla and English.
- [ ] Set up monitoring and an incident/contact process for operational failures, data concerns, and harmful or abusive submissions.
- [ ] Make `npm run lint` usable as a release gate; it currently stops because this workspace has no `eslint.config.*` file.
- [ ] Review the production build's large JavaScript chunk warning (about 1.5 MB uncompressed) and split or otherwise reduce the initial download where practical.
