/**
 * Seed-ийн агуулга. АНХААР: энд зөвхөн өөрсдийн бичсэн тестийн агуулга, нэр томьёо болон
 * мэргэжлийн тохирлын загварын (редакцийн) параметр байна. Их сургууль, рейтинг, төлбөр,
 * элсэлтийн шаардлага, цалин, өсөлтийн тоон мэдээллийг ЗОХИОХГҮЙ — Admin эх сурвалжтай оруулна.
 */

import { ONET_CAREERS, ONET_SOURCE_URL, ONET_VERSION } from './careers.onet';

export const SKILLS: [string, string, string][] = [
  ['logic', 'Логик сэтгэлгээ', 'Logical reasoning'], ['math', 'Математик сэтгэлгээ', 'Mathematical reasoning'],
  ['verbal', 'Хэл ярианы чадвар', 'Verbal communication'], ['writing', 'Бичих чадвар', 'Writing'],
  ['problem', 'Асуудал шийдвэрлэх чадвар', 'Problem solving'], ['creative', 'Бүтээлч сэтгэлгээ', 'Creative thinking'],
  ['tech', 'Техник технологийн ойлголт', 'Technical understanding'], ['research', 'Судалгаа хийх чадвар', 'Research'],
  ['leadership', 'Манлайлах чадвар', 'Leadership'], ['teamwork', 'Багаар ажиллах чадвар', 'Teamwork'],
  ['decision', 'Шийдвэр гаргах чадвар', 'Decision making'], ['digital', 'Дижитал чадвар', 'Digital literacy'],
  ['critical', 'Шүүмжлэлт сэтгэлгээ', 'Critical thinking'], ['time', 'Цаг төлөвлөлт', 'Time management'],
  ['communication', 'Харилцааны чадвар', 'Communication'], ['techSpatial', 'Техник, орон зайн сэтгэлгээ', 'Technical & spatial reasoning'],
  ['abstract', 'Хийсвэр, онолын сэтгэлгээ', 'Abstract reasoning'], ['adaptability', 'Дасан зохицох чадвар', 'Adaptability'],
];

export const VALUES: [string, string][] = [
  ['income', 'Өндөр орлого'], ['stability', 'Тогтвортой ажил'], ['impact', 'Нийгэмд үзүүлэх нөлөө'], ['international', 'Олон улсад ажиллах боломж'],
  ['creative_freedom', 'Бүтээлч эрх чөлөө'], ['independence', 'Бие даасан ажиллах боломж'], ['leadership_role', 'Удирдах албан тушаал'],
  ['science', 'Судалгаа, шинжлэх ухаан'], ['balance', 'Ажил амьдралын тэнцвэр'], ['entrepreneurship', 'Бизнес эрхлэх боломж'],
];

export const WORKSTYLE: { key: string; name: string; text: string; low: string; high: string }[] = [
  { key: 'teamwork', name: 'Багаар ажиллах хандлага', text: 'Та ямар хэлбэрээр ажиллахдаа илүү таатай байдаг вэ?', low: 'Ганцаараа', high: 'Багаар' },
  { key: 'structure', name: 'Тогтмол орчны хандлага', text: 'Ямар ажлын орчинд илүү сайн ажилладаг вэ?', low: 'Өөрчлөлт ихтэй', high: 'Тогтмол, тодорхой' },
  { key: 'practical', name: 'Практик ажлын хандлага', text: 'Онолын болон практик ажлын аль нь танд илүү тохирох вэ?', low: 'Онолын', high: 'Практик' },
  { key: 'people', name: 'Хүнтэй харилцах хандлага', text: 'Ихэвчлэн хэнтэй/юутай ажиллахад таатай вэ?', low: 'Технологи, өгөгдөлтэй', high: 'Хүмүүстэй' },
  { key: 'risk', name: 'Эрсдэл хүлээх хандлага', text: 'Шийдвэр гаргахдаа эрсдэлд хэрхэн хандах вэ?', low: 'Эрсдэлээс зайлсхийх', high: 'Эрсдэл хүлээх' },
  { key: 'responsibility', name: 'Хариуцлага хүлээх хэв маяг', text: 'Ажил дээрээ ямар үүрэг хүлээх дуртай вэ?', low: 'Заавар дагах', high: 'Хариуцлага, манлайлал хүлээх' },
];

export const SUBJECTS: [string, string][] = [
  ['math', 'Математик'], ['physics', 'Физик'], ['chemistry', 'Хими'], ['biology', 'Биологи'], ['informatics', 'Мэдээлэл зүй'],
  ['mongolian', 'Монгол хэл, уран зохиол'], ['english', 'Англи хэл'], ['history', 'Түүх'], ['social', 'Нийгмийн ухаан'], ['geography', 'Газарзүй'],
  ['economics', 'Эдийн засаг'], ['art', 'Дүрслэх урлаг'], ['music', 'Хөгжим'], ['pe', 'Биеийн тамир'], ['technology', 'Технологи'],
];

const LIKERT5 = (min: string, max: string) => ({ min: 1, max: 5, minLabel: min, maxLabel: max });
const AGREE = LIKERT5('Огт санал нийлэхгүй', 'Бүрэн санал нийлнэ');

/** Тестийн асуултын сангийн хувилбар. Өөрчлөгдвөл seed шинэ хувилбар (version) нийтэлнэ; хуучин үр дүн өөрчлөгдөхгүй. */
export const CAREER_BANK_REV = '2026-11-60q-v3';

/** Likert асуулт: [түлхүүр, текст, dimension, target, урвуу эсэх] */
type L = [string, string, string, string, boolean?];

const INTEREST: L[] = [
  ['int_R1', 'Механик эд зүйлс засах, загвар угсрах эсвэл багаж хэрэгсэлтэй ажиллах надад таалагддаг.', 'interest', 'R'],
  ['int_R2', 'Оффисын ширээний ард сууснаас гадаа талбайд эсвэл лабораторид ажиллахыг илүүд үзнэ.', 'interest', 'R'],
  ['int_R3', 'Том оврын машин механизм жолоодох, тоног төхөөрөмж ажиллуулах эсвэл техник угсрах сонирхолтой.', 'interest', 'R'],
  ['int_R4', 'Ажлын өдрийн төгсгөлд өөрийн гараар хийсэн бодит, нүдэнд харагдахуйц үр дүнг харах нь надад урам өгдөг.', 'interest', 'R'],
  ['int_I1', 'Шинжлэх ухааны туршилт хийх, орчлон ертөнц хэрхэн ажилладгийг танин мэдэх нь миний сонирхлыг татдаг.', 'interest', 'I'],
  ['int_I2', 'Нарийн төвөгтэй бодлого, асуудалтай тулгарахад хариуг нь олохын тулд олон цагаар судалгаа хийхэд бэлэн байдаг.', 'interest', 'I'],
  ['int_I3', 'Нуугдмал зүй тогтлыг олохын тулд өгөгдөл, статистик эсвэл биологийн мэдээлэлд дүн шинжилгээ хийх дуртай.', 'interest', 'I'],
  ['int_I4', 'Өдөр тутмын практик ур чадвараас илүү онолын ухагдахуунуудыг судлахыг илүүд үздэг.', 'interest', 'I'],
  ['int_A1', 'Өөрийн мэдрэмж, санаа бодлыг урлаг, бичвэр эсвэл хөгжмөөр дамжуулан илэрхийлэх хүчтэй хэрэгцээг мэдэрдэг.', 'interest', 'A'],
  ['int_A2', 'Хатуу дүрэм журам дагаснаас өөрийн төсөөлөн бодох чадварыг ашиглах даалгаварт илүү дуртай.', 'interest', 'A'],
  ['int_A3', 'График дизайн, хувцас загвар эсвэл архитектур зохион бүтээх нь миний мөрөөдлийн ажил мэт санагддаг.', 'interest', 'A'],
  ['int_A4', 'Соёл урлагийн арга хэмжээ, театрын тоглолт, бүтээлч үзэсгэлэн үзэх дуртай.', 'interest', 'A'],
  ['int_S1', 'Бусдад хичээл заах, шинэ ур чадвар эзэмшихэд нь туслах нь надад утга учиртай санагддаг.', 'interest', 'S'],
  ['int_S2', 'Найзууд маань хүнд хэцүү үедээ надаас зөвлөгөө авахаар байнга ханддаг.', 'interest', 'S'],
  ['int_S3', 'Эрүүл мэнд, сэргээн засах эмчилгээ эсвэл нийгмийн ажлын чиглэлээр ажиллавал надад таалагдана.', 'interest', 'S'],
  ['int_S4', 'Миний өдөр тутмын ажил бусад хүмүүсийн сайн сайхан байдлыг шууд дээшлүүлж байх нь надад чухал.', 'interest', 'S'],
  ['int_E1', 'Багийн төслийн удирдагч байж, багийн гишүүдийнхээ үйл ажиллагааг чиглүүлэх дуртай.', 'interest', 'E'],
  ['int_E2', 'Өөрийн бизнесийг эхлүүлж, өндөр орлого олох санаа надад маш их эрч хүч өгдөг.', 'interest', 'E'],
  ['int_E3', 'Хүмүүсийг өөрийн санаанд итгүүлэх, эсвэл бүтээгдэхүүн борлуулахдаа би сайн.', 'interest', 'E'],
  ['int_E4', 'Олны өмнө үг хэлэх, мэтгэлцэх, мэргэжлийн орчинд анхаарлын төвд байх дуртай.', 'interest', 'E'],
  ['int_C1', 'Би утас, компьютер дээрх файлуудаа цэгцлэх, хичээлийн хуваарь гаргах болон ширээгээ үргэлж цэвэрхэн, эмх цэгцтэй байлгах дуртай.', 'interest', 'C'],
  ['int_C2', 'Надаас юу хүсэж байгаа нь тодорхой, алхам алхмаар хийх нарийн заавартай даалгаврыг илүүд үздэг.', 'interest', 'C'],
  ['int_C3', 'Би мөнгөө юунд зарцуулахаа нарийн тооцоолох, аливаа зүйлийн жагсаалт, бүртгэл хөтлөх эсвэл тоо баримттай ажиллах дуртай.', 'interest', 'C'],
  ['int_C4', 'Багшид даалгавраа хураалгахаас өмнө жижиг алдаа байгаа эсэхийг маш хянамгай шалгадаг.', 'interest', 'C'],
];

/** Зан төлөв (Big Five): O нээлттэй байдал, C хариуцлагатай байдал, E гадагшаа чиглэсэн байдал, A эв найртай байдал, N сэтгэл хөдлөлийн тогтворгүй байдал */
const PERSONALITY: L[] = [
  ['per_O1', 'Би амьдралын утга учрын талаар гүнзгий бодох, эсвэл дэлхийн өөр өөр улс орны өвөрмөц соёл, түүхийг судлах маш их дуртай.', 'personality', 'O'],
  ['per_O2', 'Би шинэ хобби, өвөрмөц хоол хүнс, аливаа зүйлийг хийх шинэлэг аргуудыг байнга туршиж үздэг.', 'personality', 'O'],
  ['per_O3', 'Эрс шинэчлэл хийсэн санаанаас илүү уламжлалт, шалгарсан арга барилыг ерөнхийдөө илүүд үздэг.', 'personality', 'O', true],
  ['per_O4', 'Би маш баялаг төсөөлөлтэй бөгөөд нарийн төвөгтэй ойлголтуудын талаар эргэцүүлэн бодох дуртай.', 'personality', 'O'],
  ['per_C1', 'Амрахаасаа өмнө гэрийн даалгавар эсвэл хийх ёстой ажлуудаа үргэлж түрүүлж дуусгадаг.', 'personality', 'C'],
  ['per_C2', 'Би эд зүйлсээ хаана тавьснаа мартах эсвэл уулзалт, даалгаврын хугацааг мартах тохиолдол гардаг.', 'personality', 'C', true],
  ['per_C3', 'Би хэцүү даалгавар эсвэл урт хугацааны ажил эхлүүлсэн бол дундаас нь шантарч орхилгүйгээр эцсийг нь хүртэл хичээдэг.', 'personality', 'C'],
  ['per_C4', 'Нарийн ширийн зүйлд маш анхааралтай ханддаг бөгөөд төгс биш ажил хүлээлгэж өгөх дургүй.', 'personality', 'C'],
  ['per_E1', 'Олон хүнтэй арга хэмжээнд цагийг өнгөрөөсний дараа би эрч хүчээр дүүрч, баяр баясгалантай болдог.', 'personality', 'E'],
  ['per_E2', 'Олуулаа байгаа үед шинэ хүмүүстэй танилцахдаа би ихэвчлэн яриаг түрүүлж эхлүүлдэг.', 'personality', 'E'],
  ['per_E3', 'Амралтын өдрүүдээр олон хүнтэй газраар явснаас гэртээ чимээгүй амрахыг илүүд үздэг.', 'personality', 'E', true],
  ['per_E4', 'Багийн хэлэлцүүлгийн үеэр өөрийн бодлыг дотроо хадгалах хандлагатай.', 'personality', 'E', true],
  ['per_A1', 'Найз нөхдийнхөө дунд маргаан үүсгэхгүй байж, эв найрамдлыг хадгалахыг хичээдэг.', 'personality', 'A'],
  ['per_A2', 'Хэн нэгэн ганцаардсан, гунигтай эсвэл сэтгэлээр унасан байгааг амархан мэдэрч, тайвшруулахыг оролддог.', 'personality', 'A'],
  ['per_A3', 'Ихэнх хүмүүс сайн санаатай бөгөөд тэдэнд итгэж болно гэж би боддог.', 'personality', 'A'],
  ['per_A4', 'Бусдыг бухимдуулах байсан ч өөрийнхөө зөв гэдэгт итгэвэл ширүүн маргалдахад бэлэн байдаг.', 'personality', 'A', true],
  ['per_N1', 'Ирээдүйн шалгалт, мэргэжил сонголт болон хувийн шийдвэрүүдийнхээ талаар байнга санаа зовдог.', 'personality', 'N'],
  ['per_N2', 'Нэг дор хэт олон даалгавар овоороход би амархан тэвдэж, стресст ордог.', 'personality', 'N'],
  ['per_N3', 'Маш их стресстэй эсвэл яаралтай нөхцөл байдалд ч би тайван, уужуу байж чаддаг.', 'personality', 'N', true],
  ['per_N4', 'Бүх зүйл миний төлөвлөснөөр болохгүй үед би амархан гуниглаж, урам хугардаг.', 'personality', 'N'],
];

const COGNITIVE: L[] = [
  ['cog_math1', 'Математикийн нарийн тэгшитгэл, функц эсвэл статистик загварчлалтай ажиллах дуртай.', 'skill', 'math'],
  ['cog_math2', 'Тоо болон магадлалыг цээжээр хурдан тооцоолох нь надад хялбар байдаг.', 'skill', 'math'],
  ['cog_verbal', 'Ятган үнэмшүүлэх эсээ бичих, мэтгэлцэх болон уран зохиолын нарийн утгыг ойлгохдоо би чадварлаг.', 'skill', 'verbal'],
  ['cog_language', 'Гадаад хэлийг амархан сурдаг бөгөөд өгүүлбэрийн бүтэц, дүрмийг шинжлэх дуртай.', 'skill', 'verbal'],
  ['cog_tech', 'Компьютерын кодчлол, цахилгаан хэлхээ эсвэл механик хөдөлгүүр хэрхэн ажилладгийг хурдан ойлгодог.', 'skill', 'techSpatial'],
  ['cog_spatial', '3 хэмжээст (3D) биетүүдийг дотроо хялбархан дүрслэн харж, оюун санаандаа эргүүлж өөрчилж чаддаг.', 'skill', 'techSpatial'],
  ['cog_research', 'Эдийн засаг, сэтгэл судлал эсвэл квант физик зэрэг онолын гүнзгий ойлголтуудын талаар эргэцүүлэх дуртай.', 'skill', 'abstract'],
  ['cog_logic', 'Баримтуудыг зүгээр цээжилснээс цаад үндсэн зарчмыг нь ойлгож асуудлыг шийдвэрлэхийг илүүд үздэг.', 'skill', 'abstract'],
];

const ENVIRONMENT: L[] = [
  ['env_structure', 'Уян хатан гарааны компаниас (стартап) илүү тодорхой дүрэм журамтай, нарийн бүтэцтэй орчинд ажиллахыг илүүд үздэг.', 'workstyle', 'structure'],
  ['env_team', 'Ганцаараа тусгаарлагдаж сууснаас багтайгаа хамтарч ажиллах үед би хамгийн сайн бүтээмжтэй байдаг.', 'workstyle', 'teamwork'],
];

const ADAPT: L[] = [
  ['adapt_change', 'Чухал төлөвлөгөө гэнэт өөрчлөгдөхөд би хурдан дасан зохицож, амжилтад хүрэх шинэ арга зам олдог.', 'skill', 'adaptability'],
  ['adapt_confidence', 'Мэргэжлүүдийг судалж, өөрт тохирох их сургуулийн мэргэжлээ сонгох чадвартаа би маш итгэлтэй байна.', 'personality', 'efficacy'],
];

/** Албадмал сонголт (А / Б). Сонголт бүр `dimension:target` → 0–100 жинтэй. */
const CHOICES: { key: string; text: string; a: [string, Record<string, number>]; b: [string, Record<string, number>] }[] = [
  {
    key: 'choice_security', text: 'Ирээдүйн ажлаа сонгох бол аль нөхцөлийг нь илүүд үзэх вэ?',
    a: ['Өдөр тутмын ажил нь бага зэрэг нэгэн хэвийн ч гэсэн баталгаатай цалинтай, маш тогтвортой ажил.', { 'value:stability': 100, 'value:independence': 0, 'workstyle:risk': 0 }],
    b: ['Орлого нь хэлбэлздэг ч гэсэн өөрийн дүрэм, цагийн хуваариар ажилладаг эрсдэлтэй, бие даасан ажил.', { 'value:stability': 0, 'value:independence': 100, 'workstyle:risk': 100 }],
  },
  {
    key: 'choice_motivation', text: 'Ирээдүйн карьерт тань аль үр дүн нь илүү их мотиваци өгөх вэ?',
    a: ['Өөртөө болон гэр бүлдээ хангалуун амьдрал цогцлоох өндөр орлого олох.', { 'value:income': 100, 'value:impact': 0 }],
    b: ['Зорилтот бүлгийн хүмүүсийн амьдралыг сайжруулах эсвэл байгаль орчныг хамгаалахад шууд хувь нэмэр оруулах (Нийгмийн сайн сайхан).', { 'value:income': 0, 'value:impact': 100 }],
  },
  {
    key: 'choice_role', text: 'Багийн төсөл дээр ажиллахдаа ямар үүрэг гүйцэтгэхийг илүүд үздэг вэ?',
    a: ['Ажил хуваарилж, хуваарийг хянаж, багийг зорилгод нь хүргэдэг удирдагч байх.', { 'workstyle:responsibility': 100, 'value:leadership_role': 100 }],
    b: ['Төслийн тодорхой нэг хэсгийг хамгийн өндөр чанартай хийж гүйцэтгэдэг нарийн мэргэжилтэн байх.', { 'workstyle:responsibility': 0, 'value:leadership_role': 0 }],
  },
  {
    key: 'choice_lifestyle', text: 'Урт хугацаандаа аль амьдралын хэв маяг танд илүү тохирох вэ?',
    a: ['Долоо хоногт яг 40 цаг ажиллаж, гэр бүл, хобби, эрүүл мэнддээ хангалттай чөлөөт цаг гаргах.', { 'value:balance': 100, 'value:leadership_role': 0 }],
    b: ['Албан тушаал хурдан ахих, өндөр нэр хүнд, салбартаа хүлээн зөвшөөрөгдөхийн тулд урт цагаар эрчимтэй ажиллах.', { 'value:balance': 0, 'value:leadership_role': 100 }],
  },
];

export function buildCareerAssessment() {
  const sections = [
    { key: 'interests', title: 'А. Ажил мэргэжлийн сонирхол', description: 'Дараах мэдэгдэл танд хэр тохирч байгааг 1 (огт санал нийлэхгүй) – 5 (бүрэн санал нийлнэ) хэмжүүрээр үнэлнэ үү.', order: 1 },
    { key: 'personality', title: 'Б. Хувь хүний зан төлөв', description: 'Өөрийн ердийн зан араншинд аль нь илүү ойр байгааг шударгаар үнэлнэ үү.', order: 2 },
    { key: 'cognitive', title: 'В. Танин мэдэхүй, академик хандлага', description: 'Өөрийн сурах, сэтгэх хандлагыг үнэлнэ үү. Энэ нь таны өөрийн үнэлгээ юм.', order: 3 },
    { key: 'values', title: 'Г. Хувь хүний үнэт зүйлс', description: 'А эсвэл Б сонголтоос өөрт хамгийн ойр нэгийг нь сонгоно уу.', order: 4 },
    { key: 'environment', title: 'Д. Ажлын орчин ба мотиваци', description: 'Ажлын орчны хувьд өөрт тохирохыг үнэлнэ үү.', order: 5 },
    { key: 'adaptability', title: 'Е. Дасан зохицох чадвар ба өөртөө итгэх итгэл', description: 'Сүүлийн хоёр мэдэгдлийг үнэлнэ үү.', order: 6 },
  ];
  const q: any[] = [];
  let order = 0;
  const likert = (section: string, items: L[]) => items.forEach(([key, text, dimension, target, reverse]) => q.push({
    key, section, order: order++, type: 'likert', text, required: true, scale: AGREE,
    scoring: { dimension, target, weight: 1, ...(reverse ? { reverse: true } : {}) },
  }));
  likert('interests', INTEREST);
  likert('personality', PERSONALITY);
  likert('cognitive', COGNITIVE);
  CHOICES.forEach((c) => q.push({
    key: c.key, section: 'values', order: order++, type: 'single', text: c.text, required: true,
    options: [{ key: 'a', label: c.a[0], weights: c.a[1] }, { key: 'b', label: c.b[0], weights: c.b[1] }],
    scoring: { dimension: 'value' },
  }));
  likert('environment', ENVIRONMENT);
  likert('adaptability', ADAPT);
  return { sections, questions: q };
}


/** Монгол нэрс (scoring тайлбарт ашиглана). Нэг key өөр утгатай байж болох тул (жнь math) ангилалаар тусгаарлав. */
export const STATIC_LABELS: Record<'skill' | 'subject' | 'value' | 'workstyle', Record<string, string>> = {
  skill: Object.fromEntries(SKILLS.map(([k, n]) => [k, n])),
  value: Object.fromEntries(VALUES.map(([k, n]) => [k, n])),
  workstyle: Object.fromEntries(WORKSTYLE.map((w) => [w.key, w.name])),
  subject: Object.fromEntries(SUBJECTS.map(([k, n]) => [k, n])),
};

/* ───────── Мэргэжлийн ангилал ───────── */
export const CAREER_CATEGORIES: [string, string, string][] = [
  ['technology', 'Технологи, мэдээллийн технологи', 'Technology'], ['engineering', 'Инженерчлэл', 'Engineering'],
  ['health', 'Эрүүл мэнд', 'Healthcare'], ['business', 'Бизнес, санхүү', 'Business & Finance'],
  ['creative', 'Бүтээлч, дизайн', 'Creative & Design'], ['education-social', 'Боловсрол, нийгмийн ажил', 'Education & Social'],
  ['science', 'Шинжлэх ухаан', 'Science'], ['law-public', 'Хууль, төрийн удирдлага', 'Law & Public'],
  ['agri-env', 'Хөдөө аж ахуй, байгаль орчин', 'Agriculture & Environment'],
  ['service', 'Үйлчилгээ, хоол, хувийн үйлчилгээ', 'Services'], ['transport', 'Тээвэр, нисэх, далай', 'Transportation'],
];

/* ───────── Мэргэжлүүд: O*NET 31.0 (scripts/import-onet.mjs → careers.onet.ts) ───────── */
/** Өмнөх редакцийн 33 мэргэжлийн slug — O*NET-ээр сольсон тул seed эдгээрийг устгана. */
export const LEGACY_CAREER_SLUGS = ['software-engineer', 'data-analyst', 'ai-specialist', 'cybersecurity-specialist', 'business-analyst', 'ux-ui-designer', 'mechanical-engineer', 'civil-engineer', 'electrical-engineer', 'robotics-engineer', 'physician', 'nurse', 'pharmacist', 'biotechnologist', 'environmental-scientist', 'renewable-energy-engineer', 'agricultural-technologist', 'financial-analyst', 'accountant', 'digital-marketing-specialist', 'project-manager', 'logistics-manager', 'teacher', 'psychologist', 'social-worker', 'lawyer', 'architect', 'graphic-designer', 'medical-technologist', 'cloud-engineer', 'economist', 'journalist', 'veterinarian'];

const ONET_SOURCE = {
  sourceName: `O*NET ${ONET_VERSION} Database (U.S. Department of Labor, ETA) — CC BY 4.0`, sourceUrl: ONET_SOURCE_URL, sourceType: 'labor_research',
  academicYear: ONET_VERSION, reliabilityStatus: 'secondary', verificationStatus: 'unverified',
};

export function buildCareers() {
  return ONET_CAREERS.map((c) => ({
    slug: c.slug, nameMn: c.nameMn, nameEn: c.nameEn, categorySlug: c.categorySlug, description: c.descriptionMn,
    onetCode: c.code, jobZone: c.jobZone,
    requiredSkills: [] as string[], schoolSubjects: c.subjects, universityMajors: [] as string[], recommendedCountries: [] as string[],
    status: 'published' as const,
    profile: { riasec: c.riasec, personality: c.personality, cognitive: c.cognitive, subjects: c.subjects },
    source: { ...ONET_SOURCE, fetchedAt: new Date('2026-11-02') },
  }));
}

/* ───────── Улсууд: зөвхөн нэр/код/туг. Тоон болон шаардлагын мэдээлэл ЗОХИОХГҮЙ. ───────── */
export const COUNTRIES: [string, string, string, string, string, string][] = [
  ['usa', 'US', 'АНУ', 'United States', '🇺🇸', 'Хойд Америк'], ['uk', 'GB', 'Их Британи', 'United Kingdom', '🇬🇧', 'Европ'],
  ['canada', 'CA', 'Канад', 'Canada', '🇨🇦', 'Хойд Америк'], ['australia', 'AU', 'Австрали', 'Australia', '🇦🇺', 'Далай тэнгисийн орнууд'],
  ['germany', 'DE', 'Герман', 'Germany', '🇩🇪', 'Европ'], ['france', 'FR', 'Франц', 'France', '🇫🇷', 'Европ'],
  ['italy', 'IT', 'Итали', 'Italy', '🇮🇹', 'Европ'], ['japan', 'JP', 'Япон', 'Japan', '🇯🇵', 'Ази'],
  ['south-korea', 'KR', 'Өмнөд Солонгос', 'South Korea', '🇰🇷', 'Ази'], ['china', 'CN', 'Хятад', 'China', '🇨🇳', 'Ази'],
  ['singapore', 'SG', 'Сингапур', 'Singapore', '🇸🇬', 'Ази'],
  ['finland', 'FI', 'Финлянд', 'Finland', '🇫🇮', 'Европ'], ['sweden', 'SE', 'Швед', 'Sweden', '🇸🇪', 'Европ'],
  ['new-zealand', 'NZ', 'Шинэ Зеланд', 'New Zealand', '🇳🇿', 'Далай тэнгисийн орнууд'], ['russia', 'RU', 'Орос', 'Russia', '🇷🇺', 'Европ/Ази'],
  ['czech-republic', 'CZ', 'Чех', 'Czech Republic', '🇨🇿', 'Европ'], ['poland', 'PL', 'Польш', 'Poland', '🇵🇱', 'Европ'],
  ['hungary', 'HU', 'Унгар', 'Hungary', '🇭🇺', 'Европ'],
  ['austria', 'AT', 'Австри', 'Austria', '🇦🇹', 'Европ'], ['switzerland', 'CH', 'Швейцар', 'Switzerland', '🇨🇭', 'Европ'],
  ['belgium', 'BE', 'Бельги', 'Belgium', '🇧🇪', 'Европ'], ['ireland', 'IE', 'Ирланд', 'Ireland', '🇮🇪', 'Европ'],
  ['spain', 'ES', 'Испани', 'Spain', '🇪🇸', 'Европ'],
  ['denmark', 'DK', 'Дани', 'Denmark', '🇩🇰', 'Европ'],
  ['india', 'IN', 'Энэтхэг', 'India', '🇮🇳', 'Ази'],
];
