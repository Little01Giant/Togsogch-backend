// `website`-гүй сургуулиудад албан ёсны сайтын хаягийг (гараар цуглуулсан) нээж шалгаад, ажиллаж байвал л хадгална.
// Анхдагч нь DRY-RUN (хуудасны гарчгийг хэвлэнэ — нүдээр шалга). `--apply --yes-remote` бол ЗӨВХӨН хоосон `website`-г бөглөнө.
import { config } from 'dotenv';
import mongoose from 'mongoose';
import { UniversitySchema } from '../src/schemas';

config();
const apply = process.argv.includes('--apply');
const SITES: Record<string, string> = {
  'epfl-cole-polytechnique-f-d-rale-de-lausanne': 'https://www.epfl.ch',
  'universit-psl': 'https://psl.eu',
  'trinity-college-dublin-the-university-of-dublin': 'https://www.tcd.ie',
  'kit-karlsruhe-institute-of-technology': 'https://www.kit.edu',
  'sapienza-university-of-rome': 'https://www.uniroma1.it',
  'universit-catholique-de-louvain-uclouvain': 'https://uclouvain.be',
  'friedrich-alexander-universit-t-erlangen-n-rnberg': 'https://www.fau.de',
  'albert-ludwigs-universitaet-freiburg': 'https://uni-freiburg.de',
  'heriot-watt-university': 'https://www.hw.ac.uk',
  'university-of-rome-tor-vergata': 'https://www.uniroma2.it',
  'sciences-po': 'https://www.sciencespo.fr',
  'city-st-george-s-university-of-london': 'https://www.citystgeorges.ac.uk',
  'goethe-university-frankfurt-am-main': 'https://www.uni-frankfurt.de',
  'university-of-turin': 'https://www.unito.it',
  'university-of-naples-federico-ii': 'https://www.unina.it',
  'university-of-saskatchewan': 'https://www.usask.ca',
  'university-at-buffalo-suny': 'https://www.buffalo.edu',
  'universitat-polit-cnica-de-catalunya-barcelonatech-upc': 'https://www.upc.edu',
  'essex-university-of': 'https://www.essex.ac.uk',
  'shoolini-university-of-biotechnology-and-management-sciences': 'https://shooliniuniversity.com',
  'usi-universit-della-svizzera-italiana': 'https://www.usi.ch',
  'stony-brook-university-state-university-of-new-york': 'https://www.stonybrook.edu',
  'universit-de-montpellier': 'https://www.umontpellier.fr',
  'ural-federal-university-urfu': 'https://urfu.ru',
  'indian-institute-of-technology-bhu-varanasi-iit-bhu-varanasi': 'https://www.iitbhu.ac.in',
  'northumbria-university': 'https://www.northumbria.ac.uk',
  'the-university-of-georgia': 'https://www.uga.edu',
  'universit-paul-sabatier-toulouse-iii': 'https://www.univ-tlse3.fr',
  'paris-lodron-university-of-salzburg': 'https://www.plus.ac.at',
  'birla-institute-of-technology-and-science-pilani': 'https://www.bits-pilani.ac.in',
  'vellore-institute-of-technology-vit-vellore-india': 'https://vit.ac.in',
  'christian-albrechts-university-zu-kiel': 'https://www.uni-kiel.de',
  'hufs-hankuk-korea-university-of-foreign-studies': 'https://www.hufs.ac.kr',
  'university-of-eastern-finland': 'https://www.uef.fi',
  'nottingham-trent-university': 'https://www.ntu.ac.uk',
  'universit-politecnica-delle-marche': 'https://www.univpm.it',
  'kingston-university-london': 'https://www.kingston.ac.uk',
  'thapar-institute-of-engineering-technology': 'https://www.thapar.edu',
  'the-university-of-tennessee-knoxville': 'https://www.utk.edu',
  'maynooth-university': 'https://www.maynoothuniversity.ie',
  'tuhh-hamburg-university-of-technology': 'https://www.tuhh.de',
  'university-of-missouri-columbia': 'https://missouri.edu',
  'syracuse-university': 'https://www.syracuse.edu',
  'missouri-university-of-science-and-technology': 'https://www.mst.edu',
  'jiangnan-university': 'https://www.jiangnan.edu.cn',
  'verona-university': 'https://www.univr.it',
  'university-of-pecs': 'https://pte.hu',
  'itmo-university': 'https://itmo.ru',
  'martin-luther-universit-t-halle-wittenberg': 'https://www.uni-halle.de',
  'saveetha-institute-of-medical-and-technical-sciences-simats-tamil-nadu-india': 'https://www.saveetha.com',
  'the-national-university-of-science-and-technology-misis': 'https://misis.ru',
  'university-of-mons': 'https://www.umons.ac.be',
  'university-of-nebraska-lincoln': 'https://www.unl.edu',
  'catania-university': 'https://www.unict.it',
  'universitat-rovira-i-virgili': 'https://www.urv.cat',
  'university-of-colorado-denver-anschutz-medical-campus': 'https://www.ucdenver.edu',
  'university-of-lincoln': 'https://www.lincoln.ac.uk',
};

async function check(url: string): Promise<{ ok: boolean; final?: string; title?: string; status?: number }> {
  try {
    const r = await fetch(url, { headers: { 'user-agent': 'Mozilla/5.0 (compatible; TogsogchEducationBot/1.0)', accept: 'text/html' }, redirect: 'follow', signal: AbortSignal.timeout(20000) });
    const t = (await r.text()).slice(0, 200000).match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1]?.replace(/\s+/g, ' ').trim();
    return { ok: r.ok, final: r.url, title: t?.slice(0, 90), status: r.status };
  } catch { return { ok: false }; }
}

(async () => {
  const uri = process.env.MONGODB_URI ?? 'mongodb://127.0.0.1:27017/togsogch';
  if (apply && /^mongodb\+srv:/.test(uri) && !process.argv.includes('--yes-remote')) { console.error('--yes-remote нэмнэ үү.'); process.exit(1); }
  await mongoose.connect(uri);
  const University = mongoose.model('University', UniversitySchema);
  let written = 0, bad = 0;
  for (const [slug, url] of Object.entries(SITES)) {
    const u: any = await University.findOne({ slug, deletedAt: null }).select('website').lean();
    if (!u) { console.log(`DB-д алга: ${slug}`); continue; }
    if (u.website) continue;
    const c = await check(url);
    console.log(`${c.ok ? 'OK ' : 'ERR'} ${slug.slice(0, 40).padEnd(40)} ${c.status ?? '-'} ${c.title ?? ''}`);
    if (!c.ok) { bad++; continue; }
    if (apply) { await University.updateOne({ _id: u._id, $or: [{ website: null }, { website: '' }] }, { $set: { website: url } }); written++; }
  }
  console.log(JSON.stringify({ mode: apply ? 'APPLY' : 'DRY-RUN', written, unreachable: bad }));
  await mongoose.disconnect();
})().catch((e) => { console.error(e); process.exit(1); });
