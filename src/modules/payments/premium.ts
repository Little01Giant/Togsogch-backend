/**
 * Premium хэсгийн агуулга (сервер талд). Бүгд хэрэглэгчийн үр дүнгээс тооцогдсон; гадны эх сурвалжгүй
 * тоо, хугацаа, сургалтын нэрийг зохиохгүй. Хугацааны хүрээ нь ерөнхий төлөвлөлтийн шошго.
 */
export interface RoadStep { text: string; href?: string; label?: string }
export interface RoadPhase { phase: string; title: string; steps: RoadStep[] }

const U = (q: string) => `/universities?${q}`;

export function premiumForResult(kind: string, r: any): { roadmap: RoadPhase[] } {
  const now: RoadStep[] = [], mid: RoadStep[] = [], later: RoadStep[] = [];
  if (kind === 'career') {
    const top = (r.careerMatches ?? [])[0];
    (r.improvements ?? []).slice(0, 4).forEach((g: any) => now.push({ text: `«${g.name}» чиглэлээр өөрийгөө хөгжүүлэх (таны үнэлгээ ${g.score}%). Сар бүр өөрийгөө дахин үнэлж ахицаа хянаарай.` }));
    (top?.subjects ?? []).slice(0, 3).forEach((s: any) => now.push({ text: `«${s.name}» хичээлдээ тогтмол цаг гарган анхаарах (ЭЕШ-д бэлтгэхэд хамаарна).` }));
    if (top) {
      mid.push({ text: `«${top.nameMn}» мэргэжлийн дэлгэрэнгүй мэдээлэлтэй танилцах.`, href: `/careers/${top.slug}`, label: 'Мэргэжлийн хуудас' });
      mid.push({ text: 'Сонирхсон улс, сургуулиудаа шүүж харьцуулах. Элсэлтийн шаардлагыг заавал сургуулийн албан ёсны хуудсаас шалгана.', href: U('degree=bachelor'), label: 'Их сургууль хайх' });
      (top.universityMajors ?? []).slice(0, 3).forEach((m: string) => mid.push({ text: `Суралцах чиглэл: ${m}.` }));
    }
    later.push({ text: 'Сонгосон сургуулиудаа Dream/Target/Safe гэж ангилж, өргөдлийн төлөвлөгөөгөө самбар дээрээ удирдах.', href: '/dashboard', label: 'Миний самбар' });
  } else if (kind === 'masters') {
    (r.knowledgeGaps ?? []).slice(0, 5).forEach((g: string) => now.push({ text: `Суурь мэдлэг нөхөх: ${g}.` }));
    const top = (r.fieldMatches ?? [])[0];
    if (top) {
      (top.competencies ?? []).slice(0, 3).forEach((c: string) => now.push({ text: `Хөгжүүлэх ур чадвар: ${c}.` }));
      mid.push({ text: `«${top.nameMn}» чиглэлийн хөтөлбөрүүдийг харьцуулах.`, href: U(`degree=master${top.uniSubject ? `&subject=${top.uniSubject}` : ''}`), label: 'Хөтөлбөр хайх' });
      if ((top.commonExams ?? []).length) mid.push({ text: `Нийтлэг шалгалтууд (${top.commonExams.join(', ')}) хөтөлбөр бүрт заавал биш — хөтөлбөрийн албан ёсны шаардлагыг шалгаж бэлтгэх.` });
    }
    later.push({ text: 'Мотивацийн захидал, CV, зөвлөмжийн захидлаа бэлтгэж, өргөдлийн хугацааг самбартаа бүртгэх.', href: '/dashboard', label: 'Өргөдлийн төлөвлөгөө' });
  } else if (kind === 'language') {
    const top = (r.countryMatches ?? [])[0];
    if (top) {
      now.push({ text: `«${top.nameMn}» улсын хэлний бэлтгэлийн хөтөлбөр, виз, зардлын албан ёсны эх сурвалжийг судлах.`, href: `/countries/${top.slug}`, label: 'Улсын хуудас' });
      mid.push({ text: 'Хэлний бэлтгэлийн сургуулиудыг харьцуулах.', href: U(`country=${top.slug}&degree=language_prep`), label: 'Сургууль хайх' });
    }
    now.push({ text: 'Сонгосон хэлний шалгалтын бэлтгэл хийх (шалгалтын байгууллагын албан ёсны хуудсаар).' });
    later.push({ text: 'Хэлний бэлтгэлийн дараа бакалавр/магистрын хөтөлбөр рүү шилжих төлөвлөгөөгөө гаргах.', href: U('degree=bachelor'), label: 'Хөтөлбөр хайх' });
  } else if (kind === 'city') {
    const top = (r.dreamCities ?? [])[0];
    const path = (r.pathways ?? [])[0];
    if (top) now.push({ text: `«${top.nameMn}» хотын сургуулиуд, виз, зардлын албан ёсны эх сурвалжийг судлах.` });
    (path?.steps ?? []).slice(0, 3).forEach((s: string) => mid.push({ text: s }));
    later.push({ text: 'Сонгосон хотууддаа тохирох сургуулиудаа хайж, өргөдлийн төлөвлөгөөгөө самбар дээрээ удирдах.', href: '/universities', label: 'Сургууль хайх' });
  }
  return { roadmap: [{ phase: 'now', title: 'Одоо — эхний саруудад', steps: now }, { phase: 'mid', title: 'Дунд хугацаанд', steps: mid }, { phase: 'later', title: 'Дараагийн шат', steps: later }].filter((p) => p.steps.length) };
}

/**
 * Төлбөр төлөөгүй үед үр дүнгийн АГУУЛГА огт буцаахгүй (оноо, мэргэжил, дүгнэлт байхгүй) —
 * зөвхөн тест дууссан гэдгийг мэдэгдэнэ. Frontend-ийн түгжээнд найдахгүй.
 */
export function lockResult(kind: string, r: any) {
  return { attemptId: r.attemptId, assessmentKey: r.assessmentKey, kind, completedAt: r.completedAt, locked: true };
}
