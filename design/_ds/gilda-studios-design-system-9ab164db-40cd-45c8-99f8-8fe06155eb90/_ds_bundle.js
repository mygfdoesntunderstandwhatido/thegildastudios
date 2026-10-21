/* @ds-bundle: {"format":4,"namespace":"GildaStudiosDesignSystem_9ab164","components":[{"name":"BranchCard","sourcePath":"components/branch/BranchCard.jsx"},{"name":"BranchDot","sourcePath":"components/branch/BranchDot.jsx"},{"name":"BranchDots","sourcePath":"components/branch/BranchDots.jsx"},{"name":"BranchTag","sourcePath":"components/branch/BranchTag.jsx"},{"name":"BRANCHES","sourcePath":"components/branch/branches.js"},{"name":"ORDER","sourcePath":"components/branch/branches.js"},{"name":"AppIcon","sourcePath":"components/brand/AppIcon.jsx"},{"name":"CreditLine","sourcePath":"components/brand/CreditLine.jsx"},{"name":"Lockup","sourcePath":"components/brand/Lockup.jsx"},{"name":"Mark","sourcePath":"components/brand/Mark.jsx"},{"name":"Monogram","sourcePath":"components/brand/Monogram.jsx"},{"name":"Wordmark","sourcePath":"components/brand/Wordmark.jsx"},{"name":"DoDont","sourcePath":"components/content/DoDont.jsx"},{"name":"Quote","sourcePath":"components/content/Quote.jsx"},{"name":"Swatch","sourcePath":"components/content/Swatch.jsx"},{"name":"Button","sourcePath":"components/core/Button.jsx"},{"name":"Chip","sourcePath":"components/core/Chip.jsx"},{"name":"Label","sourcePath":"components/core/Label.jsx"},{"name":"RuleColumn","sourcePath":"components/layout/RuleColumn.jsx"},{"name":"RunningHeader","sourcePath":"components/layout/RunningHeader.jsx"},{"name":"SectionHeader","sourcePath":"components/layout/SectionHeader.jsx"},{"name":"SpecRow","sourcePath":"components/layout/SpecRow.jsx"},{"name":"PhotoPlaceholder","sourcePath":"components/social/PhotoPlaceholder.jsx"},{"name":"Post","sourcePath":"components/social/Post.jsx"},{"name":"PostMeta","sourcePath":"components/social/PostMeta.jsx"},{"name":"GROUNDS","sourcePath":"components/social/grounds.js"}],"sourceHashes":{"components/branch/BranchCard.jsx":"e87dbe7a1f08","components/branch/BranchDot.jsx":"ac1462d7fa2f","components/branch/BranchDots.jsx":"cacb7b36ea3b","components/branch/BranchTag.jsx":"91d38c6c6cea","components/branch/branches.js":"c803d30da04e","components/brand/AppIcon.jsx":"bc27ed841622","components/brand/CreditLine.jsx":"46144719b55c","components/brand/Lockup.jsx":"49667d72125c","components/brand/Mark.jsx":"746ea81caebe","components/brand/Monogram.jsx":"338892cf56c3","components/brand/Wordmark.jsx":"4a58ece81ff5","components/content/DoDont.jsx":"25cc25f7faba","components/content/Quote.jsx":"14235d2d5b73","components/content/Swatch.jsx":"2545aa81a858","components/core/Button.jsx":"f1483dd26758","components/core/Chip.jsx":"7850d192648a","components/core/Label.jsx":"ce6e7dde2225","components/layout/RuleColumn.jsx":"b66ae744ad39","components/layout/RunningHeader.jsx":"a0279d769796","components/layout/SectionHeader.jsx":"fbe0fea2916c","components/layout/SpecRow.jsx":"7207fd44e72b","components/social/PhotoPlaceholder.jsx":"003a1d9c05f7","components/social/Post.jsx":"999d0ac28787","components/social/PostMeta.jsx":"0649ba7d5ab3","components/social/grounds.js":"9fadef67328d","dev/load-components.js":"08e30597c1cf","ui_kits/print/Collateral.jsx":"7fd44781f2e8","ui_kits/social/FeedTemplates.jsx":"aa53b8c6e282","ui_kits/social/Gallery.jsx":"d04519bdc071","ui_kits/website/Homepage.jsx":"3a2431fa0172"},"inlinedExternals":[],"unexposedExports":[{"name":"ground","sourcePath":"components/social/grounds.js"}]} */

(() => {

const __ds_ns = (window.GildaStudiosDesignSystem_9ab164 = window.GildaStudiosDesignSystem_9ab164 || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/branch/branches.js
try { (() => {
const BRANCHES = {
  plan: {
    n: '01',
    name: 'Plan',
    ingredient: 'Olive',
    color: 'var(--olive)',
    onDark: 'var(--olive-on-dark)',
    label: 'var(--olive)',
    ring: false,
    illustration: 'illustrations/01-olive-plan.png',
    illoHeight: 110,
    line: 'What everything rests on. Project management, event management and on-the-day coordination.'
  },
  build: {
    n: '02',
    name: 'Build',
    ingredient: 'Anchovy',
    color: 'var(--anchovy)',
    onDark: 'var(--anchovy-on-dark)',
    label: 'var(--anchovy)',
    ring: false,
    illustration: 'illustrations/02-anchovy-build.png',
    illoHeight: 170,
    line: 'The substance at the centre. Web design, development, hosting and ongoing care.'
  },
  grow: {
    n: '03',
    name: 'Grow',
    ingredient: 'Pepper',
    color: 'var(--pepper)',
    onDark: 'var(--pepper-on-dark)',
    label: 'var(--olive)',
    ring: true,
    illustration: 'illustrations/03-pepper-grow.png',
    illoHeight: 190,
    line: 'The heat people notice first. Social media management, content and campaigns.'
  }
};
const ORDER = ['plan', 'build', 'grow'];
Object.assign(__ds_scope, { BRANCHES, ORDER });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/branch/branches.js", error: String((e && e.message) || e) }); }

// components/branch/BranchDot.jsx
try { (() => {
function BranchDot({
  branch = 'plan',
  onDark = false,
  size = 14,
  style
}) {
  const b = __ds_scope.BRANCHES[branch];
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-block',
      width: size,
      height: size,
      borderRadius: '50%',
      flexShrink: 0,
      background: onDark ? b.onDark : b.color,
      boxShadow: !onDark && b.ring ? 'inset 0 0 0 1px rgba(36,38,26,.3)' : 'none',
      ...style
    }
  });
}
Object.assign(__ds_scope, { BranchDot });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/branch/BranchDot.jsx", error: String((e && e.message) || e) }); }

// components/branch/BranchCard.jsx
try { (() => {
const asset = p => (typeof window !== 'undefined' && window.GILDA_ASSET_BASE || '') + 'assets/' + p;

/** Branch panel: single-ingredient illustration on Sand above a Paper text block. */
function BranchCard({
  branch = 'plan',
  title,
  description,
  illustrationHeight = 250,
  style
}) {
  const b = __ds_scope.BRANCHES[branch];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--paper)',
      display: 'flex',
      flexDirection: 'column',
      color: 'var(--brine)',
      fontFamily: 'var(--font-body)',
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      height: illustrationHeight,
      flexShrink: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--sand)'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: asset(b.illustration),
    alt: b.ingredient,
    style: {
      maxHeight: b.illoHeight * illustrationHeight / 250,
      maxWidth: '70%',
      width: 'auto'
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      padding: '20px 22px 22px',
      display: 'flex',
      flexDirection: 'column',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: '500 11px var(--font-mono)',
      textTransform: 'uppercase',
      color: b.label
    }
  }, b.n, " \xB7 ", b.ingredient), /*#__PURE__*/React.createElement(__ds_scope.BranchDot, {
    branch: branch,
    size: 12
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      font: '400 38px/1 var(--font-display)'
    }
  }, title ?? b.name), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 14,
      lineHeight: 1.5,
      color: 'var(--ink-2)'
    }
  }, description ?? b.line)));
}
Object.assign(__ds_scope, { BranchCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/branch/BranchCard.jsx", error: String((e && e.message) || e) }); }

// components/branch/BranchDots.jsx
try { (() => {
/** The three branch dots. Always olive, anchovy, pepper — never reordered. */
function BranchDots({
  onDark = false,
  size = 14,
  gap,
  style
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: gap ?? Math.round(size * 0.7),
      ...style
    }
  }, __ds_scope.ORDER.map(k => /*#__PURE__*/React.createElement(__ds_scope.BranchDot, {
    key: k,
    branch: k,
    onDark: onDark,
    size: size
  })));
}
Object.assign(__ds_scope, { BranchDots });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/branch/BranchDots.jsx", error: String((e && e.message) || e) }); }

// components/branch/BranchTag.jsx
try { (() => {
/** Dot + mono label marking a branch: "01 / Plan" (format=name) or "01 · Olive" (format=ingredient). */
function BranchTag({
  branch = 'plan',
  format = 'name',
  onDark = false,
  size = 'md',
  children,
  style
}) {
  const b = __ds_scope.BRANCHES[branch];
  const fs = size === 'social' ? 26 : size === 'sm' ? 10 : 12;
  const dot = size === 'social' ? 24 : size === 'sm' ? 9 : 10;
  const text = children ?? (format === 'ingredient' ? `${b.n} · ${b.ingredient}` : `${b.n} / ${b.name}`);
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: size === 'social' ? 16 : 8,
      fontFamily: 'var(--font-mono)',
      fontWeight: 500,
      fontSize: fs,
      lineHeight: 1,
      letterSpacing: '.06em',
      textTransform: 'uppercase',
      color: onDark ? 'var(--cream-2)' : 'inherit',
      ...style
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.BranchDot, {
    branch: branch,
    onDark: onDark,
    size: dot
  }), text);
}
Object.assign(__ds_scope, { BranchTag });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/branch/BranchTag.jsx", error: String((e && e.message) || e) }); }

// components/brand/Mark.jsx
try { (() => {
const asset = p => (typeof window !== 'undefined' && window.GILDA_ASSET_BASE || '') + 'assets/' + p;

/** The gilda mark. full = full-colour illustration; engraved/outline = single-colour mask in `color`. */
function Mark({
  variant = 'full',
  height = 120,
  color = 'var(--brine)',
  style
}) {
  const w = variant === 'outline' ? height * 198 / 240 : height * 823 / 1000;
  if (variant === 'full') return /*#__PURE__*/React.createElement("img", {
    src: asset('logos/gilda-mark-full-colour.png'),
    alt: "The Gilda Studios",
    style: {
      height,
      width: 'auto',
      display: 'block',
      ...style
    }
  });
  const url = asset(variant === 'outline' ? 'logos/mask-outline.png' : 'logos/mask-engraved.png');
  return /*#__PURE__*/React.createElement("div", {
    role: "img",
    "aria-label": "The Gilda Studios",
    style: {
      width: w,
      height,
      background: color,
      WebkitMask: `url("${url}") center/contain no-repeat`,
      mask: `url("${url}") center/contain no-repeat`,
      flexShrink: 0,
      ...style
    }
  });
}
Object.assign(__ds_scope, { Mark });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/brand/Mark.jsx", error: String((e && e.message) || e) }); }

// components/brand/AppIcon.jsx
try { (() => {
/** App icon / avatar tile: full-colour mark on a cream rounded square. */
function AppIcon({
  size = 96,
  shadow = true,
  style
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      width: size,
      height: size,
      borderRadius: size * 0.25,
      background: 'var(--cream)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: shadow ? '0 4px 12px rgba(0,0,0,.2)' : 'none',
      flexShrink: 0,
      ...style
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Mark, {
    height: size * 0.79
  }));
}
Object.assign(__ds_scope, { AppIcon });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/brand/AppIcon.jsx", error: String((e && e.message) || e) }); }

// components/brand/CreditLine.jsx
try { (() => {
/** Single-colour credit for client work. Built by (web), Made by (print, decks), Produced by (events). */
function CreditLine({
  verb = 'Built by',
  mark = 'none',
  color = 'currentColor',
  size = 18,
  style
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'inline-flex',
      alignItems: mark === 'none' ? 'baseline' : 'center',
      gap: mark === 'none' ? 7 : 8,
      color,
      fontFamily: 'var(--font-body)',
      fontWeight: 500,
      fontSize: size * 0.78,
      ...style
    }
  }, /*#__PURE__*/React.createElement("span", null, verb), mark !== 'none' && /*#__PURE__*/React.createElement(__ds_scope.Mark, {
    variant: mark,
    height: size * 1.6,
    color: color
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 400,
      fontSize: size,
      lineHeight: 1
    }
  }, "The Gilda Studios"));
}
Object.assign(__ds_scope, { CreditLine });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/brand/CreditLine.jsx", error: String((e && e.message) || e) }); }

// components/brand/Monogram.jsx
try { (() => {
/** GS monogram for favicons and anything under 48px. tile = cream tile; outline = ring in `color`. */
function Monogram({
  size = 96,
  variant = 'tile',
  color = 'var(--brine)',
  style
}) {
  const tile = variant === 'tile';
  return /*#__PURE__*/React.createElement("div", {
    style: {
      width: size,
      height: size,
      borderRadius: size * 0.25,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: tile ? 'var(--cream)' : 'transparent',
      color: tile ? 'var(--brine)' : color,
      boxShadow: tile ? 'none' : `inset 0 0 0 ${Math.max(1.5, size / 38)}px ${color}`,
      fontFamily: 'var(--font-display)',
      fontSize: size * 0.48,
      lineHeight: 1,
      letterSpacing: '-.02em',
      flexShrink: 0,
      ...style
    }
  }, "GS");
}
Object.assign(__ds_scope, { Monogram });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/brand/Monogram.jsx", error: String((e && e.message) || e) }); }

// components/brand/Wordmark.jsx
try { (() => {
/** Typography-only logo. Always the three words at one size and weight. */
function Wordmark({
  layout = 'stacked',
  size = 58,
  color = 'currentColor',
  style
}) {
  const s = {
    fontFamily: 'var(--font-display)',
    fontWeight: 400,
    fontSize: size,
    color,
    letterSpacing: 0,
    ...style
  };
  if (layout === 'line') return /*#__PURE__*/React.createElement("span", {
    style: {
      ...s,
      lineHeight: 1,
      whiteSpace: 'nowrap'
    }
  }, "The Gilda Studios");
  return /*#__PURE__*/React.createElement("div", {
    style: {
      ...s,
      lineHeight: 0.95
    }
  }, "The", /*#__PURE__*/React.createElement("br", null), "Gilda", /*#__PURE__*/React.createElement("br", null), "Studios");
}
Object.assign(__ds_scope, { Wordmark });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/brand/Wordmark.jsx", error: String((e && e.message) || e) }); }

// components/brand/Lockup.jsx
try { (() => {
/** Wordmark + mark. Stacked (default) or horizontal. Proportions from the brand book (58px type : 180px mark). */
function Lockup({
  layout = 'stacked',
  size = 58,
  mark = 'full',
  color = 'var(--brine)',
  style
}) {
  if (layout === 'horizontal') {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: size * 0.48,
        color,
        ...style
      }
    }, /*#__PURE__*/React.createElement(__ds_scope.Mark, {
      variant: mark,
      height: size * 2.9,
      color: color
    }), /*#__PURE__*/React.createElement(__ds_scope.Wordmark, {
      layout: "line",
      size: size,
      color: color
    }));
  }
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      display: 'inline-block',
      padding: `${size * 0.276}px ${size * 1.57}px 0 0`,
      color,
      ...style
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Wordmark, {
    size: size,
    color: color,
    style: {
      position: 'relative'
    }
  }), /*#__PURE__*/React.createElement(__ds_scope.Mark, {
    variant: mark,
    height: size * 3.1,
    color: color,
    style: {
      position: 'absolute',
      left: size * 2.55,
      top: 0
    }
  }));
}
Object.assign(__ds_scope, { Lockup });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/brand/Lockup.jsx", error: String((e && e.message) || e) }); }

// components/content/DoDont.jsx
try { (() => {
/** Voice comparison: struck-through "Instead of" lines on Sand, "We say" lines on Brine. */
function DoDont({
  insteadOf = [],
  weSay = [],
  style
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 16,
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 12,
      padding: '22px 24px',
      background: 'var(--sand)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      font: '500 11px var(--font-mono)',
      textTransform: 'uppercase',
      color: 'var(--ink-4)'
    }
  }, "Instead of"), insteadOf.map((t, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      fontSize: 16,
      lineHeight: 1.5,
      color: 'var(--ink-3)',
      textDecoration: 'line-through',
      textDecorationColor: 'rgba(36,38,26,.4)'
    }
  }, t))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 12,
      padding: '22px 24px',
      background: 'var(--brine)',
      color: 'var(--cream)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      font: '500 11px var(--font-mono)',
      textTransform: 'uppercase',
      color: 'var(--pepper)'
    }
  }, "We say"), weSay.map((t, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      font: '400 19px/1.35 var(--font-display)'
    }
  }, t))));
}
Object.assign(__ds_scope, { DoDont });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/content/DoDont.jsx", error: String((e && e.message) || e) }); }

// components/content/Swatch.jsx
try { (() => {
/** Brand-book colour chip: hex + RGB top-left, Gilda name and note bottom-left. */
function Swatch({
  name,
  hex,
  note,
  dark = false,
  ring = false,
  height = 150,
  style
}) {
  const rgb = hex ? hex.replace('#', '').match(/../g).map(h => parseInt(h, 16)).join(' ') : '';
  return /*#__PURE__*/React.createElement("div", {
    style: {
      height,
      boxSizing: 'border-box',
      background: hex,
      color: dark ? 'var(--cream)' : 'var(--brine)',
      padding: 16,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      boxShadow: ring ? 'inset 0 0 0 1px rgba(36,38,26,.25)' : 'none',
      ...style
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: '500 11px/1.6 var(--font-mono)'
    }
  }, hex, /*#__PURE__*/React.createElement("br", null), "RGB ", rgb), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 4
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: '400 24px/1 var(--font-display)'
    }
  }, name), note && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      opacity: 0.9
    }
  }, note)));
}
Object.assign(__ds_scope, { Swatch });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/content/Swatch.jsx", error: String((e && e.message) || e) }); }

// components/core/Button.jsx
try { (() => {
const VARIANTS = {
  primary: {
    background: 'var(--olive)',
    color: 'var(--cream)'
  },
  dark: {
    background: 'var(--brine)',
    color: 'var(--cream)'
  },
  light: {
    background: 'var(--cream)',
    color: 'var(--brine)'
  },
  outline: {
    background: 'transparent',
    color: 'var(--brine)',
    boxShadow: 'inset 0 0 0 1.5px var(--brine)'
  },
  'outline-light': {
    background: 'transparent',
    color: 'var(--cream)',
    boxShadow: 'inset 0 0 0 1.5px var(--cream)'
  }
};
const SIZES = {
  sm: {
    fontSize: 11,
    padding: '10px 16px',
    letterSpacing: '.12em',
    fontStretch: '125%'
  },
  md: {
    fontSize: 12,
    padding: '14px 22px',
    letterSpacing: '.12em',
    fontStretch: '125%'
  },
  lg: {
    fontSize: 26,
    padding: '24px 36px',
    letterSpacing: '.06em',
    fontStretch: '100%'
  }
};
function Button({
  variant = 'primary',
  size = 'md',
  caps,
  href,
  onClick,
  disabled,
  children,
  style
}) {
  const [hover, setHover] = React.useState(false);
  const upper = caps ?? size !== 'lg';
  const Tag = href ? 'a' : 'button';
  return /*#__PURE__*/React.createElement(Tag, {
    href: href,
    onClick: disabled ? undefined : onClick,
    disabled: Tag === 'button' ? disabled : undefined,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      border: 'none',
      borderRadius: 99,
      cursor: disabled ? 'default' : 'pointer',
      textDecoration: 'none',
      fontFamily: 'var(--font-body)',
      fontWeight: 600,
      lineHeight: 1,
      whiteSpace: 'nowrap',
      textTransform: upper ? 'uppercase' : 'none',
      transition: 'opacity .15s ease',
      opacity: disabled ? 0.4 : hover ? 0.86 : 1,
      ...SIZES[size],
      ...VARIANTS[variant],
      ...style
    }
  }, children);
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Button.jsx", error: String((e && e.message) || e) }); }

// components/core/Chip.jsx
try { (() => {
function Chip({
  onDark = false,
  children,
  style
}) {
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      padding: '8px 14px',
      borderRadius: 99,
      fontFamily: 'var(--font-body)',
      fontSize: 14,
      lineHeight: 1.2,
      color: onDark ? 'var(--cream)' : 'var(--brine)',
      boxShadow: onDark ? 'inset 0 0 0 1px rgba(243,238,226,.35)' : 'inset 0 0 0 1px rgba(36,38,26,.35)',
      ...style
    }
  }, children);
}
Object.assign(__ds_scope, { Chip });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Chip.jsx", error: String((e && e.message) || e) }); }

// components/core/Label.jsx
try { (() => {
const TONES = {
  accent: 'var(--olive)',
  ink: 'var(--brine)',
  muted: 'var(--ink-3)',
  'on-dark': 'var(--cream-2)',
  'on-dark-accent': 'var(--pepper)',
  'on-dark-muted': 'var(--salt)',
  inherit: 'inherit'
};
const SIZES = {
  sm: {
    fontSize: 11
  },
  md: {
    fontSize: 12
  },
  social: {
    fontSize: 26
  }
};
function Label({
  tone = 'accent',
  size = 'md',
  tracking = 'label',
  as = 'span',
  children,
  style
}) {
  const Tag = as;
  return /*#__PURE__*/React.createElement(Tag, {
    style: {
      fontFamily: 'var(--font-mono)',
      fontWeight: 500,
      lineHeight: 1,
      textTransform: 'uppercase',
      letterSpacing: tracking === 'running' ? '.1em' : '.06em',
      color: TONES[tone] || tone,
      ...SIZES[size],
      ...style
    }
  }, children);
}
Object.assign(__ds_scope, { Label });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Label.jsx", error: String((e && e.message) || e) }); }

// components/layout/RuleColumn.jsx
try { (() => {
/** Column opened by a top rule: kicker (mono), title (Gilda), body. Used for principles, steps, mission. */
function RuleColumn({
  kicker,
  title,
  children,
  note,
  weight = 'strong',
  onDark = false,
  titleSize = 22,
  ruleColor,
  style
}) {
  const rule = ruleColor ?? (onDark ? 'rgba(243,238,226,.3)' : weight === 'strong' ? 'var(--brine)' : 'rgba(36,38,26,.25)');
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 8,
      paddingTop: 14,
      borderTop: `${weight === 'strong' && !onDark ? 2 : 1}px solid ${rule}`,
      color: onDark ? 'var(--cream)' : 'var(--brine)',
      ...style
    }
  }, kicker && /*#__PURE__*/React.createElement("span", {
    style: {
      font: '500 11px var(--font-mono)',
      textTransform: 'uppercase',
      color: onDark ? 'var(--pepper)' : 'var(--olive)'
    }
  }, kicker), title && /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: titleSize,
      lineHeight: 1.15
    }
  }, title), children && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 14,
      lineHeight: 1.55,
      color: onDark ? 'var(--cream-2)' : 'var(--ink-3)'
    }
  }, children), note && /*#__PURE__*/React.createElement("span", {
    style: {
      font: '500 11px/1.5 var(--font-mono)',
      textTransform: 'uppercase',
      color: onDark ? 'var(--pepper)' : 'var(--olive)'
    }
  }, note));
}
Object.assign(__ds_scope, { RuleColumn });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/layout/RuleColumn.jsx", error: String((e && e.message) || e) }); }

// components/layout/RunningHeader.jsx
try { (() => {
/** Mono running header across the top of a page or band: left section, right document/page. */
function RunningHeader({
  number,
  left,
  right,
  onDark = false,
  style
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      gap: 24,
      font: '500 11px/1 var(--font-mono)',
      letterSpacing: '.1em',
      textTransform: 'uppercase',
      color: onDark ? 'var(--cream-2)' : 'var(--brine)',
      ...style
    }
  }, /*#__PURE__*/React.createElement("span", null, number && /*#__PURE__*/React.createElement("span", {
    style: {
      color: onDark ? 'var(--pepper)' : 'var(--olive)',
      marginRight: '1.6em'
    }
  }, number), left), /*#__PURE__*/React.createElement("span", null, right));
}
Object.assign(__ds_scope, { RunningHeader });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/layout/RunningHeader.jsx", error: String((e && e.message) || e) }); }

// components/layout/SectionHeader.jsx
try { (() => {
/** Numbered section label with a hairline running to the edge: "01  Voice ————". */
function SectionHeader({
  number,
  title,
  onDark = false,
  style
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 16,
      font: '500 12px/1 var(--font-mono)',
      textTransform: 'uppercase',
      letterSpacing: '.1em',
      color: onDark ? 'var(--cream)' : 'var(--brine)',
      ...style
    }
  }, number && /*#__PURE__*/React.createElement("span", {
    style: {
      color: onDark ? 'var(--pepper)' : 'var(--olive)'
    }
  }, number), /*#__PURE__*/React.createElement("span", null, title), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      height: 1,
      background: onDark ? 'rgba(243,238,226,.25)' : 'rgba(36,38,26,.25)'
    }
  }));
}
Object.assign(__ds_scope, { SectionHeader });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/layout/SectionHeader.jsx", error: String((e && e.message) || e) }); }

// components/layout/SpecRow.jsx
try { (() => {
/** Three-column row: mono label · large Gilda line · right-aligned note. Taglines, type scale, specs. */
function SpecRow({
  label,
  children,
  note,
  first = false,
  last = false,
  size = 32,
  style
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '110px minmax(0,1fr) 240px',
      gap: 16,
      alignItems: 'baseline',
      padding: '20px 0',
      borderTop: first ? '2px solid var(--brine)' : '1px solid rgba(36,38,26,.2)',
      borderBottom: last ? '1px solid rgba(36,38,26,.2)' : 'none',
      color: 'var(--brine)',
      ...style
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: '500 12px var(--font-mono)',
      textTransform: 'uppercase',
      color: 'var(--olive)'
    }
  }, label), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: size,
      lineHeight: 1.1
    }
  }, children), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 14,
      lineHeight: 1.5,
      color: 'var(--ink-3)',
      textAlign: 'right'
    }
  }, note));
}
Object.assign(__ds_scope, { SpecRow });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/layout/SpecRow.jsx", error: String((e && e.message) || e) }); }

// components/social/PhotoPlaceholder.jsx
try { (() => {
const asset = p => (typeof window !== 'undefined' && window.GILDA_ASSET_BASE || '') + 'assets/' + p;

/** Striped photo slot from the Canva kit. Replace with client photography. */
function PhotoPlaceholder({
  format = 'feed',
  src,
  style
}) {
  return /*#__PURE__*/React.createElement("img", {
    src: src || asset(`graphics/photo-placeholder-${format}.png`),
    alt: "",
    style: {
      width: '100%',
      display: 'block',
      objectFit: 'cover',
      ...style
    }
  });
}
Object.assign(__ds_scope, { PhotoPlaceholder });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/social/PhotoPlaceholder.jsx", error: String((e && e.message) || e) }); }

// components/social/PostMeta.jsx
try { (() => {
/** Top (or bottom) mono bar on a social post: page count, series, location. */
function PostMeta({
  left,
  right,
  style
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: 24,
      font: '500 26px/1 var(--font-mono)',
      letterSpacing: '.06em',
      textTransform: 'uppercase',
      position: 'relative',
      ...style
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 16
    }
  }, left), /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 16
    }
  }, right));
}
Object.assign(__ds_scope, { PostMeta });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/social/PostMeta.jsx", error: String((e && e.message) || e) }); }

// components/social/grounds.js
try { (() => {
// Ground → ink pairings from colours.txt: light grounds take Brine, dark grounds take Cream.
const GROUNDS = {
  cream: {
    bg: 'var(--cream)',
    fg: 'var(--brine)',
    secondary: 'var(--ink-2)',
    accent: 'var(--olive)',
    mark: 'var(--olive)',
    rule: 'rgba(36,38,26,.3)',
    dark: false
  },
  sand: {
    bg: 'var(--sand)',
    fg: 'var(--brine)',
    secondary: 'var(--ink-2)',
    accent: 'var(--olive)',
    mark: 'var(--olive)',
    rule: 'rgba(36,38,26,.3)',
    dark: false
  },
  'pepper-pale': {
    bg: 'var(--pepper-pale)',
    fg: 'var(--brine)',
    secondary: 'var(--ink-2)',
    accent: 'var(--olive)',
    mark: 'var(--olive)',
    rule: 'rgba(36,38,26,.3)',
    dark: false
  },
  pepper: {
    bg: 'var(--pepper)',
    fg: 'var(--brine)',
    secondary: 'var(--brine)',
    accent: 'var(--olive-deep)',
    mark: 'var(--olive-deep)',
    rule: 'rgba(36,38,26,.35)',
    dark: false
  },
  salt: {
    bg: 'var(--salt)',
    fg: 'var(--brine)',
    secondary: 'var(--brine)',
    accent: 'var(--brine)',
    mark: 'var(--brine)',
    rule: 'rgba(36,38,26,.35)',
    dark: false
  },
  olive: {
    bg: 'var(--olive)',
    fg: 'var(--cream)',
    secondary: 'var(--sand)',
    accent: 'var(--pepper-pale)',
    mark: 'var(--pepper)',
    rule: 'rgba(243,238,226,.35)',
    dark: true
  },
  'olive-deep': {
    bg: 'var(--olive-deep)',
    fg: 'var(--cream)',
    secondary: 'var(--sand)',
    accent: 'var(--pepper-pale)',
    mark: 'var(--pepper)',
    rule: 'rgba(243,238,226,.35)',
    dark: true
  },
  anchovy: {
    bg: 'var(--anchovy)',
    fg: 'var(--cream)',
    secondary: 'var(--sand)',
    accent: 'var(--pepper-pale)',
    mark: 'var(--pepper)',
    rule: 'rgba(243,238,226,.35)',
    dark: true
  },
  cure: {
    bg: 'var(--cure)',
    fg: 'var(--cream)',
    secondary: 'var(--sand)',
    accent: 'var(--pepper-pale)',
    mark: 'var(--pepper)',
    rule: 'rgba(243,238,226,.35)',
    dark: true
  },
  brine: {
    bg: 'var(--brine)',
    fg: 'var(--cream)',
    secondary: 'var(--sand)',
    accent: 'var(--pepper-pale)',
    mark: 'var(--pepper)',
    rule: 'rgba(243,238,226,.35)',
    dark: true
  }
};
const ground = name => GROUNDS[name] || GROUNDS.cream;
Object.assign(__ds_scope, { GROUNDS, ground });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/social/grounds.js", error: String((e && e.message) || e) }); }

// components/content/Quote.jsx
try { (() => {
/** Client testimonial at social scale (1080px canvas): big quote mark, Gilda quote, ruled attribution. */
function Quote({
  quote,
  name = 'Name Surname',
  business = 'Business name · Malta',
  ground: g = 'cream',
  scale = 1,
  style
}) {
  const c = __ds_scope.ground(g);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'contents',
      color: c.fg,
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 40 * scale
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      font: `400 ${200 * scale}px/.6 var(--font-display)`,
      color: c.mark
    }
  }, "\u201C"), /*#__PURE__*/React.createElement("div", {
    style: {
      font: `400 ${80 * scale}px/1.1 var(--font-display)`,
      textWrap: 'pretty'
    }
  }, quote)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 12 * scale,
      paddingTop: 28 * scale,
      borderTop: `${2 * scale}px solid ${c.rule}`
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: `400 ${44 * scale}px/1.1 var(--font-display)`
    }
  }, name), /*#__PURE__*/React.createElement("span", {
    style: {
      font: `500 ${24 * scale}px/1 var(--font-mono)`,
      letterSpacing: '.06em',
      textTransform: 'uppercase',
      color: c.accent
    }
  }, business)));
}
Object.assign(__ds_scope, { Quote });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/content/Quote.jsx", error: String((e && e.message) || e) }); }

// components/social/Post.jsx
try { (() => {
const FORMATS = {
  feed: [1080, 1350],
  square: [1080, 1080],
  story: [1080, 1920]
};

/** A social canvas at real pixel size (1080 wide). Sets ground + paired ink; children lay out top-to-bottom with space-between. */
function Post({
  format = 'feed',
  ground: g = 'cream',
  padding = 80,
  bleed = false,
  children,
  style
}) {
  const [w, h] = FORMATS[format];
  const c = __ds_scope.ground(g);
  const pad = bleed ? 0 : format === 'story' ? `240px ${padding}px 340px` : padding;
  return /*#__PURE__*/React.createElement("section", {
    "data-ground": g,
    style: {
      width: w,
      height: h,
      boxSizing: 'border-box',
      padding: pad,
      background: c.bg,
      color: c.fg,
      fontFamily: 'var(--font-body)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      position: 'relative',
      overflow: 'hidden',
      ...style
    }
  }, children);
}
Object.assign(__ds_scope, { Post });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/social/Post.jsx", error: String((e && e.message) || e) }); }

// dev/load-components.js
try { (() => {
// Preview helper: returns the compiled design-system namespace if _ds_bundle.js is loaded,
// otherwise transpiles components/*.jsx in the browser (needs React + @babel/standalone on the page).
(function () {
  const FILES = ["social/grounds.js", "branch/branches.js", "core/Button.jsx", "core/Label.jsx", "core/Chip.jsx", "brand/Mark.jsx", "brand/Wordmark.jsx", "brand/Lockup.jsx", "brand/Monogram.jsx", "brand/AppIcon.jsx", "brand/CreditLine.jsx", "branch/BranchDot.jsx", "branch/BranchDots.jsx", "branch/BranchTag.jsx", "branch/BranchCard.jsx", "layout/SectionHeader.jsx", "layout/RunningHeader.jsx", "layout/RuleColumn.jsx", "layout/SpecRow.jsx", "content/Quote.jsx", "content/DoDont.jsx", "content/Swatch.jsx", "social/Post.jsx", "social/PostMeta.jsx", "social/PhotoPlaceholder.jsx"];
  window.loadGilda = async function (root) {
    if (window.GILDA_ASSET_BASE == null) window.GILDA_ASSET_BASE = root;
    for (const k of Object.keys(window)) {
      try {
        const v = window[k];
        if (v && typeof v === 'object' && v.BranchDots && v.Button && v.Post) return v;
      } catch (e) {}
    }
    const src = {};
    await Promise.all(FILES.map(async f => {
      src[f] = await (await fetch(root + 'components/' + f)).text();
    }));
    const cache = {};
    const norm = (from, rel) => {
      const p = from.split('/');
      p.pop();
      rel.split('/').forEach(s => {
        if (s === '..') p.pop();else if (s !== '.') p.push(s);
      });
      return p.join('/');
    };
    const req = id => {
      if (id === 'react') return React;
      if (cache[id]) return cache[id].exports;
      const m = {
        exports: {}
      };
      cache[id] = m;
      const code = Babel.transform(src[id], {
        presets: ['react'],
        plugins: ['transform-modules-commonjs'],
        filename: id
      }).code;
      new Function('require', 'module', 'exports', 'React', code)(r => req(r === 'react' ? 'react' : norm(id, r)), m, m.exports, React);
      return m.exports;
    };
    const NS = {};
    FILES.forEach(f => Object.assign(NS, req(f)));
    return NS;
  };
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "dev/load-components.js", error: String((e && e.message) || e) }); }

// ui_kits/print/Collateral.jsx
try { (() => {
// Print + email collateral, recreated from brand book §11 Applications · print & email (page 19).
function BusinessCardFront() {
  const {
    Mark,
    Wordmark
  } = window.GS;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      width: 350,
      height: 200,
      background: 'var(--cream)',
      boxShadow: 'var(--shadow-print)',
      position: 'relative',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement(Mark, {
    height: 150,
    style: {
      position: 'absolute',
      right: 32,
      top: 24
    }
  }), /*#__PURE__*/React.createElement(Wordmark, {
    size: 36,
    style: {
      position: 'absolute',
      left: 26,
      bottom: 24
    }
  }));
}
function BusinessCardBack({
  name = 'Name Surname',
  role = 'Founder'
}) {
  const {
    BranchDots
  } = window.GS;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      width: 350,
      height: 200,
      background: 'var(--brine)',
      color: 'var(--cream)',
      boxShadow: 'var(--shadow-print)',
      padding: 22,
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 6
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: '400 22px/1.1 var(--font-display)'
    }
  }, name), /*#__PURE__*/React.createElement("span", {
    style: {
      font: '500 10px var(--font-mono)',
      textTransform: 'uppercase',
      color: 'var(--pepper)'
    }
  }, role)), /*#__PURE__*/React.createElement(BranchDots, {
    onDark: true,
    size: 8,
    gap: 4
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      font: '400 10px/1.7 var(--font-mono)',
      borderTop: '1px solid rgba(243,238,226,.25)',
      paddingTop: 10
    }
  }, /*#__PURE__*/React.createElement("span", null, "hello@thegildastudios.com", /*#__PURE__*/React.createElement("br", null), "+356 0000 0000"), /*#__PURE__*/React.createElement("span", {
    style: {
      textAlign: 'right'
    }
  }, "thegildastudios.com", /*#__PURE__*/React.createElement("br", null), "Malta")));
}
function EventPass({
  event = ['Launch', 'night'],
  name = ['Name', 'Surname'],
  role = 'Guest',
  ground = 'var(--anchovy)'
}) {
  const {
    Mark
  } = window.GS;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      width: 250,
      height: 420,
      background: 'var(--cream)',
      boxShadow: '0 10px 30px rgba(36,38,26,.2)',
      borderRadius: 12,
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      height: 140,
      background: ground,
      color: 'var(--cream)',
      padding: 16,
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      alignSelf: 'center',
      width: 44,
      height: 8,
      borderRadius: 99,
      background: 'var(--cream)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-end'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: '400 26px/.95 var(--font-display)'
    }
  }, event[0], /*#__PURE__*/React.createElement("br", null), event[1]), /*#__PURE__*/React.createElement("span", {
    style: {
      font: '500 9px/1.5 var(--font-mono)',
      textTransform: 'uppercase',
      textAlign: 'right'
    }
  }, "Produced by", /*#__PURE__*/React.createElement("br", null), "The Gilda Studios"))), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      padding: '18px 16px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      color: 'var(--brine)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 6
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: '400 28px/1.05 var(--font-display)'
    }
  }, name[0], /*#__PURE__*/React.createElement("br", null), name[1]), /*#__PURE__*/React.createElement("span", {
    style: {
      font: '500 10px var(--font-mono)',
      textTransform: 'uppercase',
      color: 'var(--anchovy)'
    }
  }, role)), /*#__PURE__*/React.createElement(Mark, {
    height: 92,
    style: {
      alignSelf: 'flex-end'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 4,
      font: '500 9px/1.5 var(--font-mono)',
      textTransform: 'uppercase',
      borderTop: '1px solid var(--brine)',
      paddingTop: 10
    }
  }, /*#__PURE__*/React.createElement("span", null, "Doors 19:00"), /*#__PURE__*/React.createElement("span", {
    style: {
      textAlign: 'right'
    }
  }, "Malta"))));
}
function EmailSignature() {
  const {
    Mark,
    Label
  } = window.GS;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      width: 300,
      background: 'var(--paper)',
      boxShadow: '0 10px 30px rgba(36,38,26,.12)',
      padding: 22,
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
      gap: 14,
      fontSize: 13,
      lineHeight: 1.5,
      color: 'var(--brine)'
    }
  }, /*#__PURE__*/React.createElement(Label, {
    size: "sm",
    style: {
      fontSize: 10
    }
  }, "Email signature"), /*#__PURE__*/React.createElement("span", null, "Grazzi,"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      paddingTop: 12,
      borderTop: '1px solid rgba(36,38,26,.15)'
    }
  }, /*#__PURE__*/React.createElement(Mark, {
    height: 50
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 2
    }
  }, /*#__PURE__*/React.createElement("b", {
    style: {
      fontWeight: 600
    }
  }, "Name Surname"), /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--ink-3)'
    }
  }, "Founder \xB7 The Gilda Studios"), /*#__PURE__*/React.createElement("span", {
    style: {
      font: '400 10px var(--font-mono)',
      color: 'var(--ink-3)'
    }
  }, "thegildastudios.com", /*#__PURE__*/React.createElement("br", null), "+356 0000 0000"))));
}
function PrintKit() {
  const {
    RunningHeader
  } = window.GS;
  const [flip, setFlip] = React.useState(false);
  const [ground, setGround] = React.useState(0);
  const grounds = ['var(--anchovy)', 'var(--olive)', 'var(--brine)'];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '40px 56px',
      minHeight: '100vh',
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
      gap: 40
    }
  }, /*#__PURE__*/React.createElement(RunningHeader, {
    number: "11",
    left: "Applications \xB7 print & email",
    right: "The Gilda Studios \xB7 Brand book \xB7 19"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 32,
      justifyContent: 'center',
      alignItems: 'center',
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 20
    }
  }, /*#__PURE__*/React.createElement("div", {
    onClick: () => setFlip(!flip),
    style: {
      cursor: 'pointer'
    },
    title: "Click to flip"
  }, flip ? /*#__PURE__*/React.createElement(BusinessCardBack, null) : /*#__PURE__*/React.createElement(BusinessCardFront, null)), /*#__PURE__*/React.createElement("div", {
    onClick: () => setFlip(!flip),
    style: {
      cursor: 'pointer'
    }
  }, flip ? /*#__PURE__*/React.createElement(BusinessCardFront, null) : /*#__PURE__*/React.createElement(BusinessCardBack, null))), /*#__PURE__*/React.createElement("div", {
    onClick: () => setGround((ground + 1) % grounds.length),
    style: {
      cursor: 'pointer'
    },
    title: "Click to change event colour"
  }, /*#__PURE__*/React.createElement(EventPass, {
    ground: grounds[ground]
  })), /*#__PURE__*/React.createElement(EmailSignature, null)));
}
window.PrintKit = PrintKit;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/print/Collateral.jsx", error: String((e && e.message) || e) }); }

// ui_kits/social/FeedTemplates.jsx
try { (() => {
// Feed 4x5 templates (1080x1350). Recreated from "Canva Templates - Feed 4x5.dc.html" using design-system components.
const img = p => window.GILDA_ASSET_BASE + 'assets/' + p;
const meta = {
  font: 'var(--social-meta)',
  letterSpacing: '.06em',
  textTransform: 'uppercase'
};
const h = (size, lh) => ({
  font: `400 ${size}px/${lh} var(--font-display)`
});
const body = {
  fontSize: 32,
  lineHeight: 1.45,
  color: 'var(--ink-2)',
  maxWidth: 820
};
function F01() {
  const {
    Post,
    PostMeta
  } = window.GS;
  return /*#__PURE__*/React.createElement(Post, {
    ground: "cream"
  }, /*#__PURE__*/React.createElement(PostMeta, {
    left: "The Gilda Studios",
    right: "Malta",
    style: {
      letterSpacing: '.08em'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: img('logos/gilda-mark-full-colour.png'),
    style: {
      height: 620
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 28
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: h(104, 1)
  }, "The Gilda Studios is open."), /*#__PURE__*/React.createElement("div", {
    style: {
      ...meta,
      color: 'var(--olive)'
    }
  }, "Web \xB7 Projects \xB7 Events \xB7 Social")));
}
function F02() {
  const {
    Post,
    PostMeta,
    BranchTag
  } = window.GS;
  return /*#__PURE__*/React.createElement(Post, {
    ground: "brine"
  }, /*#__PURE__*/React.createElement(PostMeta, {
    left: /*#__PURE__*/React.createElement(BranchTag, {
      branch: "plan",
      onDark: true,
      size: "social",
      style: {
        color: 'var(--cream)'
      }
    }),
    right: /*#__PURE__*/React.createElement("span", {
      style: {
        color: 'var(--salt)'
      }
    }, "Events")
  }), /*#__PURE__*/React.createElement("div", {
    style: h(150, 1)
  }, "Online and in the room."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 14,
      paddingTop: 28,
      borderTop: '2px solid rgba(243,238,226,.3)',
      font: '500 26px/1.4 var(--font-mono)',
      letterSpacing: '.04em',
      textTransform: 'uppercase',
      color: 'var(--cream-2)'
    }
  }, /*#__PURE__*/React.createElement("span", null, "Launches \xB7 Openings \xB7 Conferences"), /*#__PURE__*/React.createElement("span", null, "Now booking for spring")));
}
function Branch({
  branch,
  ground,
  illo,
  illoH,
  title,
  line
}) {
  const {
    Post,
    PostMeta,
    BranchTag
  } = window.GS;
  return /*#__PURE__*/React.createElement(Post, {
    ground: ground
  }, /*#__PURE__*/React.createElement(PostMeta, {
    left: /*#__PURE__*/React.createElement(BranchTag, {
      branch: branch,
      size: "social"
    }),
    right: "The Gilda Studios"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: img(illo),
    style: {
      height: illoH
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 28
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: h(96, 1.02)
  }, title), /*#__PURE__*/React.createElement("div", {
    style: body
  }, line)));
}
const F03 = () => /*#__PURE__*/React.createElement(Branch, {
  branch: "plan",
  ground: "cream",
  illo: "illustrations/01-olive-plan.png",
  illoH: 400,
  title: "One plan, from brief to the big day.",
  line: "Project management, event management and on-the-day coordination."
});
const F04 = () => /*#__PURE__*/React.createElement(Branch, {
  branch: "build",
  ground: "sand",
  illo: "illustrations/02-anchovy-build.png",
  illoH: 520,
  title: "We build it, host it and look after it.",
  line: "Web design, development, hosting and ongoing care."
});
function F05() {
  const {
    Post,
    PostMeta,
    BranchTag
  } = window.GS;
  return /*#__PURE__*/React.createElement(Post, {
    ground: "pepper-pale"
  }, /*#__PURE__*/React.createElement("img", {
    src: img('illustrations/03-pepper-grow.png'),
    style: {
      position: 'absolute',
      right: 40,
      top: 120,
      height: 900
    }
  }), /*#__PURE__*/React.createElement(PostMeta, {
    left: /*#__PURE__*/React.createElement(BranchTag, {
      branch: "grow",
      size: "social"
    })
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 28,
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      ...h(104, 1.02),
      maxWidth: 640
    }
  }, "Twelve posts a month. Planned by the 25th."), /*#__PURE__*/React.createElement("div", {
    style: {
      ...body,
      maxWidth: 600
    }
  }, "Social media management, content and campaigns.")));
}
function F06() {
  const {
    Post
  } = window.GS;
  const cell = (k, v) => /*#__PURE__*/React.createElement("div", {
    key: k,
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 12,
      padding: '24px 0',
      borderTop: '2px solid rgba(243,238,226,.4)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: '500 24px/1 var(--font-mono)',
      letterSpacing: '.06em',
      textTransform: 'uppercase',
      color: 'var(--sand)'
    }
  }, k), /*#__PURE__*/React.createElement("span", {
    style: h(48, 1.1)
  }, v));
  return /*#__PURE__*/React.createElement(Post, {
    ground: "anchovy"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      font: '500 26px/1.4 var(--font-mono)',
      letterSpacing: '.06em',
      textTransform: 'uppercase'
    }
  }, /*#__PURE__*/React.createElement("span", null, "Produced by", /*#__PURE__*/React.createElement("br", null), "The Gilda Studios"), /*#__PURE__*/React.createElement("span", null, "You're invited")), /*#__PURE__*/React.createElement("div", {
    style: h(180, 0.92)
  }, "Launch", /*#__PURE__*/React.createElement("br", null), "night"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '0 48px'
    }
  }, cell('Date', 'Fri 14 Nov'), cell('Doors', '19:00'), cell('Place', 'Valletta'), cell('RSVP', 'By 7 Nov')));
}
function F07() {
  const {
    Post,
    PostMeta,
    BranchTag,
    PhotoPlaceholder
  } = window.GS;
  return /*#__PURE__*/React.createElement(Post, {
    ground: "cream",
    bleed: true,
    style: {
      justifyContent: 'flex-start'
    }
  }, /*#__PURE__*/React.createElement(PhotoPlaceholder, {
    format: "feed",
    style: {
      width: 1080,
      height: 820
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      padding: '56px 80px 72px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between'
    }
  }, /*#__PURE__*/React.createElement(PostMeta, {
    left: /*#__PURE__*/React.createElement(BranchTag, {
      branch: "build",
      size: "social"
    }, "02 / Build \xB7 Client work"),
    right: "2026"
  }), /*#__PURE__*/React.createElement("div", {
    style: h(80, 1.04)
  }, "A new site for CS Butcher."), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 30,
      lineHeight: 1.4,
      color: 'var(--ink-2)'
    }
  }, "Online ordering and delivery across the south of Malta.")));
}
function F08() {
  const {
    Post,
    PostMeta,
    BranchTag
  } = window.GS;
  const items = ['Confirm the guest list by Monday.', 'Schedule the launch posts.', 'Check the booking page on a phone.'];
  return /*#__PURE__*/React.createElement(Post, {
    ground: "sand"
  }, /*#__PURE__*/React.createElement(PostMeta, {
    left: /*#__PURE__*/React.createElement(BranchTag, {
      branch: "plan",
      size: "social"
    }),
    right: "The Gilda Studios"
  }), /*#__PURE__*/React.createElement("div", {
    style: h(104, 1.02)
  }, "Before your opening night."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column'
    }
  }, items.map((t, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      display: 'grid',
      gridTemplateColumns: '110px 1fr',
      gap: 20,
      alignItems: 'baseline',
      padding: '30px 0',
      borderTop: i === 0 ? '2px solid var(--brine)' : '1px solid rgba(36,38,26,.3)',
      borderBottom: i === 2 ? '1px solid rgba(36,38,26,.3)' : 'none'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: '500 28px/1 var(--font-mono)',
      color: 'var(--olive)'
    }
  }, "0", i + 1), /*#__PURE__*/React.createElement("span", {
    style: h(48, 1.15)
  }, t)))));
}
function F09() {
  const {
    Post,
    PostMeta,
    Quote
  } = window.GS;
  return /*#__PURE__*/React.createElement(Post, {
    ground: "olive"
  }, /*#__PURE__*/React.createElement(PostMeta, {
    left: "Client words",
    right: "The Gilda Studios"
  }), /*#__PURE__*/React.createElement(Quote, {
    ground: "olive",
    quote: "One call, one plan, and the opening went exactly as we had hoped."
  }));
}
function F10() {
  const {
    Post,
    PostMeta
  } = window.GS;
  return /*#__PURE__*/React.createElement(Post, {
    ground: "olive-deep"
  }, /*#__PURE__*/React.createElement("img", {
    src: img('logos/gilda-mark-full-colour.png'),
    style: {
      position: 'absolute',
      right: -60,
      bottom: -40,
      height: 760
    }
  }), /*#__PURE__*/React.createElement(PostMeta, {
    left: "01 / 05",
    right: "Swipe"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 32,
      position: 'relative',
      marginBottom: 280
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: h(150, 0.98)
  }, "How we work"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 34,
      lineHeight: 1.4,
      maxWidth: 600,
      color: 'var(--sand)'
    }
  }, "From brief to launch, on one shared calendar.")));
}
function F11() {
  const {
    Post,
    PostMeta,
    BranchDots
  } = window.GS;
  return /*#__PURE__*/React.createElement(Post, {
    ground: "cream"
  }, /*#__PURE__*/React.createElement(PostMeta, {
    left: "02 / 05",
    right: "How we work"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 36,
      paddingTop: 40,
      borderTop: '4px solid var(--olive)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: '500 30px/1 var(--font-mono)',
      letterSpacing: '.06em',
      textTransform: 'uppercase',
      color: 'var(--olive)'
    }
  }, "Week 1"), /*#__PURE__*/React.createElement("span", {
    style: h(200, 0.9)
  }, "Brief"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 40,
      lineHeight: 1.4,
      color: 'var(--ink-2)',
      maxWidth: 820
    }
  }, "One call to understand the business and the goal.")), /*#__PURE__*/React.createElement(BranchDots, {
    size: 24,
    gap: 16
  }));
}
function F12() {
  const {
    Post,
    BranchDots,
    Lockup,
    Button
  } = window.GS;
  return /*#__PURE__*/React.createElement(Post, {
    ground: "brine"
  }, /*#__PURE__*/React.createElement(BranchDots, {
    onDark: true,
    size: 24,
    gap: 16
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement(Lockup, {
    size: 104,
    color: "var(--cream)"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 36
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: h(84, 1.05)
  }, "Start with a conversation."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: 24
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "light",
    size: "lg"
  }, "hello@thegildastudios.com"), /*#__PURE__*/React.createElement("span", {
    style: {
      font: '500 24px/1 var(--font-mono)',
      letterSpacing: '.06em',
      textTransform: 'uppercase',
      color: 'var(--cream-2)'
    }
  }, "Malta"))));
}
window.FEED_TEMPLATES = [{
  id: 'F01',
  name: 'Announcement',
  ground: 'Cream',
  C: F01
}, {
  id: 'F02',
  name: 'Statement',
  ground: 'Brine',
  C: F02
}, {
  id: 'F03',
  name: 'Branch · Plan',
  ground: 'Cream',
  C: F03
}, {
  id: 'F04',
  name: 'Branch · Build',
  ground: 'Sand',
  C: F04
}, {
  id: 'F05',
  name: 'Branch · Grow',
  ground: 'Pepper pale',
  C: F05
}, {
  id: 'F06',
  name: 'Event',
  ground: 'Anchovy',
  C: F06
}, {
  id: 'F07',
  name: 'Photo post',
  ground: 'Cream',
  C: F07
}, {
  id: 'F08',
  name: 'Tips list',
  ground: 'Sand',
  C: F08
}, {
  id: 'F09',
  name: 'Testimonial',
  ground: 'Olive',
  C: F09
}, {
  id: 'F10',
  name: 'Carousel · cover',
  ground: 'Olive deep',
  C: F10
}, {
  id: 'F11',
  name: 'Carousel · inner',
  ground: 'Cream',
  C: F11
}, {
  id: 'F12',
  name: 'Carousel · end / CTA',
  ground: 'Brine',
  C: F12
}];
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/social/FeedTemplates.jsx", error: String((e && e.message) || e) }); }

// ui_kits/social/Gallery.jsx
try { (() => {
// Template gallery + single-post viewer.
function Thumb({
  t,
  scale,
  onClick,
  active
}) {
  const C = t.C;
  return /*#__PURE__*/React.createElement("div", {
    role: "button",
    tabIndex: 0,
    onClick: onClick,
    onKeyDown: e => e.key === 'Enter' && onClick(),
    style: {
      cursor: 'pointer',
      display: 'flex',
      flexDirection: 'column',
      gap: 10,
      outline: 'none'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 1080 * scale,
      height: 1350 * scale,
      overflow: 'hidden',
      boxShadow: active ? '0 0 0 3px var(--olive)' : 'var(--shadow-post)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      transform: `scale(${scale})`,
      transformOrigin: '0 0'
    }
  }, /*#__PURE__*/React.createElement(C, null))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      gap: 8,
      font: '500 11px/1 var(--font-mono)',
      textTransform: 'uppercase',
      letterSpacing: '.06em'
    }
  }, /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--olive)'
    }
  }, t.id), " ", t.name), /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--ink-3)'
    }
  }, t.ground)));
}
function Viewer({
  i,
  setI,
  onClose
}) {
  const {
    Button,
    Label
  } = window.GS;
  const list = window.FEED_TEMPLATES;
  const t = list[i];
  const C = t.C;
  React.useEffect(() => {
    const k = e => {
      if (e.key === 'ArrowRight') setI((i + 1) % list.length);
      if (e.key === 'ArrowLeft') setI((i - 1 + list.length) % list.length);
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', k);
    return () => window.removeEventListener('keydown', k);
  });
  const s = Math.min(0.5, (window.innerHeight - 180) / 1350);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'fixed',
      inset: 0,
      background: 'var(--brine)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 24,
      zIndex: 10
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 1080 * s,
      height: 1350 * s,
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      transform: `scale(${s})`,
      transformOrigin: '0 0'
    }
  }, /*#__PURE__*/React.createElement(C, null))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "outline-light",
    size: "sm",
    onClick: () => setI((i - 1 + list.length) % list.length)
  }, "Prev"), /*#__PURE__*/React.createElement(Label, {
    tone: "on-dark",
    style: {
      minWidth: 240,
      textAlign: 'center'
    }
  }, t.id, " \xB7 ", t.name, " \xB7 ", t.ground), /*#__PURE__*/React.createElement(Button, {
    variant: "outline-light",
    size: "sm",
    onClick: () => setI((i + 1) % list.length)
  }, "Next"), /*#__PURE__*/React.createElement(Button, {
    variant: "light",
    size: "sm",
    onClick: onClose
  }, "Close")));
}
function SocialKit() {
  const {
    RunningHeader,
    BranchDots
  } = window.GS;
  const [open, setOpen] = React.useState(null);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '40px 56px 64px',
      display: 'flex',
      flexDirection: 'column',
      gap: 32,
      minHeight: '100vh',
      boxSizing: 'border-box'
    }
  }, /*#__PURE__*/React.createElement(RunningHeader, {
    number: "06",
    left: "Templates \xB7 Feed posts 4x5",
    right: "The Gilda Studios \xB7 Canva kit v1.0"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-end',
      gap: 24,
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      font: '400 56px/1 var(--font-display)'
    }
  }, "Feed posts"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 14,
      color: 'var(--ink-3)'
    }
  }, "12 templates \xB7 1080 \xD7 1350 \xB7 one ground per post"), /*#__PURE__*/React.createElement(BranchDots, {
    size: 12
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, 216px)',
      gap: '28px 24px'
    }
  }, window.FEED_TEMPLATES.map((t, i) => /*#__PURE__*/React.createElement(Thumb, {
    key: t.id,
    t: t,
    scale: 0.2,
    active: open === i,
    onClick: () => setOpen(i)
  }))), open !== null && /*#__PURE__*/React.createElement(Viewer, {
    i: open,
    setI: setOpen,
    onClose: () => setOpen(null)
  }));
}
window.SocialKit = SocialKit;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/social/Gallery.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/Homepage.jsx
try { (() => {
// Homepage sections, recreated from brand book §12 (pages 20–21).
const gimg = p => window.GILDA_ASSET_BASE + 'assets/' + p;
const go = id => {
  const el = document.getElementById(id);
  if (el) window.scrollTo({
    top: el.offsetTop - 70,
    behavior: 'smooth'
  });
};
function SiteHeader() {
  const {
    Mark,
    Wordmark,
    Button
  } = window.GS;
  const nav = [['Plan', 'branches'], ['Build', 'branches'], ['Grow', 'branches'], ['Work', null], ['About', null]];
  return /*#__PURE__*/React.createElement("header", {
    style: {
      position: 'sticky',
      top: 0,
      zIndex: 5,
      background: 'var(--paper)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 16,
      padding: '16px 32px',
      borderBottom: '1px solid rgba(36,38,26,.1)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement(Mark, {
    height: 34
  }), /*#__PURE__*/React.createElement(Wordmark, {
    layout: "line",
    size: 22
  })), /*#__PURE__*/React.createElement("nav", {
    style: {
      display: 'flex',
      gap: 24,
      fontSize: 13,
      fontWeight: 500
    }
  }, nav.map(([n, id]) => /*#__PURE__*/React.createElement("a", {
    key: n,
    onClick: () => id && go(id),
    style: {
      color: 'var(--brine)',
      textDecoration: 'none',
      cursor: id ? 'pointer' : 'default'
    }
  }, n))), /*#__PURE__*/React.createElement(Button, {
    size: "sm",
    onClick: () => go('contact')
  }, "Book a chat"));
}
function Hero() {
  const {
    Button,
    Label,
    Mark
  } = window.GS;
  return /*#__PURE__*/React.createElement("section", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'minmax(0,1.1fr) minmax(0,1fr)',
      gap: 24,
      alignItems: 'center',
      padding: '64px 32px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 18
    }
  }, /*#__PURE__*/React.createElement(Label, {
    size: "sm"
  }, "Mer\u0127ba \xB7 Studio for digital and events, Malta"), /*#__PURE__*/React.createElement("span", {
    style: {
      font: '400 58px/1 var(--font-display)'
    }
  }, "The right ingredients."), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 15,
      lineHeight: 1.6,
      color: 'var(--ink-3)',
      maxWidth: 420
    }
  }, "Websites, projects, events and social media from one team. One contact, one plan, one invoice."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "dark",
    size: "sm",
    onClick: () => go('contact')
  }, "Book a chat"), /*#__PURE__*/React.createElement(Button, {
    variant: "outline",
    size: "sm",
    onClick: () => go('how')
  }, "See our work"))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement(Mark, {
    height: 280
  })));
}
function BranchBand() {
  const {
    BranchDot
  } = window.GS;
  const rows = [['01', 'plan', 'Plan', 'Project management, events and on-the-day coordination.'], ['02', 'build', 'Build', 'Web design, development, hosting and ongoing care.'], ['03', 'grow', 'Grow', 'Social media management, content and campaigns.']];
  const [hover, setHover] = React.useState(null);
  return /*#__PURE__*/React.createElement("section", {
    id: "branches",
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3,1fr)',
      background: 'var(--brine)',
      color: 'var(--cream)'
    }
  }, rows.map(([n, b, name, line], i) => /*#__PURE__*/React.createElement("div", {
    key: b,
    onMouseEnter: () => setHover(b),
    onMouseLeave: () => setHover(null),
    style: {
      padding: '22px 32px 24px',
      display: 'flex',
      flexDirection: 'column',
      gap: 8,
      borderRight: i < 2 ? '1px solid rgba(243,238,226,.15)' : 'none',
      background: hover === b ? 'var(--brine-deep)' : 'transparent',
      transition: 'background .15s ease',
      cursor: 'pointer'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: '500 10px var(--font-mono)',
      color: 'var(--salt)'
    }
  }, n), /*#__PURE__*/React.createElement(BranchDot, {
    branch: b,
    onDark: true,
    size: 11
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      font: '400 28px/1 var(--font-display)'
    }
  }, name), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13,
      lineHeight: 1.5,
      color: 'var(--cream-2)'
    }
  }, line))));
}
function HowWeWork() {
  const {
    RuleColumn,
    Label
  } = window.GS;
  const steps = [['Week 1', 'Brief', 'One call to understand the business and the goal.', 1], ['Week 2', 'Plan', 'A single plan with owners and dates you can see.', 1], ['Ongoing', 'Make', 'Pages, event logistics and posts, made in parallel.', 0], ['The day', 'Launch', "Online, in the room, or both. We're there for it.", 0]];
  return /*#__PURE__*/React.createElement("section", {
    id: "how",
    style: {
      padding: '56px 32px',
      display: 'flex',
      flexDirection: 'column',
      gap: 28
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'baseline',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: '400 38px/1.1 var(--font-display)'
    }
  }, "How we work"), /*#__PURE__*/React.createElement(Label, {
    size: "sm"
  }, "One shared calendar")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4,1fr)',
      gap: 20
    }
  }, steps.map(([k, t, d, on]) => /*#__PURE__*/React.createElement(RuleColumn, {
    key: t,
    kicker: k,
    title: t,
    ruleColor: on ? 'var(--olive)' : 'rgba(100,110,44,.35)',
    style: {
      gap: 10
    }
  }, d))));
}
function ContactBand() {
  const {
    Button
  } = window.GS;
  const [sent, setSent] = React.useState(false);
  return /*#__PURE__*/React.createElement("section", {
    id: "contact",
    style: {
      background: 'var(--olive)',
      color: 'var(--cream)',
      padding: '40px 32px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-end',
      gap: 24,
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: '400 42px/1.05 var(--font-display)'
    }
  }, "Start with a conversation."), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 15,
      lineHeight: 1.55,
      maxWidth: 420
    }
  }, sent ? 'Grazzi. We reply within one working day.' : "Tell us what you're planning. We reply within one working day.")), /*#__PURE__*/React.createElement(Button, {
    variant: "light",
    size: "sm",
    caps: true,
    onClick: () => setSent(true)
  }, "hello@thegildastudios.com"));
}
function Homepage() {
  const {
    CreditLine
  } = window.GS;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1200,
      margin: '0 auto',
      background: 'var(--paper)',
      minHeight: '100vh',
      fontFamily: 'var(--font-body)',
      color: 'var(--brine)'
    }
  }, /*#__PURE__*/React.createElement(SiteHeader, null), /*#__PURE__*/React.createElement(Hero, null), /*#__PURE__*/React.createElement(BranchBand, null), /*#__PURE__*/React.createElement(HowWeWork, null), /*#__PURE__*/React.createElement(ContactBand, null));
}
window.Homepage = Homepage;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/Homepage.jsx", error: String((e && e.message) || e) }); }

__ds_ns.BranchCard = __ds_scope.BranchCard;

__ds_ns.BranchDot = __ds_scope.BranchDot;

__ds_ns.BranchDots = __ds_scope.BranchDots;

__ds_ns.BranchTag = __ds_scope.BranchTag;

__ds_ns.BRANCHES = __ds_scope.BRANCHES;

__ds_ns.ORDER = __ds_scope.ORDER;

__ds_ns.AppIcon = __ds_scope.AppIcon;

__ds_ns.CreditLine = __ds_scope.CreditLine;

__ds_ns.Lockup = __ds_scope.Lockup;

__ds_ns.Mark = __ds_scope.Mark;

__ds_ns.Monogram = __ds_scope.Monogram;

__ds_ns.Wordmark = __ds_scope.Wordmark;

__ds_ns.DoDont = __ds_scope.DoDont;

__ds_ns.Quote = __ds_scope.Quote;

__ds_ns.Swatch = __ds_scope.Swatch;

__ds_ns.Button = __ds_scope.Button;

__ds_ns.Chip = __ds_scope.Chip;

__ds_ns.Label = __ds_scope.Label;

__ds_ns.RuleColumn = __ds_scope.RuleColumn;

__ds_ns.RunningHeader = __ds_scope.RunningHeader;

__ds_ns.SectionHeader = __ds_scope.SectionHeader;

__ds_ns.SpecRow = __ds_scope.SpecRow;

__ds_ns.PhotoPlaceholder = __ds_scope.PhotoPlaceholder;

__ds_ns.Post = __ds_scope.Post;

__ds_ns.PostMeta = __ds_scope.PostMeta;

__ds_ns.GROUNDS = __ds_scope.GROUNDS;

})();
