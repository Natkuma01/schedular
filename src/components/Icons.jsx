const S = props => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props} />
);

export function CatIcon({ icon }) {
  switch (icon) {
    case 'network': return <S><path d="M4 5h11a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2H9l-4 3v-3H4a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2z" /><path d="M19 9h1a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2v3l-3-3h-4" /></S>;
    case 'learning': return <S><path d="M2 5c3-1.5 7-1.5 10 1 3-2.5 7-2.5 10-1v14c-3-1.5-7-1.5-10 1-3-2.5-7-2.5-10-1z" /><path d="M12 6v14" /></S>;
    case 'project': return <S><path d="M12 2c4 3 5 8 3 13H9C7 10 8 5 12 2z" /><circle cx="12" cy="9" r="1.6" /><path d="M9 15l-3 3v3l4-2M15 15l3 3v3l-4-2" /></S>;
    case 'job': return <S><rect x="2.5" y="7" width="19" height="13" rx="2.5" /><path d="M8.5 7V5a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v2M2.5 13h19" /></S>;
    case 'house': return <S><path d="M3 11l9-7 9 7" /><path d="M5 10v10h14V10" /><path d="M10 20v-5h4v5" /></S>;
    default: return <S><path d="M12 3l2.6 5.6 6 .7-4.5 4.1 1.2 6-5.3-3-5.3 3 1.2-6L3.4 9.3l6-.7z" /></S>;
  }
}

export const IcClock = () => <S><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></S>;
export const IcLeft = () => <S><path d="M15 5l-7 7 7 7" /></S>;
export const IcRight = () => <S><path d="M9 5l7 7-7 7" /></S>;
export const IcPlus = () => <S><path d="M12 5v14M5 12h14" /></S>;
export const IcPencil = () => <S><path d="M4 20l4-1 11-11-3-3L5 16z" /><path d="M14 6l3 3" /></S>;
export const IcTrash = () => <S><path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13" /></S>;
export const IcCheck = () => <S><path d="M5 12l5 5 9-10" /></S>;
export const IcGrip = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="grip">
    <circle cx="9" cy="6" r="1.8" /><circle cx="15" cy="6" r="1.8" /><circle cx="9" cy="12" r="1.8" />
    <circle cx="15" cy="12" r="1.8" /><circle cx="9" cy="18" r="1.8" /><circle cx="15" cy="18" r="1.8" />
  </svg>
);

export function Crown({ on = true, face = true, className = '' }) {
  return (
    <svg viewBox="0 0 64 58" className={`crown ${on ? '' : 'off'} ${className}`} aria-hidden="true">
      <path className="body" strokeWidth="3.5" strokeLinejoin="round" d="M8 20 L19 34 L32 12 L45 34 L56 20 L52 48 H12 Z" />
      <circle className="body" strokeWidth="3" cx="8" cy="17" r="5" />
      <circle className="body" strokeWidth="3" cx="32" cy="9" r="5.5" />
      <circle className="body" strokeWidth="3" cx="56" cy="17" r="5" />
      <rect className="band" x="11" y="44" width="42" height="10" rx="4" />
      <circle className="gem1" cx="21" cy="49" r="2.6" /><circle className="gem2" cx="32" cy="49" r="2.6" /><circle className="gem3" cx="43" cy="49" r="2.6" />
      {face && <>
        <circle className="eye" cx="25.5" cy="32" r="2.6" /><circle className="eye" cx="38.5" cy="32" r="2.6" />
        <path className="mouth" strokeWidth="2.4" strokeLinecap="round" d="M29 37.5 Q32 40.5 35 37.5" />
        <ellipse className="blush" cx="21" cy="37" rx="3" ry="1.8" /><ellipse className="blush" cx="43" cy="37" rx="3" ry="1.8" />
      </>}
    </svg>
  );
}

export function Cat() {
  return (
    <svg viewBox="0 0 64 60" className="cat" aria-hidden="true">
      <path className="fur" strokeWidth="3" strokeLinejoin="round" d="M9 30 L11 5 L29 17 Z" />
      <path className="fur" strokeWidth="3" strokeLinejoin="round" d="M55 30 L53 5 L35 17 Z" />
      <path className="ear-in" d="M14 22 L15 11 L23 17 Z" />
      <path className="ear-in" d="M50 22 L49 11 L41 17 Z" />
      <ellipse className="fur" strokeWidth="3" cx="32" cy="36" rx="27" ry="21" />
      <path className="stripe" strokeWidth="2.6" strokeLinecap="round" d="M32 16 V22 M26 17 L27.5 22 M38 17 L36.5 22" />
      <ellipse className="muzzle" cx="32" cy="44" rx="11" ry="8" />
      <circle className="eye" cx="21.5" cy="34" r="4.4" /><circle className="eye" cx="42.5" cy="34" r="4.4" />
      <circle className="shine" cx="23" cy="32.4" r="1.5" /><circle className="shine" cx="44" cy="32.4" r="1.5" />
      <path className="nose" d="M29.5 40 H34.5 L32 43 Z" />
      <path className="line" strokeWidth="2" strokeLinecap="round" d="M32 43 V44.5 M28 45.5 Q30 48 32 44.5 Q34 48 36 45.5" />
      <ellipse className="blush" cx="14.5" cy="42" rx="3.6" ry="2.2" /><ellipse className="blush" cx="49.5" cy="42" rx="3.6" ry="2.2" />
      <path className="whisker" strokeWidth="1.6" strokeLinecap="round" d="M20 44 L6 42 M20 47 L7 49 M44 44 L58 42 M44 47 L57 49" />
    </svg>
  );
}
