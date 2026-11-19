// Факультет/номын сан/өөр байгууллагын хаяг орсон `website`-ийг сургуулийн үндсэн сайтаар засаж, тэр буруу сайтаас авсан лого/зургийг буцаана.
// Зөвхөн энэ скриптээр (media.*.sourceUrl == буруу website) орсон лого/зургийг л хөнддөг; гараар оруулсныг хөндөхгүй.
// Хэрэглээ: npx ts-node scripts/fix-wrong-websites.ts [--apply --yes-remote]
import { config } from 'dotenv';
import fs from 'node:fs';
import path from 'node:path';
import mongoose from 'mongoose';
import { UniversitySchema } from '../src/schemas';

config();
const apply = process.argv.includes('--apply');
const FIX: Record<string, string> = {
  'ku-leuven': 'https://www.kuleuven.be',
  'universit-paris-saclay': 'https://www.universite-paris-saclay.fr',
  'politecnico-di-milano': 'https://www.polimi.it',
  'georgia-institute-of-technology': 'https://www.gatech.edu',
  'lancaster-university': 'https://www.lancaster.ac.uk',
  'politecnico-di-torino': 'https://www.polito.it',
  'universitat-ramon-llull': 'https://www.url.edu',
  'university-of-washington': 'https://www.washington.edu',
  'universitat-aut-noma-de-barcelona': 'https://www.uab.cat',
  'universit-cattolica-del-sacro-cuore': 'https://www.unicatt.it',
  'universit-de-strasbourg': 'https://www.unistra.fr',
  'universit-laval': 'https://www.ulaval.ca',
  'universit-t-bremen': 'https://www.uni-bremen.de',
  'universit-de-rennes': 'https://www.univ-rennes.fr',
  'the-catholic-university-of-korea-cuk': 'https://www.catholic.ac.kr',
  'institut-national-polytechnique-de-toulouse': 'https://www.inp-toulouse.fr',
  'universitat-polit-cnica-de-catalunya-barcelonatech-upc': 'https://www.upc.edu',
  'birla-institute-of-technology-and-science-pilani': 'https://www.bits-pilani.ac.in',
  'universit-politecnica-delle-marche': 'https://www.univpm.it',
};

(async () => {
  const uri = process.env.MONGODB_URI ?? 'mongodb://127.0.0.1:27017/togsogch';
  if (apply && /^mongodb\+srv:/.test(uri) && !process.argv.includes('--yes-remote')) { console.error('--yes-remote нэмнэ үү.'); process.exit(1); }
  await mongoose.connect(uri);
  const U = mongoose.model('University', UniversitySchema);
  const reset = new Set<string>();
  for (const [slug, site] of Object.entries(FIX)) {
    const u: any = await U.findOne({ slug, deletedAt: null }).select('website media logoUrl images').lean();
    if (!u || u.website === site) continue;
    const set: Record<string, any> = { website: site }, unset: Record<string, 1> = {};
    if (u.media?.logo?.sourceUrl && u.media.logo.sourceUrl === u.website) { unset.logoUrl = 1; unset['media.logo'] = 1; }
    if (u.media?.cover?.sourceUrl && u.media.cover.sourceUrl === u.website) { unset.images = 1; unset['media.cover'] = 1; }
    console.log(`${slug}: ${u.website ?? '-'} -> ${site}${Object.keys(unset).length ? `  (буцаах: ${Object.keys(unset).join(',')})` : ''}`);
    if (apply) await U.updateOne({ _id: u._id }, { $set: set, ...(Object.keys(unset).length ? { $unset: unset } : {}) });
    reset.add(slug);
  }
  if (apply) { // дахин татахын тулд official-site-media.json-оос хасна
    const f = path.join(__dirname, 'data', 'official-site-media.json');
    if (fs.existsSync(f)) fs.writeFileSync(f, JSON.stringify(JSON.parse(fs.readFileSync(f, 'utf8')).filter((x: any) => !reset.has(x.slug) && !FIX[x.slug]), null, 1));
  }
  console.log(JSON.stringify({ mode: apply ? 'APPLY' : 'DRY-RUN', changed: reset.size }));
  await mongoose.disconnect();
})().catch((e) => { console.error(e); process.exit(1); });
