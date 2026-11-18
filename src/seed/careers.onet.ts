/* АВТОМАТААР ҮҮССЭН — `node scripts/import-onet.mjs build`. Гараар засахгүй (дахин үүсгэхэд алдагдана); засвар хийх бол скрипт эсвэл Админ UI.
 * Эх сурвалж: O*NET 31.0 Database, U.S. Department of Labor, Employment and Training Administration (USDOL/ETA), CC BY 4.0.
 * O*NET® нь USDOL/ETA-ийн худалдааны тэмдэг. Энэ өгөгдлийг Төгсөгч нормчилж, Монгол руу орчуулсан (USDOL/ETA баталгаажуулаагүй).
 */
export const ONET_VERSION = '31.0';
export const ONET_SOURCE_URL = 'https://www.onetcenter.org/database.html';
export interface OnetCareer {
  code: string; slug: string; nameEn: string; nameMn: string; descriptionMn: string; categorySlug: string; jobZone: number;
  riasec: Record<string, number>; personality: Record<string, number>; cognitive: Record<string, number>; subjects: string[];
}
export const ONET_CAREERS: OnetCareer[] = [
 {
  "code": "11-1011.00",
  "slug": "chief-executives",
  "nameEn": "Chief Executives",
  "nameMn": "Гүйцэтгэх захирал",
  "descriptionMn": "Төлөөлөн удирдах зөвлөл болон холбогдох байгууллагын тогтоосон хүрээнд компани, төрийн болон хувийн байгууллагын бодлогыг боловсруулж, ерөнхий чиглэлийг удирдана.",
  "categorySlug": "business",
  "jobZone": 5,
  "riasec": {
   "R": 4,
   "I": 34,
   "A": 19,
   "S": 42,
   "E": 99,
   "C": 66
  },
  "personality": {
   "O": 86,
   "C": 87,
   "E": 100,
   "A": 34
  },
  "cognitive": {
   "math": 63,
   "verbal": 71,
   "techSpatial": 53,
   "abstract": 73
  },
  "subjects": [
   "informatics",
   "economics",
   "math"
  ]
 },
 {
  "code": "11-1021.00",
  "slug": "general-and-operations-managers",
  "nameEn": "General and Operations Managers",
  "nameMn": "Ерөнхий менежер, үйл ажиллагааны менежер",
  "descriptionMn": "Төрийн болон хувийн байгууллагын үйл ажиллагааг төлөвлөж, удирдан зохицуулж, олон хэлтэс, салбарыг хянана.",
  "categorySlug": "business",
  "jobZone": 4,
  "riasec": {
   "R": 20,
   "I": 23,
   "A": 5,
   "S": 40,
   "E": 100,
   "C": 72
  },
  "personality": {
   "O": 67,
   "C": 73,
   "E": 90,
   "A": 40
  },
  "cognitive": {
   "math": 49,
   "verbal": 46,
   "techSpatial": 44,
   "abstract": 41
  },
  "subjects": [
   "math",
   "economics"
  ]
 },
 {
  "code": "11-2011.00",
  "slug": "advertising-and-promotions-managers",
  "nameEn": "Advertising and Promotions Managers",
  "nameMn": "Сурталчилгаа, урамшууллын менежер",
  "descriptionMn": "Сурталчилгааны бодлого, хөтөлбөрийг төлөвлөн удирдаж, бүтээгдэхүүн, үйлчилгээнд сонирхол татах постер, уралдаан, купон зэрэг материалыг бэлтгэнэ.",
  "categorySlug": "business",
  "jobZone": 4,
  "riasec": {
   "R": 0,
   "I": 12,
   "A": 48,
   "S": 36,
   "E": 100,
   "C": 57
  },
  "personality": {
   "O": 77,
   "C": 60,
   "E": 88,
   "A": 28
  },
  "cognitive": {
   "math": 49,
   "verbal": 48,
   "techSpatial": 29,
   "abstract": 54
  },
  "subjects": [
   "informatics",
   "math"
  ]
 },
 {
  "code": "11-2021.00",
  "slug": "marketing-managers",
  "nameEn": "Marketing Managers",
  "nameMn": "Маркетингийн менежер",
  "descriptionMn": "Бүтээгдэхүүн, үйлчилгээний эрэлт, өрсөлдөгчдийг судалж, боломжит хэрэглэгчдийг тодорхойлон маркетингийн бодлого, хөтөлбөрийг удирдана.",
  "categorySlug": "business",
  "jobZone": 4,
  "riasec": {
   "R": 0,
   "I": 32,
   "A": 24,
   "S": 30,
   "E": 100,
   "C": 62
  },
  "personality": {
   "O": 83,
   "C": 57,
   "E": 85,
   "A": 29
  },
  "cognitive": {
   "math": 57,
   "verbal": 50,
   "techSpatial": 24,
   "abstract": 52
  },
  "subjects": []
 },
 {
  "code": "11-2022.00",
  "slug": "sales-managers",
  "nameEn": "Sales Managers",
  "nameMn": "Борлуулалтын менежер",
  "descriptionMn": "Бүтээгдэхүүн, үйлчилгээг хэрэглэгчид хүргэх борлуулалтын үйл ажиллагааг төлөвлөж, удирдан зохицуулна.",
  "categorySlug": "business",
  "jobZone": 4,
  "riasec": {
   "R": 8,
   "I": 11,
   "A": 6,
   "S": 40,
   "E": 100,
   "C": 76
  },
  "personality": {
   "O": 61,
   "C": 75,
   "E": 93,
   "A": 36
  },
  "cognitive": {
   "math": 61,
   "verbal": 48,
   "techSpatial": 28,
   "abstract": 49
  },
  "subjects": [
   "informatics",
   "math"
  ]
 },
 {
  "code": "11-2032.00",
  "slug": "public-relations-managers",
  "nameEn": "Public Relations Managers",
  "nameMn": "Олон нийттэй харилцах менежер",
  "descriptionMn": "Байгууллага, үйлчлүүлэгчийн олон нийтэд эерэг дүр төрхийг бий болгох, асуудлыг сурталчлах үйл ажиллагааг төлөвлөн удирдана.",
  "categorySlug": "business",
  "jobZone": 4,
  "riasec": {
   "R": 0,
   "I": 22,
   "A": 45,
   "S": 53,
   "E": 100,
   "C": 56
  },
  "personality": {
   "O": 75,
   "C": 68,
   "E": 92,
   "A": 52
  },
  "cognitive": {
   "math": 37,
   "verbal": 49,
   "techSpatial": 12,
   "abstract": 44
  },
  "subjects": [
   "social",
   "math"
  ]
 },
 {
  "code": "11-2033.00",
  "slug": "fundraising-managers",
  "nameEn": "Fundraising Managers",
  "nameMn": "Хандив цуглуулах менежер",
  "descriptionMn": "Тусгай төсөл болон ашгийн бус байгууллагад зориулсан санхүүжилт, хандив татах үйл ажиллагааг төлөвлөн удирдана.",
  "categorySlug": "business",
  "jobZone": 4,
  "riasec": {
   "R": 0,
   "I": 24,
   "A": 27,
   "S": 46,
   "E": 100,
   "C": 64
  },
  "personality": {
   "O": 64,
   "C": 78,
   "E": 85,
   "A": 51
  },
  "cognitive": {
   "math": 52,
   "verbal": 51,
   "techSpatial": 11,
   "abstract": 36
  },
  "subjects": [
   "math"
  ]
 },
 {
  "code": "11-3012.00",
  "slug": "administrative-services-managers",
  "nameEn": "Administrative Services Managers",
  "nameMn": "Захиргааны үйлчилгээний менежер",
  "descriptionMn": "Бичиг хэрэг, мэдээллийн удирдлага, шуудан түгээлт зэрэг байгууллагын захиргааны үйлчилгээг төлөвлөн удирдана.",
  "categorySlug": "business",
  "jobZone": 3,
  "riasec": {
   "R": 7,
   "I": 19,
   "A": 2,
   "S": 46,
   "E": 91,
   "C": 88
  },
  "personality": {
   "O": 45,
   "C": 47,
   "E": 64,
   "A": 43
  },
  "cognitive": {
   "math": 41,
   "verbal": 45,
   "techSpatial": 43,
   "abstract": 35
  },
  "subjects": [
   "informatics",
   "math"
  ]
 },
 {
  "code": "11-3013.00",
  "slug": "facilities-managers",
  "nameEn": "Facilities Managers",
  "nameMn": "Байр, барилгын үйл ажиллагааны менежер",
  "descriptionMn": "Барилга, байгууламжийн ашиглалт, үйл ажиллагааг төлөвлөн удирдаж зохицуулна.",
  "categorySlug": "business",
  "jobZone": 3,
  "riasec": {
   "R": 53,
   "I": 27,
   "A": 10,
   "S": 43,
   "E": 73,
   "C": 73
  },
  "personality": {
   "O": 52,
   "C": 61,
   "E": 70,
   "A": 37
  },
  "cognitive": {
   "math": 41,
   "verbal": 42,
   "techSpatial": 71,
   "abstract": 41
  },
  "subjects": [
   "social",
   "informatics"
  ]
 },
 {
  "code": "11-3013.01",
  "slug": "security-managers",
  "nameEn": "Security Managers",
  "nameMn": "Аюулгүй байдлын менежер",
  "descriptionMn": "Ажилтан, барилга байгууламжийн биет аюулгүй байдал зэрэг байгууллагын хамгаалалтын чиг үүргийг удирдана.",
  "categorySlug": "business",
  "jobZone": 4,
  "riasec": {
   "R": 40,
   "I": 45,
   "A": 5,
   "S": 29,
   "E": 77,
   "C": 74
  },
  "personality": {
   "O": 58,
   "C": 83,
   "E": 71,
   "A": 35
  },
  "cognitive": {
   "math": 45,
   "verbal": 47,
   "techSpatial": 61,
   "abstract": 47
  },
  "subjects": [
   "informatics",
   "social",
   "geography"
  ]
 },
 {
  "code": "11-3021.00",
  "slug": "computer-and-information-systems-managers",
  "nameEn": "Computer and Information Systems Managers",
  "nameMn": "Компьютер, мэдээллийн системийн менежер",
  "descriptionMn": "Мэдээлэл боловсруулалт, мэдээллийн систем, системийн шинжилгээ, програмчлалын чиглэлийн үйл ажиллагааг төлөвлөн удирдана.",
  "categorySlug": "business",
  "jobZone": 4,
  "riasec": {
   "R": 28,
   "I": 58,
   "A": 8,
   "S": 23,
   "E": 68,
   "C": 82
  },
  "personality": {
   "O": 84,
   "C": 74,
   "E": 76,
   "A": 41
  },
  "cognitive": {
   "math": 49,
   "verbal": 55,
   "techSpatial": 44,
   "abstract": 44
  },
  "subjects": [
   "informatics",
   "math",
   "technology"
  ]
 },
 {
  "code": "11-3031.00",
  "slug": "financial-managers",
  "nameEn": "Financial Managers",
  "nameMn": "Санхүүгийн менежер",
  "descriptionMn": "Байгууллагын салбар, хэлтсийн нягтлан бодох бүртгэл, хөрөнгө оруулалт, банк, даатгал зэрэг санхүүгийн үйл ажиллагааг төлөвлөн удирдана.",
  "categorySlug": "business",
  "jobZone": 4,
  "riasec": {
   "R": 6,
   "I": 24,
   "A": 10,
   "S": 34,
   "E": 100,
   "C": 76
  },
  "personality": {
   "O": 61,
   "C": 80,
   "E": 77,
   "A": 37
  },
  "cognitive": {
   "math": 67,
   "verbal": 59,
   "techSpatial": 19,
   "abstract": 56
  },
  "subjects": [
   "economics",
   "math",
   "informatics"
  ]
 },
 {
  "code": "11-3031.01",
  "slug": "treasurers-and-controllers",
  "nameEn": "Treasurers and Controllers",
  "nameMn": "Төрийн сан, санхүүгийн хяналтын менежер",
  "descriptionMn": "Байгууллагын төлөвлөлт, худалдан авалт, хөрөнгө оруулалт зэрэг санхүүгийн үйл ажиллагааг удирдана.",
  "categorySlug": "business",
  "jobZone": 4,
  "riasec": {
   "R": 0,
   "I": 20,
   "A": 3,
   "S": 28,
   "E": 86,
   "C": 91
  },
  "personality": {
   "O": 62,
   "C": 91,
   "E": 72,
   "A": 28
  },
  "cognitive": {
   "math": 77,
   "verbal": 61,
   "techSpatial": 20,
   "abstract": 68
  },
  "subjects": [
   "economics",
   "math",
   "informatics"
  ]
 },
 {
  "code": "11-3031.03",
  "slug": "investment-fund-managers",
  "nameEn": "Investment Fund Managers",
  "nameMn": "Хөрөнгө оруулалтын сангийн менежер",
  "descriptionMn": "Институцийн болон хувь хөрөнгө оруулагчдын их хэмжээний хөрвөх хөрөнгийн хөрөнгө оруулалтын стратеги, үйл ажиллагааг удирдана.",
  "categorySlug": "business",
  "jobZone": 5,
  "riasec": {
   "R": 8,
   "I": 46,
   "A": 11,
   "S": 28,
   "E": 99,
   "C": 70
  },
  "personality": {
   "O": 80,
   "C": 99,
   "E": 74,
   "A": 15
  },
  "cognitive": {
   "math": 72,
   "verbal": 55,
   "techSpatial": 18,
   "abstract": 57
  },
  "subjects": [
   "economics",
   "math",
   "social"
  ]
 },
 {
  "code": "11-3051.00",
  "slug": "industrial-production-managers",
  "nameEn": "Industrial Production Managers",
  "nameMn": "Үйлдвэрлэлийн менежер",
  "descriptionMn": "Өртөг, чанар, тоо хэмжээний шаардлагын дагуу бүтээгдэхүүн үйлдвэрлэх ажил, нөөцийг төлөвлөн удирдана.",
  "categorySlug": "business",
  "jobZone": 4,
  "riasec": {
   "R": 50,
   "I": 32,
   "A": 7,
   "S": 14,
   "E": 84,
   "C": 70
  },
  "personality": {
   "O": 57,
   "C": 79,
   "E": 76,
   "A": 38
  },
  "cognitive": {
   "math": 57,
   "verbal": 47,
   "techSpatial": 58,
   "abstract": 55
  },
  "subjects": [
   "technology",
   "math",
   "informatics"
  ]
 },
 {
  "code": "11-3051.01",
  "slug": "quality-control-systems-managers",
  "nameEn": "Quality Control Systems Managers",
  "nameMn": "Чанарын хяналтын системийн менежер",
  "descriptionMn": "Чанарын баталгааны хөтөлбөрийг төлөвлөж, лаборатори болон үйлдвэрлэлийн чанарыг хянах бодлогыг боловсруулна.",
  "categorySlug": "business",
  "jobZone": 4,
  "riasec": {
   "R": 43,
   "I": 52,
   "A": 5,
   "S": 18,
   "E": 68,
   "C": 74
  },
  "personality": {
   "O": 54,
   "C": 93,
   "E": 70,
   "A": 41
  },
  "cognitive": {
   "math": 52,
   "verbal": 49,
   "techSpatial": 46,
   "abstract": 54
  },
  "subjects": [
   "chemistry",
   "math",
   "technology"
  ]
 },
 {
  "code": "11-3061.00",
  "slug": "purchasing-managers",
  "nameEn": "Purchasing Managers",
  "nameMn": "Худалдан авалтын менежер",
  "descriptionMn": "Материал, бүтээгдэхүүн, үйлчилгээ худалдан авдаг ажилтнуудын үйл ажиллагааг төлөвлөн удирдана.",
  "categorySlug": "business",
  "jobZone": 4,
  "riasec": {
   "R": 25,
   "I": 13,
   "A": 3,
   "S": 28,
   "E": 100,
   "C": 83
  },
  "personality": {
   "O": 53,
   "C": 71,
   "E": 75,
   "A": 36
  },
  "cognitive": {
   "math": 58,
   "verbal": 46,
   "techSpatial": 28,
   "abstract": 47
  },
  "subjects": [
   "informatics",
   "math",
   "social"
  ]
 },
 {
  "code": "11-3071.00",
  "slug": "transportation-storage-and-distribution-managers",
  "nameEn": "Transportation, Storage, and Distribution Managers",
  "nameMn": "Тээвэр, агуулах, түгээлтийн менежер",
  "descriptionMn": "Байгууллагын бодлого, хууль тогтоомжийн дагуу тээвэр, хадгалалт, түгээлтийн үйл ажиллагааг төлөвлөн удирдана.",
  "categorySlug": "business",
  "jobZone": 4,
  "riasec": {
   "R": 43,
   "I": 27,
   "A": 0,
   "S": 23,
   "E": 83,
   "C": 79
  },
  "personality": {
   "O": 57,
   "C": 76,
   "E": 74,
   "A": 38
  },
  "cognitive": {
   "math": 47,
   "verbal": 41,
   "techSpatial": 48,
   "abstract": 38
  },
  "subjects": [
   "math",
   "informatics",
   "economics"
  ]
 },
 {
  "code": "11-3071.04",
  "slug": "supply-chain-managers",
  "nameEn": "Supply Chain Managers",
  "nameMn": "Нийлүүлэлтийн сүлжээний менежер",
  "descriptionMn": "Зардлыг бууруулж, нарийвчлал, үйлчилгээ, аюулгүй байдлыг сайжруулахын тулд үйлдвэрлэл, худалдан авалт, агуулах, түгээлтийг удирдана.",
  "categorySlug": "business",
  "jobZone": 4,
  "riasec": {
   "R": 40,
   "I": 24,
   "A": 0,
   "S": 17,
   "E": 87,
   "C": 71
  },
  "personality": {
   "O": 67,
   "C": 76,
   "E": 71,
   "A": 35
  },
  "cognitive": {
   "math": 54,
   "verbal": 48,
   "techSpatial": 43,
   "abstract": 48
  },
  "subjects": [
   "math",
   "informatics",
   "economics"
  ]
 },
 {
  "code": "11-3111.00",
  "slug": "compensation-and-benefits-managers",
  "nameEn": "Compensation and Benefits Managers",
  "nameMn": "Цалин хөлс, урамшууллын менежер",
  "descriptionMn": "Байгууллагын цалин хөлс, нэмэгдэл, урамшууллын үйл ажиллагааг төлөвлөн удирдана.",
  "categorySlug": "business",
  "jobZone": 4,
  "riasec": {
   "R": 0,
   "I": 20,
   "A": 7,
   "S": 47,
   "E": 100,
   "C": 78
  },
  "personality": {
   "O": 58,
   "C": 68,
   "E": 68,
   "A": 45
  },
  "cognitive": {
   "math": 55,
   "verbal": 49,
   "techSpatial": 8,
   "abstract": 32
  },
  "subjects": [
   "math",
   "economics",
   "informatics"
  ]
 },
 {
  "code": "11-3121.00",
  "slug": "human-resources-managers",
  "nameEn": "Human Resources Managers",
  "nameMn": "Хүний нөөцийн менежер",
  "descriptionMn": "Байгууллагын хүний нөөцийн үйл ажиллагаа, ажилтнуудыг төлөвлөн удирдана.",
  "categorySlug": "business",
  "jobZone": 4,
  "riasec": {
   "R": 4,
   "I": 22,
   "A": 8,
   "S": 48,
   "E": 100,
   "C": 76
  },
  "personality": {
   "O": 56,
   "C": 67,
   "E": 82,
   "A": 68
  },
  "cognitive": {
   "math": 53,
   "verbal": 54,
   "techSpatial": 17,
   "abstract": 52
  },
  "subjects": [
   "math",
   "informatics",
   "social"
  ]
 },
 {
  "code": "11-3131.00",
  "slug": "training-and-development-managers",
  "nameEn": "Training and Development Managers",
  "nameMn": "Сургалт, хөгжлийн менежер",
  "descriptionMn": "Байгууллагын сургалт, хөгжлийн үйл ажиллагаа, ажилтнуудыг төлөвлөн удирдана.",
  "categorySlug": "business",
  "jobZone": 4,
  "riasec": {
   "R": 15,
   "I": 34,
   "A": 26,
   "S": 76,
   "E": 89,
   "C": 51
  },
  "personality": {
   "O": 81,
   "C": 67,
   "E": 81,
   "A": 62
  },
  "cognitive": {
   "math": 42,
   "verbal": 58,
   "techSpatial": 18,
   "abstract": 48
  },
  "subjects": [
   "informatics",
   "social"
  ]
 },
 {
  "code": "11-9013.00",
  "slug": "farmers-ranchers-and-other-agricultural-managers",
  "nameEn": "Farmers, Ranchers, and Other Agricultural Managers",
  "nameMn": "Тариаланч, малчин, хөдөө аж ахуйн менежер",
  "descriptionMn": "Ферм, мал аж ахуй, дулаан хүлэмж, загасны аж ахуй, нөөц ой зэрэг хөдөө аж ахуйн үйл ажиллагааг төлөвлөн удирдана.",
  "categorySlug": "business",
  "jobZone": 4,
  "riasec": {
   "R": 69,
   "I": 29,
   "A": 1,
   "S": 27,
   "E": 75,
   "C": 59
  },
  "personality": {
   "O": 58,
   "C": 72,
   "E": 68,
   "A": 24
  },
  "cognitive": {
   "math": 53,
   "verbal": 46,
   "techSpatial": 72,
   "abstract": 55
  },
  "subjects": [
   "biology",
   "math",
   "chemistry"
  ]
 },
 {
  "code": "11-9021.00",
  "slug": "construction-managers",
  "nameEn": "Construction Managers",
  "nameMn": "Барилгын менежер",
  "descriptionMn": "Барилга байгууламж, системийн барилга болон засвар үйлчилгээний ажлыг, ихэвчлэн дэд ажилтнуудаар дамжуулан төлөвлөн удирдана.",
  "categorySlug": "business",
  "jobZone": 4,
  "riasec": {
   "R": 61,
   "I": 36,
   "A": 12,
   "S": 23,
   "E": 79,
   "C": 63
  },
  "personality": {
   "O": 57,
   "C": 79,
   "E": 81,
   "A": 40
  },
  "cognitive": {
   "math": 61,
   "verbal": 52,
   "techSpatial": 89,
   "abstract": 58
  },
  "subjects": [
   "technology",
   "math",
   "informatics"
  ]
 },
 {
  "code": "11-9031.00",
  "slug": "education-and-childcare-administrators-preschool-and-daycare",
  "nameEn": "Education and Childcare Administrators, Preschool and Daycare",
  "nameMn": "Цэцэрлэг, хүүхдийн төвийн захирал",
  "descriptionMn": "Цэцэрлэг, хүүхэд харах төвийн сургалт болон сургалтын бус үйл ажиллагааг төлөвлөн удирдана.",
  "categorySlug": "business",
  "jobZone": 4,
  "riasec": {
   "R": 3,
   "I": 32,
   "A": 30,
   "S": 91,
   "E": 64,
   "C": 59
  },
  "personality": {
   "O": 58,
   "C": 64,
   "E": 80,
   "A": 74
  },
  "cognitive": {
   "math": 49,
   "verbal": 48,
   "techSpatial": 24,
   "abstract": 41
  },
  "subjects": [
   "economics",
   "social",
   "informatics"
  ]
 },
 {
  "code": "11-9032.00",
  "slug": "education-administrators-kindergarten-through-secondary",
  "nameEn": "Education Administrators, Kindergarten through Secondary",
  "nameMn": "Ерөнхий боловсролын сургуулийн захирал, менежер",
  "descriptionMn": "Цэцэрлэгээс ерөнхий боловсролын сургууль хүртэлх байгууллагын сургалт, захиргаа, туслах үйл ажиллагааг удирдана.",
  "categorySlug": "business",
  "jobZone": 5,
  "riasec": {
   "R": 5,
   "I": 34,
   "A": 31,
   "S": 79,
   "E": 72,
   "C": 61
  },
  "personality": {
   "O": 73,
   "C": 75,
   "E": 92,
   "A": 64
  },
  "cognitive": {
   "math": 55,
   "verbal": 75,
   "techSpatial": 21,
   "abstract": 62
  },
  "subjects": [
   "informatics",
   "social",
   "math"
  ]
 },
 {
  "code": "11-9041.00",
  "slug": "architectural-and-engineering-managers",
  "nameEn": "Architectural and Engineering Managers",
  "nameMn": "Архитектур, инженерийн менежер",
  "descriptionMn": "Архитектур, инженерчлэл болон тэдгээрийн судалгаа, хөгжүүлэлтийн үйл ажиллагааг төлөвлөн удирдана.",
  "categorySlug": "business",
  "jobZone": 5,
  "riasec": {
   "R": 33,
   "I": 59,
   "A": 27,
   "S": 33,
   "E": 90,
   "C": 57
  },
  "personality": {
   "O": 82,
   "C": 73,
   "E": 82,
   "A": 40
  },
  "cognitive": {
   "math": 69,
   "verbal": 67,
   "techSpatial": 70,
   "abstract": 58
  },
  "subjects": [
   "technology",
   "math",
   "informatics"
  ]
 },
 {
  "code": "11-9072.00",
  "slug": "entertainment-and-recreation-managers-except-gambling",
  "nameEn": "Entertainment and Recreation Managers, Except Gambling",
  "nameMn": "Зугаа цэнгэл, амралт чөлөөт цагийн менежер",
  "descriptionMn": "Амралт чөлөөт цагийн байгууламж, зугаа цэнгэлийн үйл ажиллагааг төлөвлөн удирдана.",
  "categorySlug": "business",
  "jobZone": 4,
  "riasec": {
   "R": 39,
   "I": 16,
   "A": 16,
   "S": 49,
   "E": 88,
   "C": 67
  },
  "personality": {
   "O": 53,
   "C": 51,
   "E": 79,
   "A": 51
  },
  "cognitive": {
   "math": 46,
   "verbal": 39,
   "techSpatial": 27,
   "abstract": 31
  },
  "subjects": []
 },
 {
  "code": "11-9081.00",
  "slug": "lodging-managers",
  "nameEn": "Lodging Managers",
  "nameMn": "Зочид буудлын менежер",
  "descriptionMn": "Байр, амралтын үйлчилгээ үзүүлдэг байгууллага, хэлтсийн үйл ажиллагааг төлөвлөн удирдана.",
  "categorySlug": "business",
  "jobZone": 4,
  "riasec": {
   "R": 28,
   "I": 2,
   "A": 7,
   "S": 55,
   "E": 87,
   "C": 70
  },
  "personality": {
   "O": 45,
   "C": 64,
   "E": 80,
   "A": 58
  },
  "cognitive": {
   "math": 43,
   "verbal": 45,
   "techSpatial": 51,
   "abstract": 32
  },
  "subjects": [
   "informatics",
   "math",
   "social"
  ]
 },
 {
  "code": "11-9111.00",
  "slug": "medical-and-health-services-managers",
  "nameEn": "Medical and Health Services Managers",
  "nameMn": "Эрүүл мэндийн үйлчилгээний менежер",
  "descriptionMn": "Эмнэлэг, клиник, нийгмийн эрүүл мэндийн байгууллагын эмнэлгийн болон эрүүл мэндийн үйлчилгээг төлөвлөн удирдана.",
  "categorySlug": "business",
  "jobZone": 4,
  "riasec": {
   "R": 17,
   "I": 46,
   "A": 8,
   "S": 57,
   "E": 83,
   "C": 70
  },
  "personality": {
   "O": 72,
   "C": 85,
   "E": 88,
   "A": 62
  },
  "cognitive": {
   "math": 55,
   "verbal": 56,
   "techSpatial": 28,
   "abstract": 44
  },
  "subjects": [
   "informatics",
   "math",
   "economics"
  ]
 },
 {
  "code": "11-9121.00",
  "slug": "natural-sciences-managers",
  "nameEn": "Natural Sciences Managers",
  "nameMn": "Байгалийн ухааны судалгааны менежер",
  "descriptionMn": "Амьд байгаль, физик, математик, статистикийн салбарын судалгаа, хөгжүүлэлтийн үйл ажиллагааг төлөвлөн удирдана.",
  "categorySlug": "business",
  "jobZone": 5,
  "riasec": {
   "R": 29,
   "I": 81,
   "A": 24,
   "S": 35,
   "E": 77,
   "C": 54
  },
  "personality": {
   "O": 93,
   "C": 80,
   "E": 81,
   "A": 41
  },
  "cognitive": {
   "math": 66,
   "verbal": 74,
   "techSpatial": 47,
   "abstract": 75
  },
  "subjects": [
   "biology",
   "informatics",
   "math"
  ]
 },
 {
  "code": "11-9121.01",
  "slug": "clinical-research-coordinators",
  "nameEn": "Clinical Research Coordinators",
  "nameMn": "Эмнэлзүйн судалгааны зохицуулагч",
  "descriptionMn": "Эмнэлзүйн судалгааны төслийг төлөвлөж, протокол, зорилтыг биелүүлэх ажилтнуудын үйл ажиллагааг удирдана.",
  "categorySlug": "business",
  "jobZone": 4,
  "riasec": {
   "R": 10,
   "I": 82,
   "A": 13,
   "S": 43,
   "E": 55,
   "C": 63
  },
  "personality": {
   "O": 69,
   "C": 83,
   "E": 65,
   "A": 63
  },
  "cognitive": {
   "math": 48,
   "verbal": 51,
   "techSpatial": 24,
   "abstract": 47
  },
  "subjects": []
 },
 {
  "code": "11-9141.00",
  "slug": "property-real-estate-and-community-association-managers",
  "nameEn": "Property, Real Estate, and Community Association Managers",
  "nameMn": "Үл хөдлөх хөрөнгийн менежер",
  "descriptionMn": "Үйлдвэр, худалдааны болон оршин суух үл хөдлөх хөрөнгийн худалдаа, түрээс, удирдлагын үйл ажиллагааг төлөвлөн удирдана.",
  "categorySlug": "business",
  "jobZone": 4,
  "riasec": {
   "R": 38,
   "I": 18,
   "A": 12,
   "S": 42,
   "E": 95,
   "C": 71
  },
  "personality": {
   "O": 48,
   "C": 65,
   "E": 78,
   "A": 42
  },
  "cognitive": {
   "math": 49,
   "verbal": 47,
   "techSpatial": 43,
   "abstract": 32
  },
  "subjects": [
   "economics",
   "math",
   "informatics"
  ]
 },
 {
  "code": "11-9151.00",
  "slug": "social-and-community-service-managers",
  "nameEn": "Social and Community Service Managers",
  "nameMn": "Нийгмийн үйлчилгээний менежер",
  "descriptionMn": "Нийгмийн үйлчилгээний хөтөлбөр, олон нийтэд хүрэх байгууллагын үйл ажиллагааг төлөвлөн удирдана.",
  "categorySlug": "business",
  "jobZone": 4,
  "riasec": {
   "R": 0,
   "I": 19,
   "A": 24,
   "S": 74,
   "E": 100,
   "C": 54
  },
  "personality": {
   "O": 61,
   "C": 64,
   "E": 84,
   "A": 73
  },
  "cognitive": {
   "math": 55,
   "verbal": 55,
   "techSpatial": 26,
   "abstract": 47
  },
  "subjects": [
   "social",
   "math",
   "informatics"
  ]
 },
 {
  "code": "11-9161.00",
  "slug": "emergency-management-directors",
  "nameEn": "Emergency Management Directors",
  "nameMn": "Онцгой байдлын удирдагч",
  "descriptionMn": "Гамшгийн хариу арга хэмжээ, хямралын удирдлагыг төлөвлөн удирдаж, бэлэн байдлын сургалт хийж, онцгой байдлын төлөвлөгөө боловсруулна.",
  "categorySlug": "business",
  "jobZone": 4,
  "riasec": {
   "R": 42,
   "I": 58,
   "A": 14,
   "S": 50,
   "E": 68,
   "C": 62
  },
  "personality": {
   "O": 80,
   "C": 90,
   "E": 91,
   "A": 58
  },
  "cognitive": {
   "math": 47,
   "verbal": 56,
   "techSpatial": 65,
   "abstract": 59
  },
  "subjects": [
   "informatics",
   "social",
   "geography"
  ]
 },
 {
  "code": "11-9171.00",
  "slug": "funeral-home-managers",
  "nameEn": "Funeral Home Managers",
  "nameMn": "Оршуулгын газрын менежер",
  "descriptionMn": "Оршуулгын газрын үйлчилгээ, нөөцийг төлөвлөн удирдана.",
  "categorySlug": "business",
  "jobZone": 3,
  "riasec": {
   "R": 30,
   "I": 22,
   "A": 15,
   "S": 56,
   "E": 90,
   "C": 59
  },
  "personality": {
   "O": 43,
   "C": 69,
   "E": 77,
   "A": 86
  },
  "cognitive": {
   "math": 46,
   "verbal": 43,
   "techSpatial": 47,
   "abstract": 20
  },
  "subjects": [
   "social",
   "informatics",
   "biology"
  ]
 },
 {
  "code": "11-9179.01",
  "slug": "fitness-and-wellness-coordinators",
  "nameEn": "Fitness and Wellness Coordinators",
  "nameMn": "Фитнес, эрүүл мэндийн зохицуулагч",
  "descriptionMn": "Фитнес болон эрүүл мэндийн хөтөлбөр, үйлчилгээг удирдан зохицуулна.",
  "categorySlug": "business",
  "jobZone": 4,
  "riasec": {
   "R": 37,
   "I": 28,
   "A": 19,
   "S": 76,
   "E": 74,
   "C": 44
  },
  "personality": {
   "O": 52,
   "C": 54,
   "E": 80,
   "A": 57
  },
  "cognitive": {
   "math": 43,
   "verbal": 45,
   "techSpatial": 35,
   "abstract": 41
  },
  "subjects": [
   "social",
   "informatics"
  ]
 },
 {
  "code": "11-9179.02",
  "slug": "spa-managers",
  "nameEn": "Spa Managers",
  "nameMn": "Спа-гийн менежер",
  "descriptionMn": "Спа байгууламжийн үйл ажиллагаа, хөтөлбөр, ажилтны хуваарь, санхүүг төлөвлөн удирдана.",
  "categorySlug": "business",
  "jobZone": 3,
  "riasec": {
   "R": 25,
   "I": 5,
   "A": 14,
   "S": 53,
   "E": 100,
   "C": 65
  },
  "personality": {
   "O": 50,
   "C": 59,
   "E": 79,
   "A": 58
  },
  "cognitive": {
   "math": 50,
   "verbal": 41,
   "techSpatial": 18,
   "abstract": 33
  },
  "subjects": [
   "math",
   "economics"
  ]
 },
 {
  "code": "11-9199.01",
  "slug": "regulatory-affairs-managers",
  "nameEn": "Regulatory Affairs Managers",
  "nameMn": "Зохицуулалтын асуудал хариуцсан менежер",
  "descriptionMn": "Байгууллагын үйлдвэрлэлийн үйл ажиллагаа хууль журам, стандарт ажиллагааны дүрэмд нийцэж байгааг хангана.",
  "categorySlug": "business",
  "jobZone": 4,
  "riasec": {
   "R": 16,
   "I": 33,
   "A": 6,
   "S": 27,
   "E": 93,
   "C": 78
  },
  "personality": {
   "O": 64,
   "C": 92,
   "E": 68,
   "A": 40
  },
  "cognitive": {
   "math": 40,
   "verbal": 49,
   "techSpatial": 25,
   "abstract": 42
  },
  "subjects": [
   "social",
   "biology",
   "chemistry"
  ]
 },
 {
  "code": "11-9199.08",
  "slug": "loss-prevention-managers",
  "nameEn": "Loss Prevention Managers",
  "nameMn": "Алдагдлаас сэргийлэх менежер",
  "descriptionMn": "Хөрөнгийн алдагдлаас урьдчилан сэргийлэх бодлого, журам, системийг төлөвлөн удирдана.",
  "categorySlug": "business",
  "jobZone": 4,
  "riasec": {
   "R": 41,
   "I": 44,
   "A": 0,
   "S": 31,
   "E": 77,
   "C": 81
  },
  "personality": {
   "O": 49,
   "C": 89,
   "E": 69,
   "A": 17
  },
  "cognitive": {
   "math": 47,
   "verbal": 45,
   "techSpatial": 39,
   "abstract": 39
  },
  "subjects": [
   "social",
   "math",
   "informatics"
  ]
 },
 {
  "code": "13-1011.00",
  "slug": "agents-and-business-managers-of-artists-performers-and-athletes",
  "nameEn": "Agents and Business Managers of Artists, Performers, and Athletes",
  "nameMn": "Уран бүтээлч, тамирчдын агент, менежер",
  "descriptionMn": "Уран бүтээлч, тоглогч, тамирчдыг ажил олгогчтой харилцахад төлөөлж, сурталчилна.",
  "categorySlug": "business",
  "jobZone": 4,
  "riasec": {
   "R": 0,
   "I": 13,
   "A": 43,
   "S": 52,
   "E": 91,
   "C": 46
  },
  "personality": {
   "O": 63,
   "C": 70,
   "E": 88,
   "A": 31
  },
  "cognitive": {
   "math": 36,
   "verbal": 47,
   "techSpatial": 13,
   "abstract": 38
  },
  "subjects": [
   "informatics",
   "art",
   "math"
  ]
 },
 {
  "code": "13-1021.00",
  "slug": "buyers-and-purchasing-agents-farm-products",
  "nameEn": "Buyers and Purchasing Agents, Farm Products",
  "nameMn": "Хөдөө аж ахуйн бүтээгдэхүүний худалдан авагч",
  "descriptionMn": "Боловсруулах эсвэл дахин борлуулах зорилгоор хөдөө аж ахуйн бүтээгдэхүүн худалдан авна.",
  "categorySlug": "business",
  "jobZone": 4,
  "riasec": {
   "R": 59,
   "I": 14,
   "A": 1,
   "S": 12,
   "E": 65,
   "C": 63
  },
  "personality": {
   "O": 47,
   "C": 56,
   "E": 61,
   "A": 34
  },
  "cognitive": {
   "math": 48,
   "verbal": 41,
   "techSpatial": 24,
   "abstract": 26
  },
  "subjects": [
   "math",
   "economics"
  ]
 },
 {
  "code": "13-1022.00",
  "slug": "wholesale-and-retail-buyers-except-farm-products",
  "nameEn": "Wholesale and Retail Buyers, Except Farm Products",
  "nameMn": "Бөөний болон жижиглэнгийн худалдан авагч",
  "descriptionMn": "Хөдөө аж ахуйн бус бараа, түүхий эдийг бөөнөөр эсвэл жижиглэнгээр борлуулахаар худалдан авна.",
  "categorySlug": "business",
  "jobZone": 3,
  "riasec": {
   "R": 40,
   "I": 15,
   "A": 9,
   "S": 24,
   "E": 71,
   "C": 70
  },
  "personality": {
   "O": 57,
   "C": 58,
   "E": 65,
   "A": 28
  },
  "cognitive": {
   "math": 54,
   "verbal": 42,
   "techSpatial": 22,
   "abstract": 42
  },
  "subjects": [
   "math",
   "informatics"
  ]
 },
 {
  "code": "13-1023.00",
  "slug": "purchasing-agents-except-wholesale-retail-and-farm-products",
  "nameEn": "Purchasing Agents, Except Wholesale, Retail, and Farm Products",
  "nameMn": "Худалдан авалтын ажилтан",
  "descriptionMn": "Байгууллагын үйл ажиллагаанд шаардлагатай машин, тоног төхөөрөмж, багаж, сэлбэг, үйлчилгээг худалдан авна.",
  "categorySlug": "business",
  "jobZone": 4,
  "riasec": {
   "R": 42,
   "I": 14,
   "A": 3,
   "S": 16,
   "E": 68,
   "C": 78
  },
  "personality": {
   "O": 52,
   "C": 65,
   "E": 61,
   "A": 36
  },
  "cognitive": {
   "math": 48,
   "verbal": 45,
   "techSpatial": 30,
   "abstract": 48
  },
  "subjects": [
   "social",
   "math",
   "informatics"
  ]
 },
 {
  "code": "13-1031.00",
  "slug": "claims-adjusters-examiners-and-investigators",
  "nameEn": "Claims Adjusters, Examiners, and Investigators",
  "nameMn": "Даатгалын нөхөн төлбөрийн шинжээч, мөрдөгч",
  "descriptionMn": "Шийдвэрлэсэн нөхөн төлбөр компанийн журамд нийцэж байгааг шалгаж, нөхөн төлбөр, тооцоог хянана.",
  "categorySlug": "business",
  "jobZone": 4,
  "riasec": {
   "R": 4,
   "I": 42,
   "A": 0,
   "S": 27,
   "E": 63,
   "C": 87
  },
  "personality": {
   "O": 45,
   "C": 69,
   "E": 50,
   "A": 40
  },
  "cognitive": {
   "math": 52,
   "verbal": 56,
   "techSpatial": 34,
   "abstract": 58
  },
  "subjects": [
   "informatics",
   "math"
  ]
 },
 {
  "code": "13-1032.00",
  "slug": "insurance-appraisers-auto-damage",
  "nameEn": "Insurance Appraisers, Auto Damage",
  "nameMn": "Автомашины хохирол үнэлэгч (даатгал)",
  "descriptionMn": "Даатгалын нөхөн төлбөр тооцохын тулд тээврийн хэрэгслийн эвдрэлийг үнэлж, засварын зардлыг тодорхойлно.",
  "categorySlug": "business",
  "jobZone": 3,
  "riasec": {
   "R": 70,
   "I": 34,
   "A": 3,
   "S": 11,
   "E": 42,
   "C": 74
  },
  "personality": {
   "O": 31,
   "C": 45,
   "E": 37,
   "A": 31
  },
  "cognitive": {
   "math": 39,
   "verbal": 41,
   "techSpatial": 63,
   "abstract": 35
  },
  "subjects": [
   "informatics"
  ]
 },
 {
  "code": "13-1041.00",
  "slug": "compliance-officers",
  "nameEn": "Compliance Officers",
  "nameMn": "Хууль, журмын биелэлтийн ажилтан",
  "descriptionMn": "Хууль, журмын шаардлага, лиценз, зөвшөөрлийн нийцлийг шалгаж, үнэлж, хяналт шалгалтын шинжилгээ хийнэ.",
  "categorySlug": "business",
  "jobZone": 4,
  "riasec": {
   "R": 25,
   "I": 35,
   "A": 0,
   "S": 33,
   "E": 51,
   "C": 89
  },
  "personality": {
   "O": 24,
   "C": 52,
   "E": 39,
   "A": 39
  },
  "cognitive": {
   "math": 28,
   "verbal": 45,
   "techSpatial": 36,
   "abstract": 35
  },
  "subjects": [
   "social",
   "informatics"
  ]
 },
 {
  "code": "13-1041.04",
  "slug": "government-property-inspectors-and-investigators",
  "nameEn": "Government Property Inspectors and Investigators",
  "nameMn": "Төрийн өмчийн байцаагч",
  "descriptionMn": "Төрийн өмч гэрээ, хууль журамд нийцэж байгааг шалгаж, судална.",
  "categorySlug": "business",
  "jobZone": 3,
  "riasec": {
   "R": 35,
   "I": 39,
   "A": 0,
   "S": 24,
   "E": 53,
   "C": 88
  },
  "personality": {
   "O": 24,
   "C": 63,
   "E": 42,
   "A": 20
  },
  "cognitive": {
   "math": 48,
   "verbal": 45,
   "techSpatial": 74,
   "abstract": 57
  },
  "subjects": [
   "informatics",
   "technology",
   "social"
  ]
 },
 {
  "code": "13-1041.06",
  "slug": "coroners",
  "nameEn": "Coroners",
  "nameMn": "Шүүх эмнэлгийн үзлэгч (коронер)",
  "descriptionMn": "Нас баралтын шалтгааныг тогтоохын тулд задлан шинжилгээ, эмгэг болон хор судлалын шинжилгээг удирдана.",
  "categorySlug": "business",
  "jobZone": 3,
  "riasec": {
   "R": 51,
   "I": 66,
   "A": 8,
   "S": 35,
   "E": 52,
   "C": 64
  },
  "personality": {
   "O": 52,
   "C": 82,
   "E": 51,
   "A": 43
  },
  "cognitive": {
   "math": 40,
   "verbal": 57,
   "techSpatial": 48,
   "abstract": 64
  },
  "subjects": [
   "biology",
   "social",
   "informatics"
  ]
 },
 {
  "code": "13-1041.07",
  "slug": "regulatory-affairs-specialists",
  "nameEn": "Regulatory Affairs Specialists",
  "nameMn": "Зохицуулалтын асуудал хариуцсан мэргэжилтэн",
  "descriptionMn": "Дотоод аудит, шалгалт, лицензийн сунгалт, бүртгэл зэрэг зохицуулалтын дотоод үйл явцыг зохион байгуулж баримтжуулна.",
  "categorySlug": "business",
  "jobZone": 4,
  "riasec": {
   "R": 7,
   "I": 39,
   "A": 0,
   "S": 25,
   "E": 58,
   "C": 89
  },
  "personality": {
   "O": 47,
   "C": 75,
   "E": 46,
   "A": 36
  },
  "cognitive": {
   "math": 45,
   "verbal": 69,
   "techSpatial": 22,
   "abstract": 54
  },
  "subjects": [
   "social",
   "informatics"
  ]
 },
 {
  "code": "13-1041.08",
  "slug": "customs-brokers",
  "nameEn": "Customs Brokers",
  "nameMn": "Гаалийн зуучлагч",
  "descriptionMn": "Гаалийн бичиг баримт бэлтгэж, бараа импорт, экспортын хууль журамд нийцэж байгааг хангана.",
  "categorySlug": "business",
  "jobZone": 3,
  "riasec": {
   "R": 23,
   "I": 9,
   "A": 0,
   "S": 19,
   "E": 67,
   "C": 86
  },
  "personality": {
   "O": 42,
   "C": 70,
   "E": 49,
   "A": 35
  },
  "cognitive": {
   "math": 48,
   "verbal": 45,
   "techSpatial": 22,
   "abstract": 29
  },
  "subjects": [
   "social",
   "informatics",
   "math"
  ]
 },
 {
  "code": "13-1051.00",
  "slug": "cost-estimators",
  "nameEn": "Cost Estimators",
  "nameMn": "Өртөг тооцоологч",
  "descriptionMn": "Бүтээгдэхүүн үйлдвэрлэл, барилгын төсөл, үйлчилгээний өртгийн тооцоо гарган үнэ тогтооход менежментэд тусална.",
  "categorySlug": "business",
  "jobZone": 4,
  "riasec": {
   "R": 34,
   "I": 36,
   "A": 2,
   "S": 11,
   "E": 61,
   "C": 91
  },
  "personality": {
   "O": 46,
   "C": 70,
   "E": 52,
   "A": 24
  },
  "cognitive": {
   "math": 71,
   "verbal": 47,
   "techSpatial": 54,
   "abstract": 54
  },
  "subjects": [
   "math",
   "economics",
   "informatics"
  ]
 },
 {
  "code": "13-1071.00",
  "slug": "human-resources-specialists",
  "nameEn": "Human Resources Specialists",
  "nameMn": "Хүний нөөцийн мэргэжилтэн",
  "descriptionMn": "Байгууллагад ажилтан сонгон шалгаруулж, ярилцлага хийж, томилон ажиллуулна.",
  "categorySlug": "business",
  "jobZone": 4,
  "riasec": {
   "R": 1,
   "I": 25,
   "A": 6,
   "S": 46,
   "E": 78,
   "C": 75
  },
  "personality": {
   "O": 50,
   "C": 50,
   "E": 63,
   "A": 64
  },
  "cognitive": {
   "math": 35,
   "verbal": 45,
   "techSpatial": 6,
   "abstract": 39
  },
  "subjects": []
 },
 {
  "code": "13-1075.00",
  "slug": "labor-relations-specialists",
  "nameEn": "Labor Relations Specialists",
  "nameMn": "Хөдөлмөрийн харилцааны мэргэжилтэн",
  "descriptionMn": "Ажилтан, удирдлагын маргааныг зохицуулж, хамтын гэрээ хэлэлцэж, гомдол шийдвэрлэх журмыг зохион байгуулна.",
  "categorySlug": "business",
  "jobZone": 4,
  "riasec": {
   "R": 5,
   "I": 35,
   "A": 12,
   "S": 45,
   "E": 78,
   "C": 60
  },
  "personality": {
   "O": 52,
   "C": 62,
   "E": 73,
   "A": 49
  },
  "cognitive": {
   "math": 43,
   "verbal": 58,
   "techSpatial": 15,
   "abstract": 48
  },
  "subjects": [
   "social"
  ]
 },
 {
  "code": "13-1081.00",
  "slug": "logisticians",
  "nameEn": "Logisticians",
  "nameMn": "Логистикч",
  "descriptionMn": "Байгууллагын логистикийн үйл ажиллагааг шинжилж, зохицуулна.",
  "categorySlug": "business",
  "jobZone": 4,
  "riasec": {
   "R": 23,
   "I": 47,
   "A": 2,
   "S": 22,
   "E": 67,
   "C": 74
  },
  "personality": {
   "O": 59,
   "C": 74,
   "E": 67,
   "A": 46
  },
  "cognitive": {
   "math": 57,
   "verbal": 48,
   "techSpatial": 38,
   "abstract": 55
  },
  "subjects": [
   "math",
   "geography",
   "informatics"
  ]
 },
 {
  "code": "13-1081.01",
  "slug": "logistics-engineers",
  "nameEn": "Logistics Engineers",
  "nameMn": "Логистикийн инженер",
  "descriptionMn": "Тээврийн оновчлол, сүлжээний загварчлал, зардал бууруулалт, маршрутын оновчлол зэрэг үйл ажиллагааны шийдлийг боловсруулна.",
  "categorySlug": "business",
  "jobZone": 4,
  "riasec": {
   "R": 50,
   "I": 70,
   "A": 1,
   "S": 5,
   "E": 46,
   "C": 78
  },
  "personality": {
   "O": 82,
   "C": 70,
   "E": 49,
   "A": 23
  },
  "cognitive": {
   "math": 72,
   "verbal": 58,
   "techSpatial": 59,
   "abstract": 64
  },
  "subjects": [
   "technology",
   "math",
   "informatics"
  ]
 },
 {
  "code": "13-1081.02",
  "slug": "logistics-analysts",
  "nameEn": "Logistics Analysts",
  "nameMn": "Логистикийн шинжээч",
  "descriptionMn": "Бүтээгдэхүүн хүргэлт, нийлүүлэлтийн сүлжээний үйл явцыг шинжилж, өөрчлөлт санал болгоно.",
  "categorySlug": "business",
  "jobZone": 4,
  "riasec": {
   "R": 31,
   "I": 51,
   "A": 0,
   "S": 9,
   "E": 58,
   "C": 97
  },
  "personality": {
   "O": 59,
   "C": 61,
   "E": 35,
   "A": 22
  },
  "cognitive": {
   "math": 65,
   "verbal": 45,
   "techSpatial": 41,
   "abstract": 51
  },
  "subjects": [
   "math",
   "informatics",
   "geography"
  ]
 },
 {
  "code": "13-1082.00",
  "slug": "project-management-specialists",
  "nameEn": "Project Management Specialists",
  "nameMn": "Төслийн менежментийн мэргэжилтэн",
  "descriptionMn": "Төсөл бүрийн хуваарь, хугацаа, худалдан авалт, ажилтан, төсвийг шинжилж зохицуулна.",
  "categorySlug": "business",
  "jobZone": 4,
  "riasec": {
   "R": 8,
   "I": 29,
   "A": 10,
   "S": 39,
   "E": 88,
   "C": 76
  },
  "personality": {
   "O": 67,
   "C": 87,
   "E": 84,
   "A": 48
  },
  "cognitive": {
   "math": 41,
   "verbal": 39,
   "techSpatial": 34,
   "abstract": 32
  },
  "subjects": [
   "informatics",
   "math"
  ]
 },
 {
  "code": "13-1111.00",
  "slug": "management-analysts",
  "nameEn": "Management Analysts",
  "nameMn": "Менежментийн шинжээч",
  "descriptionMn": "Байгууллагын судалгаа, үнэлгээ хийж, систем, журмыг боловсруулан, удирдлагын үр дүнтэй ажиллагаанд тусална.",
  "categorySlug": "business",
  "jobZone": 4,
  "riasec": {
   "R": 6,
   "I": 74,
   "A": 10,
   "S": 30,
   "E": 63,
   "C": 84
  },
  "personality": {
   "O": 84,
   "C": 72,
   "E": 72,
   "A": 42
  },
  "cognitive": {
   "math": 50,
   "verbal": 55,
   "techSpatial": 33,
   "abstract": 55
  },
  "subjects": [
   "math",
   "informatics",
   "economics"
  ]
 },
 {
  "code": "13-1121.00",
  "slug": "meeting-convention-and-event-planners",
  "nameEn": "Meeting, Convention, and Event Planners",
  "nameMn": "Уулзалт, чуулган, арга хэмжээний зохион байгуулагч",
  "descriptionMn": "Хурал, арга хэмжээ, чуулганы бэлтгэлд ажилтан, оролцогч, үйлчлүүлэгчдийн үйл ажиллагааг зохицуулна.",
  "categorySlug": "business",
  "jobZone": 4,
  "riasec": {
   "R": 0,
   "I": 9,
   "A": 25,
   "S": 59,
   "E": 100,
   "C": 66
  },
  "personality": {
   "O": 55,
   "C": 83,
   "E": 78,
   "A": 50
  },
  "cognitive": {
   "math": 47,
   "verbal": 51,
   "techSpatial": 38,
   "abstract": 36
  },
  "subjects": [
   "informatics"
  ]
 },
 {
  "code": "13-1131.00",
  "slug": "fundraisers",
  "nameEn": "Fundraisers",
  "nameMn": "Хандив цуглуулагч",
  "descriptionMn": "Байгууллагад хөрөнгө, хандив, бэлэг цуглуулах арга хэмжээг зохион байгуулна.",
  "categorySlug": "business",
  "jobZone": 4,
  "riasec": {
   "R": 0,
   "I": 17,
   "A": 37,
   "S": 54,
   "E": 84,
   "C": 51
  },
  "personality": {
   "O": 58,
   "C": 76,
   "E": 85,
   "A": 61
  },
  "cognitive": {
   "math": 47,
   "verbal": 47,
   "techSpatial": 17,
   "abstract": 42
  },
  "subjects": [
   "math",
   "economics",
   "informatics"
  ]
 },
 {
  "code": "13-1141.00",
  "slug": "compensation-benefits-and-job-analysis-specialists",
  "nameEn": "Compensation, Benefits, and Job Analysis Specialists",
  "nameMn": "Цалин, урамшуулал, ажлын шинжилгээний мэргэжилтэн",
  "descriptionMn": "Ажил олгогчид зориулан цалин, урамшууллын хөтөлбөр болон ажлын шинжилгээ хийнэ.",
  "categorySlug": "business",
  "jobZone": 4,
  "riasec": {
   "R": 5,
   "I": 40,
   "A": 7,
   "S": 44,
   "E": 73,
   "C": 80
  },
  "personality": {
   "O": 51,
   "C": 57,
   "E": 45,
   "A": 40
  },
  "cognitive": {
   "math": 55,
   "verbal": 46,
   "techSpatial": 20,
   "abstract": 39
  },
  "subjects": [
   "math",
   "informatics",
   "economics"
  ]
 },
 {
  "code": "13-1151.00",
  "slug": "training-and-development-specialists",
  "nameEn": "Training and Development Specialists",
  "nameMn": "Сургалт, хөгжлийн мэргэжилтэн",
  "descriptionMn": "Хувь хүний ур чадвар, байгууллагын гүйцэтгэлийг сайжруулах ажил дээрх сургалт, хөгжлийн хөтөлбөр боловсруулж явуулна.",
  "categorySlug": "business",
  "jobZone": 4,
  "riasec": {
   "R": 17,
   "I": 51,
   "A": 37,
   "S": 77,
   "E": 45,
   "C": 46
  },
  "personality": {
   "O": 79,
   "C": 57,
   "E": 76,
   "A": 62
  },
  "cognitive": {
   "math": 36,
   "verbal": 50,
   "techSpatial": 24,
   "abstract": 41
  },
  "subjects": [
   "social",
   "informatics"
  ]
 },
 {
  "code": "13-1161.00",
  "slug": "market-research-analysts-and-marketing-specialists",
  "nameEn": "Market Research Analysts and Marketing Specialists",
  "nameMn": "Зах зээл судлаач, маркетингийн мэргэжилтэн",
  "descriptionMn": "Орон нутаг, бүс нутаг, улс болон онлайн зах зээлийн нөхцөл байдлыг судална.",
  "categorySlug": "business",
  "jobZone": 4,
  "riasec": {
   "R": 1,
   "I": 60,
   "A": 26,
   "S": 25,
   "E": 75,
   "C": 60
  },
  "personality": {
   "O": 78,
   "C": 56,
   "E": 53,
   "A": 33
  },
  "cognitive": {
   "math": 59,
   "verbal": 57,
   "techSpatial": 15,
   "abstract": 54
  },
  "subjects": [
   "math",
   "informatics"
  ]
 },
 {
  "code": "13-1161.01",
  "slug": "search-marketing-strategists",
  "nameEn": "Search Marketing Strategists",
  "nameMn": "Хайлтын маркетингийн стратегич",
  "descriptionMn": "Интернет төхөөрөмж, интерфэйс дэх агуулга, бүтээгдэхүүн, үйлчилгээний харагдац, оролцоог хайлтын маркетингаар нэмэгдүүлнэ.",
  "categorySlug": "business",
  "jobZone": 4,
  "riasec": {
   "R": 0,
   "I": 46,
   "A": 37,
   "S": 29,
   "E": 76,
   "C": 61
  },
  "personality": {
   "O": 83,
   "C": 61,
   "E": 58,
   "A": 24
  },
  "cognitive": {
   "math": 46,
   "verbal": 46,
   "techSpatial": 24,
   "abstract": 42
  },
  "subjects": [
   "informatics",
   "math"
  ]
 },
 {
  "code": "13-1199.04",
  "slug": "business-continuity-planners",
  "nameEn": "Business Continuity Planners",
  "nameMn": "Бизнесийн тасралтгүй байдлын төлөвлөгч",
  "descriptionMn": "Эрсдэлийн үнэлгээ, нөлөөллийн шинжилгээ зэрэг бизнесийн тасралтгүй байдал, гамшгаас сэргэх стратеги, шийдлийг боловсруулж хэрэгжүүлнэ.",
  "categorySlug": "business",
  "jobZone": 4,
  "riasec": {
   "R": 17,
   "I": 56,
   "A": 11,
   "S": 34,
   "E": 71,
   "C": 68
  },
  "personality": {
   "O": 78,
   "C": 90,
   "E": 67,
   "A": 35
  },
  "cognitive": {
   "math": 47,
   "verbal": 59,
   "techSpatial": 34,
   "abstract": 64
  },
  "subjects": [
   "informatics"
  ]
 },
 {
  "code": "13-1199.06",
  "slug": "online-merchants",
  "nameEn": "Online Merchants",
  "nameMn": "Онлайн худалдаачин",
  "descriptionMn": "Зөвхөн онлайнаар үйл ажиллагаа явуулдаг бизнесийн жижиглэн худалдааг эрхэлнэ.",
  "categorySlug": "business",
  "jobZone": 4,
  "riasec": {
   "R": 24,
   "I": 10,
   "A": 15,
   "S": 22,
   "E": 80,
   "C": 83
  },
  "personality": {
   "O": 55,
   "C": 63,
   "E": 51,
   "A": 27
  },
  "cognitive": {
   "math": 54,
   "verbal": 36,
   "techSpatial": 35,
   "abstract": 32
  },
  "subjects": [
   "informatics",
   "math",
   "economics"
  ]
 },
 {
  "code": "13-1199.07",
  "slug": "security-management-specialists",
  "nameEn": "Security Management Specialists",
  "nameMn": "Аюулгүй байдлын менежментийн мэргэжилтэн",
  "descriptionMn": "Байгууллагын аюулгүй байдлын үнэлгээ хийж, хамгаалалтын систем, үйл явцыг зохион бүтээнэ.",
  "categorySlug": "business",
  "jobZone": 4,
  "riasec": {
   "R": 48,
   "I": 68,
   "A": 11,
   "S": 16,
   "E": 46,
   "C": 78
  },
  "personality": {
   "O": 69,
   "C": 83,
   "E": 64,
   "A": 25
  },
  "cognitive": {
   "math": 37,
   "verbal": 44,
   "techSpatial": 55,
   "abstract": 52
  },
  "subjects": [
   "informatics",
   "social",
   "technology"
  ]
 },
 {
  "code": "13-2011.00",
  "slug": "accountants-and-auditors",
  "nameEn": "Accountants and Auditors",
  "nameMn": "Нягтлан бодогч, аудитор",
  "descriptionMn": "Нягтлан бодох бүртгэлийг шалгаж, шинжилж, санхүүгийн тайлан гаргах, зөвлөгөө өгөх, бусдын тайланг аудитлан үнэлнэ.",
  "categorySlug": "business",
  "jobZone": 4,
  "riasec": {
   "R": 2,
   "I": 43,
   "A": 1,
   "S": 19,
   "E": 48,
   "C": 100
  },
  "personality": {
   "O": 42,
   "C": 78,
   "E": 38,
   "A": 29
  },
  "cognitive": {
   "math": 64,
   "verbal": 46,
   "techSpatial": 22,
   "abstract": 44
  },
  "subjects": [
   "economics",
   "math",
   "social"
  ]
 },
 {
  "code": "13-2022.00",
  "slug": "appraisers-of-personal-and-business-property",
  "nameEn": "Appraisers of Personal and Business Property",
  "nameMn": "Хувийн болон бизнесийн өмчийн үнэлгээчин",
  "descriptionMn": "Үнэт эдлэл, урлагийн бүтээл, эртний эдлэл, тоног төхөөрөмж зэрэг биет өмчийн зах зээлийн үнийг үнэлнэ.",
  "categorySlug": "business",
  "jobZone": 4,
  "riasec": {
   "R": 43,
   "I": 26,
   "A": 18,
   "S": 11,
   "E": 61,
   "C": 83
  },
  "personality": {
   "O": 48,
   "C": 53,
   "E": 28,
   "A": 16
  },
  "cognitive": {
   "math": 48,
   "verbal": 40,
   "techSpatial": 42,
   "abstract": 44
  },
  "subjects": [
   "informatics",
   "math"
  ]
 },
 {
  "code": "13-2023.00",
  "slug": "appraisers-and-assessors-of-real-estate",
  "nameEn": "Appraisers and Assessors of Real Estate",
  "nameMn": "Үл хөдлөх хөрөнгийн үнэлгээчин",
  "descriptionMn": "Зөвхөн үл хөдлөх хөрөнгийг үнэлж, зах зээлийн үнийг тодорхойлно.",
  "categorySlug": "business",
  "jobZone": 4,
  "riasec": {
   "R": 28,
   "I": 31,
   "A": 10,
   "S": 27,
   "E": 65,
   "C": 80
  },
  "personality": {
   "O": 48,
   "C": 61,
   "E": 41,
   "A": 24
  },
  "cognitive": {
   "math": 47,
   "verbal": 32,
   "techSpatial": 51,
   "abstract": 39
  },
  "subjects": [
   "math",
   "informatics",
   "social"
  ]
 },
 {
  "code": "13-2031.00",
  "slug": "budget-analysts",
  "nameEn": "Budget Analysts",
  "nameMn": "Төсвийн шинжээч",
  "descriptionMn": "Төсвийн тооцоо бүрэн, үнэн зөв, журамд нийцэж байгааг шалгана.",
  "categorySlug": "business",
  "jobZone": 4,
  "riasec": {
   "R": 0,
   "I": 45,
   "A": 10,
   "S": 21,
   "E": 65,
   "C": 100
  },
  "personality": {
   "O": 52,
   "C": 71,
   "E": 41,
   "A": 24
  },
  "cognitive": {
   "math": 72,
   "verbal": 44,
   "techSpatial": 15,
   "abstract": 44
  },
  "subjects": [
   "economics",
   "math",
   "informatics"
  ]
 },
 {
  "code": "13-2041.00",
  "slug": "credit-analysts",
  "nameEn": "Credit Analysts",
  "nameMn": "Зээлийн шинжээч",
  "descriptionMn": "Хувь хүн, компанийн зээлийн мэдээлэл, санхүүгийн тайланг шинжилж, зээл олгох эрсдэлийг тодорхойлно.",
  "categorySlug": "business",
  "jobZone": 4,
  "riasec": {
   "R": 0,
   "I": 47,
   "A": 0,
   "S": 24,
   "E": 59,
   "C": 98
  },
  "personality": {
   "O": 49,
   "C": 76,
   "E": 33,
   "A": 22
  },
  "cognitive": {
   "math": 72,
   "verbal": 47,
   "techSpatial": 6,
   "abstract": 55
  },
  "subjects": [
   "economics",
   "math",
   "social"
  ]
 },
 {
  "code": "13-2052.00",
  "slug": "personal-financial-advisors",
  "nameEn": "Personal Financial Advisors",
  "nameMn": "Хувийн санхүүгийн зөвлөх",
  "descriptionMn": "Татвар, хөрөнгө оруулалт, үнэт цаас, даатгал, тэтгэвэр, үл хөдлөх хөрөнгийн мэдлэгээр үйлчлүүлэгчид санхүүгийн төлөвлөгөөний зөвлөгөө өгнө.",
  "categorySlug": "business",
  "jobZone": 4,
  "riasec": {
   "R": 0,
   "I": 38,
   "A": 12,
   "S": 51,
   "E": 81,
   "C": 77
  },
  "personality": {
   "O": 72,
   "C": 94,
   "E": 78,
   "A": 53
  },
  "cognitive": {
   "math": 65,
   "verbal": 48,
   "techSpatial": 11,
   "abstract": 49
  },
  "subjects": [
   "math",
   "economics",
   "informatics"
  ]
 },
 {
  "code": "13-2053.00",
  "slug": "insurance-underwriters",
  "nameEn": "Insurance Underwriters",
  "nameMn": "Даатгалын эрсдэлийн үнэлгээчин",
  "descriptionMn": "Даатгалын хүсэлтийг хянаж, эрсдэлийг үнэлж, хүлээн авах эсэхийг шийднэ.",
  "categorySlug": "business",
  "jobZone": 4,
  "riasec": {
   "R": 12,
   "I": 44,
   "A": 0,
   "S": 31,
   "E": 58,
   "C": 86
  },
  "personality": {
   "O": 41,
   "C": 62,
   "E": 24,
   "A": 18
  },
  "cognitive": {
   "math": 45,
   "verbal": 44,
   "techSpatial": 13,
   "abstract": 41
  },
  "subjects": [
   "math"
  ]
 },
 {
  "code": "13-2061.00",
  "slug": "financial-examiners",
  "nameEn": "Financial Examiners",
  "nameMn": "Санхүүгийн хяналтын байцаагч",
  "descriptionMn": "Санхүүгийн болон үнэт цаасны байгууллага, санхүүгийн гүйлгээ, үл хөдлөх хөрөнгийн хэлцлийн хууль, журмын биелэлтийг хангуулна.",
  "categorySlug": "business",
  "jobZone": 4,
  "riasec": {
   "R": 6,
   "I": 43,
   "A": 0,
   "S": 25,
   "E": 61,
   "C": 90
  },
  "personality": {
   "O": 57,
   "C": 86,
   "E": 60,
   "A": 31
  },
  "cognitive": {
   "math": 66,
   "verbal": 63,
   "techSpatial": 9,
   "abstract": 67
  },
  "subjects": [
   "economics",
   "math",
   "social"
  ]
 },
 {
  "code": "13-2071.00",
  "slug": "credit-counselors",
  "nameEn": "Credit Counselors",
  "nameMn": "Зээлийн зөвлөх",
  "descriptionMn": "Хувь хүн, байгууллагад өр авах, удирдах талаар зөвлөж, сургана.",
  "categorySlug": "business",
  "jobZone": 4,
  "riasec": {
   "R": 0,
   "I": 27,
   "A": 13,
   "S": 65,
   "E": 62,
   "C": 73
  },
  "personality": {
   "O": 51,
   "C": 73,
   "E": 63,
   "A": 75
  },
  "cognitive": {
   "math": 52,
   "verbal": 45,
   "techSpatial": 13,
   "abstract": 39
  },
  "subjects": [
   "math",
   "economics",
   "informatics"
  ]
 },
 {
  "code": "13-2072.00",
  "slug": "loan-officers",
  "nameEn": "Loan Officers",
  "nameMn": "Зээлийн мэргэжилтэн",
  "descriptionMn": "Худалдааны, үл хөдлөх хөрөнгийн болон хэрэглээний зээлийг үнэлж, зөвшөөрөх эсэхийг санал болгоно.",
  "categorySlug": "business",
  "jobZone": 4,
  "riasec": {
   "R": 7,
   "I": 22,
   "A": 0,
   "S": 44,
   "E": 66,
   "C": 85
  },
  "personality": {
   "O": 49,
   "C": 72,
   "E": 68,
   "A": 45
  },
  "cognitive": {
   "math": 54,
   "verbal": 46,
   "techSpatial": 6,
   "abstract": 39
  },
  "subjects": [
   "math",
   "economics",
   "social"
  ]
 },
 {
  "code": "13-2081.00",
  "slug": "tax-examiners-and-collectors-and-revenue-agents",
  "nameEn": "Tax Examiners and Collectors, and Revenue Agents",
  "nameMn": "Татварын байцаагч, татвар хураагч",
  "descriptionMn": "Хууль, журмын дагуу хувь хүн, байгууллагын татварыг тогтоож, хураана.",
  "categorySlug": "business",
  "jobZone": 3,
  "riasec": {
   "R": 3,
   "I": 25,
   "A": 0,
   "S": 36,
   "E": 56,
   "C": 98
  },
  "personality": {
   "O": 23,
   "C": 67,
   "E": 35,
   "A": 33
  },
  "cognitive": {
   "math": 59,
   "verbal": 46,
   "techSpatial": 8,
   "abstract": 44
  },
  "subjects": [
   "economics",
   "math",
   "social"
  ]
 },
 {
  "code": "13-2082.00",
  "slug": "tax-preparers",
  "nameEn": "Tax Preparers",
  "nameMn": "Татварын тайлан бэлтгэгч",
  "descriptionMn": "Хувь хүн, жижиг бизнесийн татварын тайланг бэлтгэнэ.",
  "categorySlug": "business",
  "jobZone": 3,
  "riasec": {
   "R": 19,
   "I": 23,
   "A": 0,
   "S": 21,
   "E": 40,
   "C": 97
  },
  "personality": {
   "O": 35,
   "C": 65,
   "E": 36,
   "A": 39
  },
  "cognitive": {
   "math": 55,
   "verbal": 37,
   "techSpatial": 19,
   "abstract": 29
  },
  "subjects": [
   "informatics",
   "economics",
   "math"
  ]
 },
 {
  "code": "13-2099.01",
  "slug": "financial-quantitative-analysts",
  "nameEn": "Financial Quantitative Analysts",
  "nameMn": "Санхүүгийн тоон шинжээч",
  "descriptionMn": "Үнэт цаасны хөрөнгө оруулалт, үнэ тогтоолт, санхүүгийн хэрэгслийн үнэлгээнд зориулсан тоон аргуудыг боловсруулна.",
  "categorySlug": "business",
  "jobZone": 5,
  "riasec": {
   "R": 10,
   "I": 95,
   "A": 14,
   "S": 10,
   "E": 41,
   "C": 80
  },
  "personality": {
   "O": 83,
   "C": 81,
   "E": 27,
   "A": 13
  },
  "cognitive": {
   "math": 84,
   "verbal": 60,
   "techSpatial": 25,
   "abstract": 67
  },
  "subjects": [
   "math",
   "informatics",
   "economics"
  ]
 },
 {
  "code": "13-2099.04",
  "slug": "fraud-examiners-investigators-and-analysts",
  "nameEn": "Fraud Examiners, Investigators and Analysts",
  "nameMn": "Залилангийн шинжээч, мөрдөгч",
  "descriptionMn": "Залилангийн хэргийн нотлох баримт цуглуулж, мэдүүлэг авч, тайлан гаргаж, дүгнэлтээ шүүхэд мэдүүлнэ.",
  "categorySlug": "business",
  "jobZone": 4,
  "riasec": {
   "R": 17,
   "I": 61,
   "A": 4,
   "S": 16,
   "E": 60,
   "C": 77
  },
  "personality": {
   "O": 72,
   "C": 91,
   "E": 62,
   "A": 22
  },
  "cognitive": {
   "math": 55,
   "verbal": 62,
   "techSpatial": 15,
   "abstract": 46
  },
  "subjects": [
   "social",
   "economics",
   "math"
  ]
 },
 {
  "code": "15-1211.00",
  "slug": "computer-systems-analysts",
  "nameEn": "Computer Systems Analysts",
  "nameMn": "Компьютерийн системийн шинжээч",
  "descriptionMn": "Шинжлэх ухаан, инженерчлэл, бизнесийн өгөгдөл боловсруулалтын асуудлыг шинжилж, програмын нарийн асуудлыг шийдэх арга боловсруулна.",
  "categorySlug": "technology",
  "jobZone": 4,
  "riasec": {
   "R": 38,
   "I": 90,
   "A": 16,
   "S": 15,
   "E": 21,
   "C": 82
  },
  "personality": {
   "O": 85,
   "C": 58,
   "E": 46,
   "A": 36
  },
  "cognitive": {
   "math": 55,
   "verbal": 53,
   "techSpatial": 52,
   "abstract": 54
  },
  "subjects": [
   "informatics",
   "math"
  ]
 },
 {
  "code": "15-1211.01",
  "slug": "health-informatics-specialists",
  "nameEn": "Health Informatics Specialists",
  "nameMn": "Эрүүл мэндийн мэдээллийн технологийн мэргэжилтэн",
  "descriptionMn": "Сувилахуй, мэдээллийн технологийн мэдлэгээр эрүүл мэндийн компьютерийн системийг зохион бүтээж, хөгжүүлж, шинэчилнэ.",
  "categorySlug": "technology",
  "jobZone": 5,
  "riasec": {
   "R": 31,
   "I": 88,
   "A": 17,
   "S": 59,
   "E": 18,
   "C": 62
  },
  "personality": {
   "O": 84,
   "C": 73,
   "E": 61,
   "A": 54
  },
  "cognitive": {
   "math": 48,
   "verbal": 67,
   "techSpatial": 39,
   "abstract": 61
  },
  "subjects": [
   "informatics",
   "math",
   "biology"
  ]
 },
 {
  "code": "15-1212.00",
  "slug": "information-security-analysts",
  "nameEn": "Information Security Analysts",
  "nameMn": "Мэдээллийн аюулгүй байдлын шинжээч",
  "descriptionMn": "Компьютерын сүлжээ, мэдээллийг хамгаалах аюулгүй байдлын арга хэмжээг төлөвлөж, хэрэгжүүлж, хянана.",
  "categorySlug": "technology",
  "jobZone": 4,
  "riasec": {
   "R": 43,
   "I": 73,
   "A": 6,
   "S": 18,
   "E": 31,
   "C": 85
  },
  "personality": {
   "O": 85,
   "C": 88,
   "E": 51,
   "A": 26
  },
  "cognitive": {
   "math": 45,
   "verbal": 48,
   "techSpatial": 48,
   "abstract": 52
  },
  "subjects": [
   "informatics",
   "technology",
   "math"
  ]
 },
 {
  "code": "15-1221.00",
  "slug": "computer-and-information-research-scientists",
  "nameEn": "Computer and Information Research Scientists",
  "nameMn": "Компьютер, мэдээллийн шинжлэх ухааны судлаач",
  "descriptionMn": "Онолч, зохион бүтээгчийн хувиар компьютер, мэдээллийн шинжлэх ухааны суурь судалгаа хийнэ.",
  "categorySlug": "technology",
  "jobZone": 5,
  "riasec": {
   "R": 46,
   "I": 100,
   "A": 33,
   "S": 17,
   "E": 25,
   "C": 63
  },
  "personality": {
   "O": 100,
   "C": 72,
   "E": 52,
   "A": 26
  },
  "cognitive": {
   "math": 67,
   "verbal": 61,
   "techSpatial": 61,
   "abstract": 75
  },
  "subjects": [
   "informatics",
   "math",
   "technology"
  ]
 },
 {
  "code": "15-1231.00",
  "slug": "computer-network-support-specialists",
  "nameEn": "Computer Network Support Specialists",
  "nameMn": "Компьютерийн сүлжээний тусламжийн мэргэжилтэн",
  "descriptionMn": "Дотоод сүлжээ (LAN), өргөн сүлжээ (WAN), үүлэн сүлжээ, сервер зэрэг сүлжээний системийг шинжилж, шалгаж, гэмтлийг засна.",
  "categorySlug": "technology",
  "jobZone": 4,
  "riasec": {
   "R": 56,
   "I": 60,
   "A": 0,
   "S": 21,
   "E": 27,
   "C": 74
  },
  "personality": {
   "O": 66,
   "C": 68,
   "E": 32,
   "A": 26
  },
  "cognitive": {
   "math": 37,
   "verbal": 45,
   "techSpatial": 62,
   "abstract": 42
  },
  "subjects": [
   "informatics",
   "technology"
  ]
 },
 {
  "code": "15-1232.00",
  "slug": "computer-user-support-specialists",
  "nameEn": "Computer User Support Specialists",
  "nameMn": "Компьютерийн хэрэглэгчийн тусламжийн мэргэжилтэн",
  "descriptionMn": "Компьютерийн хэрэглэгчдэд техникийн тусламж үзүүлж, асуултад хариулж, асуудлыг биечлэн, утсаар эсвэл цахимаар шийднэ.",
  "categorySlug": "technology",
  "jobZone": 3,
  "riasec": {
   "R": 52,
   "I": 46,
   "A": 0,
   "S": 39,
   "E": 23,
   "C": 84
  },
  "personality": {
   "O": 59,
   "C": 55,
   "E": 44,
   "A": 49
  },
  "cognitive": {
   "math": 34,
   "verbal": 43,
   "techSpatial": 71,
   "abstract": 31
  },
  "subjects": [
   "informatics",
   "technology"
  ]
 },
 {
  "code": "15-1241.00",
  "slug": "computer-network-architects",
  "nameEn": "Computer Network Architects",
  "nameMn": "Компьютерийн сүлжээний архитектор",
  "descriptionMn": "Дотоод болон өргөн сүлжээ, интранет, экстранет зэрэг мэдээллийн сүлжээг зохион бүтээж, нэвтрүүлнэ.",
  "categorySlug": "technology",
  "jobZone": 4,
  "riasec": {
   "R": 51,
   "I": 71,
   "A": 21,
   "S": 19,
   "E": 37,
   "C": 68
  },
  "personality": {
   "O": 85,
   "C": 79,
   "E": 50,
   "A": 27
  },
  "cognitive": {
   "math": 51,
   "verbal": 53,
   "techSpatial": 58,
   "abstract": 55
  },
  "subjects": [
   "informatics",
   "technology",
   "math"
  ]
 },
 {
  "code": "15-1241.01",
  "slug": "telecommunications-engineering-specialists",
  "nameEn": "Telecommunications Engineering Specialists",
  "nameMn": "Харилцаа холбооны инженерийн мэргэжилтэн",
  "descriptionMn": "Дуу, дүрс, өгөгдлийн үйлчилгээнд зориулсан утастай, утасгүй болон хиймэл дагуулын холбооны системийг зохион бүтээж, тохируулна.",
  "categorySlug": "technology",
  "jobZone": 3,
  "riasec": {
   "R": 59,
   "I": 55,
   "A": 15,
   "S": 22,
   "E": 35,
   "C": 66
  },
  "personality": {
   "O": 75,
   "C": 72,
   "E": 53,
   "A": 34
  },
  "cognitive": {
   "math": 48,
   "verbal": 47,
   "techSpatial": 77,
   "abstract": 39
  },
  "subjects": [
   "technology",
   "informatics",
   "math"
  ]
 },
 {
  "code": "15-1242.00",
  "slug": "database-administrators",
  "nameEn": "Database Administrators",
  "nameMn": "Өгөгдлийн сангийн администратор",
  "descriptionMn": "Өгөгдлийн сангийн удирдлагын системийн мэдлэгээр компьютерийн өгөгдлийн санг удирдаж, шалгаж, нэвтрүүлнэ.",
  "categorySlug": "technology",
  "jobZone": 4,
  "riasec": {
   "R": 31,
   "I": 64,
   "A": 3,
   "S": 22,
   "E": 32,
   "C": 94
  },
  "personality": {
   "O": 67,
   "C": 75,
   "E": 38,
   "A": 24
  },
  "cognitive": {
   "math": 49,
   "verbal": 49,
   "techSpatial": 49,
   "abstract": 55
  },
  "subjects": [
   "informatics",
   "math",
   "technology"
  ]
 },
 {
  "code": "15-1243.00",
  "slug": "database-architects",
  "nameEn": "Database Architects",
  "nameMn": "Өгөгдлийн сангийн архитектор",
  "descriptionMn": "Байгууллагын өгөгдлийн сан, өгөгдлийн агуулах системийн стратегийг зохион бүтээнэ.",
  "categorySlug": "technology",
  "jobZone": 4,
  "riasec": {
   "R": 27,
   "I": 77,
   "A": 19,
   "S": 15,
   "E": 28,
   "C": 85
  },
  "personality": {
   "O": 81,
   "C": 79,
   "E": 42,
   "A": 22
  },
  "cognitive": {
   "math": 52,
   "verbal": 48,
   "techSpatial": 42,
   "abstract": 54
  },
  "subjects": [
   "informatics",
   "technology",
   "math"
  ]
 },
 {
  "code": "15-1243.01",
  "slug": "data-warehousing-specialists",
  "nameEn": "Data Warehousing Specialists",
  "nameMn": "Өгөгдлийн агуулахын мэргэжилтэн",
  "descriptionMn": "Байгууллагын өгөгдлийн агуулахын үйл ажиллагааг зохион бүтээж, загварчилж, хэрэгжүүлнэ.",
  "categorySlug": "technology",
  "jobZone": 4,
  "riasec": {
   "R": 32,
   "I": 63,
   "A": 10,
   "S": 17,
   "E": 34,
   "C": 90
  },
  "personality": {
   "O": 73,
   "C": 76,
   "E": 26,
   "A": 15
  },
  "cognitive": {
   "math": 52,
   "verbal": 45,
   "techSpatial": 33,
   "abstract": 47
  },
  "subjects": [
   "informatics",
   "math"
  ]
 },
 {
  "code": "15-1244.00",
  "slug": "network-and-computer-systems-administrators",
  "nameEn": "Network and Computer Systems Administrators",
  "nameMn": "Сүлжээ болон компьютерийн системийн администратор",
  "descriptionMn": "Байгууллагын дотоод сүлжээ, өргөн сүлжээ, үйлдлийн систем, бодит болон виртуал серверийг суулгаж, тохируулж, засвар үйлчилгээ хийнэ.",
  "categorySlug": "technology",
  "jobZone": 3,
  "riasec": {
   "R": 53,
   "I": 51,
   "A": 0,
   "S": 20,
   "E": 41,
   "C": 86
  },
  "personality": {
   "O": 68,
   "C": 71,
   "E": 38,
   "A": 24
  },
  "cognitive": {
   "math": 43,
   "verbal": 47,
   "techSpatial": 53,
   "abstract": 49
  },
  "subjects": [
   "informatics"
  ]
 },
 {
  "code": "15-1251.00",
  "slug": "computer-programmers",
  "nameEn": "Computer Programmers",
  "nameMn": "Компьютерийн програмист",
  "descriptionMn": "Компьютерийн програмуудыг ажиллуулдаг код, скриптийг бичиж, засаж, шалгана.",
  "categorySlug": "technology",
  "jobZone": 4,
  "riasec": {
   "R": 40,
   "I": 68,
   "A": 25,
   "S": 16,
   "E": 18,
   "C": 82
  },
  "personality": {
   "O": 77,
   "C": 70,
   "E": 18,
   "A": 20
  },
  "cognitive": {
   "math": 50,
   "verbal": 41,
   "techSpatial": 44,
   "abstract": 41
  },
  "subjects": [
   "informatics",
   "math",
   "technology"
  ]
 },
 {
  "code": "15-1252.00",
  "slug": "software-developers",
  "nameEn": "Software Developers",
  "nameMn": "Програм хангамж хөгжүүлэгч",
  "descriptionMn": "Компьютер, сүлжээний програм хангамж болон тусгай хэрэглээний програмыг судалж, зохион бүтээж, хөгжүүлнэ.",
  "categorySlug": "technology",
  "jobZone": 4,
  "riasec": {
   "R": 44,
   "I": 84,
   "A": 23,
   "S": 14,
   "E": 15,
   "C": 77
  },
  "personality": {
   "O": 87,
   "C": 74,
   "E": 50,
   "A": 30
  },
  "cognitive": {
   "math": 49,
   "verbal": 49,
   "techSpatial": 40,
   "abstract": 49
  },
  "subjects": [
   "informatics",
   "math"
  ]
 },
 {
  "code": "15-1253.00",
  "slug": "software-quality-assurance-analysts-and-testers",
  "nameEn": "Software Quality Assurance Analysts and Testers",
  "nameMn": "Програм хангамжийн чанарын шинжээч, тестер",
  "descriptionMn": "Програм хангамжийн алдаа, шалтгааныг илрүүлэхийн тулд тест боловсруулж, гүйцэтгэнэ.",
  "categorySlug": "technology",
  "jobZone": 4,
  "riasec": {
   "R": 47,
   "I": 79,
   "A": 12,
   "S": 9,
   "E": 10,
   "C": 78
  },
  "personality": {
   "O": 64,
   "C": 73,
   "E": 24,
   "A": 29
  },
  "cognitive": {
   "math": 42,
   "verbal": 46,
   "techSpatial": 35,
   "abstract": 44
  },
  "subjects": [
   "informatics",
   "math",
   "technology"
  ]
 },
 {
  "code": "15-1254.00",
  "slug": "web-developers",
  "nameEn": "Web Developers",
  "nameMn": "Вэб хөгжүүлэгч",
  "descriptionMn": "Вэб сайт, вэб аппликейшн, өгөгдлийн сан, интерактив вэб интерфэйсийг хөгжүүлж, нэвтрүүлнэ.",
  "categorySlug": "technology",
  "jobZone": 3,
  "riasec": {
   "R": 33,
   "I": 67,
   "A": 36,
   "S": 20,
   "E": 33,
   "C": 67
  },
  "personality": {
   "O": 79,
   "C": 63,
   "E": 33,
   "A": 19
  },
  "cognitive": {
   "math": 47,
   "verbal": 41,
   "techSpatial": 42,
   "abstract": 41
  },
  "subjects": [
   "informatics",
   "math"
  ]
 },
 {
  "code": "15-1255.00",
  "slug": "web-and-digital-interface-designers",
  "nameEn": "Web and Digital Interface Designers",
  "nameMn": "Вэб болон дижитал интерфэйс дизайнер",
  "descriptionMn": "Дижитал хэрэглэгчийн интерфэйс, вэб сайтыг зохион бүтээж, янз бүрийн хөтөч, төхөөрөмж дээр ашиглахад тохиромжтой байдлыг шалгана.",
  "categorySlug": "technology",
  "jobZone": 4,
  "riasec": {
   "R": 26,
   "I": 65,
   "A": 58,
   "S": 20,
   "E": 36,
   "C": 57
  },
  "personality": {
   "O": 82,
   "C": 55,
   "E": 46,
   "A": 38
  },
  "cognitive": {
   "math": 36,
   "verbal": 41,
   "techSpatial": 34,
   "abstract": 28
  },
  "subjects": [
   "informatics"
  ]
 },
 {
  "code": "15-1255.01",
  "slug": "video-game-designers",
  "nameEn": "Video Game Designers",
  "nameMn": "Видео тоглоомын дизайнер",
  "descriptionMn": "Видео тоглоомын үндсэн боломж, тоглоомын механик, үйл явдлын шугам, дүрийн намтрыг зохион бүтээнэ.",
  "categorySlug": "technology",
  "jobZone": 4,
  "riasec": {
   "R": 30,
   "I": 53,
   "A": 90,
   "S": 22,
   "E": 49,
   "C": 48
  },
  "personality": {
   "O": 95,
   "C": 56,
   "E": 68,
   "A": 36
  },
  "cognitive": {
   "math": 48,
   "verbal": 43,
   "techSpatial": 41,
   "abstract": 45
  },
  "subjects": [
   "informatics",
   "math",
   "social"
  ]
 },
 {
  "code": "15-1299.01",
  "slug": "web-administrators",
  "nameEn": "Web Administrators",
  "nameMn": "Вэб администратор",
  "descriptionMn": "Вэб орчны зохион бүтээлт, нэвтрүүлэлт, хөгжүүлэлт, засвар үйлчилгээний ажлыг удирдана.",
  "categorySlug": "technology",
  "jobZone": 4,
  "riasec": {
   "R": 24,
   "I": 57,
   "A": 24,
   "S": 21,
   "E": 46,
   "C": 76
  },
  "personality": {
   "O": 72,
   "C": 67,
   "E": 38,
   "A": 22
  },
  "cognitive": {
   "math": 47,
   "verbal": 47,
   "techSpatial": 38,
   "abstract": 44
  },
  "subjects": [
   "informatics",
   "math",
   "technology"
  ]
 },
 {
  "code": "15-1299.02",
  "slug": "geographic-information-systems-technologists-and-technicians",
  "nameEn": "Geographic Information Systems Technologists and Technicians",
  "nameMn": "Газарзүйн мэдээллийн системийн (ГМС) техникч",
  "descriptionMn": "Эрдэмтэн, мэргэжилтнүүдэд газарзүйн мэдээллийн системийн өгөгдлийн санг бүрдүүлэх, засварлах, ашиглахад тусална.",
  "categorySlug": "technology",
  "jobZone": 4,
  "riasec": {
   "R": 54,
   "I": 70,
   "A": 22,
   "S": 16,
   "E": 16,
   "C": 81
  },
  "personality": {
   "O": 71,
   "C": 55,
   "E": 31,
   "A": 27
  },
  "cognitive": {
   "math": 46,
   "verbal": 46,
   "techSpatial": 50,
   "abstract": 41
  },
  "subjects": [
   "geography",
   "informatics",
   "math"
  ]
 },
 {
  "code": "15-1299.03",
  "slug": "document-management-specialists",
  "nameEn": "Document Management Specialists",
  "nameMn": "Баримт бичгийн удирдлагын мэргэжилтэн",
  "descriptionMn": "Цахим бүртгэл, баримт бичгийг цуглуулах, хадгалах, хайх, түгээх, устгах байгууллагын баримт бичгийн удирдлагын системийг нэвтрүүлж удирдана.",
  "categorySlug": "technology",
  "jobZone": 4,
  "riasec": {
   "R": 13,
   "I": 48,
   "A": 14,
   "S": 22,
   "E": 32,
   "C": 96
  },
  "personality": {
   "O": 58,
   "C": 59,
   "E": 32,
   "A": 28
  },
  "cognitive": {
   "math": 41,
   "verbal": 45,
   "techSpatial": 31,
   "abstract": 36
  },
  "subjects": [
   "informatics",
   "math"
  ]
 },
 {
  "code": "15-1299.04",
  "slug": "penetration-testers",
  "nameEn": "Penetration Testers",
  "nameMn": "Нэвтрэлтийн тестийн мэргэжилтэн (пентестер)",
  "descriptionMn": "Дотоод, гадаад кибер халдлагыг хуурамчаар загварчилж, сүлжээний системийн аюулгүй байдлыг үнэлнэ.",
  "categorySlug": "technology",
  "jobZone": 4,
  "riasec": {
   "R": 49,
   "I": 70,
   "A": 5,
   "S": 17,
   "E": 18,
   "C": 70
  },
  "personality": {
   "O": 89,
   "C": 85,
   "E": 22,
   "A": 0
  },
  "cognitive": {
   "math": 46,
   "verbal": 60,
   "techSpatial": 48,
   "abstract": 64
  },
  "subjects": [
   "informatics",
   "technology",
   "math"
  ]
 },
 {
  "code": "15-1299.05",
  "slug": "information-security-engineers",
  "nameEn": "Information Security Engineers",
  "nameMn": "Мэдээллийн аюулгүй байдлын инженер",
  "descriptionMn": "Мэдээллийн аюулгүй байдлын журам, бодлогыг боловсруулж, хэрэгжилтийг удирдана.",
  "categorySlug": "technology",
  "jobZone": 4,
  "riasec": {
   "R": 55,
   "I": 76,
   "A": 6,
   "S": 14,
   "E": 28,
   "C": 84
  },
  "personality": {
   "O": 87,
   "C": 88,
   "E": 46,
   "A": 20
  },
  "cognitive": {
   "math": 47,
   "verbal": 49,
   "techSpatial": 45,
   "abstract": 49
  },
  "subjects": [
   "informatics",
   "technology"
  ]
 },
 {
  "code": "15-1299.06",
  "slug": "digital-forensics-analysts",
  "nameEn": "Digital Forensics Analysts",
  "nameMn": "Дижитал шүүх шинжилгээний шинжээч",
  "descriptionMn": "Кибер халдлагатай холбоотой дижитал мэдээлэл, бүртгэл зэрэг нотлох баримтыг тогтоож, компьютерийн гэмт хэргийг шалгана.",
  "categorySlug": "technology",
  "jobZone": 4,
  "riasec": {
   "R": 37,
   "I": 85,
   "A": 12,
   "S": 11,
   "E": 28,
   "C": 84
  },
  "personality": {
   "O": 82,
   "C": 88,
   "E": 31,
   "A": 20
  },
  "cognitive": {
   "math": 36,
   "verbal": 47,
   "techSpatial": 55,
   "abstract": 47
  },
  "subjects": [
   "informatics",
   "social",
   "technology"
  ]
 },
 {
  "code": "15-1299.07",
  "slug": "blockchain-engineers",
  "nameEn": "Blockchain Engineers",
  "nameMn": "Блокчейн инженер",
  "descriptionMn": "Криптовалют, төлбөр боловсруулалт, баримт солилцоо, дижитал санал хураалт зэрэг блокчейн дээр суурилсан сүлжээ, програмуудыг ажиллуулж дэмжинэ.",
  "categorySlug": "technology",
  "jobZone": 4,
  "riasec": {
   "R": 40,
   "I": 71,
   "A": 18,
   "S": 10,
   "E": 40,
   "C": 78
  },
  "personality": {
   "O": 92,
   "C": 83,
   "E": 32,
   "A": 18
  },
  "cognitive": {
   "math": 47,
   "verbal": 51,
   "techSpatial": 49,
   "abstract": 51
  },
  "subjects": [
   "informatics",
   "technology",
   "math"
  ]
 },
 {
  "code": "15-1299.08",
  "slug": "computer-systems-engineers-architects",
  "nameEn": "Computer Systems Engineers/Architects",
  "nameMn": "Компьютерийн системийн инженер, архитектор",
  "descriptionMn": "Програмын нарийн асуудал, системийн удирдлага, сүлжээний асуудлыг шийдэх шийдлийг зохион бүтээж хөгжүүлнэ.",
  "categorySlug": "technology",
  "jobZone": 3,
  "riasec": {
   "R": 52,
   "I": 74,
   "A": 15,
   "S": 18,
   "E": 34,
   "C": 79
  },
  "personality": {
   "O": 87,
   "C": 76,
   "E": 58,
   "A": 32
  },
  "cognitive": {
   "math": 50,
   "verbal": 51,
   "techSpatial": 61,
   "abstract": 54
  },
  "subjects": [
   "informatics",
   "technology",
   "math"
  ]
 },
 {
  "code": "15-1299.09",
  "slug": "information-technology-project-managers",
  "nameEn": "Information Technology Project Managers",
  "nameMn": "Мэдээллийн технологийн төслийн менежер",
  "descriptionMn": "Мэдээллийн технологийн төслийг төлөвлөж, эхлүүлж, удирдана.",
  "categorySlug": "technology",
  "jobZone": 4,
  "riasec": {
   "R": 12,
   "I": 48,
   "A": 13,
   "S": 28,
   "E": 82,
   "C": 72
  },
  "personality": {
   "O": 74,
   "C": 87,
   "E": 84,
   "A": 46
  },
  "cognitive": {
   "math": 50,
   "verbal": 47,
   "techSpatial": 52,
   "abstract": 51
  },
  "subjects": [
   "informatics",
   "technology",
   "math"
  ]
 },
 {
  "code": "15-2011.00",
  "slug": "actuaries",
  "nameEn": "Actuaries",
  "nameMn": "Актуар",
  "descriptionMn": "Нас баралт, осол, өвчлөл, хөдөлмөрийн чадвар алдалт, тэтгэвэр зэрэг статистик өгөгдлийг шинжилж, ирээдүйн төлбөрийн эрсдэлийг урьдчилан тооцоолох магадлалын хүснэгт зохионо.",
  "categorySlug": "technology",
  "jobZone": 4,
  "riasec": {
   "R": 13,
   "I": 58,
   "A": 2,
   "S": 25,
   "E": 39,
   "C": 88
  },
  "personality": {
   "O": 67,
   "C": 81,
   "E": 40,
   "A": 24
  },
  "cognitive": {
   "math": 87,
   "verbal": 66,
   "techSpatial": 29,
   "abstract": 74
  },
  "subjects": [
   "math",
   "economics",
   "informatics"
  ]
 },
 {
  "code": "15-2021.00",
  "slug": "mathematicians",
  "nameEn": "Mathematicians",
  "nameMn": "Математикч",
  "descriptionMn": "Математикийн суурь судалгаа хийх, эсвэл математик аргыг шинжлэх ухаан, менежмент зэрэг салбарт хэрэглэнэ.",
  "categorySlug": "technology",
  "jobZone": 5,
  "riasec": {
   "R": 37,
   "I": 100,
   "A": 37,
   "S": 16,
   "E": 2,
   "C": 67
  },
  "personality": {
   "O": 97,
   "C": 77,
   "E": 28,
   "A": 16
  },
  "cognitive": {
   "math": 96,
   "verbal": 77,
   "techSpatial": 35,
   "abstract": 75
  },
  "subjects": [
   "math",
   "informatics",
   "physics"
  ]
 },
 {
  "code": "15-2031.00",
  "slug": "operations-research-analysts",
  "nameEn": "Operations Research Analysts",
  "nameMn": "Үйл ажиллагааны судалгааны шинжээч",
  "descriptionMn": "Математик загварчлал, оновчлолын аргаар удирдлагын шийдвэр, бодлого боловсруулахад тусалдаг мэдээллийг гаргаж тайлбарлана.",
  "categorySlug": "technology",
  "jobZone": 5,
  "riasec": {
   "R": 15,
   "I": 88,
   "A": 20,
   "S": 17,
   "E": 36,
   "C": 79
  },
  "personality": {
   "O": 87,
   "C": 65,
   "E": 47,
   "A": 27
  },
  "cognitive": {
   "math": 78,
   "verbal": 60,
   "techSpatial": 39,
   "abstract": 67
  },
  "subjects": [
   "math",
   "informatics",
   "technology"
  ]
 },
 {
  "code": "15-2041.00",
  "slug": "statisticians",
  "nameEn": "Statisticians",
  "nameMn": "Статистикч",
  "descriptionMn": "Тоон өгөгдлийг цуглуулж, цэгцэлж, тайлбарлаж, дүгнэхийн тулд математик, статистикийн онол, аргыг боловсруулж хэрэглэнэ.",
  "categorySlug": "technology",
  "jobZone": 5,
  "riasec": {
   "R": 19,
   "I": 93,
   "A": 13,
   "S": 12,
   "E": 14,
   "C": 84
  },
  "personality": {
   "O": 81,
   "C": 76,
   "E": 21,
   "A": 19
  },
  "cognitive": {
   "math": 88,
   "verbal": 70,
   "techSpatial": 37,
   "abstract": 71
  },
  "subjects": [
   "math",
   "informatics"
  ]
 },
 {
  "code": "15-2041.01",
  "slug": "biostatisticians",
  "nameEn": "Biostatisticians",
  "nameMn": "Биостатистикч",
  "descriptionMn": "Амьд байгалийн шинжлэх ухааны судалгаанд биостатистикийн онол, аргыг боловсруулж хэрэглэнэ.",
  "categorySlug": "technology",
  "jobZone": 5,
  "riasec": {
   "R": 24,
   "I": 100,
   "A": 30,
   "S": 35,
   "E": 16,
   "C": 57
  },
  "personality": {
   "O": 89,
   "C": 82,
   "E": 40,
   "A": 26
  },
  "cognitive": {
   "math": 78,
   "verbal": 76,
   "techSpatial": 34,
   "abstract": 75
  },
  "subjects": [
   "math",
   "informatics",
   "biology"
  ]
 },
 {
  "code": "15-2051.00",
  "slug": "data-scientists",
  "nameEn": "Data Scientists",
  "nameMn": "Өгөгдлийн эрдэмтэн (дата сайентист)",
  "descriptionMn": "Өгөгдөлд чиглэсэн програмчлалын хэл, дүрслэлийн програмаар түүхий өгөгдлийг утга учиртай мэдээлэл болгох аргуудыг боловсруулж хэрэглэнэ.",
  "categorySlug": "technology",
  "jobZone": 4,
  "riasec": {
   "R": 19,
   "I": 100,
   "A": 27,
   "S": 11,
   "E": 12,
   "C": 73
  },
  "personality": {
   "O": 96,
   "C": 79,
   "E": 37,
   "A": 21
  },
  "cognitive": {
   "math": 71,
   "verbal": 59,
   "techSpatial": 39,
   "abstract": 68
  },
  "subjects": [
   "informatics",
   "math",
   "technology"
  ]
 },
 {
  "code": "15-2051.01",
  "slug": "business-intelligence-analysts",
  "nameEn": "Business Intelligence Analysts",
  "nameMn": "Бизнес интеллигенс шинжээч",
  "descriptionMn": "Өгөгдлийн сангаас мэдээлэл татаж, тогтмол тайлан гаргаж санхүү, зах зээлийн мэдээлэл бэлтгэнэ.",
  "categorySlug": "technology",
  "jobZone": 4,
  "riasec": {
   "R": 4,
   "I": 74,
   "A": 16,
   "S": 14,
   "E": 57,
   "C": 80
  },
  "personality": {
   "O": 70,
   "C": 66,
   "E": 39,
   "A": 19
  },
  "cognitive": {
   "math": 61,
   "verbal": 62,
   "techSpatial": 27,
   "abstract": 64
  },
  "subjects": [
   "informatics",
   "math",
   "economics"
  ]
 },
 {
  "code": "15-2051.02",
  "slug": "clinical-data-managers",
  "nameEn": "Clinical Data Managers",
  "nameMn": "Эмнэлзүйн өгөгдлийн менежер",
  "descriptionMn": "Эрүүл мэндийн болон өгөгдлийн сангийн мэдлэгээр эмнэлзүйн өгөгдлийг шинжилж, чиг хандлагыг илрүүлж тайлагнана.",
  "categorySlug": "technology",
  "jobZone": 4,
  "riasec": {
   "R": 4,
   "I": 78,
   "A": 5,
   "S": 30,
   "E": 38,
   "C": 93
  },
  "personality": {
   "O": 65,
   "C": 77,
   "E": 44,
   "A": 33
  },
  "cognitive": {
   "math": 57,
   "verbal": 50,
   "techSpatial": 26,
   "abstract": 54
  },
  "subjects": [
   "informatics",
   "math"
  ]
 },
 {
  "code": "15-2099.01",
  "slug": "bioinformatics-technicians",
  "nameEn": "Bioinformatics Technicians",
  "nameMn": "Биоинформатикийн техникч",
  "descriptionMn": "Эм зүй, эмнэлгийн технологи, биотехнологи, геном судлал зэрэг салбарт биоинформатикийн аргаар эрдэмтдэд тусална.",
  "categorySlug": "technology",
  "jobZone": 4,
  "riasec": {
   "R": 47,
   "I": 90,
   "A": 10,
   "S": 12,
   "E": 0,
   "C": 84
  },
  "personality": {
   "O": 84,
   "C": 70,
   "E": 23,
   "A": 25
  },
  "cognitive": {
   "math": 63,
   "verbal": 55,
   "techSpatial": 48,
   "abstract": 48
  },
  "subjects": [
   "informatics",
   "math",
   "biology"
  ]
 },
 {
  "code": "17-1011.00",
  "slug": "architects-except-landscape-and-naval",
  "nameEn": "Architects, Except Landscape and Naval",
  "nameMn": "Архитектор (ландшафт, усан онгоцноос бусад)",
  "descriptionMn": "Орон сууц, оффис, театр, үйлдвэр зэрэг барилга байгууламжийг төлөвлөж зураг төсөл зохионо.",
  "categorySlug": "engineering",
  "jobZone": 5,
  "riasec": {
   "R": 65,
   "I": 48,
   "A": 52,
   "S": 25,
   "E": 44,
   "C": 57
  },
  "personality": {
   "O": 83,
   "C": 75,
   "E": 62,
   "A": 37
  },
  "cognitive": {
   "math": 69,
   "verbal": 67,
   "techSpatial": 81,
   "abstract": 72
  },
  "subjects": [
   "technology",
   "informatics",
   "math"
  ]
 },
 {
  "code": "17-1012.00",
  "slug": "landscape-architects",
  "nameEn": "Landscape Architects",
  "nameMn": "Ландшафтын архитектор",
  "descriptionMn": "Цэцэрлэгт хүрээлэн, нисэх онгоцны буудал, зам, эмнэлэг, сургууль, оршин суух бүс зэрэг газар нутгийн зураг төслийг боловсруулна.",
  "categorySlug": "engineering",
  "jobZone": 4,
  "riasec": {
   "R": 74,
   "I": 62,
   "A": 61,
   "S": 28,
   "E": 44,
   "C": 45
  },
  "personality": {
   "O": 78,
   "C": 59,
   "E": 61,
   "A": 41
  },
  "cognitive": {
   "math": 53,
   "verbal": 49,
   "techSpatial": 60,
   "abstract": 51
  },
  "subjects": [
   "geography",
   "technology",
   "informatics"
  ]
 },
 {
  "code": "17-1021.00",
  "slug": "cartographers-and-photogrammetrists",
  "nameEn": "Cartographers and Photogrammetrists",
  "nameMn": "Картограф, фотограмметрч",
  "descriptionMn": "Хууль эрх зүй, нийгэм, боловсрол, дизайн зэрэг зорилгоор газрын зураг болон орон зайн мэдээллийг судалж бэлтгэнэ.",
  "categorySlug": "engineering",
  "jobZone": 4,
  "riasec": {
   "R": 60,
   "I": 70,
   "A": 43,
   "S": 13,
   "E": 11,
   "C": 72
  },
  "personality": {
   "O": 66,
   "C": 59,
   "E": 21,
   "A": 12
  },
  "cognitive": {
   "math": 49,
   "verbal": 46,
   "techSpatial": 45,
   "abstract": 48
  },
  "subjects": [
   "geography",
   "informatics",
   "math"
  ]
 },
 {
  "code": "17-1022.00",
  "slug": "surveyors",
  "nameEn": "Surveyors",
  "nameMn": "Хэмжилтийн инженер (геодезист)",
  "descriptionMn": "Газрын хэмжилт хийж, эд хөрөнгийн хил хязгаарыг тодорхойлж, барилга, зураг зүй, уул уурхайн зорилгоор газрын мэдээлэл гаргана.",
  "categorySlug": "engineering",
  "jobZone": 4,
  "riasec": {
   "R": 71,
   "I": 62,
   "A": 19,
   "S": 10,
   "E": 15,
   "C": 72
  },
  "personality": {
   "O": 31,
   "C": 73,
   "E": 37,
   "A": 16
  },
  "cognitive": {
   "math": 70,
   "verbal": 48,
   "techSpatial": 82,
   "abstract": 54
  },
  "subjects": [
   "math",
   "informatics",
   "geography"
  ]
 },
 {
  "code": "17-1022.01",
  "slug": "geodetic-surveyors",
  "nameEn": "Geodetic Surveyors",
  "nameMn": "Геодезийн хэмжээчин",
  "descriptionMn": "Хиймэл дагуул, дэлхийн навигацийн систем, лидар зэргээр дэлхийн гадаргын том талбайг хэмжинэ.",
  "categorySlug": "engineering",
  "jobZone": 4,
  "riasec": {
   "R": 75,
   "I": 73,
   "A": 9,
   "S": 12,
   "E": 10,
   "C": 72
  },
  "personality": {
   "O": 52,
   "C": 68,
   "E": 31,
   "A": 7
  },
  "cognitive": {
   "math": 77,
   "verbal": 64,
   "techSpatial": 72,
   "abstract": 55
  },
  "subjects": [
   "math",
   "geography",
   "technology"
  ]
 },
 {
  "code": "17-2011.00",
  "slug": "aerospace-engineers",
  "nameEn": "Aerospace Engineers",
  "nameMn": "Нисэх онгоц, сансрын инженер",
  "descriptionMn": "Нисэх онгоц, пуужин, сансрын хөлгийг зохион бүтээж, барьж, туршина.",
  "categorySlug": "engineering",
  "jobZone": 4,
  "riasec": {
   "R": 78,
   "I": 84,
   "A": 23,
   "S": 4,
   "E": 25,
   "C": 57
  },
  "personality": {
   "O": 84,
   "C": 82,
   "E": 51,
   "A": 25
  },
  "cognitive": {
   "math": 76,
   "verbal": 78,
   "techSpatial": 78,
   "abstract": 68
  },
  "subjects": [
   "technology",
   "informatics",
   "physics"
  ]
 },
 {
  "code": "17-2021.00",
  "slug": "agricultural-engineers",
  "nameEn": "Agricultural Engineers",
  "nameMn": "Хөдөө аж ахуйн инженер",
  "descriptionMn": "Инженерчлэл, биологийн мэдлэгээр хөдөө аж ахуйн хүч, машин механизм, цахилгаан, байгууламж, ус хөрсний хамгаалал, боловсруулалтын асуудлыг шийднэ.",
  "categorySlug": "engineering",
  "jobZone": 4,
  "riasec": {
   "R": 94,
   "I": 88,
   "A": 20,
   "S": 12,
   "E": 22,
   "C": 46
  },
  "personality": {
   "O": 79,
   "C": 66,
   "E": 58,
   "A": 36
  },
  "cognitive": {
   "math": 67,
   "verbal": 59,
   "techSpatial": 92,
   "abstract": 65
  },
  "subjects": [
   "technology",
   "informatics",
   "math"
  ]
 },
 {
  "code": "17-2031.00",
  "slug": "bioengineers-and-biomedical-engineers",
  "nameEn": "Bioengineers and Biomedical Engineers",
  "nameMn": "Биоинженер, биомедицины инженер",
  "descriptionMn": "Инженерчлэл, биологи, хими, компьютерийн шинжлэх ухааны мэдлэгээр хиймэл эрхтэн, протез, багаж, эмнэлгийн мэдээллийн систем зэргийг зохион бүтээнэ.",
  "categorySlug": "engineering",
  "jobZone": 4,
  "riasec": {
   "R": 74,
   "I": 96,
   "A": 18,
   "S": 24,
   "E": 14,
   "C": 58
  },
  "personality": {
   "O": 92,
   "C": 74,
   "E": 52,
   "A": 39
  },
  "cognitive": {
   "math": 64,
   "verbal": 70,
   "techSpatial": 75,
   "abstract": 75
  },
  "subjects": [
   "technology",
   "informatics",
   "math"
  ]
 },
 {
  "code": "17-2041.00",
  "slug": "chemical-engineers",
  "nameEn": "Chemical Engineers",
  "nameMn": "Химийн инженер",
  "descriptionMn": "Хими, физик, инженерчлэлийн зарчмаар химийн үйлдвэрийн тоног төхөөрөмж зохион, бензин, хуванцар, цемент, цаас зэрэг бүтээгдэхүүний үйлдвэрлэлийн үйл явцыг боловсруулна.",
  "categorySlug": "engineering",
  "jobZone": 4,
  "riasec": {
   "R": 88,
   "I": 79,
   "A": 13,
   "S": 0,
   "E": 14,
   "C": 59
  },
  "personality": {
   "O": 83,
   "C": 74,
   "E": 47,
   "A": 23
  },
  "cognitive": {
   "math": 67,
   "verbal": 63,
   "techSpatial": 64,
   "abstract": 87
  },
  "subjects": [
   "technology",
   "chemistry",
   "math"
  ]
 },
 {
  "code": "17-2051.00",
  "slug": "civil-engineers",
  "nameEn": "Civil Engineers",
  "nameMn": "Барилгын инженер (иргэний)",
  "descriptionMn": "Барилга, зам, төмөр зам, нисэх буудал, гүүр, далан, усжуулалт, хоолой шугам, цахилгаан станц зэргийг төлөвлөж, зураг төсөл хийж, барилга ба засварыг удирдана.",
  "categorySlug": "engineering",
  "jobZone": 4,
  "riasec": {
   "R": 90,
   "I": 69,
   "A": 20,
   "S": 12,
   "E": 28,
   "C": 60
  },
  "personality": {
   "O": 75,
   "C": 75,
   "E": 61,
   "A": 32
  },
  "cognitive": {
   "math": 75,
   "verbal": 68,
   "techSpatial": 66,
   "abstract": 65
  },
  "subjects": [
   "technology",
   "math",
   "physics"
  ]
 },
 {
  "code": "17-2051.01",
  "slug": "transportation-engineers",
  "nameEn": "Transportation Engineers",
  "nameMn": "Тээврийн инженер",
  "descriptionMn": "Тогтоосон инженерийн стандарт, барилгын бодлогын дагуу хуурай замын тээврийн төслийн төлөвлөгөө боловсруулна.",
  "categorySlug": "engineering",
  "jobZone": 4,
  "riasec": {
   "R": 73,
   "I": 68,
   "A": 19,
   "S": 16,
   "E": 35,
   "C": 57
  },
  "personality": {
   "O": 68,
   "C": 73,
   "E": 45,
   "A": 29
  },
  "cognitive": {
   "math": 70,
   "verbal": 63,
   "techSpatial": 65,
   "abstract": 67
  },
  "subjects": [
   "technology",
   "math",
   "informatics"
  ]
 },
 {
  "code": "17-2061.00",
  "slug": "computer-hardware-engineers",
  "nameEn": "Computer Hardware Engineers",
  "nameMn": "Компьютерийн техник хангамжийн инженер",
  "descriptionMn": "Худалдаа, үйлдвэр, цэрэг, шинжлэх ухааны зорилгоор компьютер болон холбогдох тоног төхөөрөмжийг судалж, зохион бүтээж, туршина.",
  "categorySlug": "engineering",
  "jobZone": 4,
  "riasec": {
   "R": 78,
   "I": 76,
   "A": 14,
   "S": 14,
   "E": 16,
   "C": 73
  },
  "personality": {
   "O": 84,
   "C": 71,
   "E": 44,
   "A": 21
  },
  "cognitive": {
   "math": 54,
   "verbal": 56,
   "techSpatial": 69,
   "abstract": 59
  },
  "subjects": [
   "informatics",
   "technology",
   "math"
  ]
 },
 {
  "code": "17-2071.00",
  "slug": "electrical-engineers",
  "nameEn": "Electrical Engineers",
  "nameMn": "Цахилгааны инженер",
  "descriptionMn": "Цахилгаан тоног төхөөрөмж, бүрэлдэхүүн, системийг судалж, зохион бүтээж, туршиж, үйлдвэрлэл, суурилуулалтыг удирдана.",
  "categorySlug": "engineering",
  "jobZone": 4,
  "riasec": {
   "R": 84,
   "I": 74,
   "A": 19,
   "S": 12,
   "E": 24,
   "C": 57
  },
  "personality": {
   "O": 77,
   "C": 76,
   "E": 51,
   "A": 28
  },
  "cognitive": {
   "math": 66,
   "verbal": 62,
   "techSpatial": 72,
   "abstract": 58
  },
  "subjects": [
   "technology",
   "informatics",
   "math"
  ]
 },
 {
  "code": "17-2072.00",
  "slug": "electronics-engineers-except-computer",
  "nameEn": "Electronics Engineers, Except Computer",
  "nameMn": "Электроникийн инженер (компьютерээс бусад)",
  "descriptionMn": "Электроникийн онол, материалын шинж чанарыг ашиглан электрон бүрэлдэхүүн, системийг судалж, зохион бүтээж, туршина.",
  "categorySlug": "engineering",
  "jobZone": 4,
  "riasec": {
   "R": 87,
   "I": 80,
   "A": 17,
   "S": 10,
   "E": 10,
   "C": 61
  },
  "personality": {
   "O": 82,
   "C": 71,
   "E": 44,
   "A": 23
  },
  "cognitive": {
   "math": 63,
   "verbal": 53,
   "techSpatial": 80,
   "abstract": 61
  },
  "subjects": [
   "technology",
   "informatics",
   "math"
  ]
 },
 {
  "code": "17-2072.01",
  "slug": "radio-frequency-identification-device-specialists",
  "nameEn": "Radio Frequency Identification Device Specialists",
  "nameMn": "Радио давтамжаар таних төхөөрөмжийн (RFID) мэргэжилтэн",
  "descriptionMn": "Ачаа, барааг хянах RFID системийг зохион бүтээж нэвтрүүлнэ.",
  "categorySlug": "engineering",
  "jobZone": 4,
  "riasec": {
   "R": 68,
   "I": 64,
   "A": 7,
   "S": 9,
   "E": 9,
   "C": 72
  },
  "personality": {
   "O": 79,
   "C": 64,
   "E": 41,
   "A": 18
  },
  "cognitive": {
   "math": 52,
   "verbal": 43,
   "techSpatial": 57,
   "abstract": 49
  },
  "subjects": [
   "informatics",
   "technology",
   "math"
  ]
 },
 {
  "code": "17-2081.00",
  "slug": "environmental-engineers",
  "nameEn": "Environmental Engineers",
  "nameMn": "Байгаль орчны инженер",
  "descriptionMn": "Инженерийн янз бүрийн салбарын мэдлэгээр байгаль орчны аюулаас урьдчилан сэргийлэх, хянах, нөхөн сэргээх ажлыг судалж, төлөвлөнө.",
  "categorySlug": "engineering",
  "jobZone": 4,
  "riasec": {
   "R": 70,
   "I": 85,
   "A": 16,
   "S": 20,
   "E": 36,
   "C": 60
  },
  "personality": {
   "O": 81,
   "C": 73,
   "E": 61,
   "A": 41
  },
  "cognitive": {
   "math": 61,
   "verbal": 67,
   "techSpatial": 65,
   "abstract": 58
  },
  "subjects": [
   "technology",
   "math",
   "physics"
  ]
 },
 {
  "code": "17-2111.00",
  "slug": "health-and-safety-engineers-except-mining-safety-engineers-and-inspectors",
  "nameEn": "Health and Safety Engineers, Except Mining Safety Engineers and Inspectors",
  "nameMn": "Эрүүл мэнд, аюулгүй байдлын инженер",
  "descriptionMn": "Үйлдвэрлэлийн үйл явц, механик, хими, сэтгэл зүй, хууль журмын мэдлэгээр ажлын байр, бүтээгдэхүүний аюулгүй байдлыг хангана.",
  "categorySlug": "engineering",
  "jobZone": 4,
  "riasec": {
   "R": 73,
   "I": 77,
   "A": 1,
   "S": 19,
   "E": 21,
   "C": 61
  },
  "personality": {
   "O": 72,
   "C": 79,
   "E": 61,
   "A": 46
  },
  "cognitive": {
   "math": 43,
   "verbal": 46,
   "techSpatial": 65,
   "abstract": 45
  },
  "subjects": [
   "technology",
   "math",
   "chemistry"
  ]
 },
 {
  "code": "17-2111.02",
  "slug": "fire-prevention-and-protection-engineers",
  "nameEn": "Fire-Prevention and Protection Engineers",
  "nameMn": "Галын аюулаас хамгаалах инженер",
  "descriptionMn": "Галын шалтгааныг судалж, хамгаалалтын арга, барилгын бүрэлдэхүүн, галын мэдрэгч зэрэг материал, тоног төхөөрөмжийг зохион, санал болгоно.",
  "categorySlug": "engineering",
  "jobZone": 4,
  "riasec": {
   "R": 89,
   "I": 70,
   "A": 8,
   "S": 31,
   "E": 30,
   "C": 58
  },
  "personality": {
   "O": 77,
   "C": 81,
   "E": 60,
   "A": 37
  },
  "cognitive": {
   "math": 53,
   "verbal": 49,
   "techSpatial": 75,
   "abstract": 65
  },
  "subjects": [
   "technology",
   "math",
   "physics"
  ]
 },
 {
  "code": "17-2112.00",
  "slug": "industrial-engineers",
  "nameEn": "Industrial Engineers",
  "nameMn": "Үйлдвэрлэлийн инженер",
  "descriptionMn": "Үйлдвэрлэлийн үйл явц, хүний хүчин зүйл, чанарын хяналт, нөөц, логистик, зардлын шинжилгээг нэгтгэсэн системийг зохион бүтээж үнэлнэ.",
  "categorySlug": "engineering",
  "jobZone": 4,
  "riasec": {
   "R": 66,
   "I": 67,
   "A": 10,
   "S": 6,
   "E": 38,
   "C": 73
  },
  "personality": {
   "O": 77,
   "C": 70,
   "E": 57,
   "A": 31
  },
  "cognitive": {
   "math": 57,
   "verbal": 54,
   "techSpatial": 76,
   "abstract": 57
  },
  "subjects": [
   "technology",
   "math",
   "informatics"
  ]
 },
 {
  "code": "17-2112.01",
  "slug": "human-factors-engineers-and-ergonomists",
  "nameEn": "Human Factors Engineers and Ergonomists",
  "nameMn": "Хүний хүчин зүйл, эргономикийн инженер",
  "descriptionMn": "Хүн ба технологийн харилцааны онолоор хүний сайн сайхан байдал, системийн гүйцэтгэлийг оновчтой болгох эд зүйл, орчныг зохион бүтээнэ.",
  "categorySlug": "engineering",
  "jobZone": 5,
  "riasec": {
   "R": 59,
   "I": 87,
   "A": 27,
   "S": 19,
   "E": 26,
   "C": 57
  },
  "personality": {
   "O": 85,
   "C": 65,
   "E": 51,
   "A": 51
  },
  "cognitive": {
   "math": 64,
   "verbal": 70,
   "techSpatial": 60,
   "abstract": 68
  },
  "subjects": [
   "technology",
   "social",
   "math"
  ]
 },
 {
  "code": "17-2112.02",
  "slug": "validation-engineers",
  "nameEn": "Validation Engineers",
  "nameMn": "Баталгаажуулалтын инженер",
  "descriptionMn": "Дотоод, гадаад цэвэр байдал, аюулгүй байдал, чанарын шаардлагад нийцсэн бүтээгдэхүүнийг гаргах тоног төхөөрөмж, үйл явцын протоколыг боловсруулна.",
  "categorySlug": "engineering",
  "jobZone": 4,
  "riasec": {
   "R": 64,
   "I": 76,
   "A": 8,
   "S": 7,
   "E": 17,
   "C": 68
  },
  "personality": {
   "O": 61,
   "C": 82,
   "E": 46,
   "A": 31
  },
  "cognitive": {
   "math": 61,
   "verbal": 52,
   "techSpatial": 56,
   "abstract": 58
  },
  "subjects": [
   "technology",
   "math",
   "informatics"
  ]
 },
 {
  "code": "17-2112.03",
  "slug": "manufacturing-engineers",
  "nameEn": "Manufacturing Engineers",
  "nameMn": "Үйлдвэрлэлийн технологийн инженер",
  "descriptionMn": "Үйлдвэрлэлийн систем, холбогдох үйл явцыг зохион бүтээж, нэгтгэж, сайжруулна.",
  "categorySlug": "engineering",
  "jobZone": 4,
  "riasec": {
   "R": 71,
   "I": 59,
   "A": 20,
   "S": 10,
   "E": 35,
   "C": 57
  },
  "personality": {
   "O": 77,
   "C": 70,
   "E": 52,
   "A": 27
  },
  "cognitive": {
   "math": 78,
   "verbal": 67,
   "techSpatial": 84,
   "abstract": 73
  },
  "subjects": [
   "technology",
   "math",
   "informatics"
  ]
 },
 {
  "code": "17-2121.00",
  "slug": "marine-engineers-and-naval-architects",
  "nameEn": "Marine Engineers and Naval Architects",
  "nameMn": "Усан онгоцны инженер, далайн хөлөг зохион бүтээгч",
  "descriptionMn": "Далайн хөлөг, хөлгийн машин механизм, хүчний болон хөдөлгүүрийн системийг зохион бүтээж, хөгжүүлж, ажиллагааг нь үнэлнэ.",
  "categorySlug": "engineering",
  "jobZone": 4,
  "riasec": {
   "R": 79,
   "I": 79,
   "A": 27,
   "S": 5,
   "E": 38,
   "C": 55
  },
  "personality": {
   "O": 80,
   "C": 78,
   "E": 54,
   "A": 29
  },
  "cognitive": {
   "math": 65,
   "verbal": 60,
   "techSpatial": 96,
   "abstract": 78
  },
  "subjects": [
   "technology",
   "physics",
   "informatics"
  ]
 },
 {
  "code": "17-2131.00",
  "slug": "materials-engineers",
  "nameEn": "Materials Engineers",
  "nameMn": "Материалын инженер",
  "descriptionMn": "Тусгай шаардлагад нийцэх бүтээгдэхүүнд хэрэглэх материалыг үнэлж, үйлдвэрлэх машин, үйл явцыг боловсруулна.",
  "categorySlug": "engineering",
  "jobZone": 4,
  "riasec": {
   "R": 81,
   "I": 80,
   "A": 26,
   "S": 6,
   "E": 18,
   "C": 52
  },
  "personality": {
   "O": 83,
   "C": 74,
   "E": 49,
   "A": 25
  },
  "cognitive": {
   "math": 76,
   "verbal": 72,
   "techSpatial": 68,
   "abstract": 87
  },
  "subjects": [
   "technology",
   "math",
   "physics"
  ]
 },
 {
  "code": "17-2141.00",
  "slug": "mechanical-engineers",
  "nameEn": "Mechanical Engineers",
  "nameMn": "Машин механизмын инженер",
  "descriptionMn": "Багаж, хөдөлгүүр, машин, механик ажиллагаатай тоног төхөөрөмжийг төлөвлөж зохион бүтээнэ.",
  "categorySlug": "engineering",
  "jobZone": 4,
  "riasec": {
   "R": 90,
   "I": 69,
   "A": 17,
   "S": 4,
   "E": 16,
   "C": 64
  },
  "personality": {
   "O": 79,
   "C": 72,
   "E": 46,
   "A": 26
  },
  "cognitive": {
   "math": 73,
   "verbal": 62,
   "techSpatial": 77,
   "abstract": 67
  },
  "subjects": [
   "technology",
   "math",
   "physics"
  ]
 },
 {
  "code": "17-2141.01",
  "slug": "fuel-cell-engineers",
  "nameEn": "Fuel Cell Engineers",
  "nameMn": "Түлшний элементийн инженер",
  "descriptionMn": "Тээвэр, суурин болон зөөврийн хэрэглээнд зориулсан түлшний элементийн бүрэлдэхүүн, системийг зохион бүтээж, үнэлж, засварлана.",
  "categorySlug": "engineering",
  "jobZone": 4,
  "riasec": {
   "R": 76,
   "I": 73,
   "A": 14,
   "S": 7,
   "E": 25,
   "C": 51
  },
  "personality": {
   "O": 88,
   "C": 75,
   "E": 49,
   "A": 22
  },
  "cognitive": {
   "math": 66,
   "verbal": 68,
   "techSpatial": 75,
   "abstract": 56
  },
  "subjects": [
   "technology",
   "physics",
   "chemistry"
  ]
 },
 {
  "code": "17-2141.02",
  "slug": "automotive-engineers",
  "nameEn": "Automotive Engineers",
  "nameMn": "Авто машины инженер",
  "descriptionMn": "Компьютерийн тусламжтай зураг төслийн технологиор тээврийн хэрэгслийн хүрээ, хөдөлгүүр, дамжуулалтын шинэ эсвэл сайжруулсан загвар гаргана.",
  "categorySlug": "engineering",
  "jobZone": 4,
  "riasec": {
   "R": 86,
   "I": 78,
   "A": 26,
   "S": 6,
   "E": 19,
   "C": 51
  },
  "personality": {
   "O": 84,
   "C": 71,
   "E": 50,
   "A": 25
  },
  "cognitive": {
   "math": 76,
   "verbal": 59,
   "techSpatial": 97,
   "abstract": 71
  },
  "subjects": [
   "technology",
   "physics",
   "math"
  ]
 },
 {
  "code": "17-2151.00",
  "slug": "mining-and-geological-engineers-including-mining-safety-engineers",
  "nameEn": "Mining and Geological Engineers, Including Mining Safety Engineers",
  "nameMn": "Уул уурхай, геологийн инженер",
  "descriptionMn": "Газрын хэвлийн судалгаа хийж, боломжит газар болон уурхайн талбайн шинж чанарыг тодорхойлно.",
  "categorySlug": "engineering",
  "jobZone": 4,
  "riasec": {
   "R": 85,
   "I": 76,
   "A": 9,
   "S": 14,
   "E": 29,
   "C": 61
  },
  "personality": {
   "O": 75,
   "C": 81,
   "E": 57,
   "A": 31
  },
  "cognitive": {
   "math": 69,
   "verbal": 68,
   "techSpatial": 63,
   "abstract": 72
  },
  "subjects": [
   "technology",
   "math",
   "physics"
  ]
 },
 {
  "code": "17-2161.00",
  "slug": "nuclear-engineers",
  "nameEn": "Nuclear Engineers",
  "nameMn": "Цөмийн инженер",
  "descriptionMn": "Цөмийн инженерийн төслийн судалгаа хийж, цөмийн энергийн ашиглалт, хяналт, цөмийн хаягдлын асуудалд цөмийн шинжлэх ухааны онолыг хэрэглэнэ.",
  "categorySlug": "engineering",
  "jobZone": 4,
  "riasec": {
   "R": 65,
   "I": 91,
   "A": 17,
   "S": 15,
   "E": 25,
   "C": 58
  },
  "personality": {
   "O": 80,
   "C": 97,
   "E": 49,
   "A": 35
  },
  "cognitive": {
   "math": 69,
   "verbal": 75,
   "techSpatial": 65,
   "abstract": 61
  },
  "subjects": [
   "technology",
   "math",
   "physics"
  ]
 },
 {
  "code": "17-2171.00",
  "slug": "petroleum-engineers",
  "nameEn": "Petroleum Engineers",
  "nameMn": "Газрын тосны инженер",
  "descriptionMn": "Газрын тос, хийн олборлолт, үйлдвэрлэлийг сайжруулах арга зүй боловсруулж, шинэ багаж зохион бүтээх хэрэгцээг тодорхойлно.",
  "categorySlug": "engineering",
  "jobZone": 4,
  "riasec": {
   "R": 73,
   "I": 72,
   "A": 15,
   "S": 13,
   "E": 34,
   "C": 55
  },
  "personality": {
   "O": 79,
   "C": 79,
   "E": 55,
   "A": 23
  },
  "cognitive": {
   "math": 59,
   "verbal": 60,
   "techSpatial": 51,
   "abstract": 54
  },
  "subjects": [
   "technology",
   "math",
   "physics"
  ]
 },
 {
  "code": "17-2199.03",
  "slug": "energy-engineers-except-wind-and-solar",
  "nameEn": "Energy Engineers, Except Wind and Solar",
  "nameMn": "Эрчим хүчний инженер (салхи, нарнаас бусад)",
  "descriptionMn": "Барилгын зураг төсөл, барилга, шинэчлэлийн шатанд эрчим хүчний зардлыг бууруулж, үр ашгийг нэмэгдүүлэх төсөл, хөтөлбөрийг боловсруулж үнэлнэ.",
  "categorySlug": "engineering",
  "jobZone": 4,
  "riasec": {
   "R": 70,
   "I": 62,
   "A": 17,
   "S": 21,
   "E": 35,
   "C": 57
  },
  "personality": {
   "O": 78,
   "C": 70,
   "E": 52,
   "A": 30
  },
  "cognitive": {
   "math": 70,
   "verbal": 62,
   "techSpatial": 71,
   "abstract": 59
  },
  "subjects": [
   "technology",
   "math",
   "physics"
  ]
 },
 {
  "code": "17-2199.05",
  "slug": "mechatronics-engineers",
  "nameEn": "Mechatronics Engineers",
  "nameMn": "Мехатроникийн инженер",
  "descriptionMn": "Автоматжуулалт, ухаалаг систем, ухаалаг төхөөрөмж, үйлдвэрлэлийн системийн удирдлагыг судалж, зохион бүтээж, туршина.",
  "categorySlug": "engineering",
  "jobZone": 4,
  "riasec": {
   "R": 78,
   "I": 76,
   "A": 24,
   "S": 10,
   "E": 12,
   "C": 64
  },
  "personality": {
   "O": 85,
   "C": 69,
   "E": 46,
   "A": 20
  },
  "cognitive": {
   "math": 60,
   "verbal": 65,
   "techSpatial": 69,
   "abstract": 56
  },
  "subjects": [
   "technology",
   "math",
   "physics"
  ]
 },
 {
  "code": "17-2199.06",
  "slug": "microsystems-engineers",
  "nameEn": "Microsystems Engineers",
  "nameMn": "Микросистемийн инженер",
  "descriptionMn": "Микроэлектромеханик системийн (MEMS) төхөөрөмжийг судалж, зохион бүтээж, туршина.",
  "categorySlug": "engineering",
  "jobZone": 5,
  "riasec": {
   "R": 75,
   "I": 87,
   "A": 16,
   "S": 9,
   "E": 7,
   "C": 65
  },
  "personality": {
   "O": 86,
   "C": 77,
   "E": 39,
   "A": 19
  },
  "cognitive": {
   "math": 64,
   "verbal": 63,
   "techSpatial": 80,
   "abstract": 64
  },
  "subjects": [
   "technology",
   "informatics",
   "math"
  ]
 },
 {
  "code": "17-2199.07",
  "slug": "photonics-engineers",
  "nameEn": "Photonics Engineers",
  "nameMn": "Фотоникийн инженер",
  "descriptionMn": "Лазер, шилэн кабель зэрэг гэрлийн мэдээлэл, гэрлийн энергийн технологийг зохион бүтээнэ.",
  "categorySlug": "engineering",
  "jobZone": 4,
  "riasec": {
   "R": 82,
   "I": 81,
   "A": 30,
   "S": 6,
   "E": 12,
   "C": 49
  },
  "personality": {
   "O": 87,
   "C": 70,
   "E": 40,
   "A": 20
  },
  "cognitive": {
   "math": 78,
   "verbal": 70,
   "techSpatial": 73,
   "abstract": 80
  },
  "subjects": [
   "technology",
   "physics",
   "math"
  ]
 },
 {
  "code": "17-2199.08",
  "slug": "robotics-engineers",
  "nameEn": "Robotics Engineers",
  "nameMn": "Робот техникийн инженер",
  "descriptionMn": "Робот техникийн хэрэглээг судалж, зохион бүтээж, хөгжүүлж, туршина.",
  "categorySlug": "engineering",
  "jobZone": 4,
  "riasec": {
   "R": 86,
   "I": 77,
   "A": 13,
   "S": 8,
   "E": 13,
   "C": 58
  },
  "personality": {
   "O": 86,
   "C": 76,
   "E": 41,
   "A": 16
  },
  "cognitive": {
   "math": 75,
   "verbal": 68,
   "techSpatial": 100,
   "abstract": 67
  },
  "subjects": [
   "technology",
   "informatics",
   "math"
  ]
 },
 {
  "code": "17-2199.09",
  "slug": "nanosystems-engineers",
  "nameEn": "Nanosystems Engineers",
  "nameMn": "Нано системийн инженер",
  "descriptionMn": "Нано хэмжээний физик, цахилгаан, хими, биологийн инженерчлэлийн зарчмаар онцгой молекул бүтэцтэй материал, төхөөрөмж, системийг зохион бүтээнэ.",
  "categorySlug": "engineering",
  "jobZone": 5,
  "riasec": {
   "R": 72,
   "I": 85,
   "A": 23,
   "S": 8,
   "E": 26,
   "C": 51
  },
  "personality": {
   "O": 99,
   "C": 86,
   "E": 56,
   "A": 26
  },
  "cognitive": {
   "math": 75,
   "verbal": 80,
   "techSpatial": 67,
   "abstract": 84
  },
  "subjects": [
   "physics",
   "technology",
   "chemistry"
  ]
 },
 {
  "code": "17-3011.00",
  "slug": "architectural-and-civil-drafters",
  "nameEn": "Architectural and Civil Drafters",
  "nameMn": "Архитектур, барилгын зураач (драфтер)",
  "descriptionMn": "Барилгын архитектур, бүтцийн нарийвчилсан зураг, замын гүүр, нийтийн байгууламжийн топографийн зураг зэргийг бэлтгэнэ.",
  "categorySlug": "engineering",
  "jobZone": 3,
  "riasec": {
   "R": 76,
   "I": 54,
   "A": 58,
   "S": 9,
   "E": 9,
   "C": 65
  },
  "personality": {
   "O": 44,
   "C": 53,
   "E": 21,
   "A": 14
  },
  "cognitive": {
   "math": 52,
   "verbal": 37,
   "techSpatial": 58,
   "abstract": 41
  },
  "subjects": [
   "technology",
   "informatics",
   "math"
  ]
 },
 {
  "code": "17-3012.00",
  "slug": "electrical-and-electronics-drafters",
  "nameEn": "Electrical and Electronics Drafters",
  "nameMn": "Цахилгаан, электроникийн зураач (драфтер)",
  "descriptionMn": "Цахилгаан тоног төхөөрөмж үйлдвэрлэх, суурилуулах, засахад хэрэгтэй утасны схем, хэлхээний самбарын зураг, байршлын зургийг гаргана.",
  "categorySlug": "engineering",
  "jobZone": 3,
  "riasec": {
   "R": 77,
   "I": 41,
   "A": 34,
   "S": 5,
   "E": 15,
   "C": 76
  },
  "personality": {
   "O": 34,
   "C": 48,
   "E": 11,
   "A": 18
  },
  "cognitive": {
   "math": 48,
   "verbal": 45,
   "techSpatial": 66,
   "abstract": 35
  },
  "subjects": [
   "technology",
   "informatics",
   "math"
  ]
 },
 {
  "code": "17-3013.00",
  "slug": "mechanical-drafters",
  "nameEn": "Mechanical Drafters",
  "nameMn": "Машин механизмын зураач (драфтер)",
  "descriptionMn": "Машин, механик төхөөрөмжийн хэмжээ, бэхэлгээний арга зэрэг инженерийн мэдээлэл бүхий нарийвчилсан ажлын зургийг гаргана.",
  "categorySlug": "engineering",
  "jobZone": 3,
  "riasec": {
   "R": 83,
   "I": 47,
   "A": 44,
   "S": 3,
   "E": 6,
   "C": 64
  },
  "personality": {
   "O": 40,
   "C": 54,
   "E": 19,
   "A": 15
  },
  "cognitive": {
   "math": 59,
   "verbal": 35,
   "techSpatial": 68,
   "abstract": 39
  },
  "subjects": [
   "technology",
   "math",
   "informatics"
  ]
 },
 {
  "code": "17-3021.00",
  "slug": "aerospace-engineering-and-operations-technologists-and-technicians",
  "nameEn": "Aerospace Engineering and Operations Technologists and Technicians",
  "nameMn": "Нисэх, сансрын инженерийн техникч",
  "descriptionMn": "Нисэх болон сансрын хөлгийг хөөргөх, хянах, байрлуулах, үнэлэхэд ашиглагдах компьютер, холбооны систем, симулятор, хэмжих багаж, тоног төхөөрөмжийг ажиллуулж, суурилуулж, засна.",
  "categorySlug": "engineering",
  "jobZone": 3,
  "riasec": {
   "R": 91,
   "I": 69,
   "A": 0,
   "S": 0,
   "E": 7,
   "C": 72
  },
  "personality": {
   "O": 57,
   "C": 50,
   "E": 26,
   "A": 24
  },
  "cognitive": {
   "math": 49,
   "verbal": 48,
   "techSpatial": 77,
   "abstract": 49
  },
  "subjects": [
   "technology",
   "math",
   "physics"
  ]
 },
 {
  "code": "17-3022.00",
  "slug": "civil-engineering-technologists-and-technicians",
  "nameEn": "Civil Engineering Technologists and Technicians",
  "nameMn": "Барилгын инженерийн техникч",
  "descriptionMn": "Инженер, физик шинжлэх ухааны мэргэжилтний удирдлаган дор барилга байгууламжийн төлөвлөлт, зураг төсөл, барилга болон засварт барилгын инженерийн онолыг хэрэглэнэ.",
  "categorySlug": "engineering",
  "jobZone": 3,
  "riasec": {
   "R": 79,
   "I": 73,
   "A": 31,
   "S": 9,
   "E": 17,
   "C": 71
  },
  "personality": {
   "O": 44,
   "C": 59,
   "E": 27,
   "A": 24
  },
  "cognitive": {
   "math": 59,
   "verbal": 46,
   "techSpatial": 74,
   "abstract": 45
  },
  "subjects": [
   "technology",
   "math",
   "informatics"
  ]
 },
 {
  "code": "17-3023.00",
  "slug": "electrical-and-electronic-engineering-technologists-and-technicians",
  "nameEn": "Electrical and Electronic Engineering Technologists and Technicians",
  "nameMn": "Цахилгаан, электроникийн инженерийн техникч",
  "descriptionMn": "Инженерүүдийн удирдлаган дор цахилгаан бүрэлдэхүүн, хэлхээ, удирдлага, машиныг зохион бүтээж, угсарч, засаж, тохируулна.",
  "categorySlug": "engineering",
  "jobZone": 3,
  "riasec": {
   "R": 88,
   "I": 70,
   "A": 13,
   "S": 13,
   "E": 5,
   "C": 67
  },
  "personality": {
   "O": 62,
   "C": 67,
   "E": 27,
   "A": 21
  },
  "cognitive": {
   "math": 48,
   "verbal": 46,
   "techSpatial": 81,
   "abstract": 39
  },
  "subjects": [
   "technology",
   "informatics",
   "math"
  ]
 },
 {
  "code": "17-3024.00",
  "slug": "electro-mechanical-and-mechatronics-technologists-and-technicians",
  "nameEn": "Electro-Mechanical and Mechatronics Technologists and Technicians",
  "nameMn": "Цахилгаан механик, мехатроникийн техникч",
  "descriptionMn": "Жолоочгүй, автомат, серво болон цахилгаан механик тоног төхөөрөмжийг ажиллуулж, шалгаж, засвар үйлчилгээ хийнэ.",
  "categorySlug": "engineering",
  "jobZone": 3,
  "riasec": {
   "R": 100,
   "I": 56,
   "A": 6,
   "S": 0,
   "E": 0,
   "C": 60
  },
  "personality": {
   "O": 56,
   "C": 64,
   "E": 17,
   "A": 14
  },
  "cognitive": {
   "math": 48,
   "verbal": 35,
   "techSpatial": 86,
   "abstract": 41
  },
  "subjects": [
   "informatics",
   "technology",
   "math"
  ]
 },
 {
  "code": "17-3024.01",
  "slug": "robotics-technicians",
  "nameEn": "Robotics Technicians",
  "nameMn": "Робот техникийн техникч",
  "descriptionMn": "Робот тоног төхөөрөмж болон холбогдох автомат үйлдвэрлэлийн системийг угсарч, суурилуулж, шалгаж, засвар үйлчилгээ хийнэ.",
  "categorySlug": "engineering",
  "jobZone": 3,
  "riasec": {
   "R": 99,
   "I": 48,
   "A": 0,
   "S": 2,
   "E": 6,
   "C": 61
  },
  "personality": {
   "O": 63,
   "C": 62,
   "E": 26,
   "A": 17
  },
  "cognitive": {
   "math": 48,
   "verbal": 46,
   "techSpatial": 92,
   "abstract": 51
  },
  "subjects": [
   "informatics",
   "technology",
   "math"
  ]
 },
 {
  "code": "17-3025.00",
  "slug": "environmental-engineering-technologists-and-technicians",
  "nameEn": "Environmental Engineering Technologists and Technicians",
  "nameMn": "Байгаль орчны инженерийн техникч",
  "descriptionMn": "Инженер, эрдэмтдийн удирдлаган дор хаягдал боловсруулалт, нөхөн сэргээлт зэрэг байгаль орчны асуудлыг шийддэг тоног төхөөрөмжийг тохируулж, шалгаж, ажиллуулна.",
  "categorySlug": "engineering",
  "jobZone": 4,
  "riasec": {
   "R": 88,
   "I": 82,
   "A": 12,
   "S": 8,
   "E": 5,
   "C": 63
  },
  "personality": {
   "O": 60,
   "C": 64,
   "E": 23,
   "A": 28
  },
  "cognitive": {
   "math": 58,
   "verbal": 54,
   "techSpatial": 66,
   "abstract": 52
  },
  "subjects": [
   "math",
   "technology",
   "chemistry"
  ]
 },
 {
  "code": "17-3026.00",
  "slug": "industrial-engineering-technologists-and-technicians",
  "nameEn": "Industrial Engineering Technologists and Technicians",
  "nameMn": "Үйлдвэрлэлийн инженерийн техникч",
  "descriptionMn": "Инженерчлэлийн онолыг ашиглан үйлдвэрийн байршил, үйлдвэрлэлийн асуудлыг шийдэхэд тусална.",
  "categorySlug": "engineering",
  "jobZone": 3,
  "riasec": {
   "R": 72,
   "I": 69,
   "A": 4,
   "S": 7,
   "E": 22,
   "C": 70
  },
  "personality": {
   "O": 48,
   "C": 56,
   "E": 26,
   "A": 23
  },
  "cognitive": {
   "math": 55,
   "verbal": 45,
   "techSpatial": 72,
   "abstract": 52
  },
  "subjects": [
   "technology",
   "informatics",
   "math"
  ]
 },
 {
  "code": "17-3026.01",
  "slug": "nanotechnology-engineering-technologists-and-technicians",
  "nameEn": "Nanotechnology Engineering Technologists and Technicians",
  "nameMn": "Нанотехнологийн инженерийн техникч",
  "descriptionMn": "Онцгой молекул бүтэцтэй материал, төхөөрөмж, системийг үйлдвэрлэх, шалгах, өөрчлөх арилжааны хэмжээний үйлдвэрлэлийн тоног төхөөрөмжийг ажиллуулна.",
  "categorySlug": "engineering",
  "jobZone": 4,
  "riasec": {
   "R": 86,
   "I": 66,
   "A": 9,
   "S": 1,
   "E": 17,
   "C": 64
  },
  "personality": {
   "O": 72,
   "C": 78,
   "E": 21,
   "A": 26
  },
  "cognitive": {
   "math": 58,
   "verbal": 69,
   "techSpatial": 77,
   "abstract": 59
  },
  "subjects": [
   "technology",
   "informatics",
   "math"
  ]
 },
 {
  "code": "17-3027.00",
  "slug": "mechanical-engineering-technologists-and-technicians",
  "nameEn": "Mechanical Engineering Technologists and Technicians",
  "nameMn": "Машин механизмын инженерийн техникч",
  "descriptionMn": "Инженер, физик шинжлэх ухааны мэргэжилтний удирдлаган дор машин, тоног төхөөрөмжийг өөрчилж, боловсруулж, шалгаж, тохируулна.",
  "categorySlug": "engineering",
  "jobZone": 3,
  "riasec": {
   "R": 88,
   "I": 73,
   "A": 20,
   "S": 3,
   "E": 1,
   "C": 63
  },
  "personality": {
   "O": 69,
   "C": 65,
   "E": 30,
   "A": 23
  },
  "cognitive": {
   "math": 61,
   "verbal": 46,
   "techSpatial": 82,
   "abstract": 58
  },
  "subjects": [
   "technology",
   "math",
   "physics"
  ]
 },
 {
  "code": "17-3027.01",
  "slug": "automotive-engineering-technicians",
  "nameEn": "Automotive Engineering Technicians",
  "nameMn": "Авто машины инженерийн техникч",
  "descriptionMn": "Инженерүүдэд бүтээгдэхүүний загварын өөрчлөлтийн боломжийг тодорхойлоход тусалж, туршилтын төхөөрөмжийн гүйцэтгэл, бат бөх байдлыг шалгана.",
  "categorySlug": "engineering",
  "jobZone": 3,
  "riasec": {
   "R": 100,
   "I": 73,
   "A": 7,
   "S": 0,
   "E": 4,
   "C": 58
  },
  "personality": {
   "O": 67,
   "C": 62,
   "E": 23,
   "A": 18
  },
  "cognitive": {
   "math": 45,
   "verbal": 38,
   "techSpatial": 88,
   "abstract": 39
  },
  "subjects": [
   "technology",
   "informatics",
   "math"
  ]
 },
 {
  "code": "17-3029.08",
  "slug": "photonics-technicians",
  "nameEn": "Photonics Technicians",
  "nameMn": "Фотоникийн техникч",
  "descriptionMn": "Спектрометр, интерферометр зэрэг багажаар лазер, линз, толь зэрэг оптик болон шилэн кабелийн тоног төхөөрөмжийг угсарч, суурилуулж, шалгаж, засна.",
  "categorySlug": "engineering",
  "jobZone": 3,
  "riasec": {
   "R": 100,
   "I": 53,
   "A": 0,
   "S": 0,
   "E": 0,
   "C": 74
  },
  "personality": {
   "O": 53,
   "C": 62,
   "E": 18,
   "A": 20
  },
  "cognitive": {
   "math": 46,
   "verbal": 37,
   "techSpatial": 65,
   "abstract": 22
  },
  "subjects": [
   "informatics",
   "technology",
   "math"
  ]
 },
 {
  "code": "17-3031.00",
  "slug": "surveying-and-mapping-technicians",
  "nameEn": "Surveying and Mapping Technicians",
  "nameMn": "Хэмжилт, зураг зүйн техникч",
  "descriptionMn": "Инженер, геодезист, картографчийн удирдлаган дор барилга, зураг зүй, уул уурхайн зорилгоор хэмжилт, зураг зүйн ажил хийнэ.",
  "categorySlug": "engineering",
  "jobZone": 3,
  "riasec": {
   "R": 82,
   "I": 51,
   "A": 15,
   "S": 0,
   "E": 0,
   "C": 77
  },
  "personality": {
   "O": 42,
   "C": 48,
   "E": 14,
   "A": 13
  },
  "cognitive": {
   "math": 48,
   "verbal": 38,
   "techSpatial": 56,
   "abstract": 32
  },
  "subjects": [
   "geography",
   "math",
   "informatics"
  ]
 },
 {
  "code": "19-1011.00",
  "slug": "animal-scientists",
  "nameEn": "Animal Scientists",
  "nameMn": "Мал аж ахуйн эрдэмтэн",
  "descriptionMn": "Тэжээвэр мал, ферм дэх амьтдын удамшил, хоол тэжээл, үржил, өсөлт, хөгжлийг судална.",
  "categorySlug": "science",
  "jobZone": 5,
  "riasec": {
   "R": 71,
   "I": 99,
   "A": 16,
   "S": 16,
   "E": 23,
   "C": 39
  },
  "personality": {
   "O": 83,
   "C": 63,
   "E": 47,
   "A": 31
  },
  "cognitive": {
   "math": 58,
   "verbal": 72,
   "techSpatial": 53,
   "abstract": 67
  },
  "subjects": [
   "biology",
   "math",
   "chemistry"
  ]
 },
 {
  "code": "19-1012.00",
  "slug": "food-scientists-and-technologists",
  "nameEn": "Food Scientists and Technologists",
  "nameMn": "Хүнсний технологич, эрдэмтэн",
  "descriptionMn": "Хими, микробиологи, инженерчлэлийг ашиглан хүнс боловсруулалт, муудалтын зарчмыг судалж, хүнсний аюулгүй, амттай, эрүүл байдлыг сайжруулна.",
  "categorySlug": "science",
  "jobZone": 4,
  "riasec": {
   "R": 68,
   "I": 79,
   "A": 24,
   "S": 19,
   "E": 26,
   "C": 49
  },
  "personality": {
   "O": 83,
   "C": 69,
   "E": 48,
   "A": 29
  },
  "cognitive": {
   "math": 59,
   "verbal": 62,
   "techSpatial": 43,
   "abstract": 62
  },
  "subjects": [
   "chemistry",
   "math",
   "biology"
  ]
 },
 {
  "code": "19-1013.00",
  "slug": "soil-and-plant-scientists",
  "nameEn": "Soil and Plant Scientists",
  "nameMn": "Хөрс, ургамлын эрдэмтэн",
  "descriptionMn": "Тариалангийн ургамал, мод бут, суулгацын үржил, физиологи, ургац, удирдлага, хөрсөн дэх өсөлт, хортон ялзмагтай тэмцэх болон хөрсний бүтцийг судална.",
  "categorySlug": "science",
  "jobZone": 5,
  "riasec": {
   "R": 90,
   "I": 95,
   "A": 18,
   "S": 11,
   "E": 12,
   "C": 40
  },
  "personality": {
   "O": 87,
   "C": 51,
   "E": 43,
   "A": 24
  },
  "cognitive": {
   "math": 55,
   "verbal": 75,
   "techSpatial": 65,
   "abstract": 77
  },
  "subjects": [
   "biology",
   "math",
   "informatics"
  ]
 },
 {
  "code": "19-1021.00",
  "slug": "biochemists-and-biophysicists",
  "nameEn": "Biochemists and Biophysicists",
  "nameMn": "Биохимич, биофизикч",
  "descriptionMn": "Амьд эс, организмын химийн найрлага, физик зарчим, цахилгаан ба механик энерги болон холбогдох үзэгдлийг судална.",
  "categorySlug": "science",
  "jobZone": 5,
  "riasec": {
   "R": 69,
   "I": 100,
   "A": 27,
   "S": 19,
   "E": 14,
   "C": 44
  },
  "personality": {
   "O": 90,
   "C": 75,
   "E": 49,
   "A": 32
  },
  "cognitive": {
   "math": 76,
   "verbal": 90,
   "techSpatial": 60,
   "abstract": 93
  },
  "subjects": [
   "biology",
   "math",
   "chemistry"
  ]
 },
 {
  "code": "19-1022.00",
  "slug": "microbiologists",
  "nameEn": "Microbiologists",
  "nameMn": "Микробиологич",
  "descriptionMn": "Бактери, замаг, мөөгөнцөр зэрэг нүдэнд үл харагдах организмын өсөлт, бүтэц, хөгжил болон бусад шинж чанарыг судална.",
  "categorySlug": "science",
  "jobZone": 4,
  "riasec": {
   "R": 72,
   "I": 100,
   "A": 15,
   "S": 16,
   "E": 1,
   "C": 48
  },
  "personality": {
   "O": 88,
   "C": 82,
   "E": 40,
   "A": 27
  },
  "cognitive": {
   "math": 64,
   "verbal": 75,
   "techSpatial": 51,
   "abstract": 87
  },
  "subjects": [
   "biology",
   "chemistry",
   "informatics"
  ]
 },
 {
  "code": "19-1023.00",
  "slug": "zoologists-and-wildlife-biologists",
  "nameEn": "Zoologists and Wildlife Biologists",
  "nameMn": "Амьтан судлаач, зэрлэг амьтны биологич",
  "descriptionMn": "Амьтан, зэрлэг ан амьтны гарал үүсэл, зан үйл, өвчин, удамшил, амьдралын үйл явцыг судална.",
  "categorySlug": "science",
  "jobZone": 4,
  "riasec": {
   "R": 74,
   "I": 100,
   "A": 22,
   "S": 26,
   "E": 22,
   "C": 45
  },
  "personality": {
   "O": 86,
   "C": 63,
   "E": 56,
   "A": 46
  },
  "cognitive": {
   "math": 49,
   "verbal": 74,
   "techSpatial": 59,
   "abstract": 54
  },
  "subjects": [
   "biology",
   "geography",
   "math"
  ]
 },
 {
  "code": "19-1029.01",
  "slug": "bioinformatics-scientists",
  "nameEn": "Bioinformatics Scientists",
  "nameMn": "Биоинформатикийн эрдэмтэн",
  "descriptionMn": "Эм зүй, эмнэлгийн технологи, биотехнологи, геном судлал зэрэг салбарт биоинформатикийн онол, аргаар судалгаа хийнэ.",
  "categorySlug": "science",
  "jobZone": 5,
  "riasec": {
   "R": 47,
   "I": 100,
   "A": 25,
   "S": 11,
   "E": 4,
   "C": 67
  },
  "personality": {
   "O": 97,
   "C": 75,
   "E": 43,
   "A": 25
  },
  "cognitive": {
   "math": 75,
   "verbal": 76,
   "techSpatial": 53,
   "abstract": 77
  },
  "subjects": [
   "biology",
   "informatics",
   "technology"
  ]
 },
 {
  "code": "19-1029.02",
  "slug": "molecular-and-cellular-biologists",
  "nameEn": "Molecular and Cellular Biologists",
  "nameMn": "Молекул, эсийн биологич",
  "descriptionMn": "Эсийн үйл ажиллагаа, зохион байгуулалтыг ойлгохын тулд эсийн молекул, эсийн бүрэлдэхүүнийг судална.",
  "categorySlug": "science",
  "jobZone": 5,
  "riasec": {
   "R": 67,
   "I": 94,
   "A": 16,
   "S": 21,
   "E": 26,
   "C": 68
  },
  "personality": {
   "O": 91,
   "C": 86,
   "E": 54,
   "A": 30
  },
  "cognitive": {
   "math": 73,
   "verbal": 92,
   "techSpatial": 43,
   "abstract": 90
  },
  "subjects": [
   "biology",
   "chemistry",
   "math"
  ]
 },
 {
  "code": "19-1029.03",
  "slug": "geneticists",
  "nameEn": "Geneticists",
  "nameMn": "Удамшил судлаач (генетикч)",
  "descriptionMn": "Молекул, организм, популяцийн түвшинд шинж чанарын удамшлыг судална.",
  "categorySlug": "science",
  "jobZone": 5,
  "riasec": {
   "R": 51,
   "I": 100,
   "A": 33,
   "S": 32,
   "E": 10,
   "C": 63
  },
  "personality": {
   "O": 96,
   "C": 83,
   "E": 56,
   "A": 37
  },
  "cognitive": {
   "math": 65,
   "verbal": 76,
   "techSpatial": 34,
   "abstract": 74
  },
  "subjects": [
   "biology",
   "math",
   "chemistry"
  ]
 },
 {
  "code": "19-1029.04",
  "slug": "biologists",
  "nameEn": "Biologists",
  "nameMn": "Биологич",
  "descriptionMn": "Ургамал, амьтны амьдралын гарал үүсэл, хамаарал, хөгжил, анатоми, үйл ажиллагаа зэрэг суурь зарчмыг судална.",
  "categorySlug": "science",
  "jobZone": 5,
  "riasec": {
   "R": 52,
   "I": 100,
   "A": 23,
   "S": 27,
   "E": 29,
   "C": 58
  },
  "personality": {
   "O": 88,
   "C": 59,
   "E": 52,
   "A": 38
  },
  "cognitive": {
   "math": 63,
   "verbal": 77,
   "techSpatial": 50,
   "abstract": 87
  },
  "subjects": [
   "biology",
   "math",
   "chemistry"
  ]
 },
 {
  "code": "19-1031.00",
  "slug": "conservation-scientists",
  "nameEn": "Conservation Scientists",
  "nameMn": "Байгаль хамгаалах эрдэмтэн",
  "descriptionMn": "Байгаль орчинд хор хөнөөл учруулахгүйгээр байгалийн нөөцийг дээд зэргээр ашиглах, сайжруулах, хамгаалахад удирдана.",
  "categorySlug": "science",
  "jobZone": 4,
  "riasec": {
   "R": 69,
   "I": 78,
   "A": 16,
   "S": 31,
   "E": 36,
   "C": 50
  },
  "personality": {
   "O": 75,
   "C": 58,
   "E": 58,
   "A": 47
  },
  "cognitive": {
   "math": 50,
   "verbal": 49,
   "techSpatial": 61,
   "abstract": 44
  },
  "subjects": [
   "geography",
   "biology",
   "math"
  ]
 },
 {
  "code": "19-1031.02",
  "slug": "range-managers",
  "nameEn": "Range Managers",
  "nameMn": "Бэлчээр судлаач (менежер)",
  "descriptionMn": "Бэлчээрийн тэжээл, мал, зэрлэг амьтны тогтвортой үйлдвэрлэлд зориулан бэлчээрийн менежментийн практикийг судална.",
  "categorySlug": "science",
  "jobZone": 4,
  "riasec": {
   "R": 79,
   "I": 67,
   "A": 8,
   "S": 24,
   "E": 56,
   "C": 45
  },
  "personality": {
   "O": 68,
   "C": 54,
   "E": 61,
   "A": 44
  },
  "cognitive": {
   "math": 47,
   "verbal": 47,
   "techSpatial": 50,
   "abstract": 55
  },
  "subjects": [
   "biology",
   "geography",
   "social"
  ]
 },
 {
  "code": "19-1031.03",
  "slug": "park-naturalists",
  "nameEn": "Park Naturalists",
  "nameMn": "Байгалийн цогцолборт газрын байгаль судлаач",
  "descriptionMn": "Үндэсний, аймгийн болон орон нутгийн цогцолборт газрын түүх, байгаль, шинжлэх ухааны онцлогийг олон нийтэд таниулах хөтөлбөр боловсруулж явуулна.",
  "categorySlug": "science",
  "jobZone": 4,
  "riasec": {
   "R": 56,
   "I": 54,
   "A": 46,
   "S": 65,
   "E": 41,
   "C": 41
  },
  "personality": {
   "O": 60,
   "C": 23,
   "E": 55,
   "A": 44
  },
  "cognitive": {
   "math": 29,
   "verbal": 48,
   "techSpatial": 42,
   "abstract": 23
  },
  "subjects": [
   "biology",
   "geography",
   "history"
  ]
 },
 {
  "code": "19-1032.00",
  "slug": "foresters",
  "nameEn": "Foresters",
  "nameMn": "Ойн инженер",
  "descriptionMn": "Эдийн засаг, амралт, байгаль хамгааллын зорилгоор төр, хувийн ойт газрыг удирдана.",
  "categorySlug": "science",
  "jobZone": 4,
  "riasec": {
   "R": 72,
   "I": 58,
   "A": 4,
   "S": 22,
   "E": 46,
   "C": 56
  },
  "personality": {
   "O": 63,
   "C": 58,
   "E": 61,
   "A": 37
  },
  "cognitive": {
   "math": 50,
   "verbal": 47,
   "techSpatial": 70,
   "abstract": 55
  },
  "subjects": [
   "geography",
   "biology",
   "math"
  ]
 },
 {
  "code": "19-1041.00",
  "slug": "epidemiologists",
  "nameEn": "Epidemiologists",
  "nameMn": "Эпидемиологич",
  "descriptionMn": "Өвчин, хөгжлийн бэрхшээл, эрүүл мэндийн үр дүнгийн тархалт, шалтгаан нөхцөлийг судалж тодорхойлно.",
  "categorySlug": "science",
  "jobZone": 5,
  "riasec": {
   "R": 30,
   "I": 100,
   "A": 20,
   "S": 52,
   "E": 23,
   "C": 44
  },
  "personality": {
   "O": 85,
   "C": 80,
   "E": 61,
   "A": 57
  },
  "cognitive": {
   "math": 65,
   "verbal": 80,
   "techSpatial": 33,
   "abstract": 83
  },
  "subjects": [
   "biology",
   "math",
   "informatics"
  ]
 },
 {
  "code": "19-1042.00",
  "slug": "medical-scientists-except-epidemiologists",
  "nameEn": "Medical Scientists, Except Epidemiologists",
  "nameMn": "Эмнэлгийн шинжлэх ухааны судлаач (эпидемиологичоос бусад)",
  "descriptionMn": "Хүний өвчнийг ойлгох, хүний эрүүл мэндийг сайжруулахад чиглэсэн судалгаа хийнэ.",
  "categorySlug": "science",
  "jobZone": 5,
  "riasec": {
   "R": 54,
   "I": 100,
   "A": 24,
   "S": 38,
   "E": 20,
   "C": 45
  },
  "personality": {
   "O": 91,
   "C": 91,
   "E": 51,
   "A": 38
  },
  "cognitive": {
   "math": 65,
   "verbal": 78,
   "techSpatial": 29,
   "abstract": 81
  },
  "subjects": [
   "biology",
   "chemistry",
   "math"
  ]
 },
 {
  "code": "19-2011.00",
  "slug": "astronomers",
  "nameEn": "Astronomers",
  "nameMn": "Одон орон судлаач",
  "descriptionMn": "Одон орны үзэгдлийг ажиглаж, судалж, тайлбарлан, суурь мэдлэгийг нэмэгдүүлэх, эсвэл практик асуудалд хэрэглэнэ.",
  "categorySlug": "science",
  "jobZone": 5,
  "riasec": {
   "R": 68,
   "I": 100,
   "A": 38,
   "S": 28,
   "E": 15,
   "C": 51
  },
  "personality": {
   "O": 97,
   "C": 74,
   "E": 60,
   "A": 36
  },
  "cognitive": {
   "math": 80,
   "verbal": 76,
   "techSpatial": 58,
   "abstract": 74
  },
  "subjects": [
   "physics",
   "math",
   "informatics"
  ]
 },
 {
  "code": "19-2012.00",
  "slug": "physicists",
  "nameEn": "Physicists",
  "nameMn": "Физикч",
  "descriptionMn": "Физик үзэгдлийг судалж, ажиглалт, туршилтад үндэслэн онол боловсруулж, физикийн хууль, онолыг хэрэглэх аргыг зохионо.",
  "categorySlug": "science",
  "jobZone": 5,
  "riasec": {
   "R": 66,
   "I": 100,
   "A": 29,
   "S": 19,
   "E": 13,
   "C": 63
  },
  "personality": {
   "O": 97,
   "C": 69,
   "E": 42,
   "A": 19
  },
  "cognitive": {
   "math": 100,
   "verbal": 100,
   "techSpatial": 80,
   "abstract": 100
  },
  "subjects": [
   "physics",
   "math",
   "informatics"
  ]
 },
 {
  "code": "19-2021.00",
  "slug": "atmospheric-and-space-scientists",
  "nameEn": "Atmospheric and Space Scientists",
  "nameMn": "Агаар мандал, сансар судлаач",
  "descriptionMn": "Агаар мандлын үзэгдлийг судалж, станц, хиймэл дагуул, радараас авсан цаг уурын мэдээллийг тайлбарлан, мэдээ, урьдчилсан тайлан бэлтгэнэ.",
  "categorySlug": "science",
  "jobZone": 4,
  "riasec": {
   "R": 63,
   "I": 88,
   "A": 29,
   "S": 25,
   "E": 28,
   "C": 58
  },
  "personality": {
   "O": 85,
   "C": 74,
   "E": 40,
   "A": 24
  },
  "cognitive": {
   "math": 61,
   "verbal": 73,
   "techSpatial": 40,
   "abstract": 58
  },
  "subjects": [
   "math",
   "informatics",
   "geography"
  ]
 },
 {
  "code": "19-2031.00",
  "slug": "chemists",
  "nameEn": "Chemists",
  "nameMn": "Химич",
  "descriptionMn": "Чанар, процессын хяналт, шинэ бүтээгдэхүүн, шинэ мэдлэг олох зорилгоор лабораторид чанарын болон тоон химийн шинжилгээ, туршилт хийнэ.",
  "categorySlug": "science",
  "jobZone": 4,
  "riasec": {
   "R": 78,
   "I": 95,
   "A": 9,
   "S": 2,
   "E": 10,
   "C": 63
  },
  "personality": {
   "O": 90,
   "C": 79,
   "E": 34,
   "A": 22
  },
  "cognitive": {
   "math": 70,
   "verbal": 72,
   "techSpatial": 51,
   "abstract": 78
  },
  "subjects": [
   "chemistry",
   "math",
   "informatics"
  ]
 },
 {
  "code": "19-2032.00",
  "slug": "materials-scientists",
  "nameEn": "Materials Scientists",
  "nameMn": "Материал судлаач",
  "descriptionMn": "Металл, хайлш, резин, керамик, хагас дамжуулагч, полимер, шил зэрэг байгалийн, синтетик, нийлмэл материалын бүтэц, химийн шинж чанарыг судална.",
  "categorySlug": "science",
  "jobZone": 4,
  "riasec": {
   "R": 80,
   "I": 93,
   "A": 19,
   "S": 6,
   "E": 14,
   "C": 53
  },
  "personality": {
   "O": 92,
   "C": 70,
   "E": 42,
   "A": 24
  },
  "cognitive": {
   "math": 60,
   "verbal": 72,
   "techSpatial": 65,
   "abstract": 77
  },
  "subjects": [
   "technology",
   "math",
   "chemistry"
  ]
 },
 {
  "code": "19-2041.00",
  "slug": "environmental-scientists-and-specialists-including-health",
  "nameEn": "Environmental Scientists and Specialists, Including Health",
  "nameMn": "Байгаль орчин, эрүүл мэндийн мэргэжилтэн (орчны эрдэмтэн)",
  "descriptionMn": "Байгаль орчин, нийгмийн эрүүл мэндэд нөлөөлөх бохирдол, аюулын эх үүсвэрийг тогтоож, бууруулах, арилгах судалгаа хийнэ.",
  "categorySlug": "science",
  "jobZone": 4,
  "riasec": {
   "R": 63,
   "I": 100,
   "A": 15,
   "S": 29,
   "E": 26,
   "C": 55
  },
  "personality": {
   "O": 81,
   "C": 71,
   "E": 56,
   "A": 43
  },
  "cognitive": {
   "math": 60,
   "verbal": 70,
   "techSpatial": 46,
   "abstract": 62
  },
  "subjects": [
   "biology",
   "informatics"
  ]
 },
 {
  "code": "19-2042.00",
  "slug": "geoscientists-except-hydrologists-and-geographers",
  "nameEn": "Geoscientists, Except Hydrologists and Geographers",
  "nameMn": "Геологич (газарзүйч, усзүйчээс бусад)",
  "descriptionMn": "Дэлхийн найрлага, бүтэц болон бусад физик талыг судална.",
  "categorySlug": "science",
  "jobZone": 4,
  "riasec": {
   "R": 77,
   "I": 100,
   "A": 29,
   "S": 21,
   "E": 11,
   "C": 53
  },
  "personality": {
   "O": 90,
   "C": 65,
   "E": 43,
   "A": 23
  },
  "cognitive": {
   "math": 67,
   "verbal": 71,
   "techSpatial": 63,
   "abstract": 67
  },
  "subjects": [
   "geography",
   "math",
   "chemistry"
  ]
 },
 {
  "code": "19-2043.00",
  "slug": "hydrologists",
  "nameEn": "Hydrologists",
  "nameMn": "Усзүйч (гидролог)",
  "descriptionMn": "Гүний болон гадаргын усны тархалт, эргэлт, физик шинж чанар, хур тундасны хэлбэр, эрчим, хөрсөнд шингэх, дэлхийд хөдөлж далай, агаар мандалд буцах үйл явцыг судална.",
  "categorySlug": "science",
  "jobZone": 4,
  "riasec": {
   "R": 81,
   "I": 90,
   "A": 10,
   "S": 19,
   "E": 22,
   "C": 55
  },
  "personality": {
   "O": 83,
   "C": 68,
   "E": 44,
   "A": 29
  },
  "cognitive": {
   "math": 70,
   "verbal": 71,
   "techSpatial": 68,
   "abstract": 65
  },
  "subjects": [
   "math",
   "geography",
   "physics"
  ]
 },
 {
  "code": "19-2099.01",
  "slug": "remote-sensing-scientists-and-technologists",
  "nameEn": "Remote Sensing Scientists and Technologists",
  "nameMn": "Алсын хэмжилтийн эрдэмтэн, технологич",
  "descriptionMn": "Байгалийн нөөцийн менежмент, хотын төлөвлөлт зэрэг салбарт алсын хэмжилтийн зарчим, аргаар өгөгдөл шинжилж, асуудал шийднэ.",
  "categorySlug": "science",
  "jobZone": 4,
  "riasec": {
   "R": 64,
   "I": 85,
   "A": 16,
   "S": 5,
   "E": 7,
   "C": 63
  },
  "personality": {
   "O": 90,
   "C": 66,
   "E": 40,
   "A": 23
  },
  "cognitive": {
   "math": 70,
   "verbal": 68,
   "techSpatial": 52,
   "abstract": 68
  },
  "subjects": [
   "geography",
   "math",
   "informatics"
  ]
 },
 {
  "code": "19-3011.00",
  "slug": "economists",
  "nameEn": "Economists",
  "nameMn": "Эдийн засагч",
  "descriptionMn": "Бараа үйлчилгээний үйлдвэрлэл, түгээлт, мөнгөний болон төсвийн бодлоготой холбоотой эдийн засгийн асуудлыг судалж, тайлан, төлөвлөгөө боловсруулна.",
  "categorySlug": "science",
  "jobZone": 5,
  "riasec": {
   "R": 6,
   "I": 100,
   "A": 24,
   "S": 23,
   "E": 49,
   "C": 59
  },
  "personality": {
   "O": 89,
   "C": 64,
   "E": 50,
   "A": 19
  },
  "cognitive": {
   "math": 72,
   "verbal": 73,
   "techSpatial": 23,
   "abstract": 55
  },
  "subjects": [
   "math",
   "economics",
   "informatics"
  ]
 },
 {
  "code": "19-3022.00",
  "slug": "survey-researchers",
  "nameEn": "Survey Researchers",
  "nameMn": "Судалгааны эрдэмтэн (судалгаа явуулагч)",
  "descriptionMn": "Судалгаа төлөвлөж, боловсруулж, явуулна. Судалгааны өгөгдлийг шинжилж тайлбарлаж, зорилго, асуултыг тодорхойлно.",
  "categorySlug": "science",
  "jobZone": 5,
  "riasec": {
   "R": 11,
   "I": 85,
   "A": 22,
   "S": 22,
   "E": 34,
   "C": 71
  },
  "personality": {
   "O": 76,
   "C": 61,
   "E": 53,
   "A": 41
  },
  "cognitive": {
   "math": 71,
   "verbal": 61,
   "techSpatial": 24,
   "abstract": 67
  },
  "subjects": [
   "social",
   "math",
   "informatics"
  ]
 },
 {
  "code": "19-3032.00",
  "slug": "industrial-organizational-psychologists",
  "nameEn": "Industrial-Organizational Psychologists",
  "nameMn": "Аж үйлдвэр, байгууллагын сэтгэл зүйч",
  "descriptionMn": "Хүний нөөц, захиргаа, менежмент, борлуулалт, маркетингийн асуудалд сэтгэл судлалын зарчмыг хэрэглэнэ.",
  "categorySlug": "science",
  "jobZone": 5,
  "riasec": {
   "R": 1,
   "I": 72,
   "A": 36,
   "S": 50,
   "E": 62,
   "C": 55
  },
  "personality": {
   "O": 92,
   "C": 76,
   "E": 75,
   "A": 62
  },
  "cognitive": {
   "math": 63,
   "verbal": 71,
   "techSpatial": 21,
   "abstract": 62
  },
  "subjects": [
   "social",
   "math",
   "informatics"
  ]
 },
 {
  "code": "19-3033.00",
  "slug": "clinical-and-counseling-psychologists",
  "nameEn": "Clinical and Counseling Psychologists",
  "nameMn": "Эмнэлзүйн болон зөвлөх сэтгэл зүйч",
  "descriptionMn": "Ажиглалт, ярилцлага, сэтгэл зүйн тестээр хүний сэтгэл гаргуун, сэтгэл зүйн эмгэгийг үнэлж, оношилж, эмчилнэ.",
  "categorySlug": "science",
  "jobZone": 5,
  "riasec": {
   "R": 1,
   "I": 76,
   "A": 34,
   "S": 93,
   "E": 27,
   "C": 42
  },
  "personality": {
   "O": 77,
   "C": 76,
   "E": 63,
   "A": 87
  },
  "cognitive": {
   "math": 32,
   "verbal": 67,
   "techSpatial": 12,
   "abstract": 54
  },
  "subjects": [
   "social",
   "informatics"
  ]
 },
 {
  "code": "19-3034.00",
  "slug": "school-psychologists",
  "nameEn": "School Psychologists",
  "nameMn": "Сургуулийн сэтгэл зүйч",
  "descriptionMn": "Сургуулийн сургалтын үйл ажиллагаанд сөргөөр нөлөөлөх боловсрол, зан үйл, хөгжлийн асуудлыг шийдвэрлэх хувь хүн болон сургуулийн хэмжээний арга хэмжээг оношилж хэрэгжүүлнэ.",
  "categorySlug": "science",
  "jobZone": 5,
  "riasec": {
   "R": 0,
   "I": 67,
   "A": 39,
   "S": 96,
   "E": 30,
   "C": 50
  },
  "personality": {
   "O": 72,
   "C": 78,
   "E": 68,
   "A": 84
  },
  "cognitive": {
   "math": 48,
   "verbal": 71,
   "techSpatial": 7,
   "abstract": 55
  },
  "subjects": [
   "social",
   "math"
  ]
 },
 {
  "code": "19-3039.02",
  "slug": "neuropsychologists",
  "nameEn": "Neuropsychologists",
  "nameMn": "Мэдрэлийн сэтгэл зүйч (нейропсихологич)",
  "descriptionMn": "Тархины дээд үйл ажиллагааны эмгэгийг үнэлж оношлоход мэдрэлийн сэтгэл судлалын онол, зарчмыг хэрэглэнэ.",
  "categorySlug": "science",
  "jobZone": 5,
  "riasec": {
   "R": 27,
   "I": 100,
   "A": 38,
   "S": 72,
   "E": 12,
   "C": 39
  },
  "personality": {
   "O": 81,
   "C": 80,
   "E": 52,
   "A": 68
  },
  "cognitive": {
   "math": 49,
   "verbal": 82,
   "techSpatial": 23,
   "abstract": 81
  },
  "subjects": [
   "social",
   "math",
   "biology"
  ]
 },
 {
  "code": "19-3039.03",
  "slug": "clinical-neuropsychologists",
  "nameEn": "Clinical Neuropsychologists",
  "nameMn": "Эмнэлзүйн мэдрэлийн сэтгэл зүйч",
  "descriptionMn": "Мэдрэлийн тогтолцооны олдмол болон хөгжлийн эмгэг, тархины гэмтэл, таталт, суралцахын бэрхшээлтэй холбоотой зан үйлийн асуудалтай өвчтөнийг үнэлж оношилно.",
  "categorySlug": "science",
  "jobZone": 5,
  "riasec": {
   "R": 30,
   "I": 100,
   "A": 23,
   "S": 78,
   "E": 18,
   "C": 42
  },
  "personality": {
   "O": 81,
   "C": 85,
   "E": 57,
   "A": 73
  },
  "cognitive": {
   "math": 46,
   "verbal": 68,
   "techSpatial": 22,
   "abstract": 71
  },
  "subjects": [
   "social",
   "math",
   "biology"
  ]
 },
 {
  "code": "19-3041.00",
  "slug": "sociologists",
  "nameEn": "Sociologists",
  "nameMn": "Социологич",
  "descriptionMn": "Хүмүүсийн бүрдүүлсэн бүлэг, нийгмийн институц, нийгэм, шашин, улс төр, бизнесийн байгууллагуудыг судалж нийгэм, нийгмийн зан үйлийг тайлбарлана.",
  "categorySlug": "science",
  "jobZone": 5,
  "riasec": {
   "R": 9,
   "I": 92,
   "A": 50,
   "S": 56,
   "E": 35,
   "C": 43
  },
  "personality": {
   "O": 91,
   "C": 46,
   "E": 53,
   "A": 56
  },
  "cognitive": {
   "math": 49,
   "verbal": 71,
   "techSpatial": 20,
   "abstract": 55
  },
  "subjects": [
   "social",
   "math",
   "informatics"
  ]
 },
 {
  "code": "19-3051.00",
  "slug": "urban-and-regional-planners",
  "nameEn": "Urban and Regional Planners",
  "nameMn": "Хот, бүсийн төлөвлөгч",
  "descriptionMn": "Хот, аймаг, нийслэл бүс зэрэг нутаг дэвсгэрийн газар болон байгууламжийг ашиглах цогц төлөвлөгөө, хөтөлбөр боловсруулна.",
  "categorySlug": "science",
  "jobZone": 5,
  "riasec": {
   "R": 37,
   "I": 72,
   "A": 34,
   "S": 34,
   "E": 58,
   "C": 49
  },
  "personality": {
   "O": 80,
   "C": 64,
   "E": 68,
   "A": 52
  },
  "cognitive": {
   "math": 54,
   "verbal": 58,
   "techSpatial": 40,
   "abstract": 54
  },
  "subjects": [
   "geography",
   "social",
   "math"
  ]
 },
 {
  "code": "19-3091.00",
  "slug": "anthropologists-and-archeologists",
  "nameEn": "Anthropologists and Archeologists",
  "nameMn": "Антрополог, археологич",
  "descriptionMn": "Хүн төрөлхтний гарал үүсэл, хөгжил, зан үйлийг судална.",
  "categorySlug": "science",
  "jobZone": 5,
  "riasec": {
   "R": 50,
   "I": 97,
   "A": 54,
   "S": 45,
   "E": 10,
   "C": 37
  },
  "personality": {
   "O": 95,
   "C": 54,
   "E": 56,
   "A": 55
  },
  "cognitive": {
   "math": 43,
   "verbal": 77,
   "techSpatial": 42,
   "abstract": 71
  },
  "subjects": [
   "social",
   "history",
   "geography"
  ]
 },
 {
  "code": "19-3092.00",
  "slug": "geographers",
  "nameEn": "Geographers",
  "nameMn": "Газарзүйч",
  "descriptionMn": "Дэлхийн гадаргын бүс нутгийн шинж чанар, ашиглалтыг судалж, физик болон соёлын үзэгдлийн харилцан үйлчлэлийг тайлбарлана.",
  "categorySlug": "science",
  "jobZone": 4,
  "riasec": {
   "R": 69,
   "I": 96,
   "A": 45,
   "S": 29,
   "E": 18,
   "C": 45
  },
  "personality": {
   "O": 85,
   "C": 52,
   "E": 37,
   "A": 23
  },
  "cognitive": {
   "math": 53,
   "verbal": 70,
   "techSpatial": 41,
   "abstract": 59
  },
  "subjects": [
   "geography",
   "informatics",
   "social"
  ]
 },
 {
  "code": "19-3093.00",
  "slug": "historians",
  "nameEn": "Historians",
  "nameMn": "Түүхч",
  "descriptionMn": "Төрийн болон байгууллагын бүртгэл, сонин хэвлэл, гэрэл зураг, ярилцлага, кино, гар бичмэл зэрэг эх сурвалжид тэмдэглэгдсэн өнгөрсөн үеийг судалж, шинжилж, тайлбарлана.",
  "categorySlug": "science",
  "jobZone": 5,
  "riasec": {
   "R": 23,
   "I": 72,
   "A": 45,
   "S": 37,
   "E": 23,
   "C": 65
  },
  "personality": {
   "O": 82,
   "C": 61,
   "E": 32,
   "A": 29
  },
  "cognitive": {
   "math": 19,
   "verbal": 71,
   "techSpatial": 18,
   "abstract": 45
  },
  "subjects": [
   "history",
   "geography",
   "social"
  ]
 },
 {
  "code": "19-3094.00",
  "slug": "political-scientists",
  "nameEn": "Political Scientists",
  "nameMn": "Улс төр судлаач",
  "descriptionMn": "Улс төрийн системийн гарал үүсэл, хөгжил, үйл ажиллагааг судална.",
  "categorySlug": "science",
  "jobZone": 5,
  "riasec": {
   "R": 0,
   "I": 95,
   "A": 48,
   "S": 40,
   "E": 44,
   "C": 42
  },
  "personality": {
   "O": 91,
   "C": 54,
   "E": 52,
   "A": 25
  },
  "cognitive": {
   "math": 42,
   "verbal": 71,
   "techSpatial": 17,
   "abstract": 48
  },
  "subjects": [
   "social",
   "math",
   "history"
  ]
 },
 {
  "code": "19-3099.01",
  "slug": "transportation-planners",
  "nameEn": "Transportation Planners",
  "nameMn": "Тээврийн төлөвлөгч",
  "descriptionMn": "Тээврийн төслийн урьдчилсан судалгаа хийж, өгөгдөл цуглуулж, цэгцэлж, шинжилнэ.",
  "categorySlug": "science",
  "jobZone": 4,
  "riasec": {
   "R": 43,
   "I": 77,
   "A": 17,
   "S": 13,
   "E": 36,
   "C": 65
  },
  "personality": {
   "O": 76,
   "C": 62,
   "E": 53,
   "A": 43
  },
  "cognitive": {
   "math": 57,
   "verbal": 48,
   "techSpatial": 47,
   "abstract": 58
  },
  "subjects": [
   "geography",
   "math",
   "informatics"
  ]
 },
 {
  "code": "19-4012.00",
  "slug": "agricultural-technicians",
  "nameEn": "Agricultural Technicians",
  "nameMn": "Хөдөө аж ахуйн техникч",
  "descriptionMn": "Хөдөө аж ахуйн эрдэмтэдтэй хамтран ургамал, шилэн, амьтны судалгаа хийх болон малын үржил, тэжээлд тусална.",
  "categorySlug": "science",
  "jobZone": 3,
  "riasec": {
   "R": 97,
   "I": 60,
   "A": 0,
   "S": 8,
   "E": 17,
   "C": 54
  },
  "personality": {
   "O": 51,
   "C": 50,
   "E": 30,
   "A": 28
  },
  "cognitive": {
   "math": 48,
   "verbal": 42,
   "techSpatial": 60,
   "abstract": 33
  },
  "subjects": [
   "chemistry",
   "biology",
   "math"
  ]
 },
 {
  "code": "19-4012.01",
  "slug": "precision-agriculture-technicians",
  "nameEn": "Precision Agriculture Technicians",
  "nameMn": "Нарийвчилсан хөдөө аж ахуйн техникч",
  "descriptionMn": "ГМС, GPS зэрэг газарзүйн технологийг хөдөө аж ахуйн үйлдвэрлэл, удирдлагад (хортон шавьжийн хяналт, ургацын зураглал, усалгаа) хэрэглэнэ.",
  "categorySlug": "science",
  "jobZone": 3,
  "riasec": {
   "R": 91,
   "I": 73,
   "A": 4,
   "S": 6,
   "E": 18,
   "C": 66
  },
  "personality": {
   "O": 77,
   "C": 63,
   "E": 34,
   "A": 20
  },
  "cognitive": {
   "math": 53,
   "verbal": 43,
   "techSpatial": 83,
   "abstract": 51
  },
  "subjects": [
   "informatics",
   "math",
   "geography"
  ]
 },
 {
  "code": "19-4013.00",
  "slug": "food-science-technicians",
  "nameEn": "Food Science Technicians",
  "nameMn": "Хүнсний шинжлэх ухааны техникч",
  "descriptionMn": "Хүнсний эрдэмтдийн хамт хүнс, ундааны физик, химийн шинж чанарыг тодорхойлох стандарт чанарын болон тоон шинжилгээ хийнэ.",
  "categorySlug": "science",
  "jobZone": 3,
  "riasec": {
   "R": 76,
   "I": 59,
   "A": 6,
   "S": 12,
   "E": 16,
   "C": 67
  },
  "personality": {
   "O": 35,
   "C": 53,
   "E": 23,
   "A": 28
  },
  "cognitive": {
   "math": 48,
   "verbal": 42,
   "techSpatial": 36,
   "abstract": 32
  },
  "subjects": [
   "chemistry",
   "informatics",
   "biology"
  ]
 },
 {
  "code": "19-4021.00",
  "slug": "biological-technicians",
  "nameEn": "Biological Technicians",
  "nameMn": "Биологийн техникч",
  "descriptionMn": "Биологи, анагаах ухааны эрдэмтдэд тусалж, лабораторийн багаж, тоног төхөөрөмжийг ажиллуулж, туршилтыг хянаж, өгөгдөл, дээж цуглуулж, үр дүнг тооцож бүртгэнэ.",
  "categorySlug": "science",
  "jobZone": 4,
  "riasec": {
   "R": 77,
   "I": 73,
   "A": 3,
   "S": 16,
   "E": 5,
   "C": 77
  },
  "personality": {
   "O": 59,
   "C": 64,
   "E": 18,
   "A": 30
  },
  "cognitive": {
   "math": 52,
   "verbal": 52,
   "techSpatial": 40,
   "abstract": 54
  },
  "subjects": [
   "biology",
   "informatics",
   "chemistry"
  ]
 },
 {
  "code": "19-4031.00",
  "slug": "chemical-technicians",
  "nameEn": "Chemical Technicians",
  "nameMn": "Химийн техникч",
  "descriptionMn": "Эрдэмтдэд тусалж, хатуу, шингэн, хийн материалын чанарын болон тоон шинжилгээ хийх лабораторийн химийн, физикийн тест хийнэ.",
  "categorySlug": "science",
  "jobZone": 3,
  "riasec": {
   "R": 74,
   "I": 80,
   "A": 9,
   "S": 11,
   "E": 2,
   "C": 71
  },
  "personality": {
   "O": 55,
   "C": 69,
   "E": 23,
   "A": 29
  },
  "cognitive": {
   "math": 50,
   "verbal": 47,
   "techSpatial": 39,
   "abstract": 54
  },
  "subjects": [
   "chemistry",
   "math"
  ]
 },
 {
  "code": "19-4042.00",
  "slug": "environmental-science-and-protection-technicians-including-health",
  "nameEn": "Environmental Science and Protection Technicians, Including Health",
  "nameMn": "Байгаль орчин, эрүүл мэндийн хамгааллын техникч",
  "descriptionMn": "Орчны эрдэмтэн, инженерийн удирдлаган дор байгаль орчныг хянаж, бохирдлын эх үүсвэрийг судлах лабораторийн болон хээрийн шинжилгээ хийнэ.",
  "categorySlug": "science",
  "jobZone": 4,
  "riasec": {
   "R": 81,
   "I": 77,
   "A": 4,
   "S": 16,
   "E": 6,
   "C": 65
  },
  "personality": {
   "O": 60,
   "C": 65,
   "E": 32,
   "A": 36
  },
  "cognitive": {
   "math": 50,
   "verbal": 47,
   "techSpatial": 61,
   "abstract": 49
  },
  "subjects": [
   "biology",
   "chemistry",
   "informatics"
  ]
 },
 {
  "code": "19-4043.00",
  "slug": "geological-technicians-except-hydrologic-technicians",
  "nameEn": "Geological Technicians, Except Hydrologic Technicians",
  "nameMn": "Геологийн техникч (усзүйн техникчээс бусад)",
  "descriptionMn": "Эрдэмтэн, инженерүүдэд тусалж, металл хүдэр, ашигт малтмал, хий, нүүрс, газрын тосны нөөцийг илрүүлэх цахилгаан, дуу, цөмийн хэмжих багажийг ашиглана.",
  "categorySlug": "science",
  "jobZone": 4,
  "riasec": {
   "R": 77,
   "I": 70,
   "A": 5,
   "S": 8,
   "E": 2,
   "C": 72
  },
  "personality": {
   "O": 53,
   "C": 45,
   "E": 15,
   "A": 20
  },
  "cognitive": {
   "math": 53,
   "verbal": 40,
   "techSpatial": 65,
   "abstract": 34
  },
  "subjects": [
   "informatics",
   "math",
   "geography"
  ]
 },
 {
  "code": "19-4051.00",
  "slug": "nuclear-technicians",
  "nameEn": "Nuclear Technicians",
  "nameMn": "Цөмийн техникч",
  "descriptionMn": "Цөмийн физикч, цөмийн инженер болон бусад эрдэмтдэд лаборатори, эрчим хүч үйлдвэрлэлийн ажилд тусална.",
  "categorySlug": "science",
  "jobZone": 3,
  "riasec": {
   "R": 79,
   "I": 60,
   "A": 0,
   "S": 14,
   "E": 21,
   "C": 68
  },
  "personality": {
   "O": 35,
   "C": 89,
   "E": 19,
   "A": 40
  },
  "cognitive": {
   "math": 45,
   "verbal": 44,
   "techSpatial": 70,
   "abstract": 32
  },
  "subjects": [
   "physics",
   "chemistry",
   "technology"
  ]
 },
 {
  "code": "19-4051.02",
  "slug": "nuclear-monitoring-technicians",
  "nameEn": "Nuclear Monitoring Technicians",
  "nameMn": "Цөмийн хяналтын техникч",
  "descriptionMn": "Цөмийн туршилтын үр дүн, хүн, байгууламж, орчны цацрагийн бохирдлыг хянахын тулд дээж цуглуулж шинжилнэ.",
  "categorySlug": "science",
  "jobZone": 3,
  "riasec": {
   "R": 85,
   "I": 57,
   "A": 0,
   "S": 15,
   "E": 9,
   "C": 75
  },
  "personality": {
   "O": 28,
   "C": 78,
   "E": 30,
   "A": 46
  },
  "cognitive": {
   "math": 48,
   "verbal": 44,
   "techSpatial": 45,
   "abstract": 49
  },
  "subjects": [
   "math",
   "informatics",
   "physics"
  ]
 },
 {
  "code": "19-4061.00",
  "slug": "social-science-research-assistants",
  "nameEn": "Social Science Research Assistants",
  "nameMn": "Нийгмийн ухааны судалгааны туслах",
  "descriptionMn": "Нийгмийн эрдэмтдэд лаборатори, судалгаа болон бусад нийгмийн ухааны судалгаанд тусална.",
  "categorySlug": "science",
  "jobZone": 4,
  "riasec": {
   "R": 23,
   "I": 85,
   "A": 15,
   "S": 28,
   "E": 21,
   "C": 82
  },
  "personality": {
   "O": 66,
   "C": 62,
   "E": 27,
   "A": 32
  },
  "cognitive": {
   "math": 50,
   "verbal": 48,
   "techSpatial": 25,
   "abstract": 35
  },
  "subjects": [
   "informatics",
   "math"
  ]
 },
 {
  "code": "19-4071.00",
  "slug": "forest-and-conservation-technicians",
  "nameEn": "Forest and Conservation Technicians",
  "nameMn": "Ой, байгаль хамгааллын техникч",
  "descriptionMn": "Хөрс, ус, ой болон холбогдох байгалийн нөөцийн хамгаалалтын талаар техникийн дэмжлэг үзүүлнэ.",
  "categorySlug": "science",
  "jobZone": 3,
  "riasec": {
   "R": 92,
   "I": 56,
   "A": 0,
   "S": 30,
   "E": 25,
   "C": 62
  },
  "personality": {
   "O": 45,
   "C": 44,
   "E": 47,
   "A": 37
  },
  "cognitive": {
   "math": 45,
   "verbal": 34,
   "techSpatial": 71,
   "abstract": 32
  },
  "subjects": [
   "geography",
   "math",
   "informatics"
  ]
 },
 {
  "code": "19-4092.00",
  "slug": "forensic-science-technicians",
  "nameEn": "Forensic Science Technicians",
  "nameMn": "Шүүх шинжилгээний техникч",
  "descriptionMn": "Гэмт хэргийн мөрдөн байцаалттай холбоотой биет нотлох баримтыг цуглуулж, тодорхойлж, ангилж, шинжилнэ.",
  "categorySlug": "science",
  "jobZone": 3,
  "riasec": {
   "R": 70,
   "I": 82,
   "A": 13,
   "S": 8,
   "E": 10,
   "C": 66
  },
  "personality": {
   "O": 67,
   "C": 79,
   "E": 35,
   "A": 34
  },
  "cognitive": {
   "math": 46,
   "verbal": 59,
   "techSpatial": 56,
   "abstract": 59
  },
  "subjects": [
   "informatics",
   "chemistry",
   "social"
  ]
 },
 {
  "code": "19-4099.01",
  "slug": "quality-control-analysts",
  "nameEn": "Quality Control Analysts",
  "nameMn": "Чанарын хяналтын шинжээч",
  "descriptionMn": "Түүхий эд, завсрын болон бэлэн бүтээгдэхүүний чанарыг тодорхойлох шинжилгээ хийнэ.",
  "categorySlug": "science",
  "jobZone": 3,
  "riasec": {
   "R": 52,
   "I": 65,
   "A": 0,
   "S": 3,
   "E": 27,
   "C": 83
  },
  "personality": {
   "O": 41,
   "C": 73,
   "E": 24,
   "A": 29
  },
  "cognitive": {
   "math": 49,
   "verbal": 44,
   "techSpatial": 42,
   "abstract": 36
  },
  "subjects": [
   "math",
   "chemistry"
  ]
 },
 {
  "code": "19-4099.03",
  "slug": "remote-sensing-technicians",
  "nameEn": "Remote Sensing Technicians",
  "nameMn": "Алсын хэмжилтийн техникч",
  "descriptionMn": "Байгалийн нөөц, хотын төлөвлөлт, аюулгүй байдал зэрэг салбарт эрдэмтдэд алсын хэмжилтийн технологиор тусална.",
  "categorySlug": "science",
  "jobZone": 4,
  "riasec": {
   "R": 68,
   "I": 60,
   "A": 19,
   "S": 9,
   "E": 12,
   "C": 71
  },
  "personality": {
   "O": 68,
   "C": 53,
   "E": 24,
   "A": 18
  },
  "cognitive": {
   "math": 66,
   "verbal": 55,
   "techSpatial": 57,
   "abstract": 48
  },
  "subjects": [
   "geography",
   "informatics",
   "math"
  ]
 },
 {
  "code": "19-5011.00",
  "slug": "occupational-health-and-safety-specialists",
  "nameEn": "Occupational Health and Safety Specialists",
  "nameMn": "Хөдөлмөрийн эрүүл мэнд, аюулгүй байдлын мэргэжилтэн",
  "descriptionMn": "Ажлын орчныг шалгаж үнэлж, хими, физик, биологийн хүчин зүйл, эргономикоос үүдэх өвчин, гэмтлээс сэргийлэх хөтөлбөр, журмыг боловсруулна.",
  "categorySlug": "science",
  "jobZone": 4,
  "riasec": {
   "R": 58,
   "I": 66,
   "A": 5,
   "S": 41,
   "E": 37,
   "C": 62
  },
  "personality": {
   "O": 65,
   "C": 76,
   "E": 58,
   "A": 50
  },
  "cognitive": {
   "math": 48,
   "verbal": 49,
   "techSpatial": 62,
   "abstract": 54
  },
  "subjects": [
   "chemistry",
   "math",
   "biology"
  ]
 },
 {
  "code": "19-5012.00",
  "slug": "occupational-health-and-safety-technicians",
  "nameEn": "Occupational Health and Safety Technicians",
  "nameMn": "Хөдөлмөрийн эрүүл мэнд, аюулгүй байдлын техникч",
  "descriptionMn": "Мэргэжилтнүүдийн шинжилгээнд зориулж ажлын орчны өгөгдөл цуглуулна.",
  "categorySlug": "science",
  "jobZone": 3,
  "riasec": {
   "R": 73,
   "I": 65,
   "A": 0,
   "S": 31,
   "E": 27,
   "C": 76
  },
  "personality": {
   "O": 55,
   "C": 68,
   "E": 53,
   "A": 50
  },
  "cognitive": {
   "math": 42,
   "verbal": 43,
   "techSpatial": 58,
   "abstract": 45
  },
  "subjects": [
   "math",
   "technology",
   "informatics"
  ]
 },
 {
  "code": "21-1011.00",
  "slug": "substance-abuse-and-behavioral-disorder-counselors",
  "nameEn": "Substance Abuse and Behavioral Disorder Counselors",
  "nameMn": "Мансууруулах бодис, зан үйлийн эмгэгийн зөвлөх",
  "descriptionMn": "Архи, тамхи, мансууруулах бодис, мөрийтэй тоглоом, хоолны эмгэг зэрэг асуудалтай хүмүүст зөвлөгөө өгч туслана.",
  "categorySlug": "education-social",
  "jobZone": 5,
  "riasec": {
   "R": 10,
   "I": 47,
   "A": 26,
   "S": 94,
   "E": 28,
   "C": 36
  },
  "personality": {
   "O": 53,
   "C": 62,
   "E": 64,
   "A": 86
  },
  "cognitive": {
   "math": 28,
   "verbal": 61,
   "techSpatial": 22,
   "abstract": 45
  },
  "subjects": [
   "social",
   "informatics"
  ]
 },
 {
  "code": "21-1012.00",
  "slug": "educational-guidance-and-career-counselors-and-advisors",
  "nameEn": "Educational, Guidance, and Career Counselors and Advisors",
  "nameMn": "Боловсрол, чиг баримжаа, карьерын зөвлөх",
  "descriptionMn": "Сурагчдад зөвлөгөө өгч, боловсрол болон мэргэжлийн чиг баримжааны үйлчилгээ үзүүлнэ.",
  "categorySlug": "education-social",
  "jobZone": 5,
  "riasec": {
   "R": 0,
   "I": 38,
   "A": 36,
   "S": 100,
   "E": 49,
   "C": 52
  },
  "personality": {
   "O": 64,
   "C": 58,
   "E": 67,
   "A": 82
  },
  "cognitive": {
   "math": 35,
   "verbal": 56,
   "techSpatial": 19,
   "abstract": 49
  },
  "subjects": [
   "informatics",
   "social"
  ]
 },
 {
  "code": "21-1013.00",
  "slug": "marriage-and-family-therapists",
  "nameEn": "Marriage and Family Therapists",
  "nameMn": "Гэр бүлийн эмчилгээч (гэр бүл, гэр бүлийн сэтгэл засалч)",
  "descriptionMn": "Гэр бүлийн харилцааны хүрээнд танин мэдэхүй, сэтгэл хөдлөл, зан үйлийн эмгэгийг оношилж эмчилнэ.",
  "categorySlug": "education-social",
  "jobZone": 5,
  "riasec": {
   "R": 8,
   "I": 72,
   "A": 43,
   "S": 87,
   "E": 13,
   "C": 32
  },
  "personality": {
   "O": 71,
   "C": 47,
   "E": 56,
   "A": 90
  },
  "cognitive": {
   "math": 29,
   "verbal": 58,
   "techSpatial": 5,
   "abstract": 52
  },
  "subjects": [
   "social"
  ]
 },
 {
  "code": "21-1014.00",
  "slug": "mental-health-counselors",
  "nameEn": "Mental Health Counselors",
  "nameMn": "Сэтгэцийн эрүүл мэндийн зөвлөх",
  "descriptionMn": "Урьдчилан сэргийлэхэд анхаарч, хувь хүн, бүлэгт сэтгэл зүй, сэтгэл хөдлөлийн эрүүл мэндийг дэмжих зөвлөгөө өгнө.",
  "categorySlug": "education-social",
  "jobZone": 5,
  "riasec": {
   "R": 5,
   "I": 57,
   "A": 34,
   "S": 97,
   "E": 33,
   "C": 41
  },
  "personality": {
   "O": 70,
   "C": 58,
   "E": 60,
   "A": 92
  },
  "cognitive": {
   "math": 30,
   "verbal": 65,
   "techSpatial": 10,
   "abstract": 75
  },
  "subjects": [
   "social"
  ]
 },
 {
  "code": "21-1015.00",
  "slug": "rehabilitation-counselors",
  "nameEn": "Rehabilitation Counselors",
  "nameMn": "Нөхөн сэргээх зөвлөх",
  "descriptionMn": "Төрөлхийн гажиг, өвчин, осол, хөгшрөлт, өдөр тутмын стрессээс үүдсэн хүндрэлтэй хүмүүсийн бие даасан байдал, ажил эрхлэх чадварыг дээшлүүлэхэд зөвлөнө.",
  "categorySlug": "education-social",
  "jobZone": 5,
  "riasec": {
   "R": 4,
   "I": 38,
   "A": 33,
   "S": 97,
   "E": 43,
   "C": 38
  },
  "personality": {
   "O": 49,
   "C": 67,
   "E": 68,
   "A": 84
  },
  "cognitive": {
   "math": 31,
   "verbal": 49,
   "techSpatial": 5,
   "abstract": 44
  },
  "subjects": [
   "social"
  ]
 },
 {
  "code": "21-1021.00",
  "slug": "child-family-and-school-social-workers",
  "nameEn": "Child, Family, and School Social Workers",
  "nameMn": "Хүүхэд, гэр бүл, сургуулийн нийгмийн ажилтан",
  "descriptionMn": "Хүүхэд, гэр бүлийн нийгмийн болон сэтгэл зүйн үйл ажиллагааг сайжруулж, гэр бүлийн сайн сайхан байдал, хүүхдийн хичээлийн гүйцэтгэлийг дэмжинэ.",
  "categorySlug": "education-social",
  "jobZone": 4,
  "riasec": {
   "R": 12,
   "I": 39,
   "A": 32,
   "S": 98,
   "E": 32,
   "C": 43
  },
  "personality": {
   "O": 59,
   "C": 57,
   "E": 66,
   "A": 91
  },
  "cognitive": {
   "math": 33,
   "verbal": 47,
   "techSpatial": 20,
   "abstract": 42
  },
  "subjects": [
   "social",
   "informatics"
  ]
 },
 {
  "code": "21-1022.00",
  "slug": "healthcare-social-workers",
  "nameEn": "Healthcare Social Workers",
  "nameMn": "Эрүүл мэндийн нийгмийн ажилтан",
  "descriptionMn": "Архаг, цочмог эсвэл хүнд өвчинтэй тэмцэж буй хүмүүс, гэр бүл, бүлгийг сэтгэл зүйн болон нийгмийн дэмжлэгээр хангана.",
  "categorySlug": "education-social",
  "jobZone": 5,
  "riasec": {
   "R": 16,
   "I": 54,
   "A": 22,
   "S": 99,
   "E": 26,
   "C": 35
  },
  "personality": {
   "O": 67,
   "C": 66,
   "E": 73,
   "A": 91
  },
  "cognitive": {
   "math": 29,
   "verbal": 59,
   "techSpatial": 8,
   "abstract": 49
  },
  "subjects": [
   "social"
  ]
 },
 {
  "code": "21-1023.00",
  "slug": "mental-health-and-substance-abuse-social-workers",
  "nameEn": "Mental Health and Substance Abuse Social Workers",
  "nameMn": "Сэтгэцийн эрүүл мэнд, донтолтын нийгмийн ажилтан",
  "descriptionMn": "Сэтгэцийн, сэтгэл хөдлөлийн эсвэл архи, тамхи, мансууруулах бодисын донтолттой хүмүүсийг үнэлж, эмчилнэ.",
  "categorySlug": "education-social",
  "jobZone": 5,
  "riasec": {
   "R": 12,
   "I": 51,
   "A": 30,
   "S": 100,
   "E": 24,
   "C": 35
  },
  "personality": {
   "O": 65,
   "C": 54,
   "E": 68,
   "A": 90
  },
  "cognitive": {
   "math": 39,
   "verbal": 61,
   "techSpatial": 13,
   "abstract": 57
  },
  "subjects": [
   "social"
  ]
 },
 {
  "code": "21-1091.00",
  "slug": "health-education-specialists",
  "nameEn": "Health Education Specialists",
  "nameMn": "Эрүүл мэндийн боловсролын мэргэжилтэн",
  "descriptionMn": "Хувь хүн, гэр бүл, олон нийтэд эрүүл амьдралын хэв маягийг бий болгох эрүүл мэндийн боловсролын хөтөлбөр зохион явуулна.",
  "categorySlug": "education-social",
  "jobZone": 4,
  "riasec": {
   "R": 11,
   "I": 72,
   "A": 26,
   "S": 86,
   "E": 37,
   "C": 49
  },
  "personality": {
   "O": 74,
   "C": 62,
   "E": 77,
   "A": 73
  },
  "cognitive": {
   "math": 34,
   "verbal": 52,
   "techSpatial": 19,
   "abstract": 38
  },
  "subjects": [
   "social",
   "math",
   "informatics"
  ]
 },
 {
  "code": "21-1092.00",
  "slug": "probation-officers-and-correctional-treatment-specialists",
  "nameEn": "Probation Officers and Correctional Treatment Specialists",
  "nameMn": "Тэнсэн харгалзах офицер, ялтныг засан хүмүүжүүлэх мэргэжилтэн",
  "descriptionMn": "Хоригдож буй болон тэнсэн харгалзаж буй гэмт хэрэгтнийг нөхөн сэргээхэд нийгмийн үйлчилгээ үзүүлнэ.",
  "categorySlug": "education-social",
  "jobZone": 4,
  "riasec": {
   "R": 23,
   "I": 41,
   "A": 19,
   "S": 76,
   "E": 49,
   "C": 53
  },
  "personality": {
   "O": 45,
   "C": 60,
   "E": 70,
   "A": 63
  },
  "cognitive": {
   "math": 18,
   "verbal": 46,
   "techSpatial": 15,
   "abstract": 41
  },
  "subjects": [
   "social"
  ]
 },
 {
  "code": "21-1093.00",
  "slug": "social-and-human-service-assistants",
  "nameEn": "Social and Human Service Assistants",
  "nameMn": "Нийгмийн үйлчилгээний туслах",
  "descriptionMn": "Сэтгэл зүй, нөхөн сэргээлт, нийгмийн ажил зэрэг олон салбарт үйлчлүүлэгчдэд, мөн гэр бүлд тусалж, бусад мэргэжилтнүүдийг дэмжинэ.",
  "categorySlug": "education-social",
  "jobZone": 4,
  "riasec": {
   "R": 5,
   "I": 30,
   "A": 16,
   "S": 85,
   "E": 44,
   "C": 60
  },
  "personality": {
   "O": 47,
   "C": 40,
   "E": 55,
   "A": 83
  },
  "cognitive": {
   "math": 31,
   "verbal": 43,
   "techSpatial": 22,
   "abstract": 36
  },
  "subjects": [
   "social",
   "informatics"
  ]
 },
 {
  "code": "21-1094.00",
  "slug": "community-health-workers",
  "nameEn": "Community Health Workers",
  "nameMn": "Олон нийтийн эрүүл мэндийн ажилтан",
  "descriptionMn": "Хүмүүсийг эрүүл зан үйлд сургаж, орон нутгийн эрүүл мэндийг дэмжинэ.",
  "categorySlug": "education-social",
  "jobZone": 4,
  "riasec": {
   "R": 17,
   "I": 42,
   "A": 20,
   "S": 93,
   "E": 42,
   "C": 40
  },
  "personality": {
   "O": 50,
   "C": 45,
   "E": 70,
   "A": 84
  },
  "cognitive": {
   "math": 34,
   "verbal": 44,
   "techSpatial": 32,
   "abstract": 38
  },
  "subjects": [
   "social",
   "informatics",
   "biology"
  ]
 },
 {
  "code": "21-2011.00",
  "slug": "clergy",
  "nameEn": "Clergy",
  "nameMn": "Шашны тэргүүлэгч (лам, санваартан)",
  "descriptionMn": "Шашны шүтлэг, зан үйлтэй холбоотой мөргөл хийж, бусад сүнслэг үүргийг гүйцэтгэнэ.",
  "categorySlug": "education-social",
  "jobZone": 5,
  "riasec": {
   "R": 18,
   "I": 18,
   "A": 41,
   "S": 82,
   "E": 53,
   "C": 32
  },
  "personality": {
   "O": 63,
   "C": 54,
   "E": 84,
   "A": 100
  },
  "cognitive": {
   "math": 30,
   "verbal": 48,
   "techSpatial": 21,
   "abstract": 48
  },
  "subjects": [
   "social"
  ]
 },
 {
  "code": "21-2021.00",
  "slug": "directors-religious-activities-and-education",
  "nameEn": "Directors, Religious Activities and Education",
  "nameMn": "Шашны үйл ажиллагаа, боловсролын захирал",
  "descriptionMn": "Шашны бүлгийн шашны боловсрол, үйл ажиллагааг дэмжих хөтөлбөр зохион бүтээж, олон нийтэд хүрэх ажил зохион байгуулна.",
  "categorySlug": "education-social",
  "jobZone": 4,
  "riasec": {
   "R": 0,
   "I": 28,
   "A": 40,
   "S": 100,
   "E": 86,
   "C": 36
  },
  "personality": {
   "O": 66,
   "C": 61,
   "E": 84,
   "A": 82
  },
  "cognitive": {
   "math": 37,
   "verbal": 46,
   "techSpatial": 19,
   "abstract": 35
  },
  "subjects": [
   "social"
  ]
 },
 {
  "code": "23-1011.00",
  "slug": "lawyers",
  "nameEn": "Lawyers",
  "nameMn": "Хуульч (өмгөөлөгч)",
  "descriptionMn": "Эрүүгийн болон иргэний хэрэг, бусад хууль зүйн ажиллагаанд үйлчлүүлэгчийг төлөөлж, хуулийн баримт бичиг бэлтгэж, хууль зүйн хэлцлийн талаар зөвлөнө.",
  "categorySlug": "law-public",
  "jobZone": 5,
  "riasec": {
   "R": 2,
   "I": 56,
   "A": 23,
   "S": 41,
   "E": 75,
   "C": 60
  },
  "personality": {
   "O": 73,
   "C": 87,
   "E": 74,
   "A": 29
  },
  "cognitive": {
   "math": 37,
   "verbal": 75,
   "techSpatial": 15,
   "abstract": 62
  },
  "subjects": [
   "social"
  ]
 },
 {
  "code": "23-1012.00",
  "slug": "judicial-law-clerks",
  "nameEn": "Judicial Law Clerks",
  "nameMn": "Шүүгчийн туслах (хууль зүйн туслах)",
  "descriptionMn": "Шүүхэд шүүгчид тусалж, судалгаа хийж, хуулийн баримт бичиг бэлтгэнэ.",
  "categorySlug": "law-public",
  "jobZone": 5,
  "riasec": {
   "R": 10,
   "I": 50,
   "A": 18,
   "S": 40,
   "E": 59,
   "C": 68
  },
  "personality": {
   "O": 61,
   "C": 84,
   "E": 36,
   "A": 41
  },
  "cognitive": {
   "math": 42,
   "verbal": 64,
   "techSpatial": 9,
   "abstract": 48
  },
  "subjects": [
   "social"
  ]
 },
 {
  "code": "23-1021.00",
  "slug": "administrative-law-judges-adjudicators-and-hearing-officers",
  "nameEn": "Administrative Law Judges, Adjudicators, and Hearing Officers",
  "nameMn": "Захиргааны хэргийн шүүгч, маргаан шийдвэрлэгч",
  "descriptionMn": "Төрийн хөтөлбөр болон бусад төртэй холбоотой асуудлаарх нэхэмжлэлийн талаар хэлэлцүүлэг хийж шийдвэр гаргана.",
  "categorySlug": "law-public",
  "jobZone": 5,
  "riasec": {
   "R": 0,
   "I": 50,
   "A": 12,
   "S": 34,
   "E": 69,
   "C": 75
  },
  "personality": {
   "O": 47,
   "C": 75,
   "E": 56,
   "A": 35
  },
  "cognitive": {
   "math": 36,
   "verbal": 77,
   "techSpatial": 3,
   "abstract": 65
  },
  "subjects": [
   "social"
  ]
 },
 {
  "code": "23-1022.00",
  "slug": "arbitrators-mediators-and-conciliators",
  "nameEn": "Arbitrators, Mediators, and Conciliators",
  "nameMn": "Эвлэрүүлэн зуучлагч, хэлэлцээрийн зуучлагч",
  "descriptionMn": "Яриа хэлцлээр дамжуулан хэлэлцээр, зөрчил шийдвэрлэхэд дэмжлэг үзүүлнэ.",
  "categorySlug": "law-public",
  "jobZone": 5,
  "riasec": {
   "R": 2,
   "I": 44,
   "A": 21,
   "S": 54,
   "E": 61,
   "C": 56
  },
  "personality": {
   "O": 60,
   "C": 54,
   "E": 62,
   "A": 78
  },
  "cognitive": {
   "math": 29,
   "verbal": 72,
   "techSpatial": 18,
   "abstract": 44
  },
  "subjects": [
   "social"
  ]
 },
 {
  "code": "23-1023.00",
  "slug": "judges-magistrate-judges-and-magistrates",
  "nameEn": "Judges, Magistrate Judges, and Magistrates",
  "nameMn": "Шүүгч",
  "descriptionMn": "Шүүхэд маргааныг шийдвэрлэж, зөвлөж, шүүн таслан хууль ёсыг хэрэгжүүлнэ.",
  "categorySlug": "law-public",
  "jobZone": 5,
  "riasec": {
   "R": 22,
   "I": 47,
   "A": 20,
   "S": 49,
   "E": 71,
   "C": 52
  },
  "personality": {
   "O": 55,
   "C": 83,
   "E": 63,
   "A": 32
  },
  "cognitive": {
   "math": 37,
   "verbal": 75,
   "techSpatial": 8,
   "abstract": 67
  },
  "subjects": [
   "social"
  ]
 },
 {
  "code": "23-2011.00",
  "slug": "paralegals-and-legal-assistants",
  "nameEn": "Paralegals and Legal Assistants",
  "nameMn": "Хуулийн туслах",
  "descriptionMn": "Баримт, нөхцөл байдлыг шалгаж, хуулийн баримт бичиг бэлтгэж, өмнөх шийдвэрийг судлан хуульчдад тусална.",
  "categorySlug": "law-public",
  "jobZone": 3,
  "riasec": {
   "R": 12,
   "I": 67,
   "A": 21,
   "S": 35,
   "E": 49,
   "C": 71
  },
  "personality": {
   "O": 50,
   "C": 74,
   "E": 34,
   "A": 41
  },
  "cognitive": {
   "math": 31,
   "verbal": 45,
   "techSpatial": 18,
   "abstract": 19
  },
  "subjects": [
   "social",
   "informatics"
  ]
 },
 {
  "code": "25-2011.00",
  "slug": "preschool-teachers-except-special-education",
  "nameEn": "Preschool Teachers, Except Special Education",
  "nameMn": "Сургуулийн өмнөх боловсролын багш (тусгай боловсролоос бусад)",
  "descriptionMn": "Сургалтын хөтөлбөр, хичээлийн төлөвлөгөөний дагуу нийгэм, бие бялдар, оюун ухааны хөгжлийг дэмжих үйл ажиллагаагаар сургуулийн өмнөх насны хүүхдийг сургана.",
  "categorySlug": "education-social",
  "jobZone": 3,
  "riasec": {
   "R": 32,
   "I": 29,
   "A": 50,
   "S": 100,
   "E": 25,
   "C": 44
  },
  "personality": {
   "O": 53,
   "C": 38,
   "E": 65,
   "A": 84
  },
  "cognitive": {
   "math": 29,
   "verbal": 29,
   "techSpatial": 9,
   "abstract": 19
  },
  "subjects": []
 },
 {
  "code": "25-2012.00",
  "slug": "kindergarten-teachers-except-special-education",
  "nameEn": "Kindergarten Teachers, Except Special Education",
  "nameMn": "Цэцэрлэгийн багш (тусгай боловсролоос бусад)",
  "descriptionMn": "Цэцэрлэгийн хүүхдэд суурь мэдлэг, нийгмийн ур чадвар заана.",
  "categorySlug": "education-social",
  "jobZone": 4,
  "riasec": {
   "R": 28,
   "I": 35,
   "A": 50,
   "S": 100,
   "E": 25,
   "C": 47
  },
  "personality": {
   "O": 55,
   "C": 53,
   "E": 66,
   "A": 80
  },
  "cognitive": {
   "math": 37,
   "verbal": 42,
   "techSpatial": 18,
   "abstract": 35
  },
  "subjects": [
   "social",
   "geography",
   "informatics"
  ]
 },
 {
  "code": "25-2021.00",
  "slug": "elementary-school-teachers-except-special-education",
  "nameEn": "Elementary School Teachers, Except Special Education",
  "nameMn": "Бага ангийн багш (тусгай боловсролоос бусад)",
  "descriptionMn": "Бага ангийн сурагчдад суурь мэдлэг, нийгмийн ур чадвар заана.",
  "categorySlug": "education-social",
  "jobZone": 4,
  "riasec": {
   "R": 27,
   "I": 39,
   "A": 48,
   "S": 100,
   "E": 26,
   "C": 46
  },
  "personality": {
   "O": 62,
   "C": 66,
   "E": 72,
   "A": 79
  },
  "cognitive": {
   "math": 43,
   "verbal": 45,
   "techSpatial": 17,
   "abstract": 39
  },
  "subjects": [
   "math",
   "social"
  ]
 },
 {
  "code": "25-2022.00",
  "slug": "middle-school-teachers-except-special-and-career-technical-education",
  "nameEn": "Middle School Teachers, Except Special and Career/Technical Education",
  "nameMn": "Дунд ангийн багш (тусгай ба мэргэжлийн боловсролоос бусад)",
  "descriptionMn": "Дунд, бага дунд шатны сурагчдад нэг болон хэд хэдэн хичээл заана.",
  "categorySlug": "education-social",
  "jobZone": 4,
  "riasec": {
   "R": 26,
   "I": 39,
   "A": 52,
   "S": 100,
   "E": 28,
   "C": 43
  },
  "personality": {
   "O": 65,
   "C": 67,
   "E": 69,
   "A": 70
  },
  "cognitive": {
   "math": 48,
   "verbal": 48,
   "techSpatial": 23,
   "abstract": 35
  },
  "subjects": [
   "geography",
   "math",
   "informatics"
  ]
 },
 {
  "code": "25-2023.00",
  "slug": "career-technical-education-teachers-middle-school",
  "nameEn": "Career/Technical Education Teachers, Middle School",
  "nameMn": "Мэргэжил, техникийн боловсролын багш (дунд шат)",
  "descriptionMn": "Дунд, бага дунд шатны сурагчдад мэргэжлийн, ажил мэргэжлийн болон техникийн хичээл заана.",
  "categorySlug": "education-social",
  "jobZone": 4,
  "riasec": {
   "R": 38,
   "I": 39,
   "A": 40,
   "S": 100,
   "E": 21,
   "C": 47
  },
  "personality": {
   "O": 64,
   "C": 56,
   "E": 68,
   "A": 67
  },
  "cognitive": {
   "math": 36,
   "verbal": 49,
   "techSpatial": 42,
   "abstract": 39
  },
  "subjects": [
   "informatics",
   "social",
   "math"
  ]
 },
 {
  "code": "25-2031.00",
  "slug": "secondary-school-teachers-except-special-and-career-technical-education",
  "nameEn": "Secondary School Teachers, Except Special and Career/Technical Education",
  "nameMn": "Ахлах ангийн багш (тусгай ба мэргэжлийн боловсролоос бусад)",
  "descriptionMn": "Ахлах ангийн сурагчдад нэг болон хэд хэдэн хичээл заана.",
  "categorySlug": "education-social",
  "jobZone": 4,
  "riasec": {
   "R": 29,
   "I": 37,
   "A": 46,
   "S": 100,
   "E": 32,
   "C": 44
  },
  "personality": {
   "O": 65,
   "C": 65,
   "E": 69,
   "A": 69
  },
  "cognitive": {
   "math": 48,
   "verbal": 51,
   "techSpatial": 27,
   "abstract": 42
  },
  "subjects": [
   "informatics",
   "social",
   "history"
  ]
 },
 {
  "code": "25-2032.00",
  "slug": "career-technical-education-teachers-secondary-school",
  "nameEn": "Career/Technical Education Teachers, Secondary School",
  "nameMn": "Мэргэжил, техникийн боловсролын багш (ахлах шат)",
  "descriptionMn": "Ахлах сургуулийн сурагчдад мэргэжлийн болон техникийн хичээл заана.",
  "categorySlug": "education-social",
  "jobZone": 4,
  "riasec": {
   "R": 31,
   "I": 40,
   "A": 41,
   "S": 100,
   "E": 25,
   "C": 49
  },
  "personality": {
   "O": 65,
   "C": 60,
   "E": 70,
   "A": 66
  },
  "cognitive": {
   "math": 46,
   "verbal": 51,
   "techSpatial": 43,
   "abstract": 52
  },
  "subjects": [
   "informatics",
   "social"
  ]
 },
 {
  "code": "25-2051.00",
  "slug": "special-education-teachers-preschool",
  "nameEn": "Special Education Teachers, Preschool",
  "nameMn": "Тусгай боловсролын багш (сургуулийн өмнөх)",
  "descriptionMn": "Суралцахуйн, сэтгэл хөдлөлийн эсвэл бие махбодын хөгжлийн бэрхшээлтэй сургуулийн өмнөх насны хүүхдэд хичээл, нийгэм, амьдралын ур чадвар заана.",
  "categorySlug": "education-social",
  "jobZone": 4,
  "riasec": {
   "R": 28,
   "I": 42,
   "A": 50,
   "S": 100,
   "E": 12,
   "C": 36
  },
  "personality": {
   "O": 65,
   "C": 68,
   "E": 67,
   "A": 88
  },
  "cognitive": {
   "math": 30,
   "verbal": 47,
   "techSpatial": 24,
   "abstract": 42
  },
  "subjects": [
   "social"
  ]
 },
 {
  "code": "25-2055.00",
  "slug": "special-education-teachers-kindergarten",
  "nameEn": "Special Education Teachers, Kindergarten",
  "nameMn": "Тусгай боловсролын багш (цэцэрлэг)",
  "descriptionMn": "Суралцахуйн, сэтгэл хөдлөлийн эсвэл бие махбодын хөгжлийн бэрхшээлтэй цэцэрлэгийн хүүхдэд хичээл, нийгэм, амьдралын ур чадвар заана.",
  "categorySlug": "education-social",
  "jobZone": 4,
  "riasec": {
   "R": 26,
   "I": 47,
   "A": 44,
   "S": 100,
   "E": 12,
   "C": 45
  },
  "personality": {
   "O": 66,
   "C": 72,
   "E": 67,
   "A": 87
  },
  "cognitive": {
   "math": 32,
   "verbal": 39,
   "techSpatial": 16,
   "abstract": 28
  },
  "subjects": [
   "social",
   "informatics",
   "math"
  ]
 },
 {
  "code": "25-2056.00",
  "slug": "special-education-teachers-elementary-school",
  "nameEn": "Special Education Teachers, Elementary School",
  "nameMn": "Тусгай боловсролын багш (бага анги)",
  "descriptionMn": "Суралцахуйн, сэтгэл хөдлөлийн эсвэл бие махбодын хөгжлийн бэрхшээлтэй бага ангийн сурагчдад хичээл, нийгэм, амьдралын ур чадвар заана.",
  "categorySlug": "education-social",
  "jobZone": 4,
  "riasec": {
   "R": 21,
   "I": 49,
   "A": 44,
   "S": 100,
   "E": 13,
   "C": 41
  },
  "personality": {
   "O": 65,
   "C": 77,
   "E": 69,
   "A": 86
  },
  "cognitive": {
   "math": 37,
   "verbal": 47,
   "techSpatial": 25,
   "abstract": 47
  },
  "subjects": [
   "informatics",
   "geography",
   "social"
  ]
 },
 {
  "code": "25-2057.00",
  "slug": "special-education-teachers-middle-school",
  "nameEn": "Special Education Teachers, Middle School",
  "nameMn": "Тусгай боловсролын багш (дунд анги)",
  "descriptionMn": "Суралцахуйн, сэтгэл хөдлөлийн эсвэл бие махбодын хөгжлийн бэрхшээлтэй дунд ангийн сурагчдад хичээл, нийгэм, амьдралын ур чадвар заана.",
  "categorySlug": "education-social",
  "jobZone": 4,
  "riasec": {
   "R": 22,
   "I": 49,
   "A": 49,
   "S": 100,
   "E": 13,
   "C": 38
  },
  "personality": {
   "O": 66,
   "C": 77,
   "E": 67,
   "A": 84
  },
  "cognitive": {
   "math": 46,
   "verbal": 45,
   "techSpatial": 18,
   "abstract": 44
  },
  "subjects": [
   "math",
   "social"
  ]
 },
 {
  "code": "25-2058.00",
  "slug": "special-education-teachers-secondary-school",
  "nameEn": "Special Education Teachers, Secondary School",
  "nameMn": "Тусгай боловсролын багш (ахлах анги)",
  "descriptionMn": "Суралцахуйн, сэтгэл хөдлөлийн эсвэл бие махбодын хөгжлийн бэрхшээлтэй ахлах ангийн сурагчдад хичээл, нийгэм, амьдралын ур чадвар заана.",
  "categorySlug": "education-social",
  "jobZone": 4,
  "riasec": {
   "R": 23,
   "I": 47,
   "A": 46,
   "S": 100,
   "E": 16,
   "C": 42
  },
  "personality": {
   "O": 69,
   "C": 70,
   "E": 69,
   "A": 86
  },
  "cognitive": {
   "math": 46,
   "verbal": 45,
   "techSpatial": 30,
   "abstract": 45
  },
  "subjects": [
   "social",
   "math",
   "informatics"
  ]
 },
 {
  "code": "25-2059.01",
  "slug": "adapted-physical-education-specialists",
  "nameEn": "Adapted Physical Education Specialists",
  "nameMn": "Дасан зохицох биеийн тамирын мэргэжилтэн",
  "descriptionMn": "Бие бялдрын хөгжлийн хоцрогдол эсвэл бусад хөгжлийн бэрхшээлтэй хүүхэд, залуус, том хүмүүст хувийн хэрэгцээнд нийцсэн биеийн тамирын хичээл, үйлчилгээ үзүүлнэ.",
  "categorySlug": "education-social",
  "jobZone": 4,
  "riasec": {
   "R": 52,
   "I": 44,
   "A": 24,
   "S": 100,
   "E": 15,
   "C": 53
  },
  "personality": {
   "O": 58,
   "C": 61,
   "E": 64,
   "A": 79
  },
  "cognitive": {
   "math": 30,
   "verbal": 43,
   "techSpatial": 22,
   "abstract": 33
  },
  "subjects": [
   "social"
  ]
 },
 {
  "code": "25-3011.00",
  "slug": "adult-basic-education-adult-secondary-education-and-english-as-a-second-language-instructors",
  "nameEn": "Adult Basic Education, Adult Secondary Education, and English as a Second Language Instructors",
  "nameMn": "Насанд хүрэгчдийн суурь боловсрол, англи хэлний багш",
  "descriptionMn": "Сургуулиас гадуурх залуус, насанд хүрэгчдэд суурь боловсрол, бичиг үсэг, англи хэл заах, эсвэл дунд боловсролын түвшний үнэмлэх авах анги зохион явуулна.",
  "categorySlug": "education-social",
  "jobZone": 4,
  "riasec": {
   "R": 22,
   "I": 36,
   "A": 49,
   "S": 100,
   "E": 31,
   "C": 40
  },
  "personality": {
   "O": 66,
   "C": 57,
   "E": 66,
   "A": 71
  },
  "cognitive": {
   "math": 43,
   "verbal": 47,
   "techSpatial": 4,
   "abstract": 33
  },
  "subjects": [
   "geography"
  ]
 },
 {
  "code": "25-3021.00",
  "slug": "self-enrichment-teachers",
  "nameEn": "Self-Enrichment Teachers",
  "nameMn": "Өөрийгөө хөгжүүлэх, сонирхлын чиглэлийн багш",
  "descriptionMn": "Мэргэжил, боловсролын зорилгоос бус өөрийгөө хөгжүүлэх, чөлөөт цагийг зөв өнгөрүүлэх зорилгоор хувь хүн, бүлэгт заана.",
  "categorySlug": "education-social",
  "jobZone": 3,
  "riasec": {
   "R": 25,
   "I": 33,
   "A": 53,
   "S": 100,
   "E": 37,
   "C": 35
  },
  "personality": {
   "O": 64,
   "C": 29,
   "E": 68,
   "A": 66
  },
  "cognitive": {
   "math": 25,
   "verbal": 39,
   "techSpatial": 17,
   "abstract": 20
  },
  "subjects": []
 },
 {
  "code": "25-3031.00",
  "slug": "substitute-teachers-short-term",
  "nameEn": "Substitute Teachers, Short-Term",
  "nameMn": "Орлон багш (богино хугацааны)",
  "descriptionMn": "Ихэвчлэн энгийн багшийн хичээлийн төлөвлөгөөг ашиглан түр хугацаагаар багшийг орлож заана.",
  "categorySlug": "education-social",
  "jobZone": 4,
  "riasec": {
   "R": 20,
   "I": 25,
   "A": 41,
   "S": 96,
   "E": 24,
   "C": 44
  },
  "personality": {
   "O": 43,
   "C": 30,
   "E": 57,
   "A": 67
  },
  "cognitive": {
   "math": 25,
   "verbal": 41,
   "techSpatial": 15,
   "abstract": 20
  },
  "subjects": []
 },
 {
  "code": "25-3041.00",
  "slug": "tutors",
  "nameEn": "Tutors",
  "nameMn": "Дагалдан хичээл заагч (репетитор)",
  "descriptionMn": "Хичээлийн дэмжлэг үзүүлэх эсвэл стандарт болон элсэлтийн шалгалтад бэлтгэхээр сурагчдад ганцаарчлан болон жижиг бүлгээр хичээл заана.",
  "categorySlug": "education-social",
  "jobZone": 3,
  "riasec": {
   "R": 21,
   "I": 31,
   "A": 35,
   "S": 96,
   "E": 12,
   "C": 39
  },
  "personality": {
   "O": 57,
   "C": 54,
   "E": 60,
   "A": 71
  },
  "cognitive": {
   "math": 45,
   "verbal": 47,
   "techSpatial": 16,
   "abstract": 22
  },
  "subjects": [
   "math",
   "informatics"
  ]
 },
 {
  "code": "25-4011.00",
  "slug": "archivists",
  "nameEn": "Archivists",
  "nameMn": "Архивч",
  "descriptionMn": "Байнгын хадгалалтын бүртгэл, түүхэн үнэ цэнэтэй баримт бичгийг үнэлж, засварлаж, хадгалалтыг удирдана.",
  "categorySlug": "education-social",
  "jobZone": 5,
  "riasec": {
   "R": 31,
   "I": 62,
   "A": 32,
   "S": 33,
   "E": 14,
   "C": 83
  },
  "personality": {
   "O": 67,
   "C": 68,
   "E": 44,
   "A": 42
  },
  "cognitive": {
   "math": 34,
   "verbal": 51,
   "techSpatial": 35,
   "abstract": 45
  },
  "subjects": [
   "history",
   "informatics",
   "social"
  ]
 },
 {
  "code": "25-4012.00",
  "slug": "curators",
  "nameEn": "Curators",
  "nameMn": "Музейн куратор",
  "descriptionMn": "Музей болон бусад байгууллагын урлагийн бүтээл, түүхэн эд зүйл, шинжлэх ухааны үлгэр зэрэг цуглуулгыг удирдана.",
  "categorySlug": "education-social",
  "jobZone": 5,
  "riasec": {
   "R": 25,
   "I": 41,
   "A": 33,
   "S": 47,
   "E": 47,
   "C": 73
  },
  "personality": {
   "O": 80,
   "C": 68,
   "E": 69,
   "A": 48
  },
  "cognitive": {
   "math": 52,
   "verbal": 63,
   "techSpatial": 45,
   "abstract": 59
  },
  "subjects": [
   "history",
   "art",
   "social"
  ]
 },
 {
  "code": "25-4013.00",
  "slug": "museum-technicians-and-conservators",
  "nameEn": "Museum Technicians and Conservators",
  "nameMn": "Музейн техникч, сэргээн засварлагч",
  "descriptionMn": "Музейн цуглуулгын эд зүйлийг хадгалалт, судалгаа, үзэсгэлэнд зориулж сэргээн засварлаж, арчилж, бэлтгэнэ.",
  "categorySlug": "education-social",
  "jobZone": 5,
  "riasec": {
   "R": 78,
   "I": 37,
   "A": 36,
   "S": 27,
   "E": 9,
   "C": 60
  },
  "personality": {
   "O": 64,
   "C": 65,
   "E": 37,
   "A": 36
  },
  "cognitive": {
   "math": 31,
   "verbal": 47,
   "techSpatial": 51,
   "abstract": 48
  },
  "subjects": [
   "history",
   "art",
   "chemistry"
  ]
 },
 {
  "code": "25-4022.00",
  "slug": "librarians-and-media-collections-specialists",
  "nameEn": "Librarians and Media Collections Specialists",
  "nameMn": "Номын санч, мэдээллийн сан хөмрөгийн мэргэжилтэн",
  "descriptionMn": "Олон нийт, хувийн хэрэглээнд зориулсан номын сан, мэдээллийн цуглуулгыг удирдаж арчилна.",
  "categorySlug": "education-social",
  "jobZone": 5,
  "riasec": {
   "R": 22,
   "I": 44,
   "A": 27,
   "S": 51,
   "E": 29,
   "C": 81
  },
  "personality": {
   "O": 61,
   "C": 34,
   "E": 56,
   "A": 60
  },
  "cognitive": {
   "math": 28,
   "verbal": 46,
   "techSpatial": 31,
   "abstract": 32
  },
  "subjects": [
   "informatics"
  ]
 },
 {
  "code": "25-4031.00",
  "slug": "library-technicians",
  "nameEn": "Library Technicians",
  "nameMn": "Номын сангийн техникч",
  "descriptionMn": "Уншигчдад каталог, өгөгдлийн сан ашиглан ном, материал олоход тусалж, лавлах эх сурвалжийн богино асуултад хариулж номын санчид туслана.",
  "categorySlug": "education-social",
  "jobZone": 3,
  "riasec": {
   "R": 35,
   "I": 28,
   "A": 10,
   "S": 51,
   "E": 15,
   "C": 92
  },
  "personality": {
   "O": 30,
   "C": 23,
   "E": 34,
   "A": 56
  },
  "cognitive": {
   "math": 30,
   "verbal": 33,
   "techSpatial": 23,
   "abstract": 18
  },
  "subjects": [
   "informatics"
  ]
 },
 {
  "code": "25-9021.00",
  "slug": "farm-and-home-management-educators",
  "nameEn": "Farm and Home Management Educators",
  "nameMn": "Фермийн болон гэрийн аж ахуйн сургагч",
  "descriptionMn": "Хөдөө аж ахуй, холбогдох үйл явц, гэрийн аж ахуйн үйл ажиллагаа эрхэлдэг хүмүүс, гэр бүлд заавар зөвлөгөө өгнө.",
  "categorySlug": "education-social",
  "jobZone": 5,
  "riasec": {
   "R": 49,
   "I": 55,
   "A": 22,
   "S": 64,
   "E": 42,
   "C": 36
  },
  "personality": {
   "O": 72,
   "C": 58,
   "E": 80,
   "A": 68
  },
  "cognitive": {
   "math": 52,
   "verbal": 65,
   "techSpatial": 58,
   "abstract": 61
  },
  "subjects": [
   "biology",
   "informatics",
   "math"
  ]
 },
 {
  "code": "25-9031.00",
  "slug": "instructional-coordinators",
  "nameEn": "Instructional Coordinators",
  "nameMn": "Сургалтын зохицуулагч",
  "descriptionMn": "Сургалтын материал боловсруулж, агуулгыг зохицуулж, орчин үеийн технологийг сургалтад нэвтрүүлэн багш нарт хөтөлбөр боловсруулах, хичээл заах удирдамж өгнө.",
  "categorySlug": "education-social",
  "jobZone": 5,
  "riasec": {
   "R": 10,
   "I": 51,
   "A": 43,
   "S": 86,
   "E": 54,
   "C": 50
  },
  "personality": {
   "O": 75,
   "C": 51,
   "E": 70,
   "A": 61
  },
  "cognitive": {
   "math": 47,
   "verbal": 67,
   "techSpatial": 30,
   "abstract": 51
  },
  "subjects": [
   "informatics",
   "math",
   "social"
  ]
 },
 {
  "code": "25-9042.00",
  "slug": "teaching-assistants-preschool-elementary-middle-and-secondary-school-except-special-education",
  "nameEn": "Teaching Assistants, Preschool, Elementary, Middle, and Secondary School, Except Special Education",
  "nameMn": "Багшийн туслах (тусгай боловсролоос бусад)",
  "descriptionMn": "Сургуулийн өмнөх, бага, дунд, ахлах ангийн багшид сургалтын үүрэгт нь тусална.",
  "categorySlug": "education-social",
  "jobZone": 3,
  "riasec": {
   "R": 26,
   "I": 22,
   "A": 30,
   "S": 92,
   "E": 33,
   "C": 54
  },
  "personality": {
   "O": 44,
   "C": 31,
   "E": 48,
   "A": 67
  },
  "cognitive": {
   "math": 35,
   "verbal": 33,
   "techSpatial": 19,
   "abstract": 25
  },
  "subjects": [
   "social"
  ]
 },
 {
  "code": "25-9043.00",
  "slug": "teaching-assistants-special-education",
  "nameEn": "Teaching Assistants, Special Education",
  "nameMn": "Тусгай боловсролын багшийн туслах",
  "descriptionMn": "Суралцахуйн, сэтгэл хөдлөлийн эсвэл бие махбодын хөгжлийн бэрхшээлтэй сурагчдад хичээл, нийгэм, амьдралын ур чадвар олгоход багшид тусална.",
  "categorySlug": "education-social",
  "jobZone": 3,
  "riasec": {
   "R": 16,
   "I": 38,
   "A": 39,
   "S": 100,
   "E": 19,
   "C": 43
  },
  "personality": {
   "O": 48,
   "C": 45,
   "E": 48,
   "A": 76
  },
  "cognitive": {
   "math": 19,
   "verbal": 32,
   "techSpatial": 6,
   "abstract": 18
  },
  "subjects": []
 },
 {
  "code": "27-1011.00",
  "slug": "art-directors",
  "nameEn": "Art Directors",
  "nameMn": "Уран сайхны удирдагч (арт директор)",
  "descriptionMn": "Хэвлэл, нэвтрүүлэг, видео, кино зэрэг дүрслэлийн бүтээл, медиад зориулсан дизайны санаа, танилцуулгын хандлагыг боловсруулна.",
  "categorySlug": "creative",
  "jobZone": 4,
  "riasec": {
   "R": 33,
   "I": 28,
   "A": 100,
   "S": 31,
   "E": 71,
   "C": 43
  },
  "personality": {
   "O": 84,
   "C": 52,
   "E": 79,
   "A": 33
  },
  "cognitive": {
   "math": 46,
   "verbal": 44,
   "techSpatial": 46,
   "abstract": 51
  },
  "subjects": [
   "art",
   "informatics"
  ]
 },
 {
  "code": "27-1012.00",
  "slug": "craft-artists",
  "nameEn": "Craft Artists",
  "nameMn": "Гар урлалын уран бүтээлч",
  "descriptionMn": "Гагнуур, сүлжмэл, вааран эдлэл, оёдол зэрэг олон аргаар худалдаа, үзэсгэлэнд зориулсан гар хийцийн эд зүйл бүтээнэ.",
  "categorySlug": "creative",
  "jobZone": 3,
  "riasec": {
   "R": 82,
   "I": 14,
   "A": 82,
   "S": 11,
   "E": 31,
   "C": 28
  },
  "personality": {
   "O": 67,
   "C": 32,
   "E": 34,
   "A": 13
  },
  "cognitive": {
   "math": 35,
   "verbal": 12,
   "techSpatial": 49,
   "abstract": 23
  },
  "subjects": [
   "art"
  ]
 },
 {
  "code": "27-1013.00",
  "slug": "fine-artists-including-painters-sculptors-and-illustrators",
  "nameEn": "Fine Artists, Including Painters, Sculptors, and Illustrators",
  "nameMn": "Дүрслэх урлагийн зураач, уран барималч, зураглаач",
  "descriptionMn": "Олон төрлийн материал, техникээр анхны уран бүтээл туурвина.",
  "categorySlug": "creative",
  "jobZone": 3,
  "riasec": {
   "R": 51,
   "I": 28,
   "A": 100,
   "S": 21,
   "E": 23,
   "C": 22
  },
  "personality": {
   "O": 90,
   "C": 19,
   "E": 31,
   "A": 12
  },
  "cognitive": {
   "math": 24,
   "verbal": 21,
   "techSpatial": 54,
   "abstract": 22
  },
  "subjects": [
   "informatics",
   "art",
   "math"
  ]
 },
 {
  "code": "27-1014.00",
  "slug": "special-effects-artists-and-animators",
  "nameEn": "Special Effects Artists and Animators",
  "nameMn": "Тусгай эффект, анимэйшний зураач",
  "descriptionMn": "Кино, видео, компьютер болон бусад электрон хэрэгслээр тоглоом, кино, клип, сурталчилгаанд зориулсан тусгай эффект, анимэйшн бүтээнэ.",
  "categorySlug": "creative",
  "jobZone": 4,
  "riasec": {
   "R": 45,
   "I": 30,
   "A": 100,
   "S": 20,
   "E": 27,
   "C": 36
  },
  "personality": {
   "O": 86,
   "C": 52,
   "E": 38,
   "A": 15
  },
  "cognitive": {
   "math": 37,
   "verbal": 44,
   "techSpatial": 45,
   "abstract": 39
  },
  "subjects": [
   "informatics",
   "geography",
   "technology"
  ]
 },
 {
  "code": "27-1021.00",
  "slug": "commercial-and-industrial-designers",
  "nameEn": "Commercial and Industrial Designers",
  "nameMn": "Үйлдвэрлэлийн болон худалдааны бүтээгдэхүүний дизайнер",
  "descriptionMn": "Автомашин, гэр ахуйн цахилгаан хэрэгсэл, хүүхдийн тоглоом зэрэг үйлдвэрлэлийн бүтээгдэхүүнийг зохион бүтээнэ.",
  "categorySlug": "creative",
  "jobZone": 4,
  "riasec": {
   "R": 60,
   "I": 51,
   "A": 76,
   "S": 14,
   "E": 45,
   "C": 41
  },
  "personality": {
   "O": 85,
   "C": 52,
   "E": 54,
   "A": 27
  },
  "cognitive": {
   "math": 51,
   "verbal": 44,
   "techSpatial": 77,
   "abstract": 58
  },
  "subjects": [
   "technology",
   "informatics",
   "math"
  ]
 },
 {
  "code": "27-1022.00",
  "slug": "fashion-designers",
  "nameEn": "Fashion Designers",
  "nameMn": "Загвар зохион бүтээгч (хувцасны дизайнер)",
  "descriptionMn": "Хувцас, гоёл чимэглэлийг зохион бүтээж, анхны загвар гаргах, эсвэл загварын чиг хандлагад дасан зохицуулна.",
  "categorySlug": "creative",
  "jobZone": 3,
  "riasec": {
   "R": 56,
   "I": 19,
   "A": 100,
   "S": 23,
   "E": 49,
   "C": 32
  },
  "personality": {
   "O": 80,
   "C": 47,
   "E": 65,
   "A": 22
  },
  "cognitive": {
   "math": 34,
   "verbal": 40,
   "techSpatial": 36,
   "abstract": 39
  },
  "subjects": [
   "informatics"
  ]
 },
 {
  "code": "27-1024.00",
  "slug": "graphic-designers",
  "nameEn": "Graphic Designers",
  "nameMn": "График дизайнер",
  "descriptionMn": "Сав баглаа боодол, үзэсгэлэн, лого зэрэг худалдаа, сурталчилгааны тодорхой хэрэгцээнд зориулсан график зохион бүтээнэ.",
  "categorySlug": "creative",
  "jobZone": 4,
  "riasec": {
   "R": 40,
   "I": 31,
   "A": 100,
   "S": 19,
   "E": 41,
   "C": 49
  },
  "personality": {
   "O": 73,
   "C": 41,
   "E": 37,
   "A": 26
  },
  "cognitive": {
   "math": 26,
   "verbal": 36,
   "techSpatial": 44,
   "abstract": 26
  },
  "subjects": [
   "art",
   "informatics"
  ]
 },
 {
  "code": "27-1025.00",
  "slug": "interior-designers",
  "nameEn": "Interior Designers",
  "nameMn": "Интерьер дизайнер",
  "descriptionMn": "Өрөө, барилгын дотоод орон зайг төлөвлөж, зохион бүтээж, тохижуулна.",
  "categorySlug": "creative",
  "jobZone": 4,
  "riasec": {
   "R": 52,
   "I": 35,
   "A": 76,
   "S": 28,
   "E": 45,
   "C": 47
  },
  "personality": {
   "O": 72,
   "C": 58,
   "E": 63,
   "A": 45
  },
  "cognitive": {
   "math": 46,
   "verbal": 44,
   "techSpatial": 62,
   "abstract": 38
  },
  "subjects": [
   "informatics",
   "art",
   "social"
  ]
 },
 {
  "code": "27-1026.00",
  "slug": "merchandise-displayers-and-window-trimmers",
  "nameEn": "Merchandise Displayers and Window Trimmers",
  "nameMn": "Бараа үзүүлэх, лангууны чимэглэгч",
  "descriptionMn": "Дэлгүүрийн цонх, дотор болон худалдааны үзэсгэлэн дэх барааны үзүүлэн тавилтыг төлөвлөж, байрлуулна.",
  "categorySlug": "creative",
  "jobZone": 3,
  "riasec": {
   "R": 58,
   "I": 9,
   "A": 62,
   "S": 20,
   "E": 55,
   "C": 35
  },
  "personality": {
   "O": 61,
   "C": 30,
   "E": 46,
   "A": 25
  },
  "cognitive": {
   "math": 24,
   "verbal": 29,
   "techSpatial": 45,
   "abstract": 22
  },
  "subjects": []
 },
 {
  "code": "27-1027.00",
  "slug": "set-and-exhibit-designers",
  "nameEn": "Set and Exhibit Designers",
  "nameMn": "Тайз, үзэсгэлэнгийн дизайнер",
  "descriptionMn": "Кино, видео, телевиз, театрын бүтээлд зориулсан тусгай үзэсгэлэн, тайзны чимэглэлийг зохион бүтээнэ.",
  "categorySlug": "creative",
  "jobZone": 5,
  "riasec": {
   "R": 45,
   "I": 29,
   "A": 95,
   "S": 34,
   "E": 49,
   "C": 38
  },
  "personality": {
   "O": 75,
   "C": 55,
   "E": 61,
   "A": 24
  },
  "cognitive": {
   "math": 43,
   "verbal": 43,
   "techSpatial": 79,
   "abstract": 39
  },
  "subjects": [
   "art",
   "informatics",
   "history"
  ]
 },
 {
  "code": "27-2012.00",
  "slug": "producers-and-directors",
  "nameEn": "Producers and Directors",
  "nameMn": "Продюсер, найруулагч",
  "descriptionMn": "Зугаа цэнгэл, мэдээлэл, сургалтын зорилгоор тайз, телевиз, радио, видео, киноны бүтээлийг хөтлөн, найруулна.",
  "categorySlug": "creative",
  "jobZone": 4,
  "riasec": {
   "R": 19,
   "I": 21,
   "A": 86,
   "S": 35,
   "E": 80,
   "C": 43
  },
  "personality": {
   "O": 89,
   "C": 68,
   "E": 90,
   "A": 35
  },
  "cognitive": {
   "math": 45,
   "verbal": 55,
   "techSpatial": 48,
   "abstract": 51
  },
  "subjects": [
   "informatics"
  ]
 },
 {
  "code": "27-2012.03",
  "slug": "media-programming-directors",
  "nameEn": "Media Programming Directors",
  "nameMn": "Хэвлэл мэдээллийн нэвтрүүлгийн захирал",
  "descriptionMn": "Радио, телевизийн станцын нэвтрүүлгийн хуваарь, спорт, мэдээ зэрэг нэвтрүүлгийг бэлтгэдэг ажилтнуудын үйл ажиллагааг удирдан зохицуулна.",
  "categorySlug": "creative",
  "jobZone": 4,
  "riasec": {
   "R": 7,
   "I": 21,
   "A": 52,
   "S": 45,
   "E": 93,
   "C": 61
  },
  "personality": {
   "O": 75,
   "C": 62,
   "E": 81,
   "A": 37
  },
  "cognitive": {
   "math": 42,
   "verbal": 47,
   "techSpatial": 50,
   "abstract": 44
  },
  "subjects": [
   "informatics"
  ]
 },
 {
  "code": "27-2012.04",
  "slug": "talent-directors",
  "nameEn": "Talent Directors",
  "nameMn": "Тоглогч сонгон шалгаруулагч (кастинг директор)",
  "descriptionMn": "Тайз, телевиз, радио, киноны бүтээлийн дүрд тохирох уран бүтээлчдийг шалгаруулж ярилцлага хийнэ.",
  "categorySlug": "creative",
  "jobZone": 4,
  "riasec": {
   "R": 4,
   "I": 7,
   "A": 78,
   "S": 54,
   "E": 82,
   "C": 43
  },
  "personality": {
   "O": 61,
   "C": 35,
   "E": 74,
   "A": 41
  },
  "cognitive": {
   "math": 34,
   "verbal": 44,
   "techSpatial": 18,
   "abstract": 35
  },
  "subjects": [
   "art"
  ]
 },
 {
  "code": "27-2012.05",
  "slug": "media-technical-directors-managers",
  "nameEn": "Media Technical Directors/Managers",
  "nameMn": "Хэвлэл мэдээллийн техникийн захирал, менежер",
  "descriptionMn": "Радио, телевизийн нэвтрүүлэг бэлтгэх зураг авалт, засвар, инженер, засвар үйлчилгээ зэрэг техникийн хэлтсүүдийн ажлыг зохицуулна.",
  "categorySlug": "creative",
  "jobZone": 4,
  "riasec": {
   "R": 49,
   "I": 30,
   "A": 41,
   "S": 27,
   "E": 70,
   "C": 58
  },
  "personality": {
   "O": 62,
   "C": 54,
   "E": 70,
   "A": 35
  },
  "cognitive": {
   "math": 30,
   "verbal": 45,
   "techSpatial": 52,
   "abstract": 44
  },
  "subjects": [
   "informatics",
   "technology"
  ]
 },
 {
  "code": "27-2022.00",
  "slug": "coaches-and-scouts",
  "nameEn": "Coaches and Scouts",
  "nameMn": "Дасгалжуулагч, авьяас сонгон шалгаруулагч",
  "descriptionMn": "Тэмцээн уралдааны зорилгоор спортын үндсийг бүлэг, хувь хүнд заан дасгалжуулна.",
  "categorySlug": "creative",
  "jobZone": 4,
  "riasec": {
   "R": 54,
   "I": 19,
   "A": 24,
   "S": 72,
   "E": 69,
   "C": 41
  },
  "personality": {
   "O": 60,
   "C": 64,
   "E": 91,
   "A": 59
  },
  "cognitive": {
   "math": 30,
   "verbal": 47,
   "techSpatial": 47,
   "abstract": 54
  },
  "subjects": [
   "social"
  ]
 },
 {
  "code": "27-2031.00",
  "slug": "dancers",
  "nameEn": "Dancers",
  "nameMn": "Бүжигчин",
  "descriptionMn": "Бүжиг бүжиглэнэ. Тайз, нэвтрүүлэг, видео бичлэгт тоглож болно.",
  "categorySlug": "creative",
  "jobZone": 3,
  "riasec": {
   "R": 64,
   "I": 7,
   "A": 90,
   "S": 44,
   "E": 36,
   "C": 10
  },
  "personality": {
   "O": 52,
   "C": 46,
   "E": 49,
   "A": 23
  },
  "cognitive": {
   "math": 0,
   "verbal": 18,
   "techSpatial": 12,
   "abstract": 9
  },
  "subjects": [
   "art"
  ]
 },
 {
  "code": "27-2032.00",
  "slug": "choreographers",
  "nameEn": "Choreographers",
  "nameMn": "Бүжгийн дэглээч",
  "descriptionMn": "Шинэ бүжгийн найруулга зохиож, тоглолтын бэлтгэлийг хангана.",
  "categorySlug": "creative",
  "jobZone": 3,
  "riasec": {
   "R": 44,
   "I": 20,
   "A": 100,
   "S": 49,
   "E": 46,
   "C": 19
  },
  "personality": {
   "O": 86,
   "C": 41,
   "E": 82,
   "A": 40
  },
  "cognitive": {
   "math": 22,
   "verbal": 34,
   "techSpatial": 47,
   "abstract": 28
  },
  "subjects": [
   "art"
  ]
 },
 {
  "code": "27-2041.00",
  "slug": "music-directors-and-composers",
  "nameEn": "Music Directors and Composers",
  "nameMn": "Хөгжмийн удирдаач, хөгжмийн зохиолч",
  "descriptionMn": "Найрал хөгжим, хамтлаг, найрал дуу зэрэг хөгжмийн уран бүтээлчдийн тоглолтыг удирдаж, төлөвлөж, эсвэл анхны хөгжмийн бүтээл зохионо.",
  "categorySlug": "creative",
  "jobZone": 4,
  "riasec": {
   "R": 18,
   "I": 21,
   "A": 100,
   "S": 34,
   "E": 64,
   "C": 27
  },
  "personality": {
   "O": 90,
   "C": 58,
   "E": 85,
   "A": 40
  },
  "cognitive": {
   "math": 30,
   "verbal": 42,
   "techSpatial": 28,
   "abstract": 44
  },
  "subjects": [
   "art",
   "informatics"
  ]
 },
 {
  "code": "27-2042.00",
  "slug": "musicians-and-singers",
  "nameEn": "Musicians and Singers",
  "nameMn": "Хөгжимчин, дуучин",
  "descriptionMn": "Нэг болон хэд хэдэн хөгжмийн зэмсэг тоглож эсвэл дуулна. Тайз, нэвтрүүлэг, дуу болон видео бичлэгт тоглож болно.",
  "categorySlug": "creative",
  "jobZone": 4,
  "riasec": {
   "R": 31,
   "I": 9,
   "A": 94,
   "S": 40,
   "E": 40,
   "C": 19
  },
  "personality": {
   "O": 69,
   "C": 44,
   "E": 62,
   "A": 27
  },
  "cognitive": {
   "math": 24,
   "verbal": 30,
   "techSpatial": 18,
   "abstract": 13
  },
  "subjects": [
   "art"
  ]
 },
 {
  "code": "27-3011.00",
  "slug": "broadcast-announcers-and-radio-disc-jockeys",
  "nameEn": "Broadcast Announcers and Radio Disc Jockeys",
  "nameMn": "Нэвтрүүлгийн хөтлөгч, радио диск жокей",
  "descriptionMn": "Радио, телевиз болон бусад харилцаа холбооны хэрэгслээр мэдээ, сурталчилгаа зэрэг бичигдсэн материалыг уншиж хэлнэ.",
  "categorySlug": "creative",
  "jobZone": 4,
  "riasec": {
   "R": 11,
   "I": 17,
   "A": 78,
   "S": 42,
   "E": 56,
   "C": 35
  },
  "personality": {
   "O": 53,
   "C": 27,
   "E": 72,
   "A": 28
  },
  "cognitive": {
   "math": 12,
   "verbal": 45,
   "techSpatial": 21,
   "abstract": 26
  },
  "subjects": [
   "informatics"
  ]
 },
 {
  "code": "27-3023.00",
  "slug": "news-analysts-reporters-and-journalists",
  "nameEn": "News Analysts, Reporters, and Journalists",
  "nameMn": "Сэтгүүлч, мэдээний шинжээч",
  "descriptionMn": "Сонин, сэтгүүл, радио, телевиз зэрэг хэвлэл мэдээллийн хэрэгсэлд мэдээ, тойм, сэтгэгдэл бичиж эсвэл дуу хоолойгоор хүргэнэ.",
  "categorySlug": "creative",
  "jobZone": 4,
  "riasec": {
   "R": 8,
   "I": 53,
   "A": 68,
   "S": 30,
   "E": 49,
   "C": 44
  },
  "personality": {
   "O": 82,
   "C": 59,
   "E": 71,
   "A": 26
  },
  "cognitive": {
   "math": 23,
   "verbal": 64,
   "techSpatial": 39,
   "abstract": 45
  },
  "subjects": [
   "informatics"
  ]
 },
 {
  "code": "27-3031.00",
  "slug": "public-relations-specialists",
  "nameEn": "Public Relations Specialists",
  "nameMn": "Олон нийттэй харилцах мэргэжилтэн",
  "descriptionMn": "Хувь хүн, бүлэг, байгууллагын зорилтот олон нийтэд харагдах дүр төрхийг сурталчилж, бүтээнэ.",
  "categorySlug": "creative",
  "jobZone": 4,
  "riasec": {
   "R": 0,
   "I": 29,
   "A": 61,
   "S": 49,
   "E": 80,
   "C": 41
  },
  "personality": {
   "O": 72,
   "C": 54,
   "E": 81,
   "A": 45
  },
  "cognitive": {
   "math": 31,
   "verbal": 51,
   "techSpatial": 18,
   "abstract": 39
  },
  "subjects": [
   "informatics",
   "social"
  ]
 },
 {
  "code": "27-3041.00",
  "slug": "editors",
  "nameEn": "Editors",
  "nameMn": "Редактор",
  "descriptionMn": "Бичмэл материалыг төлөвлөж, зохицуулж, шинэчилж, засварлана. Хэвлүүлэх санал, ноорогт үнэлгээ өгч болно.",
  "categorySlug": "creative",
  "jobZone": 4,
  "riasec": {
   "R": 1,
   "I": 32,
   "A": 73,
   "S": 26,
   "E": 52,
   "C": 61
  },
  "personality": {
   "O": 74,
   "C": 77,
   "E": 69,
   "A": 36
  },
  "cognitive": {
   "math": 34,
   "verbal": 64,
   "techSpatial": 26,
   "abstract": 42
  },
  "subjects": [
   "informatics",
   "geography"
  ]
 },
 {
  "code": "27-3042.00",
  "slug": "technical-writers",
  "nameEn": "Technical Writers",
  "nameMn": "Техникийн нийтлэлч (техникийн бичээч)",
  "descriptionMn": "Тоног төхөөрөмжийн гарын авлага, хавсралт, ашиглалт болон засвар үйлчилгээний заавар зэрэг техникийн материал бичнэ.",
  "categorySlug": "creative",
  "jobZone": 4,
  "riasec": {
   "R": 30,
   "I": 45,
   "A": 54,
   "S": 17,
   "E": 16,
   "C": 72
  },
  "personality": {
   "O": 64,
   "C": 53,
   "E": 24,
   "A": 32
  },
  "cognitive": {
   "math": 8,
   "verbal": 60,
   "techSpatial": 55,
   "abstract": 33
  },
  "subjects": [
   "informatics"
  ]
 },
 {
  "code": "27-3043.00",
  "slug": "writers-and-authors",
  "nameEn": "Writers and Authors",
  "nameMn": "Зохиолч, нийтлэлч",
  "descriptionMn": "Сценари, түүх, сурталчилгаа зэрэг бичмэл материалыг бүтээж бэлтгэнэ.",
  "categorySlug": "creative",
  "jobZone": 4,
  "riasec": {
   "R": 0,
   "I": 38,
   "A": 95,
   "S": 31,
   "E": 63,
   "C": 39
  },
  "personality": {
   "O": 86,
   "C": 38,
   "E": 55,
   "A": 28
  },
  "cognitive": {
   "math": 0,
   "verbal": 55,
   "techSpatial": 17,
   "abstract": 26
  },
  "subjects": [
   "informatics"
  ]
 },
 {
  "code": "27-3043.05",
  "slug": "poets-lyricists-and-creative-writers",
  "nameEn": "Poets, Lyricists and Creative Writers",
  "nameMn": "Яруу найрагч, дууны үгийн зохиолч, уран зохиолч",
  "descriptionMn": "Хэвлэл, тоглолтод зориулан сценари, эсээ, зохиол, шүлэг, дууны үг зэрэг бичмэл бүтээлийг зохионо.",
  "categorySlug": "creative",
  "jobZone": 4,
  "riasec": {
   "R": 3,
   "I": 43,
   "A": 100,
   "S": 31,
   "E": 36,
   "C": 31
  },
  "personality": {
   "O": 95,
   "C": 11,
   "E": 31,
   "A": 21
  },
  "cognitive": {
   "math": 10,
   "verbal": 52,
   "techSpatial": 21,
   "abstract": 31
  },
  "subjects": [
   "informatics",
   "social",
   "art"
  ]
 },
 {
  "code": "27-3091.00",
  "slug": "interpreters-and-translators",
  "nameEn": "Interpreters and Translators",
  "nameMn": "Орчуулагч, тайлбарлагч",
  "descriptionMn": "Амаар болон дохионы хэлээр орчуулах, эсвэл бичмэл эхийг нэг хэлнээс нөгөө хэл рүү орчуулна.",
  "categorySlug": "creative",
  "jobZone": 4,
  "riasec": {
   "R": 15,
   "I": 37,
   "A": 55,
   "S": 41,
   "E": 15,
   "C": 63
  },
  "personality": {
   "O": 62,
   "C": 61,
   "E": 28,
   "A": 50
  },
  "cognitive": {
   "math": 12,
   "verbal": 54,
   "techSpatial": 12,
   "abstract": 20
  },
  "subjects": []
 },
 {
  "code": "27-3092.00",
  "slug": "court-reporters-and-simultaneous-captioners",
  "nameEn": "Court Reporters and Simultaneous Captioners",
  "nameMn": "Шүүхийн нарийн бичгийн дарга (протокол хөтлөгч)",
  "descriptionMn": "Шүүхийн өмнөх болон шүүх хурлын ажиллагаа, бусад мэдээллийг үгчлэн тэмдэглэх арга, төхөөрөмжөөр бичиж, хадгалж, дахин сэргээж, задлан бичнэ.",
  "categorySlug": "creative",
  "jobZone": 3,
  "riasec": {
   "R": 20,
   "I": 19,
   "A": 32,
   "S": 32,
   "E": 27,
   "C": 77
  },
  "personality": {
   "O": 8,
   "C": 76,
   "E": 6,
   "A": 17
  },
  "cognitive": {
   "math": 7,
   "verbal": 46,
   "techSpatial": 25,
   "abstract": 2
  },
  "subjects": [
   "informatics",
   "social"
  ]
 },
 {
  "code": "27-4011.00",
  "slug": "audio-and-video-technicians",
  "nameEn": "Audio and Video Technicians",
  "nameMn": "Дуу, дүрсний техникч",
  "descriptionMn": "Концерт, хурал, чуулган, подкаст, мэдээллийн бага хурал, спортын тэмцээн зэрэг арга хэмжээнд микрофон, чанга яригч, самбар, камер, дэлгэц зэрэг дуу, дүрсний тоног төхөөрөмжийг суурилуулж, засвар үйлчилгээ хийж, буулгана.",
  "categorySlug": "creative",
  "jobZone": 3,
  "riasec": {
   "R": 70,
   "I": 29,
   "A": 37,
   "S": 16,
   "E": 15,
   "C": 60
  },
  "personality": {
   "O": 54,
   "C": 45,
   "E": 42,
   "A": 25
  },
  "cognitive": {
   "math": 31,
   "verbal": 38,
   "techSpatial": 60,
   "abstract": 32
  },
  "subjects": [
   "informatics",
   "art",
   "technology"
  ]
 },
 {
  "code": "27-4012.00",
  "slug": "broadcast-technicians",
  "nameEn": "Broadcast Technicians",
  "nameMn": "Нэвтрүүлгийн техникч",
  "descriptionMn": "Радио, телевизийн нэвтрүүлгийн дуу, дүрсийг авах, засварлах, дамжуулахад хэрэглэгддэг электрон тоног төхөөрөмжийг суурилуулж, ажиллуулж, засвар үйлчилгээ хийнэ.",
  "categorySlug": "creative",
  "jobZone": 3,
  "riasec": {
   "R": 63,
   "I": 33,
   "A": 30,
   "S": 19,
   "E": 25,
   "C": 69
  },
  "personality": {
   "O": 49,
   "C": 50,
   "E": 19,
   "A": 14
  },
  "cognitive": {
   "math": 33,
   "verbal": 35,
   "techSpatial": 61,
   "abstract": 30
  },
  "subjects": [
   "informatics",
   "technology",
   "math"
  ]
 },
 {
  "code": "27-4014.00",
  "slug": "sound-engineering-technicians",
  "nameEn": "Sound Engineering Technicians",
  "nameMn": "Дууны инженерийн техникч",
  "descriptionMn": "Театр, видео, кино, телевиз, подкаст, спортын тэмцээн зэрэг бүтээлд хөгжим, дуу хоолой, дууны эффектийг бичих, тааруулах, холих, засварлах, дахин гаргах тоног төхөөрөмжийг угсарч ажиллуулна.",
  "categorySlug": "creative",
  "jobZone": 3,
  "riasec": {
   "R": 69,
   "I": 28,
   "A": 58,
   "S": 12,
   "E": 19,
   "C": 54
  },
  "personality": {
   "O": 63,
   "C": 60,
   "E": 34,
   "A": 27
  },
  "cognitive": {
   "math": 30,
   "verbal": 36,
   "techSpatial": 56,
   "abstract": 32
  },
  "subjects": [
   "informatics",
   "art",
   "technology"
  ]
 },
 {
  "code": "27-4021.00",
  "slug": "photographers",
  "nameEn": "Photographers",
  "nameMn": "Гэрэл зурагчин",
  "descriptionMn": "Хүн, байгаль, бараа бүтээгдэхүүн болон бусад объектыг гэрэл зургаар буулгана.",
  "categorySlug": "creative",
  "jobZone": 3,
  "riasec": {
   "R": 76,
   "I": 20,
   "A": 71,
   "S": 16,
   "E": 21,
   "C": 39
  },
  "personality": {
   "O": 69,
   "C": 42,
   "E": 44,
   "A": 25
  },
  "cognitive": {
   "math": 25,
   "verbal": 34,
   "techSpatial": 61,
   "abstract": 32
  },
  "subjects": [
   "informatics",
   "art",
   "social"
  ]
 },
 {
  "code": "27-4031.00",
  "slug": "camera-operators-television-video-and-film",
  "nameEn": "Camera Operators, Television, Video, and Film",
  "nameMn": "Телевиз, видео, киноны оператор",
  "descriptionMn": "Телевиз, видео, киноны бүтээлд зориулж зураг, үзэгдлийг бичихийн тулд камер ажиллуулна.",
  "categorySlug": "creative",
  "jobZone": 3,
  "riasec": {
   "R": 65,
   "I": 17,
   "A": 67,
   "S": 13,
   "E": 21,
   "C": 44
  },
  "personality": {
   "O": 60,
   "C": 40,
   "E": 35,
   "A": 20
  },
  "cognitive": {
   "math": 29,
   "verbal": 29,
   "techSpatial": 57,
   "abstract": 23
  },
  "subjects": [
   "informatics"
  ]
 },
 {
  "code": "27-4032.00",
  "slug": "film-and-video-editors",
  "nameEn": "Film and Video Editors",
  "nameMn": "Кино, видео монтажчин",
  "descriptionMn": "Кино, видео болон бусад медиа дээрх хөдөлгөөнт дүрсийг засварлана. Эцсийн бүтээлд зориулж продюсер, найруулагчтай хамтран дүрсийг цэгцэлж болно.",
  "categorySlug": "creative",
  "jobZone": 4,
  "riasec": {
   "R": 36,
   "I": 15,
   "A": 77,
   "S": 16,
   "E": 35,
   "C": 46
  },
  "personality": {
   "O": 76,
   "C": 65,
   "E": 35,
   "A": 23
  },
  "cognitive": {
   "math": 29,
   "verbal": 42,
   "techSpatial": 48,
   "abstract": 36
  },
  "subjects": [
   "informatics",
   "art"
  ]
 },
 {
  "code": "29-1011.00",
  "slug": "chiropractors",
  "nameEn": "Chiropractors",
  "nameMn": "Хэрлэлийн эмч (хиропрактор)",
  "descriptionMn": "Нугас, яс булчингийн системийг заллагаар өвчтөнийг үнэлж, эмчилж, арчилна.",
  "categorySlug": "health",
  "jobZone": 5,
  "riasec": {
   "R": 76,
   "I": 63,
   "A": 6,
   "S": 76,
   "E": 19,
   "C": 43
  },
  "personality": {
   "O": 64,
   "C": 63,
   "E": 57,
   "A": 67
  },
  "cognitive": {
   "math": 31,
   "verbal": 60,
   "techSpatial": 38,
   "abstract": 67
  },
  "subjects": [
   "biology",
   "social",
   "informatics"
  ]
 },
 {
  "code": "29-1021.00",
  "slug": "dentists-general",
  "nameEn": "Dentists, General",
  "nameMn": "Ерөнхий шүдний эмч",
  "descriptionMn": "Шүд, буйлны өвчин, гэмтэл, гажгийг үзэж, оношилж, эмчилнэ.",
  "categorySlug": "health",
  "jobZone": 5,
  "riasec": {
   "R": 71,
   "I": 75,
   "A": 3,
   "S": 57,
   "E": 17,
   "C": 45
  },
  "personality": {
   "O": 61,
   "C": 82,
   "E": 59,
   "A": 59
  },
  "cognitive": {
   "math": 48,
   "verbal": 59,
   "techSpatial": 43,
   "abstract": 77
  },
  "subjects": [
   "biology",
   "social",
   "chemistry"
  ]
 },
 {
  "code": "29-1022.00",
  "slug": "oral-and-maxillofacial-surgeons",
  "nameEn": "Oral and Maxillofacial Surgeons",
  "nameMn": "Амны хөндий, нүүр-эрүүний мэс заслын эмч",
  "descriptionMn": "Өвчин, гэмтэл, гажгийг эмчлэхийн тулд амны хөндий, нүүр эрүүний хатуу ба зөөлөн эдэд мэс засал болон холбогдох ажилбар хийнэ.",
  "categorySlug": "health",
  "jobZone": 5,
  "riasec": {
   "R": 79,
   "I": 81,
   "A": 3,
   "S": 58,
   "E": 19,
   "C": 43
  },
  "personality": {
   "O": 73,
   "C": 97,
   "E": 64,
   "A": 48
  },
  "cognitive": {
   "math": 47,
   "verbal": 68,
   "techSpatial": 61,
   "abstract": 75
  },
  "subjects": [
   "biology",
   "social",
   "informatics"
  ]
 },
 {
  "code": "29-1031.00",
  "slug": "dietitians-and-nutritionists",
  "nameEn": "Dietitians and Nutritionists",
  "nameMn": "Хоолны дэглэмч, хоол зүйч",
  "descriptionMn": "Эрүүл мэндийг дэмжих, өвчнийг хянахад туслах хоолны үйлчилгээ болон хоол тэжээлийн хөтөлбөрийг төлөвлөж явуулна.",
  "categorySlug": "health",
  "jobZone": 5,
  "riasec": {
   "R": 34,
   "I": 63,
   "A": 23,
   "S": 75,
   "E": 40,
   "C": 39
  },
  "personality": {
   "O": 65,
   "C": 68,
   "E": 58,
   "A": 71
  },
  "cognitive": {
   "math": 49,
   "verbal": 62,
   "techSpatial": 22,
   "abstract": 58
  },
  "subjects": [
   "social",
   "biology",
   "math"
  ]
 },
 {
  "code": "29-1041.00",
  "slug": "optometrists",
  "nameEn": "Optometrists",
  "nameMn": "Нүдний шилний эмч (оптометрист)",
  "descriptionMn": "Хүний нүд, хараа үзэхүйн системийн эмгэг, өвчнийг оношилж, хянаж, эмчилнэ.",
  "categorySlug": "health",
  "jobZone": 5,
  "riasec": {
   "R": 63,
   "I": 80,
   "A": 10,
   "S": 67,
   "E": 21,
   "C": 49
  },
  "personality": {
   "O": 63,
   "C": 70,
   "E": 52,
   "A": 60
  },
  "cognitive": {
   "math": 53,
   "verbal": 59,
   "techSpatial": 36,
   "abstract": 73
  },
  "subjects": [
   "biology",
   "informatics",
   "social"
  ]
 },
 {
  "code": "29-1051.00",
  "slug": "pharmacists",
  "nameEn": "Pharmacists",
  "nameMn": "Эм зүйч (фармацист)",
  "descriptionMn": "Эмч болон бусад эрүүл мэндийн мэргэжилтний бичсэн эмийг олгож, өвчтөнд эмийн тухай, хэрэглээний талаар мэдээлэл өгнө.",
  "categorySlug": "health",
  "jobZone": 5,
  "riasec": {
   "R": 30,
   "I": 78,
   "A": 8,
   "S": 65,
   "E": 27,
   "C": 59
  },
  "personality": {
   "O": 54,
   "C": 87,
   "E": 56,
   "A": 68
  },
  "cognitive": {
   "math": 55,
   "verbal": 66,
   "techSpatial": 22,
   "abstract": 54
  },
  "subjects": [
   "biology",
   "chemistry",
   "math"
  ]
 },
 {
  "code": "29-1071.00",
  "slug": "physician-assistants",
  "nameEn": "Physician Assistants",
  "nameMn": "Эмчийн туслах",
  "descriptionMn": "Эмчийн хяналтан дор ихэвчлэн эмчийн гүйцэтгэдэг эрүүл мэндийн үйлчилгээг үзүүлнэ.",
  "categorySlug": "health",
  "jobZone": 5,
  "riasec": {
   "R": 50,
   "I": 66,
   "A": 3,
   "S": 82,
   "E": 16,
   "C": 58
  },
  "personality": {
   "O": 69,
   "C": 93,
   "E": 54,
   "A": 63
  },
  "cognitive": {
   "math": 48,
   "verbal": 62,
   "techSpatial": 30,
   "abstract": 67
  },
  "subjects": [
   "biology",
   "social",
   "chemistry"
  ]
 },
 {
  "code": "29-1071.01",
  "slug": "anesthesiologist-assistants",
  "nameEn": "Anesthesiologist Assistants",
  "nameMn": "Мэдээгүйжүүлэгч эмчийн туслах",
  "descriptionMn": "Мэс засал болон мэс заслын бус ажилбарт мэдээгүйжүүлэгч эмчид тусална.",
  "categorySlug": "health",
  "jobZone": 5,
  "riasec": {
   "R": 57,
   "I": 60,
   "A": 0,
   "S": 65,
   "E": 15,
   "C": 68
  },
  "personality": {
   "O": 53,
   "C": 92,
   "E": 41,
   "A": 60
  },
  "cognitive": {
   "math": 53,
   "verbal": 49,
   "techSpatial": 38,
   "abstract": 54
  },
  "subjects": [
   "biology",
   "math",
   "social"
  ]
 },
 {
  "code": "29-1081.00",
  "slug": "podiatrists",
  "nameEn": "Podiatrists",
  "nameMn": "Хөлийн эмч (подиатр)",
  "descriptionMn": "Хүний хөлний өвчин, гажгийг оношилж эмчилнэ.",
  "categorySlug": "health",
  "jobZone": 5,
  "riasec": {
   "R": 72,
   "I": 80,
   "A": 12,
   "S": 66,
   "E": 19,
   "C": 38
  },
  "personality": {
   "O": 65,
   "C": 72,
   "E": 55,
   "A": 57
  },
  "cognitive": {
   "math": 47,
   "verbal": 72,
   "techSpatial": 43,
   "abstract": 74
  },
  "subjects": [
   "biology",
   "social",
   "informatics"
  ]
 },
 {
  "code": "29-1122.00",
  "slug": "occupational-therapists",
  "nameEn": "Occupational Therapists",
  "nameMn": "Хөдөлмөрийн эмчилгээч",
  "descriptionMn": "Хөгжлийн бэрхшээлтэй, хөгжлийн хоцрогдолтой хүмүүст мэргэжлийн, гэрийн болон өдөр тутмын ур чадвар, бие даасан байдлыг сэргээх нөхөн сэргээх хөтөлбөрийг төлөвлөж, зохион байгуулна.",
  "categorySlug": "health",
  "jobZone": 5,
  "riasec": {
   "R": 43,
   "I": 54,
   "A": 35,
   "S": 85,
   "E": 14,
   "C": 35
  },
  "personality": {
   "O": 69,
   "C": 73,
   "E": 58,
   "A": 81
  },
  "cognitive": {
   "math": 35,
   "verbal": 46,
   "techSpatial": 24,
   "abstract": 47
  },
  "subjects": [
   "social",
   "biology"
  ]
 },
 {
  "code": "29-1122.01",
  "slug": "low-vision-therapists-orientation-and-mobility-specialists-and-vision-rehabilitation-therapists",
  "nameEn": "Low Vision Therapists, Orientation and Mobility Specialists, and Vision Rehabilitation Therapists",
  "nameMn": "Хараа алдагдсан хүний нөхөн сэргээх эмчилгээч",
  "descriptionMn": "Хараа муутай өвчтөнд өдөр тутмын амьдралын үйл ажиллагаагаа сайжруулахад чиглэсэн эмчилгээ үзүүлнэ.",
  "categorySlug": "health",
  "jobZone": 5,
  "riasec": {
   "R": 49,
   "I": 48,
   "A": 37,
   "S": 92,
   "E": 19,
   "C": 31
  },
  "personality": {
   "O": 62,
   "C": 66,
   "E": 56,
   "A": 80
  },
  "cognitive": {
   "math": 35,
   "verbal": 46,
   "techSpatial": 36,
   "abstract": 42
  },
  "subjects": [
   "social",
   "informatics"
  ]
 },
 {
  "code": "29-1123.00",
  "slug": "physical-therapists",
  "nameEn": "Physical Therapists",
  "nameMn": "Биеийн тамирын (физик) эмчилгээч",
  "descriptionMn": "Хөдөлгөөнийг сайжруулах, өвдөлтийг намдаах, хүчийг нэмэгдүүлэх, өвчин, гэмтлээс үүдсэн бэрхшээлийг засахад чиглэсэн нөхөн сэргээх хөтөлбөрийг төлөвлөж, оролцоно.",
  "categorySlug": "health",
  "jobZone": 5,
  "riasec": {
   "R": 56,
   "I": 65,
   "A": 19,
   "S": 82,
   "E": 25,
   "C": 35
  },
  "personality": {
   "O": 65,
   "C": 75,
   "E": 63,
   "A": 79
  },
  "cognitive": {
   "math": 43,
   "verbal": 51,
   "techSpatial": 27,
   "abstract": 51
  },
  "subjects": [
   "social",
   "biology"
  ]
 },
 {
  "code": "29-1124.00",
  "slug": "radiation-therapists",
  "nameEn": "Radiation Therapists",
  "nameMn": "Цацрагийн эмчилгээч",
  "descriptionMn": "Цацрагийн онкологийн эмчийн заасны дагуу, тогтоосон практик, стандартад нийцүүлэн өвчтөнд цацрагийн эмчилгээ хийнэ.",
  "categorySlug": "health",
  "jobZone": 3,
  "riasec": {
   "R": 66,
   "I": 61,
   "A": 4,
   "S": 63,
   "E": 12,
   "C": 58
  },
  "personality": {
   "O": 24,
   "C": 60,
   "E": 47,
   "A": 82
  },
  "cognitive": {
   "math": 47,
   "verbal": 40,
   "techSpatial": 53,
   "abstract": 38
  },
  "subjects": [
   "social",
   "informatics",
   "biology"
  ]
 },
 {
  "code": "29-1125.00",
  "slug": "recreational-therapists",
  "nameEn": "Recreational Therapists",
  "nameMn": "Амралт чөлөөт цагийн эмчилгээч",
  "descriptionMn": "Эмнэлэг, асрамжийн газар зэрэг байгууллагын өвчтөнд зориулсан эмнэлгийн зөвшөөрөлтэй амралт, чөлөөт цагийн хөтөлбөрийг төлөвлөж, удирдан зохицуулна.",
  "categorySlug": "health",
  "jobZone": 4,
  "riasec": {
   "R": 45,
   "I": 55,
   "A": 31,
   "S": 97,
   "E": 25,
   "C": 28
  },
  "personality": {
   "O": 59,
   "C": 40,
   "E": 68,
   "A": 83
  },
  "cognitive": {
   "math": 29,
   "verbal": 46,
   "techSpatial": 35,
   "abstract": 41
  },
  "subjects": [
   "social"
  ]
 },
 {
  "code": "29-1126.00",
  "slug": "respiratory-therapists",
  "nameEn": "Respiratory Therapists",
  "nameMn": "Амьсгалын эмчилгээч",
  "descriptionMn": "Амьсгалын эмгэгтэй өвчтөнийг үнэлж, эмчилж, асарна.",
  "categorySlug": "health",
  "jobZone": 3,
  "riasec": {
   "R": 67,
   "I": 62,
   "A": 0,
   "S": 65,
   "E": 11,
   "C": 49
  },
  "personality": {
   "O": 58,
   "C": 85,
   "E": 62,
   "A": 71
  },
  "cognitive": {
   "math": 49,
   "verbal": 47,
   "techSpatial": 60,
   "abstract": 51
  },
  "subjects": [
   "biology",
   "social",
   "chemistry"
  ]
 },
 {
  "code": "29-1127.00",
  "slug": "speech-language-pathologists",
  "nameEn": "Speech-Language Pathologists",
  "nameMn": "Хэл ярианы эмч (логопед)",
  "descriptionMn": "Яриа, хэл, дуу хоолой, ярианы жигд байдлын эмгэгтэй хүмүүсийг үнэлж эмчилнэ.",
  "categorySlug": "health",
  "jobZone": 5,
  "riasec": {
   "R": 27,
   "I": 76,
   "A": 33,
   "S": 85,
   "E": 7,
   "C": 51
  },
  "personality": {
   "O": 68,
   "C": 74,
   "E": 60,
   "A": 80
  },
  "cognitive": {
   "math": 42,
   "verbal": 69,
   "techSpatial": 22,
   "abstract": 59
  },
  "subjects": [
   "social",
   "informatics"
  ]
 },
 {
  "code": "29-1128.00",
  "slug": "exercise-physiologists",
  "nameEn": "Exercise Physiologists",
  "nameMn": "Дасгалын физиологич",
  "descriptionMn": "Зүрх, уушгийн үйл ажиллагаа, биеийн бүтэц, булчингийн хүч, тэсвэр, уян хатан байдлыг сайжруулах биеийн тамир, дасгалын хөтөлбөрийг үнэлж, төлөвлөж, хэрэгжүүлнэ.",
  "categorySlug": "health",
  "jobZone": 4,
  "riasec": {
   "R": 71,
   "I": 65,
   "A": 8,
   "S": 62,
   "E": 33,
   "C": 46
  },
  "personality": {
   "O": 62,
   "C": 61,
   "E": 63,
   "A": 61
  },
  "cognitive": {
   "math": 47,
   "verbal": 63,
   "techSpatial": 33,
   "abstract": 55
  },
  "subjects": [
   "social",
   "biology",
   "math"
  ]
 },
 {
  "code": "29-1129.01",
  "slug": "art-therapists",
  "nameEn": "Art Therapists",
  "nameMn": "Урлагаар эмчлэгч (арт терапевт)",
  "descriptionMn": "Үйлчлүүлэгчийн бие махбод, танин мэдэхүй, сэтгэл хөдлөлийн эрүүл мэндийг сайжруулах урлагаар эмчлэх хичээл, хөтөлбөрийг төлөвлөж явуулна.",
  "categorySlug": "health",
  "jobZone": 5,
  "riasec": {
   "R": 33,
   "I": 45,
   "A": 75,
   "S": 77,
   "E": 22,
   "C": 31
  },
  "personality": {
   "O": 81,
   "C": 47,
   "E": 61,
   "A": 84
  },
  "cognitive": {
   "math": 28,
   "verbal": 49,
   "techSpatial": 21,
   "abstract": 42
  },
  "subjects": [
   "social",
   "art"
  ]
 },
 {
  "code": "29-1129.02",
  "slug": "music-therapists",
  "nameEn": "Music Therapists",
  "nameMn": "Хөгжмөөр эмчлэгч (хөгжмийн терапевт)",
  "descriptionMn": "Хүний бие махбод, сэтгэл зүй, танин мэдэхүй, зан үйлд эерэг нөлөө үзүүлэх нотолгоонд суурилсан хөгжмийн эмчилгээг төлөвлөж, зохион байгуулж, үнэлнэ.",
  "categorySlug": "health",
  "jobZone": 4,
  "riasec": {
   "R": 23,
   "I": 53,
   "A": 63,
   "S": 71,
   "E": 25,
   "C": 36
  },
  "personality": {
   "O": 78,
   "C": 53,
   "E": 63,
   "A": 85
  },
  "cognitive": {
   "math": 29,
   "verbal": 46,
   "techSpatial": 22,
   "abstract": 44
  },
  "subjects": [
   "social",
   "art",
   "informatics"
  ]
 },
 {
  "code": "29-1131.00",
  "slug": "veterinarians",
  "nameEn": "Veterinarians",
  "nameMn": "Малын эмч",
  "descriptionMn": "Амьтны өвчин, гэмтлийг оношилж, эмчилж, судална.",
  "categorySlug": "health",
  "jobZone": 5,
  "riasec": {
   "R": 83,
   "I": 83,
   "A": 0,
   "S": 41,
   "E": 12,
   "C": 41
  },
  "personality": {
   "O": 73,
   "C": 81,
   "E": 64,
   "A": 65
  },
  "cognitive": {
   "math": 50,
   "verbal": 53,
   "techSpatial": 35,
   "abstract": 61
  },
  "subjects": [
   "biology",
   "math",
   "chemistry"
  ]
 },
 {
  "code": "29-1141.00",
  "slug": "registered-nurses",
  "nameEn": "Registered Nurses",
  "nameMn": "Сувилагч (бүртгэлтэй)",
  "descriptionMn": "Өвчтөний эрүүл мэндийн асуудал, хэрэгцээг үнэлж, сувилгааны төлөвлөгөө боловсруулж хэрэгжүүлж, эмнэлгийн бүртгэл хөтөлнө.",
  "categorySlug": "health",
  "jobZone": 4,
  "riasec": {
   "R": 41,
   "I": 62,
   "A": 6,
   "S": 76,
   "E": 23,
   "C": 63
  },
  "personality": {
   "O": 60,
   "C": 77,
   "E": 65,
   "A": 74
  },
  "cognitive": {
   "math": 48,
   "verbal": 58,
   "techSpatial": 23,
   "abstract": 63
  },
  "subjects": [
   "social",
   "biology"
  ]
 },
 {
  "code": "29-1141.01",
  "slug": "acute-care-nurses",
  "nameEn": "Acute Care Nurses",
  "nameMn": "Яаралтай тусламжийн сувилагч",
  "descriptionMn": "Зүрхний шигдээс, амьсгалын дутагдал, шок зэрэг цочмог хүндрэлтэй өвчтөнд өндөр түвшний сувилгаа үзүүлнэ.",
  "categorySlug": "health",
  "jobZone": 4,
  "riasec": {
   "R": 45,
   "I": 78,
   "A": 13,
   "S": 80,
   "E": 13,
   "C": 39
  },
  "personality": {
   "O": 67,
   "C": 97,
   "E": 68,
   "A": 71
  },
  "cognitive": {
   "math": 43,
   "verbal": 54,
   "techSpatial": 26,
   "abstract": 52
  },
  "subjects": [
   "biology",
   "social"
  ]
 },
 {
  "code": "29-1141.02",
  "slug": "advanced-practice-psychiatric-nurses",
  "nameEn": "Advanced Practice Psychiatric Nurses",
  "nameMn": "Сэтгэц судлалын өндөр мэргэшилтэй сувилагч",
  "descriptionMn": "Сэтгэцийн эрүүл мэнд, донтолтын эмгэгтэй эсвэл тийм эмгэгийн эрсдэлтэй хүн, гэр бүлийг үнэлж, оношилж, эмчилнэ.",
  "categorySlug": "health",
  "jobZone": 5,
  "riasec": {
   "R": 26,
   "I": 82,
   "A": 30,
   "S": 85,
   "E": 17,
   "C": 39
  },
  "personality": {
   "O": 74,
   "C": 88,
   "E": 74,
   "A": 81
  },
  "cognitive": {
   "math": 43,
   "verbal": 55,
   "techSpatial": 20,
   "abstract": 52
  },
  "subjects": [
   "social",
   "biology",
   "informatics"
  ]
 },
 {
  "code": "29-1141.03",
  "slug": "critical-care-nurses",
  "nameEn": "Critical Care Nurses",
  "nameMn": "Эрчимт эмчилгээний сувилагч",
  "descriptionMn": "Эрчимт эмчилгээ болон зүрхний эрчимт эмчилгээний тасгийн өвчтөнд тусгай сувилгаа үзүүлнэ.",
  "categorySlug": "health",
  "jobZone": 4,
  "riasec": {
   "R": 49,
   "I": 67,
   "A": 12,
   "S": 76,
   "E": 20,
   "C": 54
  },
  "personality": {
   "O": 65,
   "C": 96,
   "E": 65,
   "A": 74
  },
  "cognitive": {
   "math": 47,
   "verbal": 49,
   "techSpatial": 36,
   "abstract": 55
  },
  "subjects": [
   "social",
   "biology",
   "math"
  ]
 },
 {
  "code": "29-1141.04",
  "slug": "clinical-nurse-specialists",
  "nameEn": "Clinical Nurse Specialists",
  "nameMn": "Эмнэлзүйн мэргэшсэн сувилагч",
  "descriptionMn": "Эмнэлэг, асрамж, клиник, гэр зэрэг эмнэлзүйн орчинд өвчтөний асаргааг үзүүлэх сувилагч нарыг удирдана.",
  "categorySlug": "health",
  "jobZone": 5,
  "riasec": {
   "R": 22,
   "I": 64,
   "A": 14,
   "S": 87,
   "E": 45,
   "C": 51
  },
  "personality": {
   "O": 72,
   "C": 92,
   "E": 84,
   "A": 76
  },
  "cognitive": {
   "math": 48,
   "verbal": 58,
   "techSpatial": 30,
   "abstract": 59
  },
  "subjects": [
   "social",
   "biology",
   "math"
  ]
 },
 {
  "code": "29-1151.00",
  "slug": "nurse-anesthetists",
  "nameEn": "Nurse Anesthetists",
  "nameMn": "Мэдээгүйжүүлгийн сувилагч",
  "descriptionMn": "Мэдээ алдуулах эм хэрэглэж, өвчтөний амин үзүүлэлтийг хянаж, мэдээгүйжүүлгээс гарах үйл явцыг хариуцна.",
  "categorySlug": "health",
  "jobZone": 5,
  "riasec": {
   "R": 63,
   "I": 68,
   "A": 0,
   "S": 73,
   "E": 16,
   "C": 53
  },
  "personality": {
   "O": 64,
   "C": 95,
   "E": 61,
   "A": 70
  },
  "cognitive": {
   "math": 50,
   "verbal": 58,
   "techSpatial": 47,
   "abstract": 55
  },
  "subjects": [
   "biology",
   "social",
   "chemistry"
  ]
 },
 {
  "code": "29-1161.00",
  "slug": "nurse-midwives",
  "nameEn": "Nurse Midwives",
  "nameMn": "Эх баригч сувилагч",
  "descriptionMn": "Төрөх үйл явцын бүх талыг бие даан эсвэл эрүүл мэндийн багийн бүрэлдэхүүнд оношилж, зохицуулна.",
  "categorySlug": "health",
  "jobZone": 5,
  "riasec": {
   "R": 37,
   "I": 54,
   "A": 16,
   "S": 83,
   "E": 33,
   "C": 40
  },
  "personality": {
   "O": 66,
   "C": 91,
   "E": 73,
   "A": 82
  },
  "cognitive": {
   "math": 45,
   "verbal": 59,
   "techSpatial": 25,
   "abstract": 60
  },
  "subjects": [
   "biology",
   "social",
   "chemistry"
  ]
 },
 {
  "code": "29-1171.00",
  "slug": "nurse-practitioners",
  "nameEn": "Nurse Practitioners",
  "nameMn": "Тусгай мэргэшсэн сувилагч (нэр практик)",
  "descriptionMn": "Цочмог, давтан эсвэл архаг өвчнийг бие даан эсвэл эрүүл мэндийн багийн бүрэлдэхүүнд оношилж эмчилнэ.",
  "categorySlug": "health",
  "jobZone": 5,
  "riasec": {
   "R": 43,
   "I": 76,
   "A": 6,
   "S": 75,
   "E": 18,
   "C": 51
  },
  "personality": {
   "O": 69,
   "C": 94,
   "E": 71,
   "A": 75
  },
  "cognitive": {
   "math": 49,
   "verbal": 63,
   "techSpatial": 28,
   "abstract": 67
  },
  "subjects": [
   "social",
   "biology",
   "math"
  ]
 },
 {
  "code": "29-1181.00",
  "slug": "audiologists",
  "nameEn": "Audiologists",
  "nameMn": "Сонсгол судлаач (аудиолог)",
  "descriptionMn": "Сонсголын болон холбогдох эмгэгтэй хүмүүсийг үнэлж, эмчилнэ.",
  "categorySlug": "health",
  "jobZone": 5,
  "riasec": {
   "R": 50,
   "I": 82,
   "A": 20,
   "S": 82,
   "E": 14,
   "C": 50
  },
  "personality": {
   "O": 65,
   "C": 71,
   "E": 58,
   "A": 71
  },
  "cognitive": {
   "math": 46,
   "verbal": 67,
   "techSpatial": 44,
   "abstract": 64
  },
  "subjects": [
   "social",
   "biology",
   "informatics"
  ]
 },
 {
  "code": "29-1211.00",
  "slug": "anesthesiologists",
  "nameEn": "Anesthesiologists",
  "nameMn": "Мэдээгүйжүүлэгч эмч",
  "descriptionMn": "Мэс заслын өмнө, үед, дараа өвдөлт намдаах мэдээ алдуулах болон өвдөлт намдаах эм хэрэглэнэ.",
  "categorySlug": "health",
  "jobZone": 5,
  "riasec": {
   "R": 70,
   "I": 79,
   "A": 3,
   "S": 71,
   "E": 25,
   "C": 45
  },
  "personality": {
   "O": 72,
   "C": 95,
   "E": 62,
   "A": 56
  },
  "cognitive": {
   "math": 50,
   "verbal": 68,
   "techSpatial": 57,
   "abstract": 68
  },
  "subjects": [
   "biology",
   "social",
   "chemistry"
  ]
 },
 {
  "code": "29-1213.00",
  "slug": "dermatologists",
  "nameEn": "Dermatologists",
  "nameMn": "Арьсны эмч",
  "descriptionMn": "Арьс, үс, хумсны өвчнийг оношилж эмчилнэ.",
  "categorySlug": "health",
  "jobZone": 5,
  "riasec": {
   "R": 63,
   "I": 91,
   "A": 15,
   "S": 61,
   "E": 13,
   "C": 47
  },
  "personality": {
   "O": 70,
   "C": 81,
   "E": 55,
   "A": 59
  },
  "cognitive": {
   "math": 46,
   "verbal": 60,
   "techSpatial": 27,
   "abstract": 78
  },
  "subjects": [
   "biology",
   "social",
   "informatics"
  ]
 },
 {
  "code": "29-1214.00",
  "slug": "emergency-medicine-physicians",
  "nameEn": "Emergency Medicine Physicians",
  "nameMn": "Яаралтай тусламжийн эмч",
  "descriptionMn": "Яаралтай эмнэлгийн шийдвэр гаргаж, нас баралт болон хөгжлийн бэрхшээлээс сэргийлж арга хэмжээ авна.",
  "categorySlug": "health",
  "jobZone": 5,
  "riasec": {
   "R": 53,
   "I": 77,
   "A": 0,
   "S": 77,
   "E": 28,
   "C": 54
  },
  "personality": {
   "O": 69,
   "C": 100,
   "E": 81,
   "A": 50
  },
  "cognitive": {
   "math": 48,
   "verbal": 75,
   "techSpatial": 42,
   "abstract": 80
  },
  "subjects": [
   "biology",
   "social",
   "chemistry"
  ]
 },
 {
  "code": "29-1215.00",
  "slug": "family-medicine-physicians",
  "nameEn": "Family Medicine Physicians",
  "nameMn": "Гэр бүлийн эмч",
  "descriptionMn": "Хувь хүн, гэр бүлд насан туршид оношилгоо, эмчилгээ, урьдчилан сэргийлэх тусламж үзүүлнэ.",
  "categorySlug": "health",
  "jobZone": 5,
  "riasec": {
   "R": 46,
   "I": 85,
   "A": 8,
   "S": 87,
   "E": 22,
   "C": 49
  },
  "personality": {
   "O": 71,
   "C": 92,
   "E": 76,
   "A": 78
  },
  "cognitive": {
   "math": 43,
   "verbal": 74,
   "techSpatial": 14,
   "abstract": 65
  },
  "subjects": [
   "biology",
   "social"
  ]
 },
 {
  "code": "29-1216.00",
  "slug": "general-internal-medicine-physicians",
  "nameEn": "General Internal Medicine Physicians",
  "nameMn": "Дотрын ерөнхий эмч",
  "descriptionMn": "Дотор эрхтний тогтолцооны олон төрлийн өвчин, гэмтлийг оношилж, мэс заслын бус эмчилгээ хийнэ.",
  "categorySlug": "health",
  "jobZone": 5,
  "riasec": {
   "R": 57,
   "I": 97,
   "A": 7,
   "S": 85,
   "E": 18,
   "C": 44
  },
  "personality": {
   "O": 78,
   "C": 95,
   "E": 70,
   "A": 73
  },
  "cognitive": {
   "math": 48,
   "verbal": 72,
   "techSpatial": 32,
   "abstract": 81
  },
  "subjects": [
   "biology",
   "social",
   "informatics"
  ]
 },
 {
  "code": "29-1217.00",
  "slug": "neurologists",
  "nameEn": "Neurologists",
  "nameMn": "Мэдрэлийн эмч",
  "descriptionMn": "Тархи, нугас, захын мэдрэлийн өвчин, эмгэгийг голдуу мэс заслын бус аргаар оношилж, хянаж, эмчилнэ.",
  "categorySlug": "health",
  "jobZone": 5,
  "riasec": {
   "R": 52,
   "I": 100,
   "A": 18,
   "S": 67,
   "E": 23,
   "C": 45
  },
  "personality": {
   "O": 81,
   "C": 89,
   "E": 60,
   "A": 66
  },
  "cognitive": {
   "math": 58,
   "verbal": 78,
   "techSpatial": 35,
   "abstract": 88
  },
  "subjects": [
   "biology",
   "social",
   "informatics"
  ]
 },
 {
  "code": "29-1218.00",
  "slug": "obstetricians-and-gynecologists",
  "nameEn": "Obstetricians and Gynecologists",
  "nameMn": "Эх барих, эмэгтэйчүүдийн эмч",
  "descriptionMn": "Жирэмслэлт, төрөлттэй холбоотой тусламж үзүүлж, эмэгтэйчүүдийн, ялангуяа үржлийн тогтолцооны өвчнийг оношилж, эмчилж, урьдчилан сэргийлнэ.",
  "categorySlug": "health",
  "jobZone": 5,
  "riasec": {
   "R": 60,
   "I": 75,
   "A": 8,
   "S": 74,
   "E": 29,
   "C": 45
  },
  "personality": {
   "O": 72,
   "C": 98,
   "E": 75,
   "A": 74
  },
  "cognitive": {
   "math": 46,
   "verbal": 71,
   "techSpatial": 34,
   "abstract": 78
  },
  "subjects": [
   "biology",
   "social",
   "chemistry"
  ]
 },
 {
  "code": "29-1221.00",
  "slug": "pediatricians-general",
  "nameEn": "Pediatricians, General",
  "nameMn": "Хүүхдийн эмч",
  "descriptionMn": "Хүүхдийн өвчин, гэмтлийг оношилж, эмчилж, урьдчилан сэргийлэхэд тусална.",
  "categorySlug": "health",
  "jobZone": 5,
  "riasec": {
   "R": 44,
   "I": 86,
   "A": 15,
   "S": 94,
   "E": 26,
   "C": 43
  },
  "personality": {
   "O": 70,
   "C": 90,
   "E": 69,
   "A": 78
  },
  "cognitive": {
   "math": 46,
   "verbal": 74,
   "techSpatial": 25,
   "abstract": 64
  },
  "subjects": [
   "biology",
   "social",
   "informatics"
  ]
 },
 {
  "code": "29-1222.00",
  "slug": "physicians-pathologists",
  "nameEn": "Physicians, Pathologists",
  "nameMn": "Эмгэг судлаач эмч",
  "descriptionMn": "Эрхтэн, биеийн эд, шингэнийг ашиглан өвчнийг оношилж, лабораторийн шинжилгээ хийнэ.",
  "categorySlug": "health",
  "jobZone": 5,
  "riasec": {
   "R": 64,
   "I": 100,
   "A": 6,
   "S": 43,
   "E": 13,
   "C": 62
  },
  "personality": {
   "O": 83,
   "C": 90,
   "E": 42,
   "A": 39
  },
  "cognitive": {
   "math": 49,
   "verbal": 80,
   "techSpatial": 29,
   "abstract": 90
  },
  "subjects": [
   "biology",
   "chemistry",
   "informatics"
  ]
 },
 {
  "code": "29-1223.00",
  "slug": "psychiatrists",
  "nameEn": "Psychiatrists",
  "nameMn": "Сэтгэцийн эмч",
  "descriptionMn": "Сэтгэцийн эмгэгийг оношилж, эмчилж, урьдчилан сэргийлнэ.",
  "categorySlug": "health",
  "jobZone": 5,
  "riasec": {
   "R": 22,
   "I": 93,
   "A": 27,
   "S": 81,
   "E": 16,
   "C": 43
  },
  "personality": {
   "O": 78,
   "C": 81,
   "E": 66,
   "A": 82
  },
  "cognitive": {
   "math": 43,
   "verbal": 74,
   "techSpatial": 15,
   "abstract": 77
  },
  "subjects": [
   "social",
   "biology",
   "chemistry"
  ]
 },
 {
  "code": "29-1224.00",
  "slug": "radiologists",
  "nameEn": "Radiologists",
  "nameMn": "Рентген, дүрс оношилгооны эмч",
  "descriptionMn": "Рентген, соронзон резонанс (MRI), цөмийн анагаах ухаан, хэт авианы зэрэг оношилгооны дүрсээр өвчин, гэмтлийг оношилж эмчилнэ.",
  "categorySlug": "health",
  "jobZone": 5,
  "riasec": {
   "R": 65,
   "I": 94,
   "A": 6,
   "S": 48,
   "E": 19,
   "C": 58
  },
  "personality": {
   "O": 72,
   "C": 83,
   "E": 47,
   "A": 50
  },
  "cognitive": {
   "math": 50,
   "verbal": 73,
   "techSpatial": 37,
   "abstract": 74
  },
  "subjects": [
   "biology",
   "informatics",
   "physics"
  ]
 },
 {
  "code": "29-1241.00",
  "slug": "ophthalmologists-except-pediatric",
  "nameEn": "Ophthalmologists, Except Pediatric",
  "nameMn": "Нүдний эмч (хүүхдийнхээс бусад)",
  "descriptionMn": "Нүдний эмгэг, өвчнийг оношилж, мэс засал хийж, урьдчилан сэргийлнэ.",
  "categorySlug": "health",
  "jobZone": 5,
  "riasec": {
   "R": 57,
   "I": 87,
   "A": 12,
   "S": 74,
   "E": 33,
   "C": 45
  },
  "personality": {
   "O": 68,
   "C": 94,
   "E": 58,
   "A": 59
  },
  "cognitive": {
   "math": 50,
   "verbal": 72,
   "techSpatial": 43,
   "abstract": 78
  },
  "subjects": [
   "biology",
   "math",
   "informatics"
  ]
 },
 {
  "code": "29-1291.00",
  "slug": "acupuncturists",
  "nameEn": "Acupuncturists",
  "nameMn": "Зүү төвөргөөчин",
  "descriptionMn": "Биеийн тодорхой цэгүүдийг зүүгээр өдөөж эмгэгийг оношилж, эмчилж, урьдчилан сэргийлнэ.",
  "categorySlug": "health",
  "jobZone": 5,
  "riasec": {
   "R": 63,
   "I": 75,
   "A": 18,
   "S": 78,
   "E": 10,
   "C": 34
  },
  "personality": {
   "O": 62,
   "C": 55,
   "E": 47,
   "A": 69
  },
  "cognitive": {
   "math": 29,
   "verbal": 42,
   "techSpatial": 22,
   "abstract": 41
  },
  "subjects": [
   "social",
   "biology",
   "economics"
  ]
 },
 {
  "code": "29-1292.00",
  "slug": "dental-hygienists",
  "nameEn": "Dental Hygienists",
  "nameMn": "Шүдний эрүүл ахуйн мэргэжилтэн",
  "descriptionMn": "Өвчтөнд амны хөндийн эрүүл ахуйн арчилгаа хийж, өвчтөний амны хөндийн асуудал, хэрэгцээг үнэлж, эрүүл мэндийн бүртгэл хөтөлнө.",
  "categorySlug": "health",
  "jobZone": 3,
  "riasec": {
   "R": 71,
   "I": 59,
   "A": 2,
   "S": 73,
   "E": 12,
   "C": 55
  },
  "personality": {
   "O": 33,
   "C": 57,
   "E": 48,
   "A": 69
  },
  "cognitive": {
   "math": 27,
   "verbal": 38,
   "techSpatial": 23,
   "abstract": 23
  },
  "subjects": [
   "biology",
   "social"
  ]
 },
 {
  "code": "29-1299.01",
  "slug": "naturopathic-physicians",
  "nameEn": "Naturopathic Physicians",
  "nameMn": "Байгалийн эмчилгээний эмч",
  "descriptionMn": "Хүний байгалийн эдгэрэх чадварт тулгуурласан тогтолцоогоор өвчнийг оношилж, эмчилж, урьдчилан сэргийлнэ.",
  "categorySlug": "health",
  "jobZone": 5,
  "riasec": {
   "R": 59,
   "I": 82,
   "A": 14,
   "S": 79,
   "E": 16,
   "C": 38
  },
  "personality": {
   "O": 80,
   "C": 69,
   "E": 64,
   "A": 70
  },
  "cognitive": {
   "math": 46,
   "verbal": 69,
   "techSpatial": 30,
   "abstract": 78
  },
  "subjects": [
   "social",
   "biology",
   "chemistry"
  ]
 },
 {
  "code": "29-2011.00",
  "slug": "medical-and-clinical-laboratory-technologists",
  "nameEn": "Medical and Clinical Laboratory Technologists",
  "nameMn": "Эмнэлгийн лабораторийн технологич",
  "descriptionMn": "Өвчнийг оношлох, эмчлэх, урьдчилан сэргийлэхэд зориулсан нарийн төвөгтэй эмнэлгийн лабораторийн шинжилгээ хийнэ.",
  "categorySlug": "health",
  "jobZone": 4,
  "riasec": {
   "R": 80,
   "I": 86,
   "A": 2,
   "S": 30,
   "E": 9,
   "C": 67
  },
  "personality": {
   "O": 53,
   "C": 78,
   "E": 37,
   "A": 35
  },
  "cognitive": {
   "math": 47,
   "verbal": 51,
   "techSpatial": 56,
   "abstract": 62
  },
  "subjects": [
   "chemistry",
   "biology",
   "math"
  ]
 },
 {
  "code": "29-2011.02",
  "slug": "cytotechnologists",
  "nameEn": "Cytotechnologists",
  "nameMn": "Эсийн шинжилгээний технологич (цитотехнологич)",
  "descriptionMn": "Тогтоосон стандарт, практикийн дагуу хорт хавдар, дааврын хазайлт болон бусад эмгэгийн шинж тэмдгийг илрүүлэхийн тулд эсийг будаж, бэхэлж, судална.",
  "categorySlug": "health",
  "jobZone": 5,
  "riasec": {
   "R": 82,
   "I": 84,
   "A": 2,
   "S": 24,
   "E": 14,
   "C": 65
  },
  "personality": {
   "O": 37,
   "C": 77,
   "E": 18,
   "A": 29
  },
  "cognitive": {
   "math": 40,
   "verbal": 43,
   "techSpatial": 26,
   "abstract": 48
  },
  "subjects": [
   "biology"
  ]
 },
 {
  "code": "29-2012.00",
  "slug": "medical-and-clinical-laboratory-technicians",
  "nameEn": "Medical and Clinical Laboratory Technicians",
  "nameMn": "Эмнэлгийн лабораторийн техникч",
  "descriptionMn": "Өвчнийг оношлох, эмчлэх, урьдчилан сэргийлэхэд зориулсан энгийн эмнэлгийн лабораторийн шинжилгээ хийнэ.",
  "categorySlug": "health",
  "jobZone": 3,
  "riasec": {
   "R": 84,
   "I": 82,
   "A": 0,
   "S": 31,
   "E": 0,
   "C": 64
  },
  "personality": {
   "O": 24,
   "C": 69,
   "E": 23,
   "A": 36
  },
  "cognitive": {
   "math": 46,
   "verbal": 31,
   "techSpatial": 41,
   "abstract": 29
  },
  "subjects": [
   "chemistry",
   "informatics",
   "biology"
  ]
 },
 {
  "code": "29-2031.00",
  "slug": "cardiovascular-technologists-and-technicians",
  "nameEn": "Cardiovascular Technologists and Technicians",
  "nameMn": "Зүрх судасны технологич, техникч",
  "descriptionMn": "Оношилгоо, эмчилгээ, судалгааны зорилгоор өвчтөний уушиг эсвэл зүрх судасны тогтолцооны шинжилгээ хийнэ.",
  "categorySlug": "health",
  "jobZone": 3,
  "riasec": {
   "R": 77,
   "I": 72,
   "A": 0,
   "S": 54,
   "E": 5,
   "C": 62
  },
  "personality": {
   "O": 32,
   "C": 61,
   "E": 41,
   "A": 64
  },
  "cognitive": {
   "math": 43,
   "verbal": 38,
   "techSpatial": 31,
   "abstract": 42
  },
  "subjects": [
   "biology",
   "informatics",
   "social"
  ]
 },
 {
  "code": "29-2032.00",
  "slug": "diagnostic-medical-sonographers",
  "nameEn": "Diagnostic Medical Sonographers",
  "nameMn": "Хэт авианы оношилгооны техникч",
  "descriptionMn": "Эмч нарт зориулж дотор эрхтний хэт авианы бичлэг хийнэ.",
  "categorySlug": "health",
  "jobZone": 3,
  "riasec": {
   "R": 81,
   "I": 63,
   "A": 5,
   "S": 52,
   "E": 9,
   "C": 68
  },
  "personality": {
   "O": 49,
   "C": 64,
   "E": 41,
   "A": 61
  },
  "cognitive": {
   "math": 31,
   "verbal": 45,
   "techSpatial": 31,
   "abstract": 36
  },
  "subjects": [
   "physics",
   "biology",
   "informatics"
  ]
 },
 {
  "code": "29-2033.00",
  "slug": "nuclear-medicine-technologists",
  "nameEn": "Nuclear Medicine Technologists",
  "nameMn": "Цөмийн анагаах ухааны технологич",
  "descriptionMn": "Тусгай изотопын тоног төхөөрөмжөөр эмчилгээ, оношилгоо, мөрдөлтийн судалгаанд цацраг идэвхт изотоп бэлтгэж, хэрэглэж, хэмжинэ.",
  "categorySlug": "health",
  "jobZone": 3,
  "riasec": {
   "R": 83,
   "I": 76,
   "A": 0,
   "S": 35,
   "E": 5,
   "C": 70
  },
  "personality": {
   "O": 46,
   "C": 74,
   "E": 38,
   "A": 60
  },
  "cognitive": {
   "math": 48,
   "verbal": 41,
   "techSpatial": 35,
   "abstract": 35
  },
  "subjects": [
   "biology",
   "chemistry",
   "informatics"
  ]
 },
 {
  "code": "29-2034.00",
  "slug": "radiologic-technologists-and-technicians",
  "nameEn": "Radiologic Technologists and Technicians",
  "nameMn": "Рентген, дүрс оношилгооны техникч",
  "descriptionMn": "Рентген болон КТ зураг авч, оношилгоо, судалгааны зорилгоор өвчтөний судсанд цацраг идэвхгүй бодис оруулна.",
  "categorySlug": "health",
  "jobZone": 3,
  "riasec": {
   "R": 82,
   "I": 65,
   "A": 0,
   "S": 40,
   "E": 0,
   "C": 68
  },
  "personality": {
   "O": 38,
   "C": 55,
   "E": 39,
   "A": 63
  },
  "cognitive": {
   "math": 31,
   "verbal": 40,
   "techSpatial": 60,
   "abstract": 31
  },
  "subjects": [
   "biology",
   "informatics",
   "math"
  ]
 },
 {
  "code": "29-2035.00",
  "slug": "magnetic-resonance-imaging-technologists",
  "nameEn": "Magnetic Resonance Imaging Technologists",
  "nameMn": "Соронзон резонанс (MRI) оношилгооны техникч",
  "descriptionMn": "Соронзон резонансын дүрслэлийн (MRI) аппаратыг ажиллуулж, өвчтөний аюулгүй байдал, тав тухыг хянаж, зургийн чанарыг шалгана.",
  "categorySlug": "health",
  "jobZone": 3,
  "riasec": {
   "R": 74,
   "I": 63,
   "A": 0,
   "S": 42,
   "E": 5,
   "C": 65
  },
  "personality": {
   "O": 40,
   "C": 57,
   "E": 36,
   "A": 64
  },
  "cognitive": {
   "math": 36,
   "verbal": 46,
   "techSpatial": 43,
   "abstract": 29
  },
  "subjects": [
   "informatics",
   "physics",
   "social"
  ]
 },
 {
  "code": "29-2036.00",
  "slug": "medical-dosimetrists",
  "nameEn": "Medical Dosimetrists",
  "nameMn": "Эмнэлгийн цацрагийн тун тооцоологч",
  "descriptionMn": "Цацрагийн эмчилгээний төлөвлөгөө, цацрагийн тун тооцоолол гаргаж, төлөвлөгөөний хэрэгжилтийг удирдаж, цацрагийн онкологийн багтай зөвлөлдөнө.",
  "categorySlug": "health",
  "jobZone": 4,
  "riasec": {
   "R": 60,
   "I": 72,
   "A": 5,
   "S": 43,
   "E": 20,
   "C": 67
  },
  "personality": {
   "O": 67,
   "C": 85,
   "E": 49,
   "A": 52
  },
  "cognitive": {
   "math": 59,
   "verbal": 60,
   "techSpatial": 46,
   "abstract": 61
  },
  "subjects": [
   "informatics",
   "math",
   "physics"
  ]
 },
 {
  "code": "29-2043.00",
  "slug": "paramedics",
  "nameEn": "Paramedics",
  "nameMn": "Түргэн тусламжийн эмнэлгийн ажилтан (парамедик)",
  "descriptionMn": "Үндсэн болон нарийвчилсан яаралтай эмнэлгийн тусламж үзүүлж, гэмтэл, өвчнийг үнэлнэ.",
  "categorySlug": "health",
  "jobZone": 3,
  "riasec": {
   "R": 70,
   "I": 67,
   "A": 0,
   "S": 75,
   "E": 15,
   "C": 40
  },
  "personality": {
   "O": 56,
   "C": 64,
   "E": 58,
   "A": 57
  },
  "cognitive": {
   "math": 30,
   "verbal": 32,
   "techSpatial": 42,
   "abstract": 39
  },
  "subjects": [
   "social",
   "biology",
   "math"
  ]
 },
 {
  "code": "29-2051.00",
  "slug": "dietetic-technicians",
  "nameEn": "Dietetic Technicians",
  "nameMn": "Хоол зүйчийн техникч",
  "descriptionMn": "Хоол зүйчийн хяналтан дор хоолны үйлчилгээ, хоол тэжээлийн хөтөлбөрт тусална.",
  "categorySlug": "health",
  "jobZone": 3,
  "riasec": {
   "R": 47,
   "I": 41,
   "A": 26,
   "S": 68,
   "E": 26,
   "C": 47
  },
  "personality": {
   "O": 44,
   "C": 46,
   "E": 48,
   "A": 64
  },
  "cognitive": {
   "math": 46,
   "verbal": 31,
   "techSpatial": 39,
   "abstract": 33
  },
  "subjects": [
   "informatics",
   "math"
  ]
 },
 {
  "code": "29-2052.00",
  "slug": "pharmacy-technicians",
  "nameEn": "Pharmacy Technicians",
  "nameMn": "Эмийн санчийн техникч",
  "descriptionMn": "Эм зүйчийн удирдлаган дор эм бэлтгэнэ. Жорын дагуу эмийн хэмжээ, тунг хэмжиж, холиж, тоолж, шошголж, бүртгэнэ.",
  "categorySlug": "health",
  "jobZone": 3,
  "riasec": {
   "R": 54,
   "I": 33,
   "A": 0,
   "S": 39,
   "E": 25,
   "C": 100
  },
  "personality": {
   "O": 16,
   "C": 55,
   "E": 25,
   "A": 48
  },
  "cognitive": {
   "math": 46,
   "verbal": 36,
   "techSpatial": 21,
   "abstract": 28
  },
  "subjects": [
   "informatics",
   "math"
  ]
 },
 {
  "code": "29-2053.00",
  "slug": "psychiatric-technicians",
  "nameEn": "Psychiatric Technicians",
  "nameMn": "Сэтгэцийн эмгэгийн техникч",
  "descriptionMn": "Эмч болон бусад эрүүл мэндийн мэргэжилтний зааврын дагуу сэтгэцийн болон сэтгэл хөдлөлийн эмгэг, хөгжлийн бэрхшээлтэй хүмүүсийг асарна.",
  "categorySlug": "health",
  "jobZone": 3,
  "riasec": {
   "R": 38,
   "I": 60,
   "A": 19,
   "S": 99,
   "E": 8,
   "C": 41
  },
  "personality": {
   "O": 46,
   "C": 49,
   "E": 56,
   "A": 82
  },
  "cognitive": {
   "math": 24,
   "verbal": 39,
   "techSpatial": 19,
   "abstract": 38
  },
  "subjects": [
   "social"
  ]
 },
 {
  "code": "29-2055.00",
  "slug": "surgical-technologists",
  "nameEn": "Surgical Technologists",
  "nameMn": "Мэс заслын технологич",
  "descriptionMn": "Мэс засалч, сувилагч болон бусад мэс заслын ажилтны хяналтан дор мэс заслын ажилбарт тусална.",
  "categorySlug": "health",
  "jobZone": 3,
  "riasec": {
   "R": 88,
   "I": 37,
   "A": 0,
   "S": 47,
   "E": 10,
   "C": 64
  },
  "personality": {
   "O": 13,
   "C": 72,
   "E": 23,
   "A": 56
  },
  "cognitive": {
   "math": 34,
   "verbal": 29,
   "techSpatial": 45,
   "abstract": 22
  },
  "subjects": [
   "biology",
   "informatics"
  ]
 },
 {
  "code": "29-2056.00",
  "slug": "veterinary-technologists-and-technicians",
  "nameEn": "Veterinary Technologists and Technicians",
  "nameMn": "Малын эмнэлгийн технологич, техникч",
  "descriptionMn": "Амьтны өвчнийг оношилж эмчлэхэд хэрэглэх эмнэлгийн шинжилгээг лабораторийн орчинд хийнэ.",
  "categorySlug": "health",
  "jobZone": 3,
  "riasec": {
   "R": 95,
   "I": 71,
   "A": 0,
   "S": 34,
   "E": 0,
   "C": 59
  },
  "personality": {
   "O": 51,
   "C": 69,
   "E": 43,
   "A": 61
  },
  "cognitive": {
   "math": 50,
   "verbal": 36,
   "techSpatial": 36,
   "abstract": 47
  },
  "subjects": [
   "biology",
   "chemistry",
   "math"
  ]
 },
 {
  "code": "29-2057.00",
  "slug": "ophthalmic-medical-technicians",
  "nameEn": "Ophthalmic Medical Technicians",
  "nameMn": "Нүдний эмнэлгийн техникч",
  "descriptionMn": "Нүдний эмчид нүдний эмнэлзүйн ажилбар гүйцэтгэж тусална.",
  "categorySlug": "health",
  "jobZone": 3,
  "riasec": {
   "R": 72,
   "I": 63,
   "A": 0,
   "S": 61,
   "E": 13,
   "C": 57
  },
  "personality": {
   "O": 22,
   "C": 36,
   "E": 37,
   "A": 53
  },
  "cognitive": {
   "math": 39,
   "verbal": 36,
   "techSpatial": 23,
   "abstract": 19
  },
  "subjects": [
   "biology"
  ]
 },
 {
  "code": "29-2061.00",
  "slug": "licensed-practical-and-licensed-vocational-nurses",
  "nameEn": "Licensed Practical and Licensed Vocational Nurses",
  "nameMn": "Практик сувилагч (дипломын түвшин)",
  "descriptionMn": "Эмнэлэг, асрамжийн газар, клиник, гэр, бүлгийн орон сууц зэрэг байгууллагад өвчтэй, бэртсэн, эдгэрч буй болон хөгжлийн бэрхшээлтэй хүмүүсийг асарна.",
  "categorySlug": "health",
  "jobZone": 3,
  "riasec": {
   "R": 60,
   "I": 45,
   "A": 1,
   "S": 75,
   "E": 19,
   "C": 60
  },
  "personality": {
   "O": 43,
   "C": 73,
   "E": 58,
   "A": 75
  },
  "cognitive": {
   "math": 41,
   "verbal": 45,
   "techSpatial": 20,
   "abstract": 41
  },
  "subjects": [
   "social",
   "biology"
  ]
 },
 {
  "code": "29-2072.00",
  "slug": "medical-records-specialists",
  "nameEn": "Medical Records Specialists",
  "nameMn": "Эмнэлгийн бүртгэлийн мэргэжилтэн",
  "descriptionMn": "Эрүүл мэндийн тогтолцооны эмнэлгийн, захиргааны, ёс зүйн, хууль эрх зүйн шаардлагад нийцүүлэн эмнэлэг, клиникийн өвчтөний бүртгэлийг цуглуулж, боловсруулж, хадгална.",
  "categorySlug": "health",
  "jobZone": 3,
  "riasec": {
   "R": 31,
   "I": 56,
   "A": 0,
   "S": 40,
   "E": 15,
   "C": 99
  },
  "personality": {
   "O": 21,
   "C": 51,
   "E": 8,
   "A": 35
  },
  "cognitive": {
   "math": 22,
   "verbal": 24,
   "techSpatial": 17,
   "abstract": 19
  },
  "subjects": [
   "informatics"
  ]
 },
 {
  "code": "29-2081.00",
  "slug": "opticians-dispensing",
  "nameEn": "Opticians, Dispensing",
  "nameMn": "Нүдний шил засагч (оптик)",
  "descriptionMn": "Бичигдсэн нүдний шилний жор, үзүүлэлтийн дагуу үйлчлүүлэгчид зориулан шилний линз, хүрээг зохион, хэмжиж, тааруулж, тохируулна.",
  "categorySlug": "health",
  "jobZone": 3,
  "riasec": {
   "R": 56,
   "I": 21,
   "A": 7,
   "S": 34,
   "E": 39,
   "C": 74
  },
  "personality": {
   "O": 29,
   "C": 41,
   "E": 47,
   "A": 57
  },
  "cognitive": {
   "math": 46,
   "verbal": 37,
   "techSpatial": 40,
   "abstract": 20
  },
  "subjects": [
   "math",
   "informatics",
   "social"
  ]
 },
 {
  "code": "29-2091.00",
  "slug": "orthotists-and-prosthetists",
  "nameEn": "Orthotists and Prosthetists",
  "nameMn": "Ортез, протезийн мэргэжилтэн",
  "descriptionMn": "Хөгжлийн бэрхшээлтэй өвчтөнд зориулж ортопедийн тулгуур, хэрэгсэл, мөч, нүүрний протез зэргийг зохион, хэмжиж, тааруулж, тохируулна.",
  "categorySlug": "health",
  "jobZone": 5,
  "riasec": {
   "R": 83,
   "I": 68,
   "A": 17,
   "S": 55,
   "E": 9,
   "C": 43
  },
  "personality": {
   "O": 74,
   "C": 78,
   "E": 58,
   "A": 69
  },
  "cognitive": {
   "math": 43,
   "verbal": 63,
   "techSpatial": 75,
   "abstract": 62
  },
  "subjects": [
   "social",
   "technology",
   "biology"
  ]
 },
 {
  "code": "29-2092.00",
  "slug": "hearing-aid-specialists",
  "nameEn": "Hearing Aid Specialists",
  "nameMn": "Сонсголын аппаратын мэргэжилтэн",
  "descriptionMn": "Үйлчлүүлэгчдэд сонсголын аппарат сонгож тааруулна. Сонсголын шинжилгээ хийж, үр дүнг тайлбарлана.",
  "categorySlug": "health",
  "jobZone": 3,
  "riasec": {
   "R": 48,
   "I": 56,
   "A": 12,
   "S": 59,
   "E": 12,
   "C": 57
  },
  "personality": {
   "O": 58,
   "C": 62,
   "E": 57,
   "A": 72
  },
  "cognitive": {
   "math": 34,
   "verbal": 32,
   "techSpatial": 50,
   "abstract": 22
  },
  "subjects": [
   "informatics",
   "biology",
   "social"
  ]
 },
 {
  "code": "29-2099.01",
  "slug": "neurodiagnostic-technologists",
  "nameEn": "Neurodiagnostic Technologists",
  "nameMn": "Мэдрэлийн оношилгооны технологич",
  "descriptionMn": "Тархины цахилгаан бичлэг, өдөөгдлийн потенциал, нойрны бичлэг зэрэг мэдрэлийн цахилгаан оношилгооны шинжилгээ хийнэ.",
  "categorySlug": "health",
  "jobZone": 3,
  "riasec": {
   "R": 72,
   "I": 80,
   "A": 7,
   "S": 45,
   "E": 7,
   "C": 58
  },
  "personality": {
   "O": 49,
   "C": 65,
   "E": 31,
   "A": 54
  },
  "cognitive": {
   "math": 34,
   "verbal": 44,
   "techSpatial": 38,
   "abstract": 44
  },
  "subjects": [
   "informatics",
   "social",
   "biology"
  ]
 },
 {
  "code": "29-2099.05",
  "slug": "ophthalmic-medical-technologists",
  "nameEn": "Ophthalmic Medical Technologists",
  "nameMn": "Нүдний эмнэлгийн технологич",
  "descriptionMn": "Нүдний эмчид нүдний эмнэлзүйн ажилбар болон нүдний гэрэл зураг авахад тусална.",
  "categorySlug": "health",
  "jobZone": 3,
  "riasec": {
   "R": 74,
   "I": 62,
   "A": 2,
   "S": 55,
   "E": 17,
   "C": 62
  },
  "personality": {
   "O": 45,
   "C": 53,
   "E": 52,
   "A": 57
  },
  "cognitive": {
   "math": 41,
   "verbal": 37,
   "techSpatial": 31,
   "abstract": 31
  },
  "subjects": [
   "biology"
  ]
 },
 {
  "code": "29-2099.08",
  "slug": "patient-representatives",
  "nameEn": "Patient Representatives",
  "nameMn": "Өвчтөний төлөөлөгч",
  "descriptionMn": "Өвчтөнд үйлчилгээ авах, журмыг ойлгох, эрүүл мэндийн шийдвэр гаргахад тусална.",
  "categorySlug": "health",
  "jobZone": 3,
  "riasec": {
   "R": 5,
   "I": 51,
   "A": 10,
   "S": 94,
   "E": 35,
   "C": 47
  },
  "personality": {
   "O": 50,
   "C": 51,
   "E": 62,
   "A": 81
  },
  "cognitive": {
   "math": 32,
   "verbal": 41,
   "techSpatial": 12,
   "abstract": 28
  },
  "subjects": [
   "social",
   "biology",
   "informatics"
  ]
 },
 {
  "code": "29-9091.00",
  "slug": "athletic-trainers",
  "nameEn": "Athletic Trainers",
  "nameMn": "Спортын гэмтлийн засагч (атлетик трейнер)",
  "descriptionMn": "Яс булчингийн гэмтэл, өвчнийг үнэлж эмчилнэ. Урьдчилан сэргийлэх, эмчлэх, яаралтай болон нөхөн сэргээх тусламж үзүүлнэ.",
  "categorySlug": "health",
  "jobZone": 5,
  "riasec": {
   "R": 77,
   "I": 57,
   "A": 2,
   "S": 79,
   "E": 21,
   "C": 37
  },
  "personality": {
   "O": 58,
   "C": 72,
   "E": 65,
   "A": 68
  },
  "cognitive": {
   "math": 29,
   "verbal": 43,
   "techSpatial": 35,
   "abstract": 48
  },
  "subjects": [
   "social",
   "biology"
  ]
 },
 {
  "code": "29-9092.00",
  "slug": "genetic-counselors",
  "nameEn": "Genetic Counselors",
  "nameMn": "Удамшлын зөвлөх",
  "descriptionMn": "Удамшлын эмгэг, төрөлхийн гажиг зэрэг төрөл бүрийн удамших өвчний хувь хүн, гэр бүлийн эрсдэлийг үнэлнэ.",
  "categorySlug": "health",
  "jobZone": 5,
  "riasec": {
   "R": 11,
   "I": 81,
   "A": 22,
   "S": 74,
   "E": 29,
   "C": 48
  },
  "personality": {
   "O": 75,
   "C": 82,
   "E": 60,
   "A": 84
  },
  "cognitive": {
   "math": 49,
   "verbal": 75,
   "techSpatial": 16,
   "abstract": 67
  },
  "subjects": [
   "biology",
   "social",
   "math"
  ]
 },
 {
  "code": "29-9093.00",
  "slug": "surgical-assistants",
  "nameEn": "Surgical Assistants",
  "nameMn": "Мэс заслын туслах",
  "descriptionMn": "Мэс засалчийн хяналтан дор мэс засалд тусална. Хууль тогтоомжийн дагуу зүсэлт хийх, оёх, эд эс хөдөлгөх, мэс заслын төхөөрөмж суулгах, шингэн соруулах зэрэгт тусалж болно.",
  "categorySlug": "health",
  "jobZone": 3,
  "riasec": {
   "R": 78,
   "I": 41,
   "A": 0,
   "S": 47,
   "E": 13,
   "C": 57
  },
  "personality": {
   "O": 20,
   "C": 84,
   "E": 30,
   "A": 56
  },
  "cognitive": {
   "math": 40,
   "verbal": 38,
   "techSpatial": 39,
   "abstract": 33
  },
  "subjects": [
   "biology",
   "social"
  ]
 },
 {
  "code": "29-9099.01",
  "slug": "midwives",
  "nameEn": "Midwives",
  "nameMn": "Эх баригч",
  "descriptionMn": "Жирэмсний өмнөх болон төрөх үеийн тусламж үзүүлнэ.",
  "categorySlug": "health",
  "jobZone": 5,
  "riasec": {
   "R": 50,
   "I": 42,
   "A": 15,
   "S": 84,
   "E": 28,
   "C": 38
  },
  "personality": {
   "O": 60,
   "C": 87,
   "E": 66,
   "A": 83
  },
  "cognitive": {
   "math": 37,
   "verbal": 50,
   "techSpatial": 22,
   "abstract": 57
  },
  "subjects": [
   "biology",
   "social"
  ]
 },
 {
  "code": "31-1131.00",
  "slug": "nursing-assistants",
  "nameEn": "Nursing Assistants",
  "nameMn": "Сувилагчийн туслах (асрагч)",
  "descriptionMn": "Лицензтэй сувилагч нарын удирдлаган дор суурь асаргаа, дэмжлэг үзүүлж эсвэл тусална.",
  "categorySlug": "health",
  "jobZone": 3,
  "riasec": {
   "R": 60,
   "I": 29,
   "A": 0,
   "S": 78,
   "E": 13,
   "C": 54
  },
  "personality": {
   "O": 20,
   "C": 46,
   "E": 35,
   "A": 84
  },
  "cognitive": {
   "math": 29,
   "verbal": 26,
   "techSpatial": 16,
   "abstract": 19
  },
  "subjects": [
   "social"
  ]
 },
 {
  "code": "31-2011.00",
  "slug": "occupational-therapy-assistants",
  "nameEn": "Occupational Therapy Assistants",
  "nameMn": "Хөдөлмөрийн эмчилгээчийн туслах",
  "descriptionMn": "Хөдөлмөрийн эмчилгээчид эмчилгээ, ажилбар хийхэд тусална.",
  "categorySlug": "health",
  "jobZone": 3,
  "riasec": {
   "R": 42,
   "I": 41,
   "A": 18,
   "S": 85,
   "E": 2,
   "C": 54
  },
  "personality": {
   "O": 52,
   "C": 62,
   "E": 55,
   "A": 78
  },
  "cognitive": {
   "math": 30,
   "verbal": 44,
   "techSpatial": 31,
   "abstract": 29
  },
  "subjects": [
   "social"
  ]
 },
 {
  "code": "31-2012.00",
  "slug": "occupational-therapy-aides",
  "nameEn": "Occupational Therapy Aides",
  "nameMn": "Хөдөлмөрийн эмчилгээний туслах ажилтан",
  "descriptionMn": "Хөдөлмөрийн эмчилгээч, түүний туслахын нягт хяналтан дор тодорхой нөхцөлд хүлээлгэсэн, сонгосон эсвэл тогтмол ажлыг гүйцэтгэнэ.",
  "categorySlug": "health",
  "jobZone": 3,
  "riasec": {
   "R": 49,
   "I": 26,
   "A": 12,
   "S": 83,
   "E": 14,
   "C": 45
  },
  "personality": {
   "O": 22,
   "C": 25,
   "E": 27,
   "A": 70
  },
  "cognitive": {
   "math": 24,
   "verbal": 28,
   "techSpatial": 30,
   "abstract": 20
  },
  "subjects": [
   "social",
   "informatics"
  ]
 },
 {
  "code": "31-2021.00",
  "slug": "physical-therapist-assistants",
  "nameEn": "Physical Therapist Assistants",
  "nameMn": "Биеийн тамирын эмчилгээчийн туслах",
  "descriptionMn": "Физик эмчилгээчид эмчилгээ, ажилбар хийхэд тусална.",
  "categorySlug": "health",
  "jobZone": 3,
  "riasec": {
   "R": 58,
   "I": 44,
   "A": 9,
   "S": 90,
   "E": 5,
   "C": 46
  },
  "personality": {
   "O": 46,
   "C": 59,
   "E": 51,
   "A": 75
  },
  "cognitive": {
   "math": 31,
   "verbal": 39,
   "techSpatial": 29,
   "abstract": 29
  },
  "subjects": [
   "social",
   "informatics",
   "biology"
  ]
 },
 {
  "code": "31-9011.00",
  "slug": "massage-therapists",
  "nameEn": "Massage Therapists",
  "nameMn": "Массажист (эмчилгээний)",
  "descriptionMn": "Зөөлөн эд, үений эмчилгээний иллэг хийнэ. Хөдөлгөөний далайц, булчингийн хүчийг үнэлэх, үйлчлүүлэгчийн эмчилгээний төлөвлөгөө санал болгоход тусалж болно.",
  "categorySlug": "health",
  "jobZone": 3,
  "riasec": {
   "R": 64,
   "I": 47,
   "A": 21,
   "S": 79,
   "E": 18,
   "C": 28
  },
  "personality": {
   "O": 47,
   "C": 22,
   "E": 45,
   "A": 74
  },
  "cognitive": {
   "math": 6,
   "verbal": 26,
   "techSpatial": 0,
   "abstract": 18
  },
  "subjects": []
 },
 {
  "code": "31-9091.00",
  "slug": "dental-assistants",
  "nameEn": "Dental Assistants",
  "nameMn": "Шүдний эмчийн туслах",
  "descriptionMn": "Шүдний эмчийн удирдлаган дор хязгаарлагдмал эмнэлзүйн үүрэг гүйцэтгэнэ.",
  "categorySlug": "health",
  "jobZone": 3,
  "riasec": {
   "R": 58,
   "I": 43,
   "A": 0,
   "S": 56,
   "E": 6,
   "C": 74
  },
  "personality": {
   "O": 23,
   "C": 49,
   "E": 38,
   "A": 64
  },
  "cognitive": {
   "math": 30,
   "verbal": 31,
   "techSpatial": 27,
   "abstract": 23
  },
  "subjects": [
   "biology",
   "informatics"
  ]
 },
 {
  "code": "31-9092.00",
  "slug": "medical-assistants",
  "nameEn": "Medical Assistants",
  "nameMn": "Эмнэлгийн туслах",
  "descriptionMn": "Эмчийн удирдлаган дор захиргааны болон тодорхой эмнэлзүйн үүрэг гүйцэтгэнэ.",
  "categorySlug": "health",
  "jobZone": 3,
  "riasec": {
   "R": 51,
   "I": 47,
   "A": 0,
   "S": 63,
   "E": 16,
   "C": 79
  },
  "personality": {
   "O": 32,
   "C": 55,
   "E": 42,
   "A": 68
  },
  "cognitive": {
   "math": 46,
   "verbal": 41,
   "techSpatial": 29,
   "abstract": 29
  },
  "subjects": [
   "informatics",
   "biology"
  ]
 },
 {
  "code": "31-9094.00",
  "slug": "medical-transcriptionists",
  "nameEn": "Medical Transcriptionists",
  "nameMn": "Эмнэлгийн тэмдэглэл бичигч",
  "descriptionMn": "Эмч болон бусад эрүүл мэндийн мэргэжилтний янз бүрийн электрон төхөөрөмжөөр бичсэн үзлэг, яаралтай тусламж, оношилгооны дүрс, мэс засал, дүгнэлтийн эмнэлгийн тайланг бичгээр буулгана.",
  "categorySlug": "health",
  "jobZone": 3,
  "riasec": {
   "R": 25,
   "I": 43,
   "A": 12,
   "S": 45,
   "E": 4,
   "C": 88
  },
  "personality": {
   "O": 20,
   "C": 57,
   "E": 2,
   "A": 23
  },
  "cognitive": {
   "math": 20,
   "verbal": 53,
   "techSpatial": 10,
   "abstract": 19
  },
  "subjects": [
   "informatics"
  ]
 },
 {
  "code": "31-9097.00",
  "slug": "phlebotomists",
  "nameEn": "Phlebotomists",
  "nameMn": "Цус авагч (флеботомист)",
  "descriptionMn": "Шинжилгээ, цус сэлбэлт, хандив, судалгааны зорилгоор цус авна. Өвчтөнд ажилбарыг тайлбарлаж, сөрөг урвалтай өвчтөнийг эдгэрэхэд тусалж болно.",
  "categorySlug": "health",
  "jobZone": 3,
  "riasec": {
   "R": 74,
   "I": 62,
   "A": 0,
   "S": 43,
   "E": 7,
   "C": 74
  },
  "personality": {
   "O": 11,
   "C": 50,
   "E": 27,
   "A": 58
  },
  "cognitive": {
   "math": 29,
   "verbal": 33,
   "techSpatial": 26,
   "abstract": 20
  },
  "subjects": [
   "informatics"
  ]
 },
 {
  "code": "31-9099.01",
  "slug": "speech-language-pathology-assistants",
  "nameEn": "Speech-Language Pathology Assistants",
  "nameMn": "Хэл ярианы эмчийн туслах",
  "descriptionMn": "Яриа, хэл, дуу хоолой, ярианы жигд байдлын эмгэгийг үнэлж эмчлэхэд хэл ярианы эмчид тусална.",
  "categorySlug": "health",
  "jobZone": 3,
  "riasec": {
   "R": 25,
   "I": 56,
   "A": 27,
   "S": 75,
   "E": 9,
   "C": 67
  },
  "personality": {
   "O": 49,
   "C": 60,
   "E": 38,
   "A": 73
  },
  "cognitive": {
   "math": 32,
   "verbal": 45,
   "techSpatial": 4,
   "abstract": 26
  },
  "subjects": [
   "social"
  ]
 },
 {
  "code": "33-1011.00",
  "slug": "first-line-supervisors-of-correctional-officers",
  "nameEn": "First-Line Supervisors of Correctional Officers",
  "nameMn": "Хорих ангийн ахлах ажилтан",
  "descriptionMn": "Хорих ангийн ажилтнууд болон хамгаалагчдын үйл ажиллагааг шууд удирдаж зохицуулна.",
  "categorySlug": "law-public",
  "jobZone": 3,
  "riasec": {
   "R": 43,
   "I": 13,
   "A": 0,
   "S": 59,
   "E": 89,
   "C": 68
  },
  "personality": {
   "O": 27,
   "C": 67,
   "E": 65,
   "A": 34
  },
  "cognitive": {
   "math": 31,
   "verbal": 44,
   "techSpatial": 46,
   "abstract": 41
  },
  "subjects": [
   "social",
   "informatics"
  ]
 },
 {
  "code": "33-1021.00",
  "slug": "first-line-supervisors-of-firefighting-and-prevention-workers",
  "nameEn": "First-Line Supervisors of Firefighting and Prevention Workers",
  "nameMn": "Гал түймэр унтраах, урьдчилан сэргийлэх ахлах ажилтан",
  "descriptionMn": "Гал түймэр унтраах, урьдчилан сэргийлэх, хянах ажилтнуудын үйл ажиллагааг шууд удирдаж зохицуулна.",
  "categorySlug": "law-public",
  "jobZone": 3,
  "riasec": {
   "R": 69,
   "I": 21,
   "A": 0,
   "S": 45,
   "E": 86,
   "C": 61
  },
  "personality": {
   "O": 57,
   "C": 80,
   "E": 90,
   "A": 56
  },
  "cognitive": {
   "math": 36,
   "verbal": 43,
   "techSpatial": 72,
   "abstract": 45
  },
  "subjects": [
   "social",
   "informatics"
  ]
 },
 {
  "code": "33-2021.00",
  "slug": "fire-inspectors-and-investigators",
  "nameEn": "Fire Inspectors and Investigators",
  "nameMn": "Галын байцаагч, мөрдөгч",
  "descriptionMn": "Галын аюулыг илрүүлж, орон нутгийн болон улсын хууль тогтоомжийг хэрэгжүүлэхийн тулд барилгыг шалгана, эсвэл гал, дэлбэрэлтийн шалтгааныг тогтоохоор нөхцөл байдлыг шинжилнэ.",
  "categorySlug": "law-public",
  "jobZone": 3,
  "riasec": {
   "R": 75,
   "I": 56,
   "A": 0,
   "S": 26,
   "E": 39,
   "C": 70
  },
  "personality": {
   "O": 53,
   "C": 77,
   "E": 56,
   "A": 41
  },
  "cognitive": {
   "math": 35,
   "verbal": 46,
   "techSpatial": 65,
   "abstract": 48
  },
  "subjects": [
   "social",
   "informatics"
  ]
 },
 {
  "code": "33-2022.00",
  "slug": "forest-fire-inspectors-and-prevention-specialists",
  "nameEn": "Forest Fire Inspectors and Prevention Specialists",
  "nameMn": "Ойн түймрийн байцаагч, урьдчилан сэргийлэх мэргэжилтэн",
  "descriptionMn": "Галын дүрмийг хэрэгжүүлж, ойн түймрийн аюулыг шалгаж, ойн түймрээс урьдчилан сэргийлэх, хянах арга хэмжээ санал болгоно.",
  "categorySlug": "law-public",
  "jobZone": 3,
  "riasec": {
   "R": 89,
   "I": 43,
   "A": 2,
   "S": 36,
   "E": 40,
   "C": 60
  },
  "personality": {
   "O": 45,
   "C": 72,
   "E": 65,
   "A": 37
  },
  "cognitive": {
   "math": 41,
   "verbal": 36,
   "techSpatial": 73,
   "abstract": 35
  },
  "subjects": [
   "informatics",
   "geography",
   "social"
  ]
 },
 {
  "code": "33-3011.00",
  "slug": "bailiffs",
  "nameEn": "Bailiffs",
  "nameMn": "Шүүхийн ажилтан (шүүхийн хамгаалагч)",
  "descriptionMn": "Шүүхийн танхимд дэг журмыг хамгаална.",
  "categorySlug": "law-public",
  "jobZone": 3,
  "riasec": {
   "R": 63,
   "I": 19,
   "A": 0,
   "S": 38,
   "E": 50,
   "C": 58
  },
  "personality": {
   "O": 8,
   "C": 41,
   "E": 38,
   "A": 27
  },
  "cognitive": {
   "math": 4,
   "verbal": 12,
   "techSpatial": 8,
   "abstract": 10
  },
  "subjects": [
   "social"
  ]
 },
 {
  "code": "33-3021.00",
  "slug": "detectives-and-criminal-investigators",
  "nameEn": "Detectives and Criminal Investigators",
  "nameMn": "Мөрдөгч, эрүүгийн мөрдөн байцаагч",
  "descriptionMn": "Гэмт хэргээс урьдчилан сэргийлэх эсвэл илрүүлэхийн тулд хууль зөрчсөн байж болзошгүй хэргийг шалгана.",
  "categorySlug": "law-public",
  "jobZone": 3,
  "riasec": {
   "R": 53,
   "I": 65,
   "A": 3,
   "S": 29,
   "E": 51,
   "C": 64
  },
  "personality": {
   "O": 72,
   "C": 92,
   "E": 68,
   "A": 28
  },
  "cognitive": {
   "math": 30,
   "verbal": 48,
   "techSpatial": 52,
   "abstract": 58
  },
  "subjects": [
   "social",
   "informatics"
  ]
 },
 {
  "code": "33-3021.02",
  "slug": "police-identification-and-records-officers",
  "nameEn": "Police Identification and Records Officers",
  "nameMn": "Цагдаагийн тодорхойлолт, бүртгэлийн ажилтан",
  "descriptionMn": "Гэмт хэргийн газраас нотлох баримт цуглуулж, хурууны хээг ангилан тодорхойлж, эрүүгийн болон иргэний хэрэгт нотлох баримтыг гэрэл зураг авна.",
  "categorySlug": "law-public",
  "jobZone": 3,
  "riasec": {
   "R": 64,
   "I": 45,
   "A": 10,
   "S": 16,
   "E": 32,
   "C": 77
  },
  "personality": {
   "O": 57,
   "C": 73,
   "E": 41,
   "A": 40
  },
  "cognitive": {
   "math": 40,
   "verbal": 44,
   "techSpatial": 52,
   "abstract": 52
  },
  "subjects": [
   "social",
   "informatics"
  ]
 },
 {
  "code": "33-3021.06",
  "slug": "intelligence-analysts",
  "nameEn": "Intelligence Analysts",
  "nameMn": "Тагнуулын шинжээч",
  "descriptionMn": "Хууль сахиулах байгууллагын өгөгдлийн сан, ажиглалт, тагнуулын сүлжээ, газарзүйн мэдээллийн систем зэрэг олон эх сурвалжаас мэдээллийг цуглуулж, шинжилж, үнэлнэ.",
  "categorySlug": "law-public",
  "jobZone": 4,
  "riasec": {
   "R": 22,
   "I": 80,
   "A": 18,
   "S": 15,
   "E": 47,
   "C": 73
  },
  "personality": {
   "O": 80,
   "C": 85,
   "E": 46,
   "A": 24
  },
  "cognitive": {
   "math": 45,
   "verbal": 65,
   "techSpatial": 31,
   "abstract": 67
  },
  "subjects": [
   "informatics",
   "social"
  ]
 },
 {
  "code": "33-3031.00",
  "slug": "fish-and-game-wardens",
  "nameEn": "Fish and Game Wardens",
  "nameMn": "Загас, ан агнуурын байцаагч",
  "descriptionMn": "Загас, ан агнуурын хууль зөрчихөөс урьдчилан сэргийлэхийн тулд хуваарилсан бүс нутагт эргүүл хийнэ.",
  "categorySlug": "law-public",
  "jobZone": 3,
  "riasec": {
   "R": 90,
   "I": 49,
   "A": 0,
   "S": 23,
   "E": 34,
   "C": 54
  },
  "personality": {
   "O": 46,
   "C": 59,
   "E": 63,
   "A": 41
  },
  "cognitive": {
   "math": 33,
   "verbal": 43,
   "techSpatial": 69,
   "abstract": 42
  },
  "subjects": [
   "social",
   "biology",
   "geography"
  ]
 },
 {
  "code": "33-3051.00",
  "slug": "police-and-sheriff-s-patrol-officers",
  "nameEn": "Police and Sheriff's Patrol Officers",
  "nameMn": "Цагдаа, эргүүлийн офицер",
  "descriptionMn": "Орон нутгийн, улсын эсвэл холбооны хууль, дүрэм журмыг хэрэгжүүлж, дэг журам, хүн, эд хөрөнгийн аюулгүй байдлыг хамгаална.",
  "categorySlug": "law-public",
  "jobZone": 3,
  "riasec": {
   "R": 73,
   "I": 29,
   "A": 1,
   "S": 41,
   "E": 51,
   "C": 56
  },
  "personality": {
   "O": 34,
   "C": 73,
   "E": 73,
   "A": 54
  },
  "cognitive": {
   "math": 29,
   "verbal": 42,
   "techSpatial": 51,
   "abstract": 47
  },
  "subjects": [
   "social",
   "informatics"
  ]
 },
 {
  "code": "33-3051.04",
  "slug": "customs-and-border-protection-officers",
  "nameEn": "Customs and Border Protection Officers",
  "nameMn": "Гаалийн болон хилийн хамгаалалтын офицер",
  "descriptionMn": "Цагаачлал, гаалийн хууль зөрчлийг илрүүлэхийн тулд улсад орж гарч буй хүн, тээврийн хэрэгсэл, бараа, бүтээгдэхүүнийг шалгаж, хянана.",
  "categorySlug": "law-public",
  "jobZone": 3,
  "riasec": {
   "R": 40,
   "I": 27,
   "A": 0,
   "S": 27,
   "E": 55,
   "C": 71
  },
  "personality": {
   "O": 34,
   "C": 74,
   "E": 56,
   "A": 20
  },
  "cognitive": {
   "math": 35,
   "verbal": 43,
   "techSpatial": 35,
   "abstract": 44
  },
  "subjects": [
   "social",
   "geography"
  ]
 },
 {
  "code": "33-3052.00",
  "slug": "transit-and-railroad-police",
  "nameEn": "Transit and Railroad Police",
  "nameMn": "Тээвэр, төмөр замын цагдаа",
  "descriptionMn": "Төмөр зам, нийтийн тээврийн өмч хөрөнгө, ажилтан, зорчигчдыг хамгаалж, хяналт тавина.",
  "categorySlug": "law-public",
  "jobZone": 3,
  "riasec": {
   "R": 86,
   "I": 21,
   "A": 0,
   "S": 25,
   "E": 37,
   "C": 66
  },
  "personality": {
   "O": 29,
   "C": 61,
   "E": 61,
   "A": 37
  },
  "cognitive": {
   "math": 30,
   "verbal": 33,
   "techSpatial": 53,
   "abstract": 39
  },
  "subjects": [
   "social",
   "informatics"
  ]
 },
 {
  "code": "33-9021.00",
  "slug": "private-detectives-and-investigators",
  "nameEn": "Private Detectives and Investigators",
  "nameMn": "Хувийн мөрдөгч, мөрдөн байцаагч",
  "descriptionMn": "Хувь хүн, байгууллагын тухай мэдээллийг цуглуулж, шинжилж, нэгтгэн үйлчлүүлэгчид мэдээлнэ, эсвэл хувийн байгууллагад хууль бус үйлдэл, дүрэм зөрчлийг илрүүлнэ.",
  "categorySlug": "law-public",
  "jobZone": 3,
  "riasec": {
   "R": 23,
   "I": 48,
   "A": 7,
   "S": 31,
   "E": 51,
   "C": 74
  },
  "personality": {
   "O": 72,
   "C": 80,
   "E": 52,
   "A": 14
  },
  "cognitive": {
   "math": 35,
   "verbal": 45,
   "techSpatial": 31,
   "abstract": 45
  },
  "subjects": [
   "social",
   "informatics"
  ]
 },
 {
  "code": "35-1011.00",
  "slug": "chefs-and-head-cooks",
  "nameEn": "Chefs and Head Cooks",
  "nameMn": "Тогооч, ахлах тогооч",
  "descriptionMn": "Салат, шөл, загас, мах, хүнсний ногоо, амттан зэрэг хоолыг бэлтгэх, амтлах, хийх ажлыг удирдаж, өөрөө оролцоно.",
  "categorySlug": "service",
  "jobZone": 3,
  "riasec": {
   "R": 64,
   "I": 11,
   "A": 29,
   "S": 33,
   "E": 69,
   "C": 56
  },
  "personality": {
   "O": 66,
   "C": 70,
   "E": 77,
   "A": 36
  },
  "cognitive": {
   "math": 48,
   "verbal": 34,
   "techSpatial": 47,
   "abstract": 39
  },
  "subjects": [
   "math",
   "informatics",
   "social"
  ]
 },
 {
  "code": "35-2013.00",
  "slug": "cooks-private-household",
  "nameEn": "Cooks, Private Household",
  "nameMn": "Хувийн гэрийн тогооч",
  "descriptionMn": "Хувийн орон сууцанд хоол бэлтгэнэ. Хувийн тогоочийг оруулна.",
  "categorySlug": "service",
  "jobZone": 3,
  "riasec": {
   "R": 66,
   "I": 7,
   "A": 46,
   "S": 46,
   "E": 43,
   "C": 45
  },
  "personality": {
   "O": 58,
   "C": 27,
   "E": 40,
   "A": 46
  },
  "cognitive": {
   "math": 30,
   "verbal": 14,
   "techSpatial": 16,
   "abstract": 20
  },
  "subjects": []
 },
 {
  "code": "37-1012.00",
  "slug": "first-line-supervisors-of-landscaping-lawn-service-and-groundskeeping-workers",
  "nameEn": "First-Line Supervisors of Landscaping, Lawn Service, and Groundskeeping Workers",
  "nameMn": "Ногоон байгууламж, тохижилтын ахлах ажилтан",
  "descriptionMn": "Ногоон байгууламж, тохижилтын ажилчдын үйл ажиллагааг шууд удирдаж зохицуулна.",
  "categorySlug": "service",
  "jobZone": 3,
  "riasec": {
   "R": 59,
   "I": 13,
   "A": 1,
   "S": 34,
   "E": 85,
   "C": 71
  },
  "personality": {
   "O": 41,
   "C": 54,
   "E": 73,
   "A": 42
  },
  "cognitive": {
   "math": 39,
   "verbal": 35,
   "techSpatial": 67,
   "abstract": 22
  },
  "subjects": [
   "math"
  ]
 },
 {
  "code": "37-2011.00",
  "slug": "janitors-and-cleaners-except-maids-and-housekeeping-cleaners",
  "nameEn": "Janitors and Cleaners, Except Maids and Housekeeping Cleaners",
  "nameMn": "Цэвэрлэгч, үйлчлэгч (гэрийн үйлчлэгчээс бусад)",
  "descriptionMn": "Барилгыг цэвэр цэмцгэр байлгана. Шал, хивс, хана, шил угаах, хог хаягдал зайлуулах зэрэг хүнд цэвэрлэгээ хийнэ.",
  "categorySlug": "service",
  "jobZone": 3,
  "riasec": {
   "R": 96,
   "I": 2,
   "A": 0,
   "S": 18,
   "E": 11,
   "C": 60
  },
  "personality": {
   "O": 3,
   "C": 0,
   "E": 0,
   "A": 20
  },
  "cognitive": {
   "math": 6,
   "verbal": 0,
   "techSpatial": 4,
   "abstract": 4
  },
  "subjects": []
 },
 {
  "code": "39-1022.00",
  "slug": "first-line-supervisors-of-personal-service-workers",
  "nameEn": "First-Line Supervisors of Personal Service Workers",
  "nameMn": "Хувийн үйлчилгээний ахлах ажилтан",
  "descriptionMn": "Хувийн үйлчилгээний ажилтнуудын үйл ажиллагааг удирдаж зохицуулна.",
  "categorySlug": "service",
  "jobZone": 3,
  "riasec": {
   "R": 40,
   "I": 2,
   "A": 2,
   "S": 50,
   "E": 98,
   "C": 69
  },
  "personality": {
   "O": 41,
   "C": 50,
   "E": 77,
   "A": 60
  },
  "cognitive": {
   "math": 29,
   "verbal": 36,
   "techSpatial": 31,
   "abstract": 26
  },
  "subjects": [
   "social",
   "informatics"
  ]
 },
 {
  "code": "39-4011.00",
  "slug": "embalmers",
  "nameEn": "Embalmers",
  "nameMn": "Ёслолын бэлтгэл хийгч (мумиёлогч)",
  "descriptionMn": "Хууль эрх зүйн шаардлагын дагуу шарилыг оршуулгад бэлтгэнэ.",
  "categorySlug": "service",
  "jobZone": 3,
  "riasec": {
   "R": 81,
   "I": 26,
   "A": 10,
   "S": 40,
   "E": 27,
   "C": 48
  },
  "personality": {
   "O": 14,
   "C": 51,
   "E": 18,
   "A": 52
  },
  "cognitive": {
   "math": 20,
   "verbal": 30,
   "techSpatial": 45,
   "abstract": 17
  },
  "subjects": [
   "chemistry",
   "social",
   "informatics"
  ]
 },
 {
  "code": "39-4031.00",
  "slug": "morticians-undertakers-and-funeral-arrangers",
  "nameEn": "Morticians, Undertakers, and Funeral Arrangers",
  "nameMn": "Оршуулгын үйлчилгээний зохион байгуулагч",
  "descriptionMn": "Шарилыг цогцос хадгалах газарт тээвэрлэх, гэр бүлийнхэнтэй ярилцаж нарийн ширийнийг тохиролцох, шашны ёслолын албаныханд тусалж оршуулгын үйлчилгээг зохион байгуулна.",
  "categorySlug": "service",
  "jobZone": 3,
  "riasec": {
   "R": 43,
   "I": 7,
   "A": 13,
   "S": 57,
   "E": 61,
   "C": 61
  },
  "personality": {
   "O": 34,
   "C": 59,
   "E": 68,
   "A": 80
  },
  "cognitive": {
   "math": 45,
   "verbal": 40,
   "techSpatial": 40,
   "abstract": 26
  },
  "subjects": [
   "social"
  ]
 },
 {
  "code": "39-5011.00",
  "slug": "barbers",
  "nameEn": "Barbers",
  "nameMn": "Үсчин (эрэгтэй)",
  "descriptionMn": "Үс засах, тайрах, угаах, засалт хийх, сахал хусах зэрэг үсчний үйлчилгээ үзүүлнэ.",
  "categorySlug": "service",
  "jobZone": 3,
  "riasec": {
   "R": 73,
   "I": 0,
   "A": 28,
   "S": 43,
   "E": 43,
   "C": 48
  },
  "personality": {
   "O": 33,
   "C": 11,
   "E": 48,
   "A": 53
  },
  "cognitive": {
   "math": 11,
   "verbal": 5,
   "techSpatial": 27,
   "abstract": 0
  },
  "subjects": [
   "chemistry"
  ]
 },
 {
  "code": "39-5012.00",
  "slug": "hairdressers-hairstylists-and-cosmetologists",
  "nameEn": "Hairdressers, Hairstylists, and Cosmetologists",
  "nameMn": "Үсчин, үс засалтын мастер, гоо сайхны мэргэжилтэн",
  "descriptionMn": "Үс засах, будах, засалт хийх, толгойн арьс иллэх, эмчлэх зэрэг гоо сайхны үйлчилгээ үзүүлнэ.",
  "categorySlug": "service",
  "jobZone": 3,
  "riasec": {
   "R": 73,
   "I": 9,
   "A": 37,
   "S": 45,
   "E": 38,
   "C": 49
  },
  "personality": {
   "O": 48,
   "C": 24,
   "E": 55,
   "A": 58
  },
  "cognitive": {
   "math": 28,
   "verbal": 12,
   "techSpatial": 16,
   "abstract": 20
  },
  "subjects": []
 },
 {
  "code": "39-5091.00",
  "slug": "makeup-artists-theatrical-and-performance",
  "nameEn": "Makeup Artists, Theatrical and Performance",
  "nameMn": "Тайз, тоглолтын нүүр будалтын мастер",
  "descriptionMn": "Дүрийн үе, орчин, нөхцөл байдлыг илэрхийлэхүйц нүүр будалт хийнэ.",
  "categorySlug": "service",
  "jobZone": 3,
  "riasec": {
   "R": 56,
   "I": 6,
   "A": 95,
   "S": 33,
   "E": 35,
   "C": 34
  },
  "personality": {
   "O": 68,
   "C": 57,
   "E": 57,
   "A": 37
  },
  "cognitive": {
   "math": 31,
   "verbal": 29,
   "techSpatial": 27,
   "abstract": 31
  },
  "subjects": [
   "art"
  ]
 },
 {
  "code": "39-5094.00",
  "slug": "skincare-specialists",
  "nameEn": "Skincare Specialists",
  "nameMn": "Арьс арчилгааны мэргэжилтэн",
  "descriptionMn": "Хүний гадаад төрхийг сайжруулахын тулд нүүр болон биеийн арьс арчилгааны эмчилгээ хийнэ.",
  "categorySlug": "service",
  "jobZone": 3,
  "riasec": {
   "R": 75,
   "I": 17,
   "A": 33,
   "S": 53,
   "E": 35,
   "C": 40
  },
  "personality": {
   "O": 42,
   "C": 28,
   "E": 46,
   "A": 66
  },
  "cognitive": {
   "math": 7,
   "verbal": 27,
   "techSpatial": 19,
   "abstract": 20
  },
  "subjects": []
 },
 {
  "code": "39-7011.00",
  "slug": "tour-guides-and-escorts",
  "nameEn": "Tour Guides and Escorts",
  "nameMn": "Аялал жуулчлалын хөтөч",
  "descriptionMn": "Аж үйлдвэр, нийтийн барилга, урлагийн галерей зэрэг үзэсгэлэнт газруудаар хүн, бүлгийг дагалдан хөтөлнө.",
  "categorySlug": "service",
  "jobZone": 3,
  "riasec": {
   "R": 39,
   "I": 23,
   "A": 41,
   "S": 73,
   "E": 44,
   "C": 31
  },
  "personality": {
   "O": 54,
   "C": 10,
   "E": 65,
   "A": 58
  },
  "cognitive": {
   "math": 12,
   "verbal": 24,
   "techSpatial": 14,
   "abstract": 13
  },
  "subjects": [
   "history"
  ]
 },
 {
  "code": "39-9031.00",
  "slug": "exercise-trainers-and-group-fitness-instructors",
  "nameEn": "Exercise Trainers and Group Fitness Instructors",
  "nameMn": "Биеийн тамирын дасгалжуулагч, бүлгийн фитнесийн багш",
  "descriptionMn": "Хувийн фитнесийн зорилгоор бүлэг, хувь хүнд дасгал заан дасгалжуулна.",
  "categorySlug": "service",
  "jobZone": 3,
  "riasec": {
   "R": 71,
   "I": 28,
   "A": 23,
   "S": 77,
   "E": 42,
   "C": 33
  },
  "personality": {
   "O": 48,
   "C": 40,
   "E": 75,
   "A": 62
  },
  "cognitive": {
   "math": 11,
   "verbal": 27,
   "techSpatial": 21,
   "abstract": 19
  },
  "subjects": [
   "social"
  ]
 },
 {
  "code": "39-9032.00",
  "slug": "recreation-workers",
  "nameEn": "Recreation Workers",
  "nameMn": "Чөлөөт цагийн үйл ажиллагааны ажилтан",
  "descriptionMn": "Төрийн, хувийн болон сайн дурын байгууллага, амралтын байгууламжид бүлгийн чөлөөт цагийн үйл ажиллагаа явуулна.",
  "categorySlug": "service",
  "jobZone": 4,
  "riasec": {
   "R": 46,
   "I": 16,
   "A": 34,
   "S": 65,
   "E": 59,
   "C": 41
  },
  "personality": {
   "O": 46,
   "C": 21,
   "E": 67,
   "A": 61
  },
  "cognitive": {
   "math": 30,
   "verbal": 32,
   "techSpatial": 26,
   "abstract": 22
  },
  "subjects": [
   "social",
   "informatics"
  ]
 },
 {
  "code": "39-9041.00",
  "slug": "residential-advisors",
  "nameEn": "Residential Advisors",
  "nameMn": "Дотуур байрны зөвлөх",
  "descriptionMn": "Ахлах сургууль, коллежийн дотуур байр, бүлгийн орон сууц зэрэг оршин суух байгууламжийн үйл ажиллагааг зохицуулна.",
  "categorySlug": "service",
  "jobZone": 3,
  "riasec": {
   "R": 30,
   "I": 23,
   "A": 21,
   "S": 71,
   "E": 47,
   "C": 61
  },
  "personality": {
   "O": 45,
   "C": 39,
   "E": 77,
   "A": 74
  },
  "cognitive": {
   "math": 29,
   "verbal": 37,
   "techSpatial": 21,
   "abstract": 20
  },
  "subjects": [
   "social",
   "informatics"
  ]
 },
 {
  "code": "41-1012.00",
  "slug": "first-line-supervisors-of-non-retail-sales-workers",
  "nameEn": "First-Line Supervisors of Non-Retail Sales Workers",
  "nameMn": "Жижиглэн бус борлуулалтын ахлах ажилтан",
  "descriptionMn": "Жижиглэн худалдаанаас бусад борлуулалтын ажилтнуудын үйл ажиллагааг шууд удирдаж зохицуулна.",
  "categorySlug": "business",
  "jobZone": 4,
  "riasec": {
   "R": 12,
   "I": 2,
   "A": 0,
   "S": 51,
   "E": 100,
   "C": 72
  },
  "personality": {
   "O": 50,
   "C": 63,
   "E": 84,
   "A": 46
  },
  "cognitive": {
   "math": 50,
   "verbal": 45,
   "techSpatial": 28,
   "abstract": 41
  },
  "subjects": [
   "informatics",
   "math"
  ]
 },
 {
  "code": "41-3011.00",
  "slug": "advertising-sales-agents",
  "nameEn": "Advertising Sales Agents",
  "nameMn": "Сурталчилгааны борлуулалтын агент",
  "descriptionMn": "Хэвлэл, самбар, телевиз, радио, интернет болон олон нийтийн газар сурталчилгааны талбай, хугацаа, зарыг худалдах, санал болгоно.",
  "categorySlug": "business",
  "jobZone": 3,
  "riasec": {
   "R": 3,
   "I": 9,
   "A": 44,
   "S": 33,
   "E": 94,
   "C": 56
  },
  "personality": {
   "O": 60,
   "C": 65,
   "E": 82,
   "A": 26
  },
  "cognitive": {
   "math": 47,
   "verbal": 47,
   "techSpatial": 23,
   "abstract": 31
  },
  "subjects": [
   "informatics",
   "math"
  ]
 },
 {
  "code": "41-3021.00",
  "slug": "insurance-sales-agents",
  "nameEn": "Insurance Sales Agents",
  "nameMn": "Даатгалын борлуулалтын агент",
  "descriptionMn": "Амь насны, өмчийн, хариуцлагын, эрүүл мэндийн, автомашины болон бусад төрлийн даатгалыг худалдана.",
  "categorySlug": "business",
  "jobZone": 4,
  "riasec": {
   "R": 0,
   "I": 21,
   "A": 2,
   "S": 45,
   "E": 83,
   "C": 74
  },
  "personality": {
   "O": 52,
   "C": 79,
   "E": 80,
   "A": 39
  },
  "cognitive": {
   "math": 48,
   "verbal": 45,
   "techSpatial": 6,
   "abstract": 32
  },
  "subjects": [
   "math"
  ]
 },
 {
  "code": "41-3031.00",
  "slug": "securities-commodities-and-financial-services-sales-agents",
  "nameEn": "Securities, Commodities, and Financial Services Sales Agents",
  "nameMn": "Үнэт цаас, санхүүгийн үйлчилгээний борлуулалтын агент",
  "descriptionMn": "Хөрөнгө оруулалт, арилжааны компаниудад үнэт цаас, түүхий эд худалдан авч борлуулах, эсвэл бизнес, хувь хүнд санхүүгийн үйлчилгээ үзүүлнэ.",
  "categorySlug": "business",
  "jobZone": 4,
  "riasec": {
   "R": 4,
   "I": 25,
   "A": 5,
   "S": 35,
   "E": 85,
   "C": 71
  },
  "personality": {
   "O": 73,
   "C": 89,
   "E": 82,
   "A": 22
  },
  "cognitive": {
   "math": 58,
   "verbal": 43,
   "techSpatial": 26,
   "abstract": 42
  },
  "subjects": [
   "math",
   "economics",
   "informatics"
  ]
 },
 {
  "code": "41-3041.00",
  "slug": "travel-agents",
  "nameEn": "Travel Agents",
  "nameMn": "Аяллын агент",
  "descriptionMn": "Үйлчлүүлэгчдэд тээвэр, байрлалыг төлөвлөж, борлуулна.",
  "categorySlug": "business",
  "jobZone": 3,
  "riasec": {
   "R": 2,
   "I": 9,
   "A": 15,
   "S": 55,
   "E": 80,
   "C": 80
  },
  "personality": {
   "O": 43,
   "C": 43,
   "E": 59,
   "A": 49
  },
  "cognitive": {
   "math": 37,
   "verbal": 35,
   "techSpatial": 15,
   "abstract": 28
  },
  "subjects": [
   "informatics",
   "geography"
  ]
 },
 {
  "code": "41-4011.00",
  "slug": "sales-representatives-wholesale-and-manufacturing-technical-and-scientific-products",
  "nameEn": "Sales Representatives, Wholesale and Manufacturing, Technical and Scientific Products",
  "nameMn": "Техникийн болон шинжлэх ухааны бүтээгдэхүүний борлуулалтын төлөөлөгч",
  "descriptionMn": "Биологи, инженерчлэл, хими, электроник зэрэг техникийн болон шинжлэх ухааны мэдлэг шаардлагатай бүтээгдэхүүнийг бөөний худалдаа, үйлдвэрийн компанид зарна.",
  "categorySlug": "business",
  "jobZone": 4,
  "riasec": {
   "R": 30,
   "I": 36,
   "A": 7,
   "S": 35,
   "E": 71,
   "C": 69
  },
  "personality": {
   "O": 67,
   "C": 83,
   "E": 83,
   "A": 28
  },
  "cognitive": {
   "math": 47,
   "verbal": 52,
   "techSpatial": 27,
   "abstract": 32
  },
  "subjects": [
   "informatics",
   "math"
  ]
 },
 {
  "code": "41-4012.00",
  "slug": "sales-representatives-wholesale-and-manufacturing-except-technical-and-scientific-products",
  "nameEn": "Sales Representatives, Wholesale and Manufacturing, Except Technical and Scientific Products",
  "nameMn": "Борлуулалтын төлөөлөгч (техникийн бус бүтээгдэхүүн)",
  "descriptionMn": "Бөөний худалдаа, үйлдвэрийн компанийн бүтээгдэхүүнийг бизнес, хувь хүмүүсийн бүлэгт зарна.",
  "categorySlug": "business",
  "jobZone": 4,
  "riasec": {
   "R": 27,
   "I": 21,
   "A": 11,
   "S": 28,
   "E": 85,
   "C": 65
  },
  "personality": {
   "O": 54,
   "C": 68,
   "E": 84,
   "A": 30
  },
  "cognitive": {
   "math": 37,
   "verbal": 43,
   "techSpatial": 20,
   "abstract": 23
  },
  "subjects": [
   "math"
  ]
 },
 {
  "code": "41-9021.00",
  "slug": "real-estate-brokers",
  "nameEn": "Real Estate Brokers",
  "nameMn": "Үл хөдлөх хөрөнгийн зуучлагч (брокер)",
  "descriptionMn": "Үл хөдлөх хөрөнгийн оффис ажиллуулах, эсвэл худалдааны үл хөдлөх хөрөнгийн компанид ажиллаж хэлцлийг удирдана.",
  "categorySlug": "business",
  "jobZone": 4,
  "riasec": {
   "R": 28,
   "I": 9,
   "A": 0,
   "S": 32,
   "E": 91,
   "C": 79
  },
  "personality": {
   "O": 58,
   "C": 79,
   "E": 88,
   "A": 36
  },
  "cognitive": {
   "math": 42,
   "verbal": 43,
   "techSpatial": 23,
   "abstract": 29
  },
  "subjects": [
   "economics",
   "math",
   "social"
  ]
 },
 {
  "code": "41-9031.00",
  "slug": "sales-engineers",
  "nameEn": "Sales Engineers",
  "nameMn": "Борлуулалтын инженер",
  "descriptionMn": "Инженерийн бакалаврын түвшний техникийн мэдлэг шаардсан бизнесийн бараа, үйлчилгээг борлуулна.",
  "categorySlug": "business",
  "jobZone": 4,
  "riasec": {
   "R": 40,
   "I": 43,
   "A": 13,
   "S": 30,
   "E": 80,
   "C": 59
  },
  "personality": {
   "O": 78,
   "C": 77,
   "E": 81,
   "A": 40
  },
  "cognitive": {
   "math": 63,
   "verbal": 65,
   "techSpatial": 53,
   "abstract": 54
  },
  "subjects": [
   "technology",
   "math",
   "informatics"
  ]
 },
 {
  "code": "43-1011.00",
  "slug": "first-line-supervisors-of-office-and-administrative-support-workers",
  "nameEn": "First-Line Supervisors of Office and Administrative Support Workers",
  "nameMn": "Албан бичиг, захиргааны ажилтнуудын ахлах ажилтан",
  "descriptionMn": "Бичиг хэрэг, захиргааны дэмжлэгийн ажилтнуудын үйл ажиллагааг шууд удирдаж зохицуулна.",
  "categorySlug": "business",
  "jobZone": 3,
  "riasec": {
   "R": 10,
   "I": 6,
   "A": 0,
   "S": 56,
   "E": 98,
   "C": 78
  },
  "personality": {
   "O": 45,
   "C": 61,
   "E": 76,
   "A": 56
  },
  "cognitive": {
   "math": 45,
   "verbal": 45,
   "techSpatial": 27,
   "abstract": 29
  },
  "subjects": [
   "informatics",
   "math"
  ]
 },
 {
  "code": "43-3031.00",
  "slug": "bookkeeping-accounting-and-auditing-clerks",
  "nameEn": "Bookkeeping, Accounting, and Auditing Clerks",
  "nameMn": "Нягтлан бодох бүртгэлийн, аудитын ажилтан",
  "descriptionMn": "Санхүүгийн бүртгэлийг бүрэн байлгахын тулд тоон өгөгдлийг тооцож, ангилж, бүртгэнэ.",
  "categorySlug": "business",
  "jobZone": 3,
  "riasec": {
   "R": 10,
   "I": 20,
   "A": 0,
   "S": 8,
   "E": 31,
   "C": 100
  },
  "personality": {
   "O": 4,
   "C": 53,
   "E": 4,
   "A": 16
  },
  "cognitive": {
   "math": 65,
   "verbal": 39,
   "techSpatial": 16,
   "abstract": 23
  },
  "subjects": [
   "informatics",
   "math"
  ]
 },
 {
  "code": "43-3051.00",
  "slug": "payroll-and-timekeeping-clerks",
  "nameEn": "Payroll and Timekeeping Clerks",
  "nameMn": "Цалин, цагийн бүртгэлийн ажилтан",
  "descriptionMn": "Ажилтнуудын цаг, цалингийн өгөгдлийг цуглуулж бүртгэнэ. Ажилласан цаг, бүтээгдэхүүн, урамшууллыг тооцож болно.",
  "categorySlug": "business",
  "jobZone": 3,
  "riasec": {
   "R": 14,
   "I": 1,
   "A": 0,
   "S": 15,
   "E": 39,
   "C": 100
  },
  "personality": {
   "O": 5,
   "C": 48,
   "E": 7,
   "A": 25
  },
  "cognitive": {
   "math": 55,
   "verbal": 38,
   "techSpatial": 10,
   "abstract": 18
  },
  "subjects": [
   "economics",
   "math",
   "informatics"
  ]
 },
 {
  "code": "43-4011.00",
  "slug": "brokerage-clerks",
  "nameEn": "Brokerage Clerks",
  "nameMn": "Брокерийн ажилтан",
  "descriptionMn": "Үнэт цаас худалдан авах, худалдах, эзэмших үйл ажиллагаатай холбоотой ажил гүйцэтгэнэ.",
  "categorySlug": "business",
  "jobZone": 3,
  "riasec": {
   "R": 18,
   "I": 5,
   "A": 0,
   "S": 22,
   "E": 59,
   "C": 99
  },
  "personality": {
   "O": 13,
   "C": 48,
   "E": 19,
   "A": 27
  },
  "cognitive": {
   "math": 55,
   "verbal": 39,
   "techSpatial": 14,
   "abstract": 29
  },
  "subjects": [
   "informatics",
   "math"
  ]
 },
 {
  "code": "43-4061.00",
  "slug": "eligibility-interviewers-government-programs",
  "nameEn": "Eligibility Interviewers, Government Programs",
  "nameMn": "Төрийн хөтөлбөрийн шалгуур хангалтын ярилцлагач",
  "descriptionMn": "Халамж, ажилгүйдлийн тэтгэмж, нийгмийн даатгал, нийтийн орон сууц зэрэг төрийн хөтөлбөр, байгууллагын тусламж авах хүсэлт гаргагчийн шалгуур хангаж буй эсэхийг тодорхойлно.",
  "categorySlug": "business",
  "jobZone": 3,
  "riasec": {
   "R": 0,
   "I": 24,
   "A": 0,
   "S": 58,
   "E": 49,
   "C": 89
  },
  "personality": {
   "O": 17,
   "C": 44,
   "E": 34,
   "A": 57
  },
  "cognitive": {
   "math": 39,
   "verbal": 44,
   "techSpatial": 12,
   "abstract": 36
  },
  "subjects": [
   "informatics"
  ]
 },
 {
  "code": "43-4111.00",
  "slug": "interviewers-except-eligibility-and-loan",
  "nameEn": "Interviewers, Except Eligibility and Loan",
  "nameMn": "Ярилцлагач (шалгуур хангалт, зээлээс бусад)",
  "descriptionMn": "Маягт, өргөдөл, асуулга бөглүүлэхийн тулд хүмүүстэй утсаар, шуудангаар, биечлэн эсвэл бусад аргаар ярилцлага хийнэ.",
  "categorySlug": "business",
  "jobZone": 3,
  "riasec": {
   "R": 0,
   "I": 15,
   "A": 6,
   "S": 52,
   "E": 44,
   "C": 84
  },
  "personality": {
   "O": 18,
   "C": 22,
   "E": 44,
   "A": 54
  },
  "cognitive": {
   "math": 32,
   "verbal": 38,
   "techSpatial": 14,
   "abstract": 25
  },
  "subjects": [
   "informatics",
   "social",
   "math"
  ]
 },
 {
  "code": "43-4131.00",
  "slug": "loan-interviewers-and-clerks",
  "nameEn": "Loan Interviewers and Clerks",
  "nameMn": "Зээлийн ярилцлагач, бичиг хэргийн ажилтан",
  "descriptionMn": "Зээл хүсэгчээс мэдээлэл авах ярилцлага хийж, суурь мэдээллийг шалгаж, лавлагааг баталгаажуулж, зээлийн хүсэлтийн баримтыг бэлтгэж, үнэлгээний хэлтэст дамжуулна.",
  "categorySlug": "business",
  "jobZone": 3,
  "riasec": {
   "R": 0,
   "I": 20,
   "A": 0,
   "S": 40,
   "E": 60,
   "C": 99
  },
  "personality": {
   "O": 14,
   "C": 57,
   "E": 35,
   "A": 39
  },
  "cognitive": {
   "math": 53,
   "verbal": 46,
   "techSpatial": 15,
   "abstract": 36
  },
  "subjects": [
   "social",
   "math",
   "informatics"
  ]
 },
 {
  "code": "43-4141.00",
  "slug": "new-accounts-clerks",
  "nameEn": "New Accounts Clerks",
  "nameMn": "Шинэ дансны ажилтан",
  "descriptionMn": "Санхүүгийн байгууллагад данс нээх хүсэлтэй хүмүүстэй ярилцлага хийнэ.",
  "categorySlug": "business",
  "jobZone": 3,
  "riasec": {
   "R": 6,
   "I": 15,
   "A": 0,
   "S": 44,
   "E": 61,
   "C": 98
  },
  "personality": {
   "O": 18,
   "C": 40,
   "E": 48,
   "A": 56
  },
  "cognitive": {
   "math": 45,
   "verbal": 37,
   "techSpatial": 17,
   "abstract": 17
  },
  "subjects": [
   "math",
   "informatics"
  ]
 },
 {
  "code": "43-4161.00",
  "slug": "human-resources-assistants-except-payroll-and-timekeeping",
  "nameEn": "Human Resources Assistants, Except Payroll and Timekeeping",
  "nameMn": "Хүний нөөцийн туслах (цалин, цагийн бүртгэлээс бусад)",
  "descriptionMn": "Хүний нөөцийн бүртгэл хөтөлнө. Ажилтан бүрийн хаяг, долоо хоногийн орлого, тасалсан, борлуулалтын эсвэл үйлдвэрлэлийн хэмжээ, удирдлагын тайлан, чөлөөлөгдсөн огноо, шалтгааныг бүртгэнэ.",
  "categorySlug": "business",
  "jobZone": 3,
  "riasec": {
   "R": 7,
   "I": 6,
   "A": 0,
   "S": 37,
   "E": 49,
   "C": 100
  },
  "personality": {
   "O": 19,
   "C": 33,
   "E": 27,
   "A": 52
  },
  "cognitive": {
   "math": 30,
   "verbal": 44,
   "techSpatial": 9,
   "abstract": 19
  },
  "subjects": []
 },
 {
  "code": "43-6011.00",
  "slug": "executive-secretaries-and-executive-administrative-assistants",
  "nameEn": "Executive Secretaries and Executive Administrative Assistants",
  "nameMn": "Гүйцэтгэх захиралын нарийн бичгийн дарга, захиргааны туслах",
  "descriptionMn": "Судалгаа хийх, статистик тайлан бэлтгэх, мэдээллийн хүсэлтийг шийдвэрлэх, захидал бичиг бэлтгэх, зочин хүлээн авах, цахим хурал, уулзалтын хуваарь гаргах зэрэг өндөр түвшний захиргааны дэмжлэг үзүүлнэ.",
  "categorySlug": "business",
  "jobZone": 3,
  "riasec": {
   "R": 5,
   "I": 16,
   "A": 6,
   "S": 49,
   "E": 75,
   "C": 90
  },
  "personality": {
   "O": 36,
   "C": 62,
   "E": 51,
   "A": 48
  },
  "cognitive": {
   "math": 42,
   "verbal": 45,
   "techSpatial": 19,
   "abstract": 23
  },
  "subjects": [
   "informatics"
  ]
 },
 {
  "code": "43-6012.00",
  "slug": "legal-secretaries-and-administrative-assistants",
  "nameEn": "Legal Secretaries and Administrative Assistants",
  "nameMn": "Хуулийн нарийн бичгийн дарга, захиргааны туслах",
  "descriptionMn": "Хууль зүйн нэр томьёо, журам, баримт бичгийг ашиглан нарийн бичгийн даргын ажил гүйцэтгэнэ.",
  "categorySlug": "business",
  "jobZone": 3,
  "riasec": {
   "R": 7,
   "I": 32,
   "A": 9,
   "S": 36,
   "E": 57,
   "C": 95
  },
  "personality": {
   "O": 18,
   "C": 59,
   "E": 24,
   "A": 43
  },
  "cognitive": {
   "math": 30,
   "verbal": 45,
   "techSpatial": 18,
   "abstract": 18
  },
  "subjects": [
   "informatics",
   "social"
  ]
 },
 {
  "code": "43-9031.00",
  "slug": "desktop-publishers",
  "nameEn": "Desktop Publishers",
  "nameMn": "Хэвлэлийн хуудас бүрдүүлэгч",
  "descriptionMn": "Хэвлэхэд бэлэн материал гаргахын тулд бичвэр, график элементийг компьютерийн програмаар хэлбэржүүлнэ.",
  "categorySlug": "business",
  "jobZone": 3,
  "riasec": {
   "R": 40,
   "I": 31,
   "A": 54,
   "S": 12,
   "E": 12,
   "C": 78
  },
  "personality": {
   "O": 33,
   "C": 36,
   "E": 5,
   "A": 8
  },
  "cognitive": {
   "math": 29,
   "verbal": 42,
   "techSpatial": 41,
   "abstract": 33
  },
  "subjects": [
   "informatics"
  ]
 },
 {
  "code": "43-9081.00",
  "slug": "proofreaders-and-copy-markers",
  "nameEn": "Proofreaders and Copy Markers",
  "nameMn": "Корректор",
  "descriptionMn": "Хэлзүйн, бичгийн болон найруулгын алдааг илрүүлж засахаар тэмдэглэхийн тулд хэвлэлийн эх, гарын үсгийг уншина.",
  "categorySlug": "business",
  "jobZone": 4,
  "riasec": {
   "R": 7,
   "I": 25,
   "A": 43,
   "S": 20,
   "E": 9,
   "C": 86
  },
  "personality": {
   "O": 7,
   "C": 59,
   "E": 5,
   "A": 18
  },
  "cognitive": {
   "math": 5,
   "verbal": 45,
   "techSpatial": 6,
   "abstract": 7
  },
  "subjects": []
 },
 {
  "code": "43-9111.00",
  "slug": "statistical-assistants",
  "nameEn": "Statistical Assistants",
  "nameMn": "Статистикийн туслах",
  "descriptionMn": "Статистик судалгаанд ашиглах өгөгдлийг статистик томьёоны дагуу цуглуулж тооцоолно.",
  "categorySlug": "business",
  "jobZone": 4,
  "riasec": {
   "R": 23,
   "I": 58,
   "A": 0,
   "S": 7,
   "E": 12,
   "C": 100
  },
  "personality": {
   "O": 25,
   "C": 52,
   "E": 6,
   "A": 12
  },
  "cognitive": {
   "math": 82,
   "verbal": 45,
   "techSpatial": 25,
   "abstract": 38
  },
  "subjects": [
   "math",
   "informatics"
  ]
 },
 {
  "code": "45-1011.00",
  "slug": "first-line-supervisors-of-farming-fishing-and-forestry-workers",
  "nameEn": "First-Line Supervisors of Farming, Fishing, and Forestry Workers",
  "nameMn": "Хөдөө аж ахуй, загас, ойн ажлын ахлах ажилтан",
  "descriptionMn": "Хөдөө аж ахуй, ой, загасны аж ахуй болон холбогдох ажилчдын үйл ажиллагааг шууд удирдаж зохицуулна.",
  "categorySlug": "agri-env",
  "jobZone": 3,
  "riasec": {
   "R": 76,
   "I": 21,
   "A": 0,
   "S": 32,
   "E": 84,
   "C": 61
  },
  "personality": {
   "O": 31,
   "C": 56,
   "E": 67,
   "A": 41
  },
  "cognitive": {
   "math": 42,
   "verbal": 29,
   "techSpatial": 62,
   "abstract": 34
  },
  "subjects": []
 },
 {
  "code": "47-1011.00",
  "slug": "first-line-supervisors-of-construction-trades-and-extraction-workers",
  "nameEn": "First-Line Supervisors of Construction Trades and Extraction Workers",
  "nameMn": "Барилга, олборлолтын ажлын ахлах ажилтан",
  "descriptionMn": "Барилга болон олборлолтын ажилчдын үйл ажиллагааг шууд удирдаж зохицуулна.",
  "categorySlug": "engineering",
  "jobZone": 3,
  "riasec": {
   "R": 61,
   "I": 15,
   "A": 0,
   "S": 32,
   "E": 83,
   "C": 66
  },
  "personality": {
   "O": 45,
   "C": 68,
   "E": 78,
   "A": 46
  },
  "cognitive": {
   "math": 49,
   "verbal": 37,
   "techSpatial": 61,
   "abstract": 29
  },
  "subjects": [
   "math",
   "technology"
  ]
 },
 {
  "code": "47-2111.00",
  "slug": "electricians",
  "nameEn": "Electricians",
  "nameMn": "Цахилгаанчин",
  "descriptionMn": "Цахилгаан утас, тоног төхөөрөмж, холбох хэрэгслийг суурилуулж, засвар үйлчилгээ хийж, засна.",
  "categorySlug": "engineering",
  "jobZone": 3,
  "riasec": {
   "R": 100,
   "I": 28,
   "A": 4,
   "S": 5,
   "E": 14,
   "C": 52
  },
  "personality": {
   "O": 35,
   "C": 61,
   "E": 35,
   "A": 21
  },
  "cognitive": {
   "math": 48,
   "verbal": 29,
   "techSpatial": 56,
   "abstract": 44
  },
  "subjects": [
   "math"
  ]
 },
 {
  "code": "47-2152.00",
  "slug": "plumbers-pipefitters-and-steamfitters",
  "nameEn": "Plumbers, Pipefitters, and Steamfitters",
  "nameMn": "Сантехникч, хоолой шугамчин",
  "descriptionMn": "Ус, уур, агаар болон бусад шингэн, хий дамжуулах хоолой шугам, хоолойн системийг угсарч, суурилуулж, өөрчилж, засна.",
  "categorySlug": "engineering",
  "jobZone": 3,
  "riasec": {
   "R": 100,
   "I": 20,
   "A": 0,
   "S": 3,
   "E": 0,
   "C": 45
  },
  "personality": {
   "O": 25,
   "C": 51,
   "E": 26,
   "A": 19
  },
  "cognitive": {
   "math": 35,
   "verbal": 12,
   "techSpatial": 67,
   "abstract": 25
  },
  "subjects": [
   "physics",
   "technology",
   "math"
  ]
 },
 {
  "code": "47-4011.00",
  "slug": "construction-and-building-inspectors",
  "nameEn": "Construction and Building Inspectors",
  "nameMn": "Барилгын байцаагч",
  "descriptionMn": "Барилга байгууламжийн бат бэх, техникийн шаардлага, барилгын норм, бусад дүрэм журамд нийцэж буйг инженерийн ур чадвараар шалгана.",
  "categorySlug": "engineering",
  "jobZone": 3,
  "riasec": {
   "R": 86,
   "I": 52,
   "A": 4,
   "S": 8,
   "E": 19,
   "C": 74
  },
  "personality": {
   "O": 30,
   "C": 70,
   "E": 53,
   "A": 32
  },
  "cognitive": {
   "math": 46,
   "verbal": 45,
   "techSpatial": 71,
   "abstract": 44
  },
  "subjects": [
   "math",
   "informatics",
   "social"
  ]
 },
 {
  "code": "47-4021.00",
  "slug": "elevator-and-escalator-installers-and-repairers",
  "nameEn": "Elevator and Escalator Installers and Repairers",
  "nameMn": "Цахилгаан шат, эскалаторын суурилуулагч, засварчин",
  "descriptionMn": "Цахилгаан болон гидравлик ачааны, зорчигчийн цахилгаан шат, эскалатор, жижиг шатыг угсарч, суурилуулж, засаж, засвар үйлчилгээ хийнэ.",
  "categorySlug": "engineering",
  "jobZone": 3,
  "riasec": {
   "R": 100,
   "I": 24,
   "A": 0,
   "S": 6,
   "E": 4,
   "C": 49
  },
  "personality": {
   "O": 29,
   "C": 64,
   "E": 21,
   "A": 19
  },
  "cognitive": {
   "math": 34,
   "verbal": 21,
   "techSpatial": 79,
   "abstract": 22
  },
  "subjects": [
   "math",
   "technology",
   "physics"
  ]
 },
 {
  "code": "49-1011.00",
  "slug": "first-line-supervisors-of-mechanics-installers-and-repairers",
  "nameEn": "First-Line Supervisors of Mechanics, Installers, and Repairers",
  "nameMn": "Механик, суурилуулагч, засварчдын ахлах ажилтан",
  "descriptionMn": "Механик, суурилуулагч, засварчдын үйл ажиллагааг шууд удирдаж зохицуулна.",
  "categorySlug": "engineering",
  "jobZone": 3,
  "riasec": {
   "R": 52,
   "I": 12,
   "A": 0,
   "S": 43,
   "E": 83,
   "C": 63
  },
  "personality": {
   "O": 46,
   "C": 65,
   "E": 71,
   "A": 48
  },
  "cognitive": {
   "math": 48,
   "verbal": 45,
   "techSpatial": 74,
   "abstract": 47
  },
  "subjects": [
   "informatics",
   "math"
  ]
 },
 {
  "code": "49-2021.00",
  "slug": "radio-cellular-and-tower-equipment-installers-and-repairers",
  "nameEn": "Radio, Cellular, and Tower Equipment Installers and Repairers",
  "nameMn": "Радио, үүрэн холбоо, цамхгийн тоног төхөөрөмжийн суурилуулагч, засварчин",
  "descriptionMn": "Үүрэн холбоо, хөдөлгөөнт өргөн зурвас, хөлөг онгоц, нисэх онгоц, яаралтай тусламжийн машины радио зэрэг радио дамжуулах, хүлээн авах тоног төхөөрөмжийг суурилуулж, засна.",
  "categorySlug": "engineering",
  "jobZone": 3,
  "riasec": {
   "R": 96,
   "I": 41,
   "A": 1,
   "S": 6,
   "E": 6,
   "C": 59
  },
  "personality": {
   "O": 33,
   "C": 58,
   "E": 18,
   "A": 13
  },
  "cognitive": {
   "math": 36,
   "verbal": 29,
   "techSpatial": 78,
   "abstract": 23
  },
  "subjects": [
   "informatics",
   "technology",
   "math"
  ]
 },
 {
  "code": "49-2022.00",
  "slug": "telecommunications-equipment-installers-and-repairers-except-line-installers",
  "nameEn": "Telecommunications Equipment Installers and Repairers, Except Line Installers",
  "nameMn": "Харилцаа холбооны тоног төхөөрөмжийн суурилуулагч, засварчин",
  "descriptionMn": "Төв оффис, станц дахь шилжүүлэх, түгээх, чиглүүлэх, залгах тоног төхөөрөмжийг суурилуулж, тохируулж, байршлыг нь солих эсвэл салгана.",
  "categorySlug": "engineering",
  "jobZone": 3,
  "riasec": {
   "R": 90,
   "I": 24,
   "A": 0,
   "S": 14,
   "E": 10,
   "C": 64
  },
  "personality": {
   "O": 42,
   "C": 59,
   "E": 32,
   "A": 35
  },
  "cognitive": {
   "math": 32,
   "verbal": 29,
   "techSpatial": 87,
   "abstract": 31
  },
  "subjects": [
   "informatics",
   "technology"
  ]
 },
 {
  "code": "49-2091.00",
  "slug": "avionics-technicians",
  "nameEn": "Avionics Technicians",
  "nameMn": "Нисэхийн электроникийн техникч",
  "descriptionMn": "Нисэх онгоц, сансрын хөлгийн радар, радио, навигаци, пуужингийн удирдлага зэрэг электрон тоног төхөөрөмжийг суурилуулж, шалгаж, тохируулж, засна.",
  "categorySlug": "engineering",
  "jobZone": 3,
  "riasec": {
   "R": 100,
   "I": 55,
   "A": 3,
   "S": 6,
   "E": 1,
   "C": 57
  },
  "personality": {
   "O": 49,
   "C": 77,
   "E": 20,
   "A": 19
  },
  "cognitive": {
   "math": 32,
   "verbal": 45,
   "techSpatial": 91,
   "abstract": 38
  },
  "subjects": [
   "informatics",
   "technology",
   "math"
  ]
 },
 {
  "code": "49-2092.00",
  "slug": "electric-motor-power-tool-and-related-repairers",
  "nameEn": "Electric Motor, Power Tool, and Related Repairers",
  "nameMn": "Цахилгаан хөдөлгүүр, цахилгаан багажийн засварчин",
  "descriptionMn": "Цахилгаан хөдөлгүүр, утас, шилжүүлэгчийг засаж, засвар үйлчилгээ хийж, суурилуулна.",
  "categorySlug": "engineering",
  "jobZone": 3,
  "riasec": {
   "R": 100,
   "I": 29,
   "A": 0,
   "S": 3,
   "E": 0,
   "C": 54
  },
  "personality": {
   "O": 28,
   "C": 40,
   "E": 13,
   "A": 14
  },
  "cognitive": {
   "math": 31,
   "verbal": 20,
   "techSpatial": 64,
   "abstract": 28
  },
  "subjects": []
 },
 {
  "code": "49-2093.00",
  "slug": "electrical-and-electronics-installers-and-repairers-transportation-equipment",
  "nameEn": "Electrical and Electronics Installers and Repairers, Transportation Equipment",
  "nameMn": "Тээврийн хэрэгслийн цахилгаан, электроникийн суурилуулагч, засварчин",
  "descriptionMn": "Галт тэрэг, усан тээвэр зэрэг хөдөлгөөнт тоног төхөөрөмж дэх дуу, сонар, хамгаалалт, навигаци, ажиглалтын системийг суурилуулж, тохируулж, засвар үйлчилгээ хийнэ.",
  "categorySlug": "engineering",
  "jobZone": 3,
  "riasec": {
   "R": 100,
   "I": 40,
   "A": 0,
   "S": 2,
   "E": 0,
   "C": 64
  },
  "personality": {
   "O": 36,
   "C": 60,
   "E": 16,
   "A": 16
  },
  "cognitive": {
   "math": 31,
   "verbal": 22,
   "techSpatial": 74,
   "abstract": 20
  },
  "subjects": [
   "informatics",
   "technology",
   "math"
  ]
 },
 {
  "code": "49-2094.00",
  "slug": "electrical-and-electronics-repairers-commercial-and-industrial-equipment",
  "nameEn": "Electrical and Electronics Repairers, Commercial and Industrial Equipment",
  "nameMn": "Худалдаа, үйлдвэрийн цахилгаан, электроникийн засварчин",
  "descriptionMn": "Үйлдвэрийн удирдлага, дамжуулагч, антен зэрэг электрон тоног төхөөрөмжийг засаж, шалгаж, тохируулж, суурилуулна.",
  "categorySlug": "engineering",
  "jobZone": 3,
  "riasec": {
   "R": 100,
   "I": 47,
   "A": 0,
   "S": 0,
   "E": 7,
   "C": 71
  },
  "personality": {
   "O": 54,
   "C": 68,
   "E": 21,
   "A": 19
  },
  "cognitive": {
   "math": 46,
   "verbal": 33,
   "techSpatial": 87,
   "abstract": 45
  },
  "subjects": [
   "informatics",
   "technology",
   "math"
  ]
 },
 {
  "code": "49-2095.00",
  "slug": "electrical-and-electronics-repairers-powerhouse-substation-and-relay",
  "nameEn": "Electrical and Electronics Repairers, Powerhouse, Substation, and Relay",
  "nameMn": "Цахилгаан станц, дэд станцын цахилгаан, электроникийн засварчин",
  "descriptionMn": "Цахилгаан үүсгүүрийн станц, дэд станц, ажиллаж буй реле дэх цахилгаан тоног төхөөрөмжийг шалгаж, туршиж, засаж, засвар үйлчилгээ хийнэ.",
  "categorySlug": "engineering",
  "jobZone": 3,
  "riasec": {
   "R": 100,
   "I": 42,
   "A": 0,
   "S": 1,
   "E": 5,
   "C": 71
  },
  "personality": {
   "O": 47,
   "C": 64,
   "E": 18,
   "A": 16
  },
  "cognitive": {
   "math": 45,
   "verbal": 33,
   "techSpatial": 78,
   "abstract": 19
  },
  "subjects": [
   "math",
   "technology",
   "physics"
  ]
 },
 {
  "code": "49-2096.00",
  "slug": "electronic-equipment-installers-and-repairers-motor-vehicles",
  "nameEn": "Electronic Equipment Installers and Repairers, Motor Vehicles",
  "nameMn": "Автомашины электрон тоног төхөөрөмжийн суурилуулагч, засварчин",
  "descriptionMn": "Автомашин дахь холбоо, дуу, хамгаалалт, навигацийн тоног төхөөрөмжийг суурилуулж, оношилж, засна.",
  "categorySlug": "engineering",
  "jobZone": 3,
  "riasec": {
   "R": 100,
   "I": 41,
   "A": 0,
   "S": 5,
   "E": 0,
   "C": 56
  },
  "personality": {
   "O": 37,
   "C": 44,
   "E": 22,
   "A": 20
  },
  "cognitive": {
   "math": 35,
   "verbal": 21,
   "techSpatial": 82,
   "abstract": 25
  },
  "subjects": [
   "informatics",
   "math",
   "technology"
  ]
 },
 {
  "code": "49-2097.00",
  "slug": "audiovisual-equipment-installers-and-repairers",
  "nameEn": "Audiovisual Equipment Installers and Repairers",
  "nameMn": "Дуу дүрсний тоног төхөөрөмжийн суурилуулагч, засварчин",
  "descriptionMn": "Гэр болон бусад газар дуу, телевиз хүлээн авагч, стерео систем, видео камер, видео систем зэрэг электрон зугаа цэнгэлийн тоног төхөөрөмжийг суурилуулж, засаж, тохируулна.",
  "categorySlug": "engineering",
  "jobZone": 3,
  "riasec": {
   "R": 98,
   "I": 27,
   "A": 11,
   "S": 11,
   "E": 2,
   "C": 60
  },
  "personality": {
   "O": 34,
   "C": 38,
   "E": 27,
   "A": 29
  },
  "cognitive": {
   "math": 32,
   "verbal": 21,
   "techSpatial": 77,
   "abstract": 19
  },
  "subjects": [
   "informatics"
  ]
 },
 {
  "code": "49-2098.00",
  "slug": "security-and-fire-alarm-systems-installers",
  "nameEn": "Security and Fire Alarm Systems Installers",
  "nameMn": "Хамгаалалт, галын дохиоллын систем суурилуулагч",
  "descriptionMn": "Хамгаалалт, галын дохиоллын утас, тоног төхөөрөмжийг суурилуулж, програмчилж, засвар үйлчилгээ хийж, засна.",
  "categorySlug": "engineering",
  "jobZone": 3,
  "riasec": {
   "R": 95,
   "I": 39,
   "A": 0,
   "S": 6,
   "E": 10,
   "C": 66
  },
  "personality": {
   "O": 31,
   "C": 59,
   "E": 30,
   "A": 25
  },
  "cognitive": {
   "math": 29,
   "verbal": 25,
   "techSpatial": 71,
   "abstract": 20
  },
  "subjects": [
   "informatics"
  ]
 },
 {
  "code": "49-3011.00",
  "slug": "aircraft-mechanics-and-service-technicians",
  "nameEn": "Aircraft Mechanics and Service Technicians",
  "nameMn": "Нисэх онгоцны механик, засвар үйлчилгээний техникч",
  "descriptionMn": "Нисэх онгоцны хөдөлгүүр, гидравлик, пневматик систем зэрэг угсралтыг оношилж, тохируулж, засаж, их засвар хийнэ.",
  "categorySlug": "engineering",
  "jobZone": 3,
  "riasec": {
   "R": 95,
   "I": 47,
   "A": 0,
   "S": 5,
   "E": 14,
   "C": 62
  },
  "personality": {
   "O": 38,
   "C": 77,
   "E": 22,
   "A": 24
  },
  "cognitive": {
   "math": 42,
   "verbal": 41,
   "techSpatial": 93,
   "abstract": 49
  },
  "subjects": [
   "technology",
   "chemistry"
  ]
 },
 {
  "code": "49-3023.00",
  "slug": "automotive-service-technicians-and-mechanics",
  "nameEn": "Automotive Service Technicians and Mechanics",
  "nameMn": "Авто засварчин, автомашины механик",
  "descriptionMn": "Автомашиныг оношилж, тохируулж, засаж, их засвар хийнэ.",
  "categorySlug": "engineering",
  "jobZone": 3,
  "riasec": {
   "R": 100,
   "I": 43,
   "A": 0,
   "S": 8,
   "E": 10,
   "C": 55
  },
  "personality": {
   "O": 46,
   "C": 56,
   "E": 16,
   "A": 23
  },
  "cognitive": {
   "math": 29,
   "verbal": 23,
   "techSpatial": 86,
   "abstract": 36
  },
  "subjects": [
   "informatics",
   "math"
  ]
 },
 {
  "code": "49-3031.00",
  "slug": "bus-and-truck-mechanics-and-diesel-engine-specialists",
  "nameEn": "Bus and Truck Mechanics and Diesel Engine Specialists",
  "nameMn": "Автобус, ачааны машины механик, дизель хөдөлгүүрийн мэргэжилтэн",
  "descriptionMn": "Автобус, ачааны машиныг оношилж, тохируулж, засаж, их засвар хийх, эсвэл дизель хөдөлгүүрийн засвар үйлчилгээ хийнэ.",
  "categorySlug": "engineering",
  "jobZone": 3,
  "riasec": {
   "R": 100,
   "I": 38,
   "A": 0,
   "S": 9,
   "E": 5,
   "C": 46
  },
  "personality": {
   "O": 38,
   "C": 53,
   "E": 16,
   "A": 16
  },
  "cognitive": {
   "math": 28,
   "verbal": 19,
   "techSpatial": 86,
   "abstract": 28
  },
  "subjects": [
   "informatics"
  ]
 },
 {
  "code": "49-3041.00",
  "slug": "farm-equipment-mechanics-and-service-technicians",
  "nameEn": "Farm Equipment Mechanics and Service Technicians",
  "nameMn": "Хөдөө аж ахуйн техникийн механик, засвар үйлчилгээний техникч",
  "descriptionMn": "Трактор, хураагч, саалийн төхөөрөмж, услалтын систем зэрэг хөдөө аж ахуйн машин, тээврийн хэрэгслийг оношилж, тохируулж, засаж, их засвар хийнэ.",
  "categorySlug": "engineering",
  "jobZone": 3,
  "riasec": {
   "R": 100,
   "I": 34,
   "A": 0,
   "S": 5,
   "E": 1,
   "C": 55
  },
  "personality": {
   "O": 41,
   "C": 54,
   "E": 21,
   "A": 20
  },
  "cognitive": {
   "math": 40,
   "verbal": 18,
   "techSpatial": 99,
   "abstract": 28
  },
  "subjects": [
   "informatics",
   "physics",
   "technology"
  ]
 },
 {
  "code": "49-3042.00",
  "slug": "mobile-heavy-equipment-mechanics-except-engines",
  "nameEn": "Mobile Heavy Equipment Mechanics, Except Engines",
  "nameMn": "Хөдөлгөөнт хүнд техникийн механик (хөдөлгүүрээс бусад)",
  "descriptionMn": "Барилга, мод бэлтгэл, уул уурхайд хэрэглэдэг кран, бульдозер, грейдер, конвейер зэрэг хөдөлгөөнт механик, гидравлик, пневматик тоног төхөөрөмжийг оношилж, засаж, их засвар хийнэ.",
  "categorySlug": "engineering",
  "jobZone": 3,
  "riasec": {
   "R": 100,
   "I": 42,
   "A": 0,
   "S": 0,
   "E": 0,
   "C": 56
  },
  "personality": {
   "O": 42,
   "C": 61,
   "E": 21,
   "A": 15
  },
  "cognitive": {
   "math": 35,
   "verbal": 27,
   "techSpatial": 91,
   "abstract": 35
  },
  "subjects": []
 },
 {
  "code": "49-3051.00",
  "slug": "motorboat-mechanics-and-service-technicians",
  "nameEn": "Motorboat Mechanics and Service Technicians",
  "nameMn": "Моторт завины механик, засвар үйлчилгээний техникч",
  "descriptionMn": "Завины дотоод болон дотоод-гадна хөдөлгүүрийн цахилгаан болон механик тоног төхөөрөмжийг засаж тохируулна.",
  "categorySlug": "engineering",
  "jobZone": 3,
  "riasec": {
   "R": 100,
   "I": 31,
   "A": 0,
   "S": 0,
   "E": 10,
   "C": 48
  },
  "personality": {
   "O": 29,
   "C": 47,
   "E": 15,
   "A": 12
  },
  "cognitive": {
   "math": 29,
   "verbal": 16,
   "techSpatial": 84,
   "abstract": 26
  },
  "subjects": [
   "informatics",
   "technology"
  ]
 },
 {
  "code": "49-3052.00",
  "slug": "motorcycle-mechanics",
  "nameEn": "Motorcycle Mechanics",
  "nameMn": "Мотоциклийн механик",
  "descriptionMn": "Мотоцикл, скутер, мопед, кросс мотоцикл зэрэг хөдөлгүүртэй тээврийн хэрэгслийг оношилж, тохируулж, засаж, их засвар хийнэ.",
  "categorySlug": "engineering",
  "jobZone": 3,
  "riasec": {
   "R": 100,
   "I": 35,
   "A": 4,
   "S": 7,
   "E": 0,
   "C": 44
  },
  "personality": {
   "O": 36,
   "C": 46,
   "E": 18,
   "A": 18
  },
  "cognitive": {
   "math": 29,
   "verbal": 21,
   "techSpatial": 90,
   "abstract": 22
  },
  "subjects": [
   "informatics"
  ]
 },
 {
  "code": "49-9012.00",
  "slug": "control-and-valve-installers-and-repairers-except-mechanical-door",
  "nameEn": "Control and Valve Installers and Repairers, Except Mechanical Door",
  "nameMn": "Удирдлага, хяналтын хавхлагын суурилуулагч, засварчин",
  "descriptionMn": "Цахилгаан тоолуур, хийн зохицуулагч, дулаан зохицуулагч, аюулгүйн болон урсгалын хавхлага зэрэг механик зохицуулах, удирдах төхөөрөмжийг суурилуулж, засна.",
  "categorySlug": "engineering",
  "jobZone": 3,
  "riasec": {
   "R": 100,
   "I": 31,
   "A": 0,
   "S": 3,
   "E": 0,
   "C": 59
  },
  "personality": {
   "O": 21,
   "C": 43,
   "E": 8,
   "A": 13
  },
  "cognitive": {
   "math": 31,
   "verbal": 22,
   "techSpatial": 76,
   "abstract": 25
  },
  "subjects": [
   "technology",
   "informatics",
   "math"
  ]
 },
 {
  "code": "49-9021.00",
  "slug": "heating-air-conditioning-and-refrigeration-mechanics-and-installers",
  "nameEn": "Heating, Air Conditioning, and Refrigeration Mechanics and Installers",
  "nameMn": "Халаалт, агааржуулалт, хөргөлтийн механик, суурилуулагч",
  "descriptionMn": "Халаалт, төвийн агааржуулалт, хөргөлтийн систем, шатдаг түлшний ба халуун агаарын зуух зэргийг суурилуулж эсвэл засна.",
  "categorySlug": "engineering",
  "jobZone": 3,
  "riasec": {
   "R": 99,
   "I": 30,
   "A": 1,
   "S": 8,
   "E": 3,
   "C": 55
  },
  "personality": {
   "O": 29,
   "C": 58,
   "E": 29,
   "A": 25
  },
  "cognitive": {
   "math": 40,
   "verbal": 22,
   "techSpatial": 84,
   "abstract": 36
  },
  "subjects": [
   "math",
   "technology",
   "informatics"
  ]
 },
 {
  "code": "49-9041.00",
  "slug": "industrial-machinery-mechanics",
  "nameEn": "Industrial Machinery Mechanics",
  "nameMn": "Үйлдвэрийн машин механизмын механик",
  "descriptionMn": "Үйлдвэрлэл, боловсруулалтын машин механизм, нефть боловсруулах үйлдвэр, хоолой шугамын түгээлтийн системийг засаж, суурилуулж, тохируулж, засвар үйлчилгээ хийнэ.",
  "categorySlug": "engineering",
  "jobZone": 3,
  "riasec": {
   "R": 100,
   "I": 34,
   "A": 0,
   "S": 0,
   "E": 3,
   "C": 56
  },
  "personality": {
   "O": 37,
   "C": 60,
   "E": 20,
   "A": 17
  },
  "cognitive": {
   "math": 34,
   "verbal": 17,
   "techSpatial": 76,
   "abstract": 23
  },
  "subjects": [
   "technology"
  ]
 },
 {
  "code": "49-9043.00",
  "slug": "maintenance-workers-machinery",
  "nameEn": "Maintenance Workers, Machinery",
  "nameMn": "Машин механизмын засвар үйлчилгээний ажилтан",
  "descriptionMn": "Машин механизмыг тосолж, сэлбэг солих эсвэл бусад тогтмол засвар үйлчилгээ хийнэ.",
  "categorySlug": "engineering",
  "jobZone": 3,
  "riasec": {
   "R": 100,
   "I": 17,
   "A": 0,
   "S": 0,
   "E": 3,
   "C": 54
  },
  "personality": {
   "O": 18,
   "C": 39,
   "E": 11,
   "A": 15
  },
  "cognitive": {
   "math": 29,
   "verbal": 14,
   "techSpatial": 71,
   "abstract": 18
  },
  "subjects": []
 },
 {
  "code": "49-9061.00",
  "slug": "camera-and-photographic-equipment-repairers",
  "nameEn": "Camera and Photographic Equipment Repairers",
  "nameMn": "Камер, гэрэл зургийн тоног төхөөрөмжийн засварчин",
  "descriptionMn": "Камер, гэрэл зургийн тоног төхөөрөмж, мөн худалдааны видео болон кино камерын тоног төхөөрөмжийг засаж тохируулна.",
  "categorySlug": "engineering",
  "jobZone": 3,
  "riasec": {
   "R": 99,
   "I": 28,
   "A": 16,
   "S": 3,
   "E": 0,
   "C": 64
  },
  "personality": {
   "O": 39,
   "C": 54,
   "E": 10,
   "A": 8
  },
  "cognitive": {
   "math": 37,
   "verbal": 18,
   "techSpatial": 66,
   "abstract": 25
  },
  "subjects": [
   "informatics"
  ]
 },
 {
  "code": "49-9062.00",
  "slug": "medical-equipment-repairers",
  "nameEn": "Medical Equipment Repairers",
  "nameMn": "Эмнэлгийн тоног төхөөрөмжийн засварчин",
  "descriptionMn": "Биоанагаах болон цахилгаан анагаах тоног төхөөрөмжийг шалгаж, тохируулж, засна.",
  "categorySlug": "engineering",
  "jobZone": 3,
  "riasec": {
   "R": 100,
   "I": 60,
   "A": 0,
   "S": 16,
   "E": 0,
   "C": 63
  },
  "personality": {
   "O": 60,
   "C": 73,
   "E": 27,
   "A": 33
  },
  "cognitive": {
   "math": 45,
   "verbal": 34,
   "techSpatial": 80,
   "abstract": 28
  },
  "subjects": [
   "informatics"
  ]
 },
 {
  "code": "49-9063.00",
  "slug": "musical-instrument-repairers-and-tuners",
  "nameEn": "Musical Instrument Repairers and Tuners",
  "nameMn": "Хөгжмийн зэмсэг засварчин, тааруулагч",
  "descriptionMn": "Цохилтот, чавхдаст, сэнсэрт болон үлээвэр хөгжмийн зэмсгийг засна. Төгөлдөр хуур тааруулах зэрэг нэг чиглэлээр мэргэжиж болно.",
  "categorySlug": "engineering",
  "jobZone": 3,
  "riasec": {
   "R": 90,
   "I": 27,
   "A": 41,
   "S": 10,
   "E": 0,
   "C": 42
  },
  "personality": {
   "O": 43,
   "C": 50,
   "E": 14,
   "A": 18
  },
  "cognitive": {
   "math": 26,
   "verbal": 15,
   "techSpatial": 65,
   "abstract": 23
  },
  "subjects": [
   "art"
  ]
 },
 {
  "code": "49-9064.00",
  "slug": "watch-and-clock-repairers",
  "nameEn": "Watch and Clock Repairers",
  "nameMn": "Цаг засварчин",
  "descriptionMn": "Бугуйн болон ханын цаг зэрэг цаг хэмжих хэрэгслийн механизмыг засаж, цэвэрлэж, тохируулна.",
  "categorySlug": "engineering",
  "jobZone": 3,
  "riasec": {
   "R": 92,
   "I": 16,
   "A": 6,
   "S": 7,
   "E": 2,
   "C": 57
  },
  "personality": {
   "O": 25,
   "C": 56,
   "E": 7,
   "A": 13
  },
  "cognitive": {
   "math": 28,
   "verbal": 11,
   "techSpatial": 55,
   "abstract": 19
  },
  "subjects": []
 },
 {
  "code": "49-9071.00",
  "slug": "maintenance-and-repair-workers-general",
  "nameEn": "Maintenance and Repair Workers, General",
  "nameMn": "Засвар үйлчилгээний ерөнхий ажилтан",
  "descriptionMn": "Машин, механик тоног төхөөрөмж, барилгын бүтцийг засвартай байлгахын тулд хоёроос олон засвар, гар урлалын мэргэжлийн ур чадвар шаардсан ажил гүйцэтгэнэ.",
  "categorySlug": "engineering",
  "jobZone": 3,
  "riasec": {
   "R": 100,
   "I": 25,
   "A": 3,
   "S": 13,
   "E": 9,
   "C": 53
  },
  "personality": {
   "O": 47,
   "C": 53,
   "E": 28,
   "A": 20
  },
  "cognitive": {
   "math": 34,
   "verbal": 23,
   "techSpatial": 62,
   "abstract": 25
  },
  "subjects": []
 },
 {
  "code": "49-9081.00",
  "slug": "wind-turbine-service-technicians",
  "nameEn": "Wind Turbine Service Technicians",
  "nameMn": "Салхин турбины засвар үйлчилгээний техникч",
  "descriptionMn": "Салхин турбиныг шалгаж, оношилж, тохируулж, засна. Цахилгаан, механик, гидравликийн эвдрэлийг арилгах зэрэг салхин турбины тоног төхөөрөмжийн засвар үйлчилгээ хийнэ.",
  "categorySlug": "engineering",
  "jobZone": 3,
  "riasec": {
   "R": 100,
   "I": 43,
   "A": 0,
   "S": 10,
   "E": 13,
   "C": 55
  },
  "personality": {
   "O": 55,
   "C": 72,
   "E": 30,
   "A": 20
  },
  "cognitive": {
   "math": 34,
   "verbal": 28,
   "techSpatial": 95,
   "abstract": 32
  },
  "subjects": [
   "informatics",
   "technology",
   "math"
  ]
 },
 {
  "code": "49-9092.00",
  "slug": "commercial-divers",
  "nameEn": "Commercial Divers",
  "nameMn": "Худалдааны усанд шумбагч",
  "descriptionMn": "Гадаргаас агаар өгөх эсвэл акваланг хэрэглэн усны гүнд тоног төхөөрөмж, байгууламжийг шалгаж, засаж, салгаж эсвэл суурилуулна.",
  "categorySlug": "engineering",
  "jobZone": 3,
  "riasec": {
   "R": 100,
   "I": 43,
   "A": 6,
   "S": 2,
   "E": 11,
   "C": 35
  },
  "personality": {
   "O": 47,
   "C": 85,
   "E": 42,
   "A": 27
  },
  "cognitive": {
   "math": 30,
   "verbal": 32,
   "techSpatial": 84,
   "abstract": 38
  },
  "subjects": [
   "technology",
   "physics",
   "math"
  ]
 },
 {
  "code": "49-9097.00",
  "slug": "signal-and-track-switch-repairers",
  "nameEn": "Signal and Track Switch Repairers",
  "nameMn": "Дохио, төмөр замын стрелкийн засварчин",
  "descriptionMn": "Төмөр замын системийн цахилгаан хаалт, дохио, дохионы тоног төхөөрөмж, замын шилжүүлэгч, шугам, дотоод холбооны системийг суурилуулж, шалгаж, засвар үйлчилгээ хийнэ.",
  "categorySlug": "engineering",
  "jobZone": 3,
  "riasec": {
   "R": 92,
   "I": 27,
   "A": 0,
   "S": 3,
   "E": 0,
   "C": 58
  },
  "personality": {
   "O": 23,
   "C": 54,
   "E": 13,
   "A": 12
  },
  "cognitive": {
   "math": 35,
   "verbal": 20,
   "techSpatial": 80,
   "abstract": 32
  },
  "subjects": [
   "technology"
  ]
 },
 {
  "code": "51-1011.00",
  "slug": "first-line-supervisors-of-production-and-operating-workers",
  "nameEn": "First-Line Supervisors of Production and Operating Workers",
  "nameMn": "Үйлдвэрлэл, ашиглалтын ажилтнуудын ахлах ажилтан",
  "descriptionMn": "Үзлэгчид, нарийн ажилчид, машин тохируулагч, оператор, угсрагч, үйлдвэр ба системийн оператор зэрэг үйлдвэрлэл, ашиглалтын ажилтнуудын үйл ажиллагааг шууд удирдаж зохицуулна.",
  "categorySlug": "engineering",
  "jobZone": 3,
  "riasec": {
   "R": 55,
   "I": 10,
   "A": 0,
   "S": 31,
   "E": 88,
   "C": 68
  },
  "personality": {
   "O": 49,
   "C": 69,
   "E": 76,
   "A": 46
  },
  "cognitive": {
   "math": 46,
   "verbal": 40,
   "techSpatial": 56,
   "abstract": 35
  },
  "subjects": [
   "informatics",
   "technology",
   "math"
  ]
 },
 {
  "code": "51-4041.00",
  "slug": "machinists",
  "nameEn": "Machinists",
  "nameMn": "Токарь, машинист (металл боловсруулагч)",
  "descriptionMn": "Металлаар нарийн эд анги, багаж үйлдвэрлэхийн тулд олон төрлийн станокийг тохируулж ажиллуулна.",
  "categorySlug": "engineering",
  "jobZone": 3,
  "riasec": {
   "R": 100,
   "I": 45,
   "A": 16,
   "S": 3,
   "E": 3,
   "C": 57
  },
  "personality": {
   "O": 33,
   "C": 71,
   "E": 14,
   "A": 13
  },
  "cognitive": {
   "math": 46,
   "verbal": 14,
   "techSpatial": 61,
   "abstract": 23
  },
  "subjects": [
   "math"
  ]
 },
 {
  "code": "51-4061.00",
  "slug": "model-makers-metal-and-plastic",
  "nameEn": "Model Makers, Metal and Plastic",
  "nameMn": "Загвар үйлдвэрлэгч (металл, хуванцар)",
  "descriptionMn": "Металл, хуванцар эд зүйлийн ажлын загварыг гаргахын тулд токарийн, фрезерийн, сийлбэрийн зэрэг станокийг тохируулж ажиллуулна.",
  "categorySlug": "engineering",
  "jobZone": 3,
  "riasec": {
   "R": 98,
   "I": 32,
   "A": 28,
   "S": 1,
   "E": 0,
   "C": 51
  },
  "personality": {
   "O": 37,
   "C": 58,
   "E": 15,
   "A": 8
  },
  "cognitive": {
   "math": 36,
   "verbal": 20,
   "techSpatial": 72,
   "abstract": 16
  },
  "subjects": [
   "math",
   "informatics",
   "technology"
  ]
 },
 {
  "code": "51-4062.00",
  "slug": "patternmakers-metal-and-plastic",
  "nameEn": "Patternmakers, Metal and Plastic",
  "nameMn": "Хэв загварчин (металл, хуванцар)",
  "descriptionMn": "Металл, хуванцарын цутгамал, хэвний хайрцаг, хэвний хавтанг тэмдэглэж, боловсруулж, тааруулж, угсарна.",
  "categorySlug": "engineering",
  "jobZone": 3,
  "riasec": {
   "R": 87,
   "I": 12,
   "A": 40,
   "S": 0,
   "E": 0,
   "C": 54
  },
  "personality": {
   "O": 20,
   "C": 44,
   "E": 4,
   "A": 7
  },
  "cognitive": {
   "math": 34,
   "verbal": 15,
   "techSpatial": 65,
   "abstract": 18
  },
  "subjects": [
   "technology",
   "math"
  ]
 },
 {
  "code": "51-4111.00",
  "slug": "tool-and-die-makers",
  "nameEn": "Tool and Die Makers",
  "nameMn": "Багаж, хэвний үйлдвэрлэгч",
  "descriptionMn": "Техникийн шаардлагыг шинжилж, металл түүхий эдийг тэмдэглэж, станок ажиллуулж, эд ангийг тааруулж угсарч, хэв, зүсэх багаж, бэхэлгээ, хэмжүүр, машинистын гарын багажийг хийж засна.",
  "categorySlug": "engineering",
  "jobZone": 3,
  "riasec": {
   "R": 99,
   "I": 33,
   "A": 15,
   "S": 0,
   "E": 0,
   "C": 53
  },
  "personality": {
   "O": 40,
   "C": 74,
   "E": 15,
   "A": 8
  },
  "cognitive": {
   "math": 39,
   "verbal": 28,
   "techSpatial": 70,
   "abstract": 32
  },
  "subjects": [
   "math"
  ]
 },
 {
  "code": "51-5111.00",
  "slug": "prepress-technicians-and-workers",
  "nameEn": "Prepress Technicians and Workers",
  "nameMn": "Хэвлэлийн өмнөх бэлтгэлийн техникч",
  "descriptionMn": "Дизайнер, үйлчлүүлэгчийн өгсөн бичвэр, зургийг хэвлэхэд бэлэн хуудас болгон хэлбэржүүлж, засна.",
  "categorySlug": "engineering",
  "jobZone": 3,
  "riasec": {
   "R": 67,
   "I": 16,
   "A": 35,
   "S": 11,
   "E": 6,
   "C": 79
  },
  "personality": {
   "O": 22,
   "C": 38,
   "E": 0,
   "A": 10
  },
  "cognitive": {
   "math": 26,
   "verbal": 16,
   "techSpatial": 47,
   "abstract": 20
  },
  "subjects": [
   "informatics"
  ]
 },
 {
  "code": "51-6092.00",
  "slug": "fabric-and-apparel-patternmakers",
  "nameEn": "Fabric and Apparel Patternmakers",
  "nameMn": "Даавуу, хувцасны загварчин (хэв загварчин)",
  "descriptionMn": "Даавууны нарийн ерөнхий хэв загвар эсвэл байршлын зургийг зурж бүтээнэ.",
  "categorySlug": "engineering",
  "jobZone": 3,
  "riasec": {
   "R": 78,
   "I": 6,
   "A": 73,
   "S": 5,
   "E": 8,
   "C": 53
  },
  "personality": {
   "O": 38,
   "C": 48,
   "E": 13,
   "A": 12
  },
  "cognitive": {
   "math": 48,
   "verbal": 25,
   "techSpatial": 48,
   "abstract": 38
  },
  "subjects": [
   "math"
  ]
 },
 {
  "code": "51-7031.00",
  "slug": "model-makers-wood",
  "nameEn": "Model Makers, Wood",
  "nameMn": "Загвар үйлдвэрлэгч (мод)",
  "descriptionMn": "Бүтээгдэхүүний бодит болон масштабтай модон нарийн загварыг хийнэ.",
  "categorySlug": "engineering",
  "jobZone": 3,
  "riasec": {
   "R": 100,
   "I": 26,
   "A": 47,
   "S": 6,
   "E": 10,
   "C": 50
  },
  "personality": {
   "O": 38,
   "C": 48,
   "E": 12,
   "A": 8
  },
  "cognitive": {
   "math": 36,
   "verbal": 20,
   "techSpatial": 62,
   "abstract": 19
  },
  "subjects": [
   "technology",
   "math"
  ]
 },
 {
  "code": "51-7032.00",
  "slug": "patternmakers-wood",
  "nameEn": "Patternmakers, Wood",
  "nameMn": "Хэв загварчин (мод)",
  "descriptionMn": "Цутгамалд зориулсан элсэн хэв үүсгэхэд хэрэглэх модон нэгж эсвэл хэсэгчилсэн хэвийг төлөвлөж, тэмдэглэж, бүтээнэ.",
  "categorySlug": "engineering",
  "jobZone": 3,
  "riasec": {
   "R": 93,
   "I": 18,
   "A": 51,
   "S": 5,
   "E": 4,
   "C": 51
  },
  "personality": {
   "O": 27,
   "C": 44,
   "E": 9,
   "A": 5
  },
  "cognitive": {
   "math": 42,
   "verbal": 16,
   "techSpatial": 61,
   "abstract": 20
  },
  "subjects": [
   "technology",
   "math"
  ]
 },
 {
  "code": "51-8011.00",
  "slug": "nuclear-power-reactor-operators",
  "nameEn": "Nuclear Power Reactor Operators",
  "nameMn": "Цөмийн реакторын оператор",
  "descriptionMn": "Цөмийн реакторыг ажиллуулж удирдана. Удирдлагын саваа хөдөлгөх, тоног төхөөрөмж асаах, унтраах, удирдлагыг хянаж тохируулах, өгөгдлийг журналд бүртгэнэ.",
  "categorySlug": "engineering",
  "jobZone": 3,
  "riasec": {
   "R": 73,
   "I": 35,
   "A": 0,
   "S": 18,
   "E": 27,
   "C": 69
  },
  "personality": {
   "O": 31,
   "C": 97,
   "E": 22,
   "A": 35
  },
  "cognitive": {
   "math": 49,
   "verbal": 44,
   "techSpatial": 55,
   "abstract": 42
  },
  "subjects": [
   "physics",
   "math",
   "chemistry"
  ]
 },
 {
  "code": "51-8012.00",
  "slug": "power-distributors-and-dispatchers",
  "nameEn": "Power Distributors and Dispatchers",
  "nameMn": "Цахилгаан түгээгч, диспетчер",
  "descriptionMn": "Цахилгаан, уурыг зохицуулж, зохицуулан түгээнэ.",
  "categorySlug": "engineering",
  "jobZone": 3,
  "riasec": {
   "R": 70,
   "I": 24,
   "A": 0,
   "S": 16,
   "E": 35,
   "C": 69
  },
  "personality": {
   "O": 38,
   "C": 66,
   "E": 51,
   "A": 25
  },
  "cognitive": {
   "math": 46,
   "verbal": 39,
   "techSpatial": 56,
   "abstract": 39
  },
  "subjects": [
   "math",
   "informatics",
   "physics"
  ]
 },
 {
  "code": "51-8021.00",
  "slug": "stationary-engineers-and-boiler-operators",
  "nameEn": "Stationary Engineers and Boiler Operators",
  "nameMn": "Суурин хөдөлгүүр, уурын зуухны оператор",
  "descriptionMn": "Барилга болон үйлдвэрлэлийн үйл явцад хэрэгтэй хангамжийг үүсгэх суурин хөдөлгүүр, уурын зуух болон бусад механик тоног төхөөрөмжийг ажиллуулж, засвар үйлчилгээ хийнэ.",
  "categorySlug": "engineering",
  "jobZone": 3,
  "riasec": {
   "R": 100,
   "I": 36,
   "A": 0,
   "S": 2,
   "E": 4,
   "C": 57
  },
  "personality": {
   "O": 20,
   "C": 58,
   "E": 19,
   "A": 13
  },
  "cognitive": {
   "math": 31,
   "verbal": 25,
   "techSpatial": 67,
   "abstract": 23
  },
  "subjects": [
   "chemistry",
   "physics",
   "technology"
  ]
 },
 {
  "code": "51-9071.00",
  "slug": "jewelers-and-precious-stone-and-metal-workers",
  "nameEn": "Jewelers and Precious Stone and Metal Workers",
  "nameMn": "Үнэт эдлэлийн мастер, үнэт чулуу, металл боловсруулагч",
  "descriptionMn": "Үнэт эдлэл, алт, мөнгө, бусад үнэт металл, эрдэнийн чулууг зохион бүтээж, хийж, тохируулж, засаж, үнэлнэ.",
  "categorySlug": "engineering",
  "jobZone": 3,
  "riasec": {
   "R": 93,
   "I": 27,
   "A": 45,
   "S": 1,
   "E": 9,
   "C": 39
  },
  "personality": {
   "O": 48,
   "C": 67,
   "E": 22,
   "A": 15
  },
  "cognitive": {
   "math": 28,
   "verbal": 19,
   "techSpatial": 60,
   "abstract": 20
  },
  "subjects": [
   "technology",
   "art",
   "math"
  ]
 },
 {
  "code": "51-9071.06",
  "slug": "gem-and-diamond-workers",
  "nameEn": "Gem and Diamond Workers",
  "nameMn": "Эрдэнийн чулуу, алмаз боловсруулагч",
  "descriptionMn": "Үнэт эдлэл, үйлдвэрлэлийн багажид ашиглах эрдэнийн чулуу, алмазыг хийж, өнгөлж, чанарыг нь үнэлнэ.",
  "categorySlug": "engineering",
  "jobZone": 3,
  "riasec": {
   "R": 74,
   "I": 35,
   "A": 31,
   "S": 2,
   "E": 19,
   "C": 52
  },
  "personality": {
   "O": 38,
   "C": 67,
   "E": 11,
   "A": 19
  },
  "cognitive": {
   "math": 47,
   "verbal": 20,
   "techSpatial": 44,
   "abstract": 29
  },
  "subjects": [
   "informatics"
  ]
 },
 {
  "code": "51-9195.05",
  "slug": "potters-manufacturing",
  "nameEn": "Potters, Manufacturing",
  "nameMn": "Вааран эдлэл үйлдвэрлэгч",
  "descriptionMn": "Вааран болон шаазан эдлэл үйлдвэрлэхэд шавар боловсруулах шавар зуурагч, хэв хийх машин, ваарчны дугуй зэрэг үйлдвэрлэлийн машиныг ажиллуулна.",
  "categorySlug": "engineering",
  "jobZone": 3,
  "riasec": {
   "R": 99,
   "I": 11,
   "A": 19,
   "S": 0,
   "E": 3,
   "C": 45
  },
  "personality": {
   "O": 37,
   "C": 22,
   "E": 14,
   "A": 11
  },
  "cognitive": {
   "math": 18,
   "verbal": 13,
   "techSpatial": 53,
   "abstract": 22
  },
  "subjects": [
   "art",
   "chemistry"
  ]
 },
 {
  "code": "53-1043.00",
  "slug": "first-line-supervisors-of-material-moving-machine-and-vehicle-operators",
  "nameEn": "First-Line Supervisors of Material-Moving Machine and Vehicle Operators",
  "nameMn": "Ачаа зөөх машин, тээврийн хэрэгслийн операторуудын ахлах ажилтан",
  "descriptionMn": "Ачаа зөөх машин, тээврийн хэрэгслийн оператор, туслахуудын үйл ажиллагааг шууд удирдаж зохицуулна.",
  "categorySlug": "transport",
  "jobZone": 3,
  "riasec": {
   "R": 63,
   "I": 14,
   "A": 0,
   "S": 26,
   "E": 70,
   "C": 63
  },
  "personality": {
   "O": 37,
   "C": 57,
   "E": 71,
   "A": 43
  },
  "cognitive": {
   "math": 43,
   "verbal": 42,
   "techSpatial": 65,
   "abstract": 28
  },
  "subjects": [
   "math",
   "informatics",
   "social"
  ]
 },
 {
  "code": "53-1044.00",
  "slug": "first-line-supervisors-of-passenger-attendants",
  "nameEn": "First-Line Supervisors of Passenger Attendants",
  "nameMn": "Зорчигчийн үйлчилгээний ахлах ажилтан",
  "descriptionMn": "Зорчигчийн үйлчилгээний ажилтнуудын үйл ажиллагааг удирдаж зохицуулна.",
  "categorySlug": "transport",
  "jobZone": 3,
  "riasec": {
   "R": 27,
   "I": 1,
   "A": 0,
   "S": 51,
   "E": 92,
   "C": 71
  },
  "personality": {
   "O": 43,
   "C": 55,
   "E": 78,
   "A": 55
  },
  "cognitive": {
   "math": 34,
   "verbal": 37,
   "techSpatial": 57,
   "abstract": 32
  },
  "subjects": [
   "social",
   "informatics"
  ]
 },
 {
  "code": "53-2011.00",
  "slug": "airline-pilots-copilots-and-flight-engineers",
  "nameEn": "Airline Pilots, Copilots, and Flight Engineers",
  "nameMn": "Нисгэгч (агаарын тээврийн компани), туслах нисгэгч, нислэгийн инженер",
  "descriptionMn": "Зорчигч, ачаа тээвэрлэх, ихэвчлэн хуваарьт агаарын тээврийн маршрутаар тогтмол далавчтай нисэх онгоцыг жолоодож, нислэгийн чиглэлийг удирдана.",
  "categorySlug": "transport",
  "jobZone": 4,
  "riasec": {
   "R": 62,
   "I": 36,
   "A": 7,
   "S": 25,
   "E": 47,
   "C": 62
  },
  "personality": {
   "O": 31,
   "C": 95,
   "E": 62,
   "A": 36
  },
  "cognitive": {
   "math": 55,
   "verbal": 48,
   "techSpatial": 96,
   "abstract": 54
  },
  "subjects": [
   "geography",
   "informatics",
   "social"
  ]
 },
 {
  "code": "53-2012.00",
  "slug": "commercial-pilots",
  "nameEn": "Commercial Pilots",
  "nameMn": "Арилжааны нисгэгч",
  "descriptionMn": "Хуваарьт бус агаарын тээврийн маршрутаар тогтмол далавчтай нисэх онгоц, эсвэл нисдэг тэрэг жолоодож, нислэгийн чиглэлийг удирдана.",
  "categorySlug": "transport",
  "jobZone": 3,
  "riasec": {
   "R": 63,
   "I": 26,
   "A": 2,
   "S": 26,
   "E": 49,
   "C": 64
  },
  "personality": {
   "O": 50,
   "C": 78,
   "E": 65,
   "A": 31
  },
  "cognitive": {
   "math": 46,
   "verbal": 46,
   "techSpatial": 84,
   "abstract": 44
  },
  "subjects": [
   "geography",
   "informatics"
  ]
 },
 {
  "code": "53-2021.00",
  "slug": "air-traffic-controllers",
  "nameEn": "Air Traffic Controllers",
  "nameMn": "Агаарын хөдөлгөөний удирдагч",
  "descriptionMn": "Тогтоосон журам, бодлогын дагуу нисэх буудал болон түүний орчимд, мөн өндрийн секторууд, удирдлагын төвүүдийн хооронд агаарын хөдөлгөөнийг удирдана.",
  "categorySlug": "transport",
  "jobZone": 3,
  "riasec": {
   "R": 59,
   "I": 24,
   "A": 0,
   "S": 28,
   "E": 55,
   "C": 67
  },
  "personality": {
   "O": 16,
   "C": 95,
   "E": 46,
   "A": 29
  },
  "cognitive": {
   "math": 52,
   "verbal": 49,
   "techSpatial": 47,
   "abstract": 58
  },
  "subjects": [
   "geography",
   "informatics",
   "math"
  ]
 },
 {
  "code": "53-2022.00",
  "slug": "airfield-operations-specialists",
  "nameEn": "Airfield Operations Specialists",
  "nameMn": "Нисэх буудлын үйл ажиллагааны мэргэжилтэн",
  "descriptionMn": "Арилжааны болон цэргийн нисэх онгоцны аюулгүй хөөрөлт, буултыг хангана.",
  "categorySlug": "transport",
  "jobZone": 3,
  "riasec": {
   "R": 61,
   "I": 42,
   "A": 0,
   "S": 25,
   "E": 58,
   "C": 65
  },
  "personality": {
   "O": 41,
   "C": 82,
   "E": 65,
   "A": 41
  },
  "cognitive": {
   "math": 34,
   "verbal": 43,
   "techSpatial": 60,
   "abstract": 38
  },
  "subjects": [
   "informatics"
  ]
 },
 {
  "code": "53-5021.00",
  "slug": "captains-mates-and-pilots-of-water-vessels",
  "nameEn": "Captains, Mates, and Pilots of Water Vessels",
  "nameMn": "Усан онгоцны ахмад, туслах, нисгэгч",
  "descriptionMn": "Чирэгч, паром зэрэг хөлөг онгоцны үйл ажиллагааг удирдаж, хянана.",
  "categorySlug": "transport",
  "jobZone": 3,
  "riasec": {
   "R": 77,
   "I": 27,
   "A": 0,
   "S": 15,
   "E": 54,
   "C": 59
  },
  "personality": {
   "O": 49,
   "C": 84,
   "E": 77,
   "A": 34
  },
  "cognitive": {
   "math": 41,
   "verbal": 35,
   "techSpatial": 84,
   "abstract": 31
  },
  "subjects": [
   "geography"
  ]
 },
 {
  "code": "53-5031.00",
  "slug": "ship-engineers",
  "nameEn": "Ship Engineers",
  "nameMn": "Усан онгоцны инженер",
  "descriptionMn": "Хөлөг онгоц дээрх хөдөлгүүр, уурын зуух, тавцангийн машин, цахилгаан, ариун цэврийн, хөргөлтийн тоног төхөөрөмжийг ажиллуулж, засвар үйлчилгээ хийдэг багийн үйл ажиллагааг удирдаж зохицуулна.",
  "categorySlug": "transport",
  "jobZone": 3,
  "riasec": {
   "R": 91,
   "I": 42,
   "A": 0,
   "S": 13,
   "E": 46,
   "C": 65
  },
  "personality": {
   "O": 50,
   "C": 84,
   "E": 56,
   "A": 31
  },
  "cognitive": {
   "math": 39,
   "verbal": 42,
   "techSpatial": 86,
   "abstract": 41
  },
  "subjects": [
   "physics",
   "chemistry",
   "informatics"
  ]
 },
 {
  "code": "53-6041.00",
  "slug": "traffic-technicians",
  "nameEn": "Traffic Technicians",
  "nameMn": "Замын хөдөлгөөний техникч",
  "descriptionMn": "Замын хөдөлгөөний инженерийн удирдлаган дор хөдөлгөөний ачаалал, хурд, дохионы үр дүн, гэрэлтүүлгийн хүрэлцээ болон бусад хүчин зүйлийг тодорхойлох хээрийн судалгаа хийнэ.",
  "categorySlug": "transport",
  "jobZone": 3,
  "riasec": {
   "R": 65,
   "I": 56,
   "A": 7,
   "S": 16,
   "E": 16,
   "C": 58
  },
  "personality": {
   "O": 33,
   "C": 28,
   "E": 23,
   "A": 27
  },
  "cognitive": {
   "math": 48,
   "verbal": 36,
   "techSpatial": 70,
   "abstract": 36
  },
  "subjects": [
   "informatics",
   "technology",
   "math"
  ]
 },
 {
  "code": "53-6051.00",
  "slug": "transportation-inspectors",
  "nameEn": "Transportation Inspectors",
  "nameMn": "Тээврийн байцаагч",
  "descriptionMn": "Ачаа, хүнийг аюулгүй тээвэрлэхтэй холбоотой тоног төхөөрөмж, барааг шалгана.",
  "categorySlug": "transport",
  "jobZone": 4,
  "riasec": {
   "R": 78,
   "I": 32,
   "A": 0,
   "S": 9,
   "E": 27,
   "C": 86
  },
  "personality": {
   "O": 19,
   "C": 58,
   "E": 43,
   "A": 28
  },
  "cognitive": {
   "math": 45,
   "verbal": 40,
   "techSpatial": 62,
   "abstract": 35
  },
  "subjects": [
   "math"
  ]
 },
 {
  "code": "53-6051.01",
  "slug": "aviation-inspectors",
  "nameEn": "Aviation Inspectors",
  "nameMn": "Нисэхийн байцаагч",
  "descriptionMn": "Холбооны аюулгүй байдлын дүрэмд нийцэж буйг баталгаажуулахын тулд нисэх онгоц, засвар үйлчилгээний журам, нислэгийн навигацийн хэрэгсэл, агаарын хөдөлгөөний удирдлага, холбооны тоног төхөөрөмжийг шалгана.",
  "categorySlug": "transport",
  "jobZone": 3,
  "riasec": {
   "R": 76,
   "I": 52,
   "A": 0,
   "S": 7,
   "E": 26,
   "C": 79
  },
  "personality": {
   "O": 33,
   "C": 89,
   "E": 42,
   "A": 31
  },
  "cognitive": {
   "math": 37,
   "verbal": 44,
   "techSpatial": 93,
   "abstract": 45
  },
  "subjects": [
   "technology",
   "math",
   "informatics"
  ]
 },
 {
  "code": "53-7021.00",
  "slug": "crane-and-tower-operators",
  "nameEn": "Crane and Tower Operators",
  "nameMn": "Кран, цамхагийн оператор",
  "descriptionMn": "Материал, машин, бүтээгдэхүүнийг олон чиглэлд өргөж хөдөлгөхийн тулд механик урт, кабель эсвэл цамхаг, кабелийн тоног төхөөрөмжийг ажиллуулна.",
  "categorySlug": "transport",
  "jobZone": 3,
  "riasec": {
   "R": 100,
   "I": 20,
   "A": 0,
   "S": 3,
   "E": 5,
   "C": 49
  },
  "personality": {
   "O": 0,
   "C": 33,
   "E": 10,
   "A": 11
  },
  "cognitive": {
   "math": 31,
   "verbal": 13,
   "techSpatial": 67,
   "abstract": 7
  },
  "subjects": []
 }
];
