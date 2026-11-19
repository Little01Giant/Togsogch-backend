// Wikipedia-ийн англи танилцуулгыг (university-media.json) Claude-аар Монгол руу ЗӨВХӨН орчуулна (мэдээлэл нэмэхгүй).
// Хэрэглээ: ANTHROPIC_API_KEY (backend/.env) тохируулаад `npx ts-node scripts/translate-university-descriptions.ts [--limit N]`
// Идемпотент: `mn` аль хэдийн байгаа мөрийг алгасна. Орчуулгад эх дээр байхгүй тоо орвол тэр мөрийг хадгалахгүй (зохиомол тооноос хамгаална).
import { config } from 'dotenv';
import fs from 'node:fs';
import path from 'node:path';
import type { UniversityMedia } from './fetch-university-media';

config();
const key = process.env.ANTHROPIC_API_KEY;
const deepseek = process.env.DEEPSEEK_API_KEY; // байвал DeepSeek-ийг ашиглана (OpenAI-тэй төстэй API)
const model = process.env.AI_MODEL ?? 'claude-sonnet-5-5';
const limit = process.argv.includes('--limit') ? Number(process.argv[process.argv.indexOf('--limit') + 1]) : Infinity;
const file = path.join(__dirname, 'data', 'university-media.json');

const SYSTEM = 'Чи мэргэжлийн орчуулагч. Хэрэглэгчийн өгсөн Wikipedia-ийн англи текстийг Монгол хэл рүү яг утгаар нь орчуул. ' +
  'ЗӨВХӨН орчуул: эх дээр байхгүй баримт, тоо, дүгнэлт, үнэлгээ НЭМЭХГҮЙ, хасахгүй. Тоо, он, хувийг эхтэй яг ижил үлдээ: эхэд үгээр бичсэн тоог (жишээ нь eight, two) үгээр, цифрээр бичсэнийг цифрээр орчуул, хөрвүүлж болохгүй. ' +
  'Сургууль, хот, хүний нэрийг латин үсгээр (эхийнх шиг) үлдээж болно. Зөвхөн орчуулгыг буцаа, тайлбар, хашилт, толгой бүү нэм.';

const nums = (s: string): string[] => s.match(/\d+/g) ?? [];

async function translate(en: string): Promise<string | null> {
  for (let i = 0; i < 3; i++) {
    try {
      const r = deepseek
        ? await fetch('https://api.deepseek.com/chat/completions', {
            method: 'POST', signal: AbortSignal.timeout(60000),
            headers: { authorization: `Bearer ${deepseek}`, 'content-type': 'application/json' },
            body: JSON.stringify({ model: process.env.DEEPSEEK_MODEL ?? 'deepseek-chat', max_tokens: 1200, temperature: 0.2, messages: [{ role: 'system', content: SYSTEM }, { role: 'user', content: en }] }),
          })
        : await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST', signal: AbortSignal.timeout(40000),
            headers: { 'x-api-key': key!, 'anthropic-version': '2023-06-01', 'content-type': 'application/json' },
            body: JSON.stringify({ model, max_tokens: 900, system: SYSTEM, messages: [{ role: 'user', content: en }] }),
          });
      if (r.status === 429 || r.status >= 500) { await new Promise((x) => setTimeout(x, 2000 * (i + 1))); continue; }
      if (!r.ok) { console.error(`HTTP ${r.status}`); return null; }
      const j: any = await r.json();
      if (deepseek) return String(j.choices?.[0]?.message?.content ?? '').trim() || null;
      return (j.content ?? []).filter((c: any) => c.type === 'text').map((c: any) => c.text).join('\n').trim() || null;
    } catch { await new Promise((x) => setTimeout(x, 1500 * (i + 1))); }
  }
  return null;
}

(async () => {
  if (!key && !deepseek) { console.error('ANTHROPIC_API_KEY эсвэл DEEPSEEK_API_KEY тохируулаагүй байна (backend/.env).'); process.exit(1); }
  const items: UniversityMedia[] = JSON.parse(fs.readFileSync(file, 'utf8'));
  const todo = items.filter((i) => i.description?.en && !i.description.mn).slice(0, limit);
  console.log(`Орчуулах: ${todo.length}`);
  let ok = 0, rejected = 0, failed = 0;
  const queue = [...todo];
  const worker = async () => {
    for (let it = queue.shift(); it; it = queue.shift()) {
      const mn = await translate(it.description!.en);
      if (!mn) { failed++; continue; }
      const extra = nums(mn).filter((n) => !nums(it.description!.en).includes(n));
      if (extra.length || !/[Ѐ-ӿ]/.test(mn)) { rejected++; console.warn(`Няцаав: ${it.name} (${extra.join(',') || 'кирилл биш'})`); continue; }
      it.description!.mn = mn; ok++;
      if (ok % 20 === 0) fs.writeFileSync(file, JSON.stringify(items, null, 1));
    }
  };
  await Promise.all([worker(), worker(), worker()]);
  fs.writeFileSync(file, JSON.stringify(items, null, 1));
  console.log(JSON.stringify({ translated: ok, rejected, failed }, null, 1));
})();
