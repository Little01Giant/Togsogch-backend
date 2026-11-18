import { ScoringContext, ScoringStrategy } from './types';

/** Зугаа цэнгээний «Зан төлөвийн тест»: хариулт бүр а/б/в/г гэсэн дөрвөн төрлийн нэгийг дэмжинэ; хамгийн олон дэмжлэг авсан төрөл нь үр дүн. */
export const PERSONA_TYPES = {
  a: {
    title: 'Хотын Хаосын Дзен Мастер',
    description: 'Та бол хотын түгжрэл, инфляц, стресс дунд экзистенциал гэгээрэлд хүрсэн ховорхон төрлийн хүн. Бусад хүмүүс дедлайнаас болж үсээ зулгааж байхад та энэ дэлхийг гүн ухааны хагас инээмсэглэлтэйгээр тольдон суудаг.',
    superpower: 'Токсик хүмүүсийн эсрэг үнэмлэхүй дархлаа. Тантай хэрэлдэх нь дэр рүү хашхирахтай л ижил.',
    weakness: 'Таны хэтэрхий тайван байдал заримдаа хариуцлагагүй мэт харагддаг. Ойр дотныхон чинь амьд байгаа эсэхийг чинь шалгах гэж судасны лугшилтыг чинь үзэх гээд байдаг.',
  },
  b: {
    title: 'Саркастик Ухаантан',
    description: 'Таны тархи бусдын логикийн алдааг олох программтай квант компьютер л гэсэн үг. Таны хошин шог мэс заслын хутга шиг хурц бөгөөд та оюуны тулаанд орох дуртай.',
    superpower: 'Хүмүүсийн багийг хуу татаж, аливаа зүйлийн мөн чанарыг шууд нэвт харах чадвар.',
    weakness: 'Та маш их шүүмжлээд сурчихсан тул хэн нэгэнд чин сэтгэлээсээ магтаал хэлэхэд хүртэл цаад хүн чинь «Намайг яг яаж доромжлоод байна аа?» гэж харддаг.',
  },
  v: {
    title: 'Партины Амин Сүнс',
    description: 'Та бол энэ дэлхийг уйтгартай байдлаас авардаг нийгмийн цавуу юм. Хаана байна, тэнд үргэлж баяр баясгалан, инээд хөөр, бас бага зэргийн хаос байдаг. Бусдыг хөгжөөхийн тулд өөрөө эвгүй байдалд орохоос ч буцдаггүй.',
    superpower: 'Хүн хоорондын харилцааны гайхалтай мэдрэмж. Та чулуун хөшөөг ч яриулж дөнгөнө.',
    weakness: '«Үгүй» гэж хэлж чаддаггүй. Үүнээсээ болоод нэгэн зэрэг 3 өөр газар очих амлалт өгөөд өөрөө өөрийгөө хүнд байдалд оруулдаг.',
  },
  g: {
    title: 'Дедлайн ба Төлөвлөгөөний Эзэн',
    description: 'Та бол Монголын эдийн засгийг нуруун дээрээ үүрч яваа хүн. Та Excel хүснэгт, төлөвлөгөө, хяналт шалгалтад нугасгүй. Гэхдээ таны хамгийн том парадокс бол зөвхөн дедлайн болохоос 2 цагийн өмнө бүрэн паникт орсон үедээ л хамгийн шилдэг үр дүнг гаргадаг.',
    superpower: 'Энгийн хүмүүсийн бүтэн 7 хоног хийх ажлыг адреналинд согтсон үедээ 3-хан цагийн дотор хийж дуусгах чадвар.',
    weakness: 'Амрахдаа хүртэл «Би зөв амарч байна уу?» гэж стресстдэг перфекционист.',
  },
} as const;
export type PersonaKey = keyof typeof PERSONA_TYPES;
const KEYS = Object.keys(PERSONA_TYPES) as PersonaKey[];

export const PERSONA_DISCLAIMER = 'Энэ бол зугаа цэнгээний тест. Шинжлэх ухааны үндэслэлтэй сэтгэл зүйн үнэлгээ биш бөгөөд мэргэжил, улс, сургууль сонгоход ашиглах ёсгүй.';

export class PersonaStrategy implements ScoringStrategy {
  key = 'persona';
  score(ctx: ScoringContext) {
    const counts: Record<PersonaKey, number> = { a: 0, b: 0, v: 0, g: 0 };
    const answered = ctx.questions.length ? ctx.questions.filter((q) => q.type === 'single').map((q) => q.key) : Object.keys(ctx.answers);
    for (const k of answered) {
      const v = ctx.answers[k];
      if (typeof v === 'string' && v in counts) counts[v as PersonaKey]++;
    }
    const total = KEYS.reduce((s, k) => s + counts[k], 0);
    const best = Math.max(...KEYS.map((k) => counts[k]));
    const leaders = KEYS.filter((k) => counts[k] === best);
    const primary = leaders[0]; // тэнцвэл а→б→в→г дарааллаар эхнийх; тэнцсэнийг `tied`-д харуулна
    const p = PERSONA_TYPES[primary];
    return {
      kind: 'persona',
      summary: leaders.length > 1 ? `${p.title} (тэнцсэн: ${leaders.slice(1).map((k) => PERSONA_TYPES[k].title).join(', ')})` : p.title,
      primary: { key: primary, ...p },
      tied: leaders.slice(1).map((k) => ({ key: k, ...PERSONA_TYPES[k] })),
      types: KEYS.map((k) => ({ key: k, title: PERSONA_TYPES[k].title, count: counts[k], percent: total ? Math.round((counts[k] / total) * 100) : 0 })),
      total,
      disclaimer: PERSONA_DISCLAIMER,
    };
  }
}
