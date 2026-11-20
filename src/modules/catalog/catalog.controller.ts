import { Controller, Get, Header, Param, Query } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiTags } from '@nestjs/swagger';
import { CatalogService } from './catalog.service';
import { Authenticated, CurrentUser, OptionalAuth, Public } from '../../common/guards/auth';
import { cacheKey, publicCache } from '../../common/ttl-cache';
import { isTestEnv } from '../../common/security';

/** Нийтийн жагсаалтын хариу бүх хэрэглэгчид ижил (төлбөртэй/хувийн мэдээлэл ороогүй) тул кэшлэхэд аюулгүй. */
const PUBLIC_CACHE = 'public, max-age=30, s-maxage=60, stale-while-revalidate=300';
const UNI_KEYS = ['q', 'featured', 'country', 'degree', 'type', 'subject', 'intake', 'language', 'mode', 'city', 'ranking', 'international', 'scholarship', 'sort', 'page', 'pageSize'] as const;
const COUNTRY_KEYS = ['q', 'page', 'pageSize'] as const;

@ApiTags('catalog')
@Public()
@Controller()
export class CatalogController {
  constructor(private svc: CatalogService, private cfg: ConfigService) {}

  /**
   * Сервер асахад хамгийн түгээмэл хүсэлтүүдийг (нүүр хуудас, сургуулиудын 1-р хуудас, шүүлтүүрийн мета) урьдчилан кэшлэнэ:
   * анхны хэрэглэгч 1+ секунд хүлээхгүй. Алдаа гарвал чимээгүй алгасна (сервер унахгүй), тест орчинд ажиллахгүй.
   */
  onApplicationBootstrap() {
    if (isTestEnv(this.cfg.get('NODE_ENV'))) return;
    const q = { page: 1, pageSize: 12 };
    void Promise.allSettled([
      this.universities(q),
      this.featured(),
      this.meta(),
    ]);
  }

  /** Тест орчинд кэш унтраастай (тест өгөгдлийг шууд харах). */
  private cached<T>(key: string | null, fn: () => Promise<T>) {
    return publicCache.wrap(key ?? '', fn, key !== null && !isTestEnv(this.cfg.get('NODE_ENV')));
  }

  @Header('Cache-Control', PUBLIC_CACHE)
  @Get('countries') countries(@Query() q: any) { return this.cached(cacheKey('countries', q, COUNTRY_KEYS), () => this.svc.listCountries(q)); }
  @OptionalAuth() @Get('countries/:slug') country(@Param('slug') slug: string, @CurrentUser() u?: any) { return this.svc.getCountry(slug, u); }

  @Header('Cache-Control', PUBLIC_CACHE)
  @Get('universities') universities(@Query() q: any) { return this.cached(cacheKey('universities', q, UNI_KEYS), () => this.svc.listUniversities(q)); }
  @Header('Cache-Control', PUBLIC_CACHE)
  @Get('universities/featured') featured() { return this.cached('featured', () => this.svc.featured()); }
  @OptionalAuth() @Get('universities/compare')
  async compare(@Query('ids') ids: string, @CurrentUser() u?: any) {
    const items = await this.svc.getUniversitiesByIds((ids ?? '').split(','));
    return { items, personal: await this.svc.compareInsights(u, items) };
  }
  @OptionalAuth() @Get('universities/:slug') university(@Param('slug') slug: string, @CurrentUser() u?: any) { return this.svc.getUniversity(slug, u); }

  @Authenticated() @Get('users/me/access') access(@CurrentUser() u: any) { return this.svc.accessSummary(u.id); }

  @Header('Cache-Control', PUBLIC_CACHE)
  @Get('meta/filters') meta() { return this.cached('meta-filters', () => this.svc.filterMeta()); }
}
