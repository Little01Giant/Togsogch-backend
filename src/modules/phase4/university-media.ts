/**
 * Сургуулийн лого, зураг, танилцуулгыг Wikidata / Wikimedia Commons / Wikipedia-аас эх сурвалж, лицензтэй нь авах цэвэр логик
 * (Nest, DB-гүй → unit тесттэй). Лиценз нь чөлөөт биш, эсвэл тодорхойгүй бол зургийг ашиглахгүй.
 */

export interface MediaCredit {
  /** Commons-ын файлын хуудас (зохиогч, лицензийг тэндээс шалгана) */
  sourceUrl: string;
  license: string;
  licenseUrl?: string;
  author?: string;
}

export interface DescriptionCredit {
  sourceName: 'Wikipedia';
  sourceUrl: string;
  license: 'CC BY-SA 4.0';
  /** Монгол орчуулга нь AI-аар хийгдсэн (Wikipedia-ийн англи эхийг л орчуулсан, нэмээгүй) */
  translatedByAi: boolean;
}

/** Commons-ын LicenseShortName-ээс зөвхөн чөлөөтийг зөвшөөрнө (CC BY, CC BY-SA, CC0, Public domain / PD-*). */
const FREE = /^(cc[ -]by(-sa)?$|cc[ -]by(-sa)?[ -]\d(\.\d)?\b|cc0|cc[ -]zero|public domain|pd\b)/i;

export function isFreeLicense(shortName?: string | null): boolean {
  return !!shortName && FREE.test(shortName.trim());
}

/** Commons файлын нэрээс (`File:` угтваргүй) тогтвортой, өргөнөөр багасгасан зургийн хаяг. SVG-г PNG болгон өгнө. */
export function filePathUrl(file: string, width: number): string {
  const name = file.replace(/^File:/i, '').replace(/ /g, '_');
  return `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(name)}?width=${width}`;
}

export function commonsPageUrl(file: string): string {
  return `https://commons.wikimedia.org/wiki/File:${encodeURIComponent(file.replace(/^File:/i, '').replace(/ /g, '_'))}`;
}

const ENTITIES: Record<string, string> = { '&amp;': '&', '&lt;': '<', '&gt;': '>', '&quot;': '"', '&#39;': "'", '&nbsp;': ' ' };

/** Commons-ын extmetadata-д HTML ирдэг (Artist гэх мэт) → энгийн текст. */
export function stripHtml(s?: string | null): string {
  return (s ?? '').replace(/<[^>]*>/g, '').replace(/&(amp|lt|gt|quot|#39|nbsp);/g, (m) => ENTITIES[m] ?? m).replace(/\s+/g, ' ').trim();
}

/** Commons imageinfo.extmetadata-аас кредит үүсгэнэ; чөлөөт биш (NonFree эсвэл лиценз танигдахгүй) бол null. */
export function creditFromExtMetadata(file: string, meta: Record<string, { value?: string }> | undefined): MediaCredit | null {
  if (!meta) return null;
  const license = stripHtml(meta.LicenseShortName?.value);
  if (String(meta.NonFree?.value).toLowerCase() === 'true' || !isFreeLicense(license)) return null;
  const author = stripHtml(meta.Artist?.value) || undefined;
  const licenseUrl = stripHtml(meta.LicenseUrl?.value);
  return { sourceUrl: commonsPageUrl(file), license, ...(licenseUrl && /^https?:\/\//.test(licenseUrl) ? { licenseUrl } : {}), ...(author ? { author: author.slice(0, 200) } : {}) };
}

/** Wikipedia-ийн эхний догол мөрийг өгүүлбэрийн хил дээр тайрна (орчуулга, харуулалтад хэт урт болохоос сэргийлнэ). */
export function trimExtract(text: string, max = 600): string {
  const t = text.replace(/\s+/g, ' ').trim();
  if (t.length <= max) return t;
  const cut = t.slice(0, max);
  const end = Math.max(cut.lastIndexOf('. '), cut.lastIndexOf('! '), cut.lastIndexOf('? '));
  return end > max * 0.4 ? cut.slice(0, end + 1) : cut.replace(/\s+\S*$/, '') + '…';
}

/** Wikidata-ийн P154/P18 мэдүүлгүүдээс файлуудыг эрэмбэлнэ: preferred, дараа нь дуусах хугацаагүй (P582), дараа нь бусад. */
export function pickCommonsFiles(statements: any[] | undefined): string[] {
  const list = (statements ?? []).filter((s) => typeof s?.mainsnak?.datavalue?.value === 'string');
  const score = (s: any) => (s.rank === 'preferred' ? 0 : 1) + (s.qualifiers?.P582 ? 2 : 0);
  return list.map((s, i) => ({ f: s.mainsnak.datavalue.value as string, k: score(s) * 1000 + i })).sort((a, b) => a.k - b.k).map((x) => x.f);
}
