export const AI_NOTE = 'Энэ тайлбарыг AI (эсвэл баталгаатай өгөгдлөөс автоматаар) үүсгэсэн. Жинхэнэ баталгаажсан мэдээлэл нь доорх «Ашигласан өгөгдөл» хэсэгт эх сурвалжтайгаа харагдана. Элсэлт, төлбөр, рейтингийн мэдээллийг албан ёсны эх сурвалжаас заавал баталгаажуулна уу.';
const STALE_MS = 365 * 24 * 3600 * 1000;

/** AI-ийн гаралтад facts-д байхгүй тоо орсон эсэхийг шалгана (зохиосон тоо/рейтинг/төлбөрөөс хамгаална). */
export function numbersGrounded(output: string, factsJson: string): boolean {
  const nums: string[] = output.match(/\d[\d,.]*\d|\d/g) ?? [];
  return nums.every((n) => n.replace(/[,.]/g, '').length <= 1 || factsJson.includes(n) || factsJson.includes(n.replace(/,/g, '')));
}

const flag = (verifiedAt?: any) => (!verifiedAt ? 'баталгаажаагүй' : Date.now() - new Date(verifiedAt).getTime() > STALE_MS ? 'хуучирсан, баталгаажуулах шаардлагатай' : 'баталгаажсан');

export function universityFacts(u: any) {
  const lines: string[] = [];
  lines.push(`Нэр: ${u.name}${u.country ? `; улс: ${u.country.nameMn}` : ''}${u.city ? `; хот: ${u.city}` : ''}${u.type ? `; төрөл: ${u.type === 'public' ? 'улсын' : 'хувийн'}` : ''}`);
  const paid = u.paid; // нээгдээгүй бол төлбөртэй мэдээлэл байхгүй — «Мэдээлэл байхгүй» гэж ХУДАЛ хэлэхгүй
  const rk = (u.rankings ?? []).filter((r: any) => !r.subject);
  lines.push(rk.length ? 'Рейтинг: ' + rk.map((r: any) => `${r.provider} ${r.rank ?? r.rankText} (${r.edition ?? r.year}, ${flag(r.verifiedAt)})`).join('; ') : 'Рейтинг: Мэдээлэл байхгүй');
  const tu = paid?.tuition ?? [];
  if (!paid) lines.push('Төлбөр, элсэлтийн шаардлага, бичиг баримт, хугацаа: төлбөртэй мэдээлэл (хэрэглэгч нээгээгүй) — тайлбарлахгүй');
  else lines.push(tu.length ? 'Төлбөр: ' + tu.map((t: any) => `${t.level} ${t.annualFee ?? 'мэдээлэлгүй'} ${t.currency ?? ''}/жил${t.academicYear ? ` (${t.academicYear})` : ''}${t.isEstimate ? ', тооцоолсон' : ''}, ${flag(t.verifiedAt)}`).join('; ') : 'Төлбөр: Мэдээлэл байхгүй');
  const reqs = (paid?.programs ?? []).flatMap((p: any) => (p.requirements ?? []).map((r: any) => `${p.name}: ${r.kind}${r.minScore != null ? ` ≥ ${r.minScore}` : ''}`));
  if (paid) lines.push(reqs.length ? 'Элсэлтийн шаардлага: ' + reqs.join('; ') : 'Элсэлтийн шаардлага: Мэдээлэл байхгүй');
  lines.push((u.scholarships ?? []).length ? 'Тэтгэлэг: ' + u.scholarships.map((s: any) => s.name).join('; ') : 'Тэтгэлэг: Мэдээлэл байхгүй');
  const src = u.source ? [{ label: 'Их сургуулийн мэдээлэл', sourceUrl: u.source.sourceUrl ?? null, verifiedAt: u.source.verifiedAt ?? null, status: flag(u.source.verifiedAt) }] : [];
  (u.rankings ?? []).forEach((r: any) => src.push({ label: `Рейтинг ${r.provider} ${r.year}`, sourceUrl: r.sourceUrl ?? null, verifiedAt: r.verifiedAt ?? null, status: flag(r.verifiedAt) }));
  return { lines, sources: src };
}

export function resultFacts(r: any) {
  const lines: string[] = [`Хураангуй: ${r.summary}`];
  const m = r.careerMatches ?? r.fieldMatches ?? r.countryMatches ?? [];
  m.slice(0, 5).forEach((x: any, i: number) => lines.push(`${i + 1}. ${x.nameMn} — тохирол ${x.score}%. ${(x.why ?? []).join(' ')}${x.breakdown ? ' Задаргаа: ' + Object.entries(x.breakdown).map(([k, v]) => `${k} ${v ?? 'мэдээлэлгүй'}`).join(', ') : ''}`));
  if (r.improvements?.length) lines.push('Хөгжүүлэх тал: ' + r.improvements.map((g: any) => `${g.name} ${g.score}%`).join('; '));
  if (r.counselorFlags?.length) lines.push('Зөвлөхийн тэмдэглэгээ: ' + r.counselorFlags.map((f: any) => f.text).join(' '));
  if (r.knowledgeGaps?.length) lines.push('Нөхөх мэдлэг: ' + r.knowledgeGaps.join('; '));
  if (r.locked) lines.push('Тайлбар: Premium нээгдээгүй тул зөвхөн хязгаарлагдмал үр дүн байна.');
  return { lines, sources: [{ label: 'Таны тестийн үр дүн (сервер талын оноолт)', sourceUrl: null, verifiedAt: null, status: 'тооцоолсон' }] };
}

