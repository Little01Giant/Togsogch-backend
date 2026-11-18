import { newOAuthState, oauthStateMatches } from './oauth-state';

describe('oauthStateMatches', () => {
  it('ижил state-ийг зөвшөөрнө', () => {
    const s = newOAuthState();
    expect(oauthStateMatches(s, s)).toBe(true);
  });
  it('байхгүй, өөр, өөр урттай, string биш state-ийг няцаана', () => {
    const s = newOAuthState();
    expect(oauthStateMatches(undefined, s)).toBe(false);
    expect(oauthStateMatches(s, undefined)).toBe(false);
    expect(oauthStateMatches(s, newOAuthState())).toBe(false);
    expect(oauthStateMatches(s, s.slice(1))).toBe(false);
    expect(oauthStateMatches(s, ['x'])).toBe(false); // ?state[]=x
    expect(oauthStateMatches('', '')).toBe(false);
  });
  it('state бүр өвөрмөц', () => { expect(newOAuthState()).not.toBe(newOAuthState()); });
});
