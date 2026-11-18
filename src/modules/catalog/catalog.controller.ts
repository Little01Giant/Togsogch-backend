import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CatalogService } from './catalog.service';
import { Authenticated, CurrentUser, OptionalAuth, Public } from '../../common/guards/auth';

@ApiTags('catalog')
@Public()
@Controller()
export class CatalogController {
  constructor(private svc: CatalogService) {}

  @Get('countries') countries(@Query() q: any) { return this.svc.listCountries(q); }
  @OptionalAuth() @Get('countries/:slug') country(@Param('slug') slug: string, @CurrentUser() u?: any) { return this.svc.getCountry(slug, u); }

  @Get('universities') universities(@Query() q: any) { return this.svc.listUniversities(q); }
  @Get('universities/featured') featured() { return this.svc.featured(); }
  @OptionalAuth() @Get('universities/compare')
  async compare(@Query('ids') ids: string, @CurrentUser() u?: any) {
    const items = await this.svc.getUniversitiesByIds((ids ?? '').split(','));
    return { items, personal: await this.svc.compareInsights(u, items) };
  }
  @OptionalAuth() @Get('universities/:slug') university(@Param('slug') slug: string, @CurrentUser() u?: any) { return this.svc.getUniversity(slug, u); }

  @Authenticated() @Get('users/me/access') access(@CurrentUser() u: any) { return this.svc.accessSummary(u.id); }

  @Get('meta/filters') meta() { return this.svc.filterMeta(); }
}
