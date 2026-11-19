import { creditFromExtMetadata, filePathUrl, isFreeLicense, pickCommonsFiles, stripHtml, trimExtract } from './university-media';

describe('isFreeLicense', () => {
  it('чөлөөт лицензийг зөвшөөрнө', () => {
    for (const l of ['CC BY-SA 4.0', 'CC BY 2.0', 'CC BY-SA 3.0', 'CC0', 'Public domain', 'PD-textlogo', 'CC BY 4.0']) expect(isFreeLicense(l)).toBe(true);
  });
  it('чөлөөт биш, тодорхойгүй, хоосныг няцаана', () => {
    for (const l of ['Fair use', 'Copyrighted free use', 'All rights reserved', 'CC BY-NC 4.0', 'CC BY-ND 2.0', '', undefined, null]) expect(isFreeLicense(l as any)).toBe(false);
  });
});

describe('creditFromExtMetadata', () => {
  const ok = { LicenseShortName: { value: 'CC BY-SA 4.0' }, LicenseUrl: { value: 'https://creativecommons.org/licenses/by-sa/4.0' }, Artist: { value: '<a href="x">Jane &amp; Co</a>' } };
  it('кредит үүсгэж HTML-г цэвэрлэнэ', () => {
    const c = creditFromExtMetadata('MIT Dome.jpg', ok)!;
    expect(c.license).toBe('CC BY-SA 4.0');
    expect(c.author).toBe('Jane & Co');
    expect(c.sourceUrl).toBe('https://commons.wikimedia.org/wiki/File:MIT_Dome.jpg');
    expect(c.licenseUrl).toBe('https://creativecommons.org/licenses/by-sa/4.0');
  });
  it('NonFree эсвэл чөлөөт биш лицензийг null болгоно', () => {
    expect(creditFromExtMetadata('a.png', { ...ok, NonFree: { value: 'true' } })).toBeNull();
    expect(creditFromExtMetadata('a.png', { LicenseShortName: { value: 'Fair use' } })).toBeNull();
    expect(creditFromExtMetadata('a.png', undefined)).toBeNull();
  });
  it('аюултай licenseUrl (javascript:) оруулахгүй', () => {
    expect(creditFromExtMetadata('a.png', { ...ok, LicenseUrl: { value: 'javascript:alert(1)' } })!.licenseUrl).toBeUndefined();
  });
});

describe('filePathUrl', () => {
  it('зай, тусгай тэмдэгтийг кодлоно', () => {
    expect(filePathUrl('File:MIT 2023 red logo.svg', 256)).toBe('https://commons.wikimedia.org/wiki/Special:FilePath/MIT_2023_red_logo.svg?width=256');
    expect(filePathUrl("Café d'été.jpg", 640)).toContain('Caf%C3%A9_d');
  });
});

describe('trimExtract / stripHtml', () => {
  it('богино бол хэвээр, урт бол өгүүлбэрийн хил дээр тайрна', () => {
    expect(trimExtract('Short one.')).toBe('Short one.');
    const long = Array.from({ length: 40 }, (_, i) => `Sentence number ${i} is here.`).join(' ');
    const t = trimExtract(long, 200);
    expect(t.length).toBeLessThanOrEqual(200);
    expect(t.endsWith('.')).toBe(true);
  });
  it('HTML-ийг цэвэрлэнэ', () => { expect(stripHtml('<b>A</b>&nbsp;&lt;B&gt;')).toBe('A <B>'); });
});

describe('pickCommonsFiles', () => {
  const st = (f: string, rank = 'normal', ended = false) => ({ rank, mainsnak: { datavalue: { value: f } }, qualifiers: ended ? { P582: [{}] } : undefined });
  it('preferred, дараа нь дуусаагүй, дараа нь бусдыг эрэмбэлнэ', () => {
    expect(pickCommonsFiles([st('old.svg', 'normal', true), st('new.svg'), st('pref.svg', 'preferred')])).toEqual(['pref.svg', 'new.svg', 'old.svg']);
  });
  it('хоосон/буруу бүтцийг тэсвэрлэнэ', () => {
    expect(pickCommonsFiles(undefined)).toEqual([]);
    expect(pickCommonsFiles([{}, { mainsnak: {} }])).toEqual([]);
  });
});
