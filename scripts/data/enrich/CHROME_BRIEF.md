# Subagent brief — Chrome pass for universities an HTTP fetcher could not read

You are a careful higher-education data researcher. These universities returned 403/404/blocked or empty content to an HTTP fetcher, so read their OFFICIAL pages in a real browser (Claude in Chrome). Your task message gives the chunk number and the output file.

INPUT: `D:\Togsogch\backend\scripts\data\enrich\chrome-todo.csv` — take rows whose `chunk` equals yours (columns chunk,order,name,countrySlug,city). Full list rows (rankSourceUrl etc.) are in `universities-top600-list.csv` (match by order).

BROWSER SETUP: Chrome tools are deferred. First call ToolSearch with query "select:mcp__claude-in-chrome__tabs_context_mcp,mcp__claude-in-chrome__navigate,mcp__claude-in-chrome__computer,mcp__claude-in-chrome__read_page,mcp__claude-in-chrome__tabs_create_mcp,mcp__claude-in-chrome__tabs_close_mcp,mcp__claude-in-chrome__get_page_text,mcp__claude-in-chrome__find,mcp__claude-in-chrome__browser_batch". Then tabs_context_mcp, open ONE new tab with tabs_create_mcp and work only there; close it when finished. Rules: decline optional cookies (most privacy-preserving option); never sign in, never create accounts, never fill/submit forms, never download files; do not click through browser certificate warnings ("Not secure"/expired certificate pages): skip such a site and say so in notes; skip login walls and CAPTCHAs. If the browser tools are unavailable or the extension is not connected, STOP and report that. Only ONE agent uses the browser at a time.

Read pages with get_page_text (screenshot only when a fee table is not text). Use ONLY the university's own official pages; no Wikipedia/ranking sites/agency blogs/forums; no search-engine snippets as sources. NEVER invent, estimate or fill typical values: a value must be printed on an official page you actually opened; otherwise leave the cell EMPTY. Do not guess currencies from symbols: if the page prints only "$" or no currency, leave amount and currency empty and put the figure in the note.

Collect, for an INTERNATIONAL (non-resident) student:
tuitionLevel (bachelor|master), tuitionAmount (plain number, per academic year, ORIGINAL currency; multiplied per-term figures only if stated in tuitionNote; one NAMED programme if fees vary), tuitionCurrency (ISO), tuitionAcademicYear (only if stated), tuitionNote (max 150), tuitionSourceUrl (https page opened), ieltsMin, toeflMin (numbers; leave TOEFL empty if the scale is ambiguous because of the 21 Jan 2026 change), languagesOfInstruction (;-separated), intakes (tokens from autumn|spring|summer|winter, only if published), applicationDeadlines (max 150), scholarshipsForInternational (max 200 or "none published"), scholarshipsSourceUrl, degreeLevels (ALWAYS EMPTY), admissionSourceUrl, verifiedAt = 2026-11-10, notes (max 150).

Finding pages: do NOT guess URL paths (they mostly 404). Open the university's official homepage first (find it by running a normal web search in the browser, e.g. "<name> international students tuition fees", then open the OFFICIAL domain result; the search page itself is never a source), then navigate with the site's own menus/links (Admissions → International → Fees / English requirements / Scholarships). If a page shows a bot check (Cloudflare/Anubis/"verify you are human"), skip that site.

Budget: at most ~8 page loads per university; leave the rest empty and say so in notes.

OUTPUT: write the output file named in your task (inside `D:\Togsogch\backend\scripts\data\enrich\`; touch no other file) with exactly this header, one row per chunk university in the order of the todo file, `name` copied exactly from the list:

order,name,tuitionLevel,tuitionAmount,tuitionCurrency,tuitionAcademicYear,tuitionNote,tuitionSourceUrl,ieltsMin,toeflMin,languagesOfInstruction,intakes,applicationDeadlines,scholarshipsForInternational,scholarshipsSourceUrl,degreeLevels,admissionSourceUrl,verifiedAt,notes

Quote cells with commas/quotes (double inner quotes), UTF-8, every non-empty URL https and a page you actually opened. Verify 19 columns per row with a quick node/python check.

FINAL REPORT (max 8 lines): per university filled vs empty, whether the browser got through where the fetcher did not, total page loads. Do not paste the CSV.
