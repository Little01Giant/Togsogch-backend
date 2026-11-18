# Subagent brief — university enrichment (10 schools per agent)

You are a careful higher-education data researcher. Collect verified facts about a block of universities from their OFFICIAL websites and write them to one CSV file. Your task message tells you the `order` range and the output file name.

INPUT: `D:\Togsogch\backend\scripts\data\universities-top600-list.csv` — take the rows whose `order` is in your range (columns: order,name,countrySlug,city,...).

For EACH university, use WebSearch to find the official website, then WebFetch the official pages (admissions, international students, tuition/fees, scholarships, English requirements, application deadlines). Use ONLY the university's own official pages. Do NOT use Wikipedia, ranking sites, agency blogs or forums. NEVER invent, estimate, or fill typical values: if a value is not on an official page you actually fetched, leave the cell EMPTY. An empty cell is always better than a guess. Do not copy numbers from memory. Do not use search-engine snippets as sources. If a page returns 403/404/empty, try one or two other official URLs (different path, international-students subsite, a PDF fee schedule), then give up and say so in notes. Do NOT use the browser (Claude in Chrome) — another process uses it.

Collect, for an INTERNATIONAL (non-resident) student:
- tuitionLevel: bachelor or master (prefer bachelor if both are published, otherwise master)
- tuitionAmount: plain number per academic year in the ORIGINAL currency (no symbols/commas). Only a figure printed on the page; if you must multiply per-term/per-quarter figures, say so in tuitionNote. If only per-credit is published, leave empty and put it in tuitionNote. If fees differ by programme, give one NAMED programme's figure and name it in tuitionNote.
- tuitionCurrency: ISO code (USD, GBP, CHF, SGD, AUD, CAD, EUR, JPY, KRW, CNY, INR, RUB, PLN, CZK, HUF, SEK, DKK, NZD...)
- tuitionAcademicYear: e.g. 2025/2026 (only if the page states it)
- tuitionNote: max 150 chars
- tuitionSourceUrl: the exact official https page you fetched
- ieltsMin, toeflMin: minimum overall scores for general undergraduate admission if published (numbers only; leave TOEFL empty if the scale is ambiguous because of the 21 Jan 2026 scale change, and say so in notes)
- languagesOfInstruction: semicolon-separated, only if an official page states it
- intakes: semicolon-separated tokens from {autumn, spring, summer, winter} if published
- applicationDeadlines: short text, max 150 chars, only if published for international applicants
- scholarshipsForInternational: max 200 chars factual summary (or "none published")
- scholarshipsSourceUrl: the official page
- degreeLevels: LEAVE EMPTY (always)
- admissionSourceUrl: the official admissions page you used
- verifiedAt: 2026-11-09
- notes: max 150 chars; say if a site blocked you or data was unavailable

OUTPUT: write the file you were told to write (inside `D:\Togsogch\backend\scripts\data\enrich\`; do not touch any other file) with exactly this header and one row per university in input order; `name` copied exactly from the list:

order,name,tuitionLevel,tuitionAmount,tuitionCurrency,tuitionAcademicYear,tuitionNote,tuitionSourceUrl,ieltsMin,toeflMin,languagesOfInstruction,intakes,applicationDeadlines,scholarshipsForInternational,scholarshipsSourceUrl,degreeLevels,admissionSourceUrl,verifiedAt,notes

Quote cells containing commas/quotes (double inner quotes), UTF-8. Every non-empty URL must be https and a page you actually fetched. After writing, verify with a quick node or python check that every row has exactly 19 columns.

Budget: at most ~6 fetches per university; do not linger. FINAL REPORT (max 8 lines): per university filled vs empty in a few words, total tool calls. Do not paste the CSV.
