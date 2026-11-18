// Судалгааны тайлангийн тоог улсын баримтад оруулна. Хоосон талбарыг, эсвэл эх сурвалж нь энэ тайлан хэвээр байгаа баримтын талбарыг шинэчилнэ. Идемпотент.
import { config } from 'dotenv';
import mongoose from 'mongoose';
import { CountrySchema } from '../src/schemas';
import { COUNTRY_REPORT, COUNTRY_REPORT_SOURCE, COUNTRY_REPORT_SOURCE_PREFIX } from '../src/seed/country-report';

config();
(async () => {
  await mongoose.connect(process.env.MONGODB_URI ?? 'mongodb://127.0.0.1:27017/togsogch');
  const Country = mongoose.model('Country', CountrySchema);
  let changed = 0;
  const only = process.argv.slice(2); // жишээ: `ts-node scripts/apply-country-report.ts finland` — зөвхөн заасан улс(ууд)
  for (const [slug, { sourceName, ...row }] of Object.entries(COUNTRY_REPORT)) {
    if (only.length && !only.includes(slug)) continue;
    const c: any = await Country.findOne({ slug }).lean();
    if (!c) { console.log(`Олдсонгүй: ${slug}`); continue; }
    const fromReport = String(c.source?.sourceName ?? '').startsWith(COUNTRY_REPORT_SOURCE_PREFIX);
    const set: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(row)) {
      const cur = c[k];
      const empty = cur == null || cur === '' || (Array.isArray(cur) && !cur.length) || (typeof cur === 'object' && !Array.isArray(cur) && cur.min == null && cur.max == null);
      if ((empty || fromReport) && JSON.stringify(cur) !== JSON.stringify(v)) set[k] = v;
    }
    if (!Object.keys(set).length) continue;
    if (!c.source?.sourceName || fromReport) set.source = { sourceName: sourceName ?? COUNTRY_REPORT_SOURCE, sourceType: 'other', reliabilityStatus: 'secondary', verificationStatus: 'unverified', lastUpdatedAt: new Date() };
    await Country.updateOne({ slug }, { $set: set });
    changed++;
    console.log(`${slug}: ${Object.keys(set).join(', ')}`);
  }
  console.log(`Шинэчилсэн улс: ${changed}`);
  await mongoose.disconnect();
})();
