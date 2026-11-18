// ХААИС (muls.edu.mn) хөтөлбөрийн хуудаснаас: Малын их эмч, Ландшафтын архитектур → Career.entranceExams.
// Хуудсанд жил, босго оноо заагаагүй тул `year`, `cutoffScore`-г оруулахгүй. Шинэ мэргэжил үүсгэхгүй.
// Анхдагч нь dry-run; бичихийн тулд `--apply`. Идемпотент: зөвхөн ХААИС-ийн мөрийг сольж, бусдыг хөндөхгүй.
import { config } from 'dotenv';
import mongoose from 'mongoose';
import { CareerSchema } from '../src/schemas';

config();

const UNIVERSITY = 'Хөдөө аж ахуйн их сургууль (ХААИС)';
const SOURCE_NAME = 'ХААИС — бакалаврын хөтөлбөрийн танилцуулга (muls.edu.mn)';
const BASE = 'https://muls.edu.mn/view_program_new.php?value_profession=';

const PROGRAMS: { slug: string; program: string; exams: string[]; url: string }[] = [
  { slug: 'veterinarians', program: 'Малын их эмч', exams: ['Хими', 'Биологи'], url: BASE + 'ZW5jb2RldXNlcmlkNjc=' },
  { slug: 'landscape-architects', program: 'Ландшафтын архитектур', exams: ['Математик', 'Хар зураг'], url: BASE + 'ZW5jb2RldXNlcmlkNDc=' },
];

(async () => {
  const apply = process.argv.includes('--apply');
  await mongoose.connect(process.env.MONGODB_URI ?? 'mongodb://127.0.0.1:27017/togsogch');
  console.log(`DB: ${mongoose.connection.host}/${mongoose.connection.name}`);
  const Career = mongoose.model('Career', CareerSchema);
  const found = await Career.find({ slug: { $in: PROGRAMS.map((p) => p.slug) } }).select('slug').lean();
  const have = new Set(found.map((c) => c.slug));
  const missing = PROGRAMS.map((p) => p.slug).filter((s) => !have.has(s));
  console.log('DB-д олдоогүй slug:', missing.length ? missing.join(', ') : 'байхгүй');
  if (missing.length) { await mongoose.disconnect(); process.exit(1); }
  for (const p of PROGRAMS) console.log(`${p.slug}: ${p.program} — ${p.exams.join(', ')}`);
  if (!apply) { console.log('Dry-run. Бичихийн тулд --apply.'); await mongoose.disconnect(); return; }
  for (const p of PROGRAMS) {
    const cur: any = await Career.findOne({ slug: p.slug }).select('entranceExams').lean();
    const keep = (cur?.entranceExams ?? []).filter((e: any) => e.university !== UNIVERSITY);
    const entry = { university: UNIVERSITY, program: p.program, level: 'bachelor', baseExams: p.exams, extraExams: [], sourceName: SOURCE_NAME, sourceUrl: p.url };
    await Career.updateOne({ slug: p.slug }, { $set: { entranceExams: [...keep, entry] } });
  }
  console.log(`Бичигдлээ: ${PROGRAMS.length} мэргэжил`);
  await mongoose.disconnect();
})();
