# AGROGUIA.AI Official Design System

## 1. Brand Identity

### Product Name

**AGROGUIA.AI**

### Core Positioning

AGROGUIA.AI is the AI infrastructure layer for intelligent agriculture. The product should feel like a serious operating system for farm decisions, not a generic agriculture website or a decorative green farming app.

### Design Personality

| Trait | Meaning In The Interface |
|---|---|
| Intelligent | Every surface should feel informed, contextual, and decision-oriented. |
| Premium | Visual choices should be restrained, intentional, and startup-grade. |
| Futuristic | The product should feel like modern AI infrastructure applied to agriculture. |
| Trustworthy | Interfaces must be calm, legible, stable, and low-noise. |
| Agricultural | The system should reference real farmer decisions, risk, crops, weather, finance, and schemes. |
| Modern SaaS | Layouts should use clear hierarchy, strong spacing, dashboard realism, and consistent primitives. |
| AI-native | UI should communicate structured intelligence rather than simple static content. |

### Visual Tone

The visual tone is dark, cinematic, data-rich, and technical. The landing page defines the core look:

```text
near-black base
glass panels
emerald/teal intelligence accents
subtle grid systems
thin borders
controlled glow
structured data modules
```

### Emotional Tone

The emotional tone is confidence under uncertainty. Farmers should feel that AGROGUIA.AI converts scattered information into usable decisions. The interface should reduce anxiety, not add complexity.

### Product Feel

The product should feel like:

```text
The Operating System for Intelligent Agriculture
```

It should not feel like:

```text
a generic crop advisory form
a cartoon farming app
a template dashboard
a simple chatbot wrapper
```

---

## 2. Color System

The color system is extracted from `app/sections/LandingPage.tsx`. Future phases should formalize these as implementation tokens, but Phase 2 is documentation-only.

### Primary Colors

| Token Name | Value / Tailwind Usage | Purpose | Use For | Do Not Use For |
|---|---|---|---|---|
| `agro-bg-deep` | `#07100d` | Core application background | Page base, hero base, authenticated shell future background | Small text, borders, warning states |
| `agro-bg-section` | `#091410` | Secondary dark section background | Alternating sections, dashboard zones, secondary panels | Primary buttons, icon fills |
| `agro-cta` | `emerald-200` | Primary action color | Main CTA, active high-confidence action, selected command | Large full-page backgrounds |
| `agro-cta-hover` | `emerald-100` | Primary CTA hover | Hover state for high-value actions | Static labels |
| `agro-signal` | `emerald-300` | Intelligence signal accent | Borders, glows, badges, selected states | Body paragraphs |
| `agro-teal-signal` | `teal-200` | Secondary intelligence accent | Maps, location, technology, network signals | Error or destructive states |

### Secondary Colors

| Token Name | Value / Tailwind Usage | Purpose | Use For | Do Not Use For |
|---|---|---|---|---|
| `agro-surface-slate` | `slate-950/90` | Deep console surface | Dashboard preview shells, modal bases, data consoles | Primary CTA backgrounds |
| `agro-surface-black-soft` | `black/25` | Internal panel depth | Nested panels, timeline rows, subtle inset areas | Main page background |
| `agro-surface-black-strong` | `black/35` | Dense technical panels | Code-like advisory blocks, financial comparisons, AI reasoning modules | General body copy backgrounds |
| `agro-surface-white-025` | `white/[0.025]` | Lowest glass layer | Very subtle rows and compact metadata cards | Important CTAs |
| `agro-surface-white-035` | `white/[0.035]` | Standard glass card | Feature cards, dashboard cards, workflow cards | Error states |
| `agro-surface-white-055` | `white/[0.055]` | Hover/elevated glass card | Hover backgrounds and active surfaces | Static base backgrounds |

### Accent Colors

| Token Name | Value / Tailwind Usage | Purpose | Use For | Do Not Use For |
|---|---|---|---|---|
| `agro-accent-emerald-soft` | `emerald-300/10` | Soft active fill | Badges, logo tile, recommendation panels | Destructive warnings |
| `agro-accent-emerald-border` | `emerald-300/20`, `emerald-300/25` | Active/accent border | CTA containers, active cards, hover borders | Default card borders everywhere |
| `agro-accent-teal-glow` | `rgba(45,212,191,0.20)` | AI atmospheric glow | Hero radial glow, technology atmosphere | Dense content cards |

### Success Colors

| Token Name | Value / Tailwind Usage | Purpose | Use For | Do Not Use For |
|---|---|---|---|---|
| `agro-success-text` | `emerald-100`, `emerald-200` | Positive intelligence | Recommendation labels, safe status, primary success indicators | Long body copy |
| `agro-success-bg` | `emerald-300/10`, `emerald-950/20` | Success panel background | Scheme value, safe financial option, validated status | Full-page sections |
| `agro-success-border` | `emerald-400/20`, `emerald-300/20` | Success border | Positive comparison cards, status chips | Default dividers |

### Warning Colors

| Token Name | Value / Tailwind Usage | Purpose | Use For | Do Not Use For |
|---|---|---|---|---|
| `agro-warning-text` | `amber-200`, `amber-300` | Warning emphasis | Risk labels, timing windows, caution states | Main headings |
| `agro-warning-bg` | `amber` at low opacity | Warning panel background | Spray timing, financial caution, forecast warnings | General card background |

### Error Colors

| Token Name | Value / Tailwind Usage | Purpose | Use For | Do Not Use For |
|---|---|---|---|---|
| `agro-error-text` | `red-200`, `red-400` | Error and threat text | Fraud warnings, high-risk states, destructive actions | Positive or neutral indicators |
| `agro-error-bg` | `red-500/10`, `red-950/20` | Error panel background | Threat badges, unsafe loan comparison, validation errors | Standard inactive cards |
| `agro-error-border` | `red-400/20`, `red-400/15` | Error border | Threat panels and high-risk warnings | Normal borders |

### Neutral Colors

| Token Name | Value / Tailwind Usage | Purpose | Use For | Do Not Use For |
|---|---|---|---|---|
| `agro-text-primary` | `white`, `slate-100` | Primary readable text | Headings, important labels, major values | Disabled copy |
| `agro-text-secondary` | `slate-300`, `slate-400` | Supporting text | Paragraphs, descriptions, secondary labels | Hero title |
| `agro-text-muted` | `slate-500` | Metadata | Captions, small labels, timestamps, secondary row labels | Form validation errors |
| `agro-border-base` | `white/10` | Default subtle divider | Cards, panels, headers, rows | High-attention selected state |
| `agro-border-subtle` | `white/5` | Internal row separators | Timeline rows, data lists | Main card boundary |

### Background Colors

| Token Name | Value / Tailwind Usage | Purpose |
|---|---|---|
| `agro-page-bg` | `#07100d` | Global dark page background |
| `agro-section-bg` | `#091410` | Alternating section background |
| `agro-console-bg` | `slate-950/90` | Dashboard console background |
| `agro-header-bg` | `#07100d/85` | Sticky header background with blur |

### Card Colors

| Token Name | Value / Tailwind Usage | Purpose |
|---|---|---|
| `agro-card-glass` | `white/[0.035]` | Standard glass card |
| `agro-card-glass-hover` | `white/[0.055]` | Hover/elevated card state |
| `agro-card-subtle` | `white/[0.025]` | Small supportive cards |
| `agro-card-inset` | `black/25`, `black/35` | Nested console areas |

### Border Colors

| Token Name | Value / Tailwind Usage | Purpose |
|---|---|---|
| `agro-border-default` | `white/10` | Default card/header boundary |
| `agro-border-muted` | `white/5` | Internal row divider |
| `agro-border-active` | `emerald-300/20`, `emerald-300/25` | Active, selected, highlighted panels |
| `agro-border-cta` | `emerald-300/20` | CTA container border |
| `agro-border-risk` | `red-400/20` | High-risk threat surfaces |

### Glow Colors

| Token Name | Value / Tailwind Usage | Purpose |
|---|---|---|
| `agro-glow-teal` | `rgba(45,212,191,0.20)` | Hero and AI atmosphere |
| `agro-glow-emerald-soft` | `emerald-950/30`, `emerald-300/10` | Logo tile, active controls |
| `agro-shadow-console` | `shadow-2xl shadow-black/40` | Elevated dashboard preview |

---

## 3. Gradient System

### Hero Gradients

| Gradient | Source Pattern | Usage |
|---|---|---|
| Hero grid | `linear-gradient(to_right, rgba(255,255,255,0.055) 1px, transparent 1px)` plus vertical grid | Use for large intelligence surfaces, public hero, future dashboard shell atmosphere |
| Hero radial glow | `radial-gradient(ellipse_at_50%_-20%, rgba(45,212,191,0.20), transparent 42%)` | Use behind primary product messaging and major AI moments |
| Hero fade | `linear-gradient(180deg, rgba(7,16,13,0) 0%, #07100d 92%)` | Use to fade visual atmosphere into dark base |

### Card Gradients

Cards should generally use flat translucent glass surfaces. Gradients should be rare inside standard cards. Use gradients only for:

- CTA panels.
- System highlight cards.
- Special AI recommendation panels.
- Empty states that need emotional pull.

### Glow Gradients

Glow gradients should be subtle, not decorative. Use teal and emerald glows to imply intelligence, infrastructure, sensing, and reasoning.

### Accent Gradients

Accent gradients should appear in CTA containers or high-level product moments:

```text
linear-gradient(135deg, rgba(16,185,129,0.18), rgba(255,255,255,0.04) 45%, rgba(45,212,191,0.12))
```

Use this style for final CTA panels, future onboarding completion moments, or dashboard generation prompts.

### Background Gradients

Background gradients should be reserved for page-level atmosphere. Avoid using saturated gradients behind dense data tables or long forms.

---

## 4. Typography System

The product uses Inter through the application layout. Typography should feel editorial, confident, and technical.

### Typography Scale

| Role | Recommended Class Pattern | Weight | Usage Rules |
|---|---|---:|---|
| Hero Title | `text-5xl sm:text-6xl lg:text-7xl leading-[1.03]` | 600 | Use only for public hero or major product identity moments |
| Page Title | `text-4xl sm:text-5xl lg:text-6xl leading-tight` | 600 | Use for major authenticated product pages after migration |
| Section Title | `text-3xl sm:text-4xl lg:text-5xl leading-tight` | 600 | Use for major sections and dashboard groups |
| Subsection Title | `text-2xl sm:text-3xl` | 600 | Use for panels and secondary modules |
| Card Title | `text-lg` to `text-xl` | 600 | Use for feature cards, metric panels, advisory blocks |
| Metric Value | `text-2xl` to `text-4xl` | 600 | Use for dashboard numbers and key intelligence values |
| Body Text | `text-base leading-8` | 400 | Use for landing copy and explanatory text |
| Dashboard Body | `text-sm leading-7` | 400 | Use for app panels and advisory descriptions |
| Small Text | `text-xs leading-5` | 400 | Use for metadata and compact descriptions |
| Label | `text-xs uppercase` or `text-sm font-medium` | 500-600 | Use for system labels, form labels, and section eyebrows |
| Caption | `text-[11px]` or `text-xs` | 400 | Use for technical metadata and timestamps |
| Badge Text | `text-xs font-medium` | 500 | Use for compact state indicators |

### Typography Rules

- Use `white` or `slate-100` for primary headings.
- Use `slate-300` and `slate-400` for explanatory copy.
- Use `slate-500` for metadata, captions, timestamps, and low-priority labels.
- Avoid excessive uppercase text. Use uppercase only for technical metadata and section eyebrows.
- Avoid overly bold typography. The official system prefers `font-semibold` over heavy weights.
- Keep line heights generous for body copy and tighter for large headlines.

---

## 5. Spacing System

### Official Spacing Scale

| Scale | Tailwind Values | Usage |
|---|---|---|
| Small | `gap-2`, `gap-3`, `p-3`, `px-3`, `py-2` | Badges, compact controls, timeline rows |
| Medium | `gap-4`, `p-4`, `p-5`, `mt-5` | Standard cards, forms, dashboard widgets |
| Large | `gap-6`, `p-6`, `mt-8`, `space-y-6` | Major panels, auth cards, onboarding cards |
| Extra Large | `gap-10`, `gap-12`, `py-20`, `lg:py-28` | Sections, page modules, landing-style narrative zones |

### Section Spacing

Use:

```text
px-4 py-20 sm:px-6 lg:py-28
```

for major marketing or high-level product sections.

### Container Spacing

Use:

```text
max-w-7xl mx-auto px-4 sm:px-6
```

for broad product layouts.

Use:

```text
max-w-5xl mx-auto
```

for focused content or form-driven pages.

### Card Spacing

| Card Type | Padding |
|---|---|
| Compact metric card | `p-4` |
| Standard feature card | `p-5` |
| Narrative card | `p-6` |
| Major CTA card | `p-8 sm:p-12` |

### Form Spacing

Recommended future pattern:

- Field stack: `space-y-2`
- Form group: `space-y-4`
- Multi-step wizard body: `space-y-5` or `space-y-6`
- Form action area: `pt-4 flex gap-3`

### Dashboard Spacing

Recommended future pattern:

- Dashboard page shell: `p-4 sm:p-6 lg:p-8`
- Dashboard modules: `gap-4` or `gap-6`
- Major dashboard groups: `space-y-6`
- Dense data rows: `px-3 py-2`

---

## 6. Border Radius System

The landing page uses refined, moderate radii. The official system should avoid overly pill-shaped or overly rounded surfaces except for chips.

| Element | Official Radius | Usage Rule |
|---|---|---|
| Buttons | `rounded-md` | Default for CTAs and command buttons |
| Small icon tiles | `rounded-md` | Use for icon containers and logo tiles |
| Cards | `rounded-lg` | Use for feature, dashboard, and advisory cards |
| Nested rows | `rounded-md` | Use inside cards for timeline/data rows |
| Badges / chips | `rounded-full` or `rounded-md` | Use `rounded-full` for metadata chips, `rounded-md` for command tabs |
| Forms | `rounded-md` | Inputs, selects, textareas |
| Dialogs / modals | `rounded-lg` | Modal containers and large panels |
| Page CTA containers | `rounded-lg` | Large high-emphasis panels |

Avoid:

- `rounded-3xl` for core app surfaces.
- Highly playful radii.
- Inconsistent mixtures of very round and very square surfaces.

---

## 7. Shadow System

The landing page relies more on contrast, borders, and glow than heavy shadows.

### Official Shadow Types

| Shadow | Source Pattern | Usage |
|---|---|---|
| Console elevation | `shadow-2xl shadow-black/40` | Large dashboard preview, future modal shells, major elevated product surfaces |
| Logo glow | `shadow-lg shadow-emerald-950/30` | Brand tile and small active identity marks |
| Hover glow | Border and background opacity shift rather than heavy shadow | Interactive cards |
| Modal shadow | `shadow-2xl shadow-black/50` | Future dialogs and overlays |
| Risk glow | Low-opacity red/amber border, not large shadow | Threat/error panels |

### Shadow Rules

- Do not use bright neon glow on large surfaces.
- Do not use heavy drop shadows on every card.
- Prefer low-opacity borders and background elevation.
- Use shadow only when a surface must separate from another dark layer.

---

## 8. Animation System

### Motion Personality

Motion should feel intelligent and restrained. It should guide attention and communicate responsiveness, not entertain.

### Official Motion Timing

| Motion Type | Timing | Usage |
|---|---:|---|
| Standard hover | `duration-300` | Cards, buttons, nav links |
| Fast micro feedback | `duration-150` to `duration-200` | Inputs, active controls, small toggles |
| Slow page atmosphere | `duration-500` to `duration-700` | Optional future section reveals |

### Hover Effects

Official card hover:

```text
transition-all duration-300
hover:-translate-y-1
hover:border-emerald-300/20
hover:bg-white/[0.05]
```

Official nav hover:

```text
transition-colors hover:text-white
```

Official button hover:

```text
background shift + border shift
no bounce
no exaggerated scaling
```

### Card Interactions

Cards may lift by `-translate-y-1` when clickable or exploratory. Static data cards may instead use a subtle border/background shift.

### Page Transitions

Future page transitions should be minimal:

- Fade in content.
- Slide up by a few pixels.
- Respect reduced-motion preferences.

### Micro Interactions

Recommended future micro interactions:

- Active command tab background shift.
- Form focus glow.
- AI loading pulse.
- Data row hover.
- Advisory section expansion glow.

### Glow Behavior

Glow should communicate system intelligence. Use emerald/teal glows for AI, validation, and active states. Use red/amber glows only for risk and warning.

---

## 9. Button System

### Primary CTA

| Attribute | Standard |
|---|---|
| Appearance | `bg-emerald-200 text-slate-950 rounded-md font-semibold` |
| Hover | `hover:bg-emerald-100` or `hover:bg-white` |
| Usage | Main user action, dashboard generation, final CTA, save/continue when high confidence |
| Do Not Use | Secondary links, destructive actions, passive controls |

### Secondary CTA

| Attribute | Standard |
|---|---|
| Appearance | `border-white/15 bg-white/[0.03] text-white rounded-md` |
| Hover | `hover:bg-white/10 hover:text-white` |
| Usage | Secondary actions next to primary CTA, sign in, learn more, back actions |
| Do Not Use | Primary conversion when a stronger CTA is needed |

### Ghost Button

| Attribute | Standard |
|---|---|
| Appearance | Transparent background, muted slate text |
| Hover | `hover:text-white hover:bg-white/[0.05]` |
| Usage | Navigation, low-priority utility actions, icon-only controls |
| Do Not Use | Major conversion actions |

### Outline Button

| Attribute | Standard |
|---|---|
| Appearance | `border-white/10 bg-transparent text-slate-300` |
| Hover | `hover:border-white/20 hover:bg-white/[0.05] hover:text-white` |
| Usage | Secondary dashboard controls, filters, view toggles |
| Do Not Use | Strong CTAs without a primary partner |

### Danger Button

| Attribute | Standard |
|---|---|
| Appearance | `border-red-400/20 bg-red-500/10 text-red-200` |
| Hover | `hover:bg-red-500/15 hover:border-red-400/30` |
| Usage | Delete, disconnect, threat response, unsafe action acknowledgment |
| Do Not Use | General warnings or neutral cancel actions |

### Button Interaction Rules

- Buttons should not scale aggressively.
- Primary CTA must have the highest contrast.
- Secondary buttons should feel glassy, not flat gray.
- Icon placement should be consistent: trailing arrow for progression, leading icon for action type.

---

## 10. Card System

### Dashboard Cards

| Attribute | Standard |
|---|---|
| Surface | `bg-white/[0.035]` |
| Border | `border-white/10` |
| Radius | `rounded-lg` |
| Padding | `p-4` to `p-6` |
| Typography | Small label, strong value, muted description |
| Interaction | Optional hover border/background shift |

### Analytics Cards

Use for metrics, financial projections, yield estimates, and system signals.

Structure:

```text
[metadata label]
[large metric value]
[supporting context]
[optional status chip]
```

### Advisory Cards

Use for AI-generated guidance.

Structure:

```text
[module label + icon]
[recommendation title]
[action body]
[risk/timing/status chip]
[optional supporting data rows]
```

Use emerald for recommendations, amber for caution, red for high risk.

### Weather Cards

Use dark glass surfaces with low-opacity weather signal colors.

Recommended pattern:

- Forecast label.
- Main metric.
- Timing window.
- Risk note.
- Suggested action.

### Financial Cards

Use comparison-friendly structure:

- Avoid loud green/red full backgrounds.
- Use dark panels with low-opacity semantic borders.
- Show value, rate, timeline, and recommendation clearly.

### Modal Cards

Use:

```text
rounded-lg border border-white/10 bg-slate-950/95 shadow-2xl shadow-black/50
```

Modals should feel like focused system panels.

### Card Rules

- Use borders before shadows.
- Use glass surfaces before solid fills.
- Keep nested panels subtle.
- Avoid bright, saturated card backgrounds.
- Use hover lift only when the card is interactive.

---

## 11. Form System

The form system should align future auth and onboarding migrations with the landing page language.

### Inputs

| Attribute | Standard |
|---|---|
| Surface | `bg-black/25` or `bg-white/[0.035]` |
| Border | `border-white/10` |
| Text | `text-white` |
| Placeholder | `placeholder:text-slate-500` |
| Focus | `focus:border-emerald-300/40 focus:ring-emerald-300/20` |
| Radius | `rounded-md` |

### Selects / Dropdowns

Should match inputs:

- Dark glass trigger.
- Muted placeholder.
- Emerald focus.
- Dark dropdown panel.
- Clear selected state.

### Textareas

Use the same visual language as inputs, with comfortable line height and enough height for advisory context.

### Checkboxes

Use emerald for checked state. Keep labels readable and avoid tiny touch targets.

### Radio Buttons

Use for compact choices. For important onboarding choices, prefer selectable cards with emerald border glow.

### Search Fields

Search should use:

- Leading icon.
- Dark glass input.
- Subtle focus glow.
- Optional keyboard shortcut chip.

### Validation States

| State | Visual Standard |
|---|---|
| Success | Emerald border/text, low-opacity emerald background if needed |
| Warning | Amber text and border, short helper copy |
| Error | Red border/text, low-opacity red background for message block |
| Disabled | Lower opacity, no hover glow, cursor disabled |

---

## 12. Iconography System

The landing page uses Lucide icons. Future product UI should standardize around the same style.

### Icon Style

- Line-based.
- Minimal.
- Geometric.
- Technical rather than decorative.
- Consistent stroke weight.

### Icon Sizing

| Use Case | Size |
|---|---|
| Small metadata icon | `h-4 w-4` |
| Standard card icon | `h-5 w-5` |
| Feature/CTA icon | `h-6 w-6` |
| Large voice/AI state icon | `h-7 w-7` or larger inside a tile |

### Icon Placement

- Use icons at the start of labels when identifying module type.
- Use icons at the end of CTAs only for progression arrows.
- Place dashboard card icons in top-right or inside small icon tiles.
- Avoid mixing icon libraries visually within the same screen when possible.

### Icon Consistency Rules

- Use emerald/teal for intelligence and system states.
- Use amber/red only for caution, risk, or threat.
- Avoid filled cartoon icons.
- Avoid oversized icons in dense dashboard contexts.

---

## 13. Layout System

### Page Widths

| Layout | Width Standard |
|---|---|
| Marketing / broad product page | `max-w-7xl` |
| Focused narrative block | `max-w-5xl` |
| Text-heavy centered content | `max-w-3xl` |
| Auth / wizard focused panel | `max-w-md` to `max-w-lg` |
| Dashboard content | `max-w-7xl` or full shell with controlled gutters |

### Container Standards

Use:

```text
mx-auto px-4 sm:px-6
```

for page containers.

### Section Widths

Marketing and high-level sections:

```text
max-w-7xl
```

Editorial copy:

```text
max-w-3xl
```

Dashboard cards:

```text
responsive grid with gap-4 or gap-6
```

### Dashboard Layouts

Future dashboard layout should follow:

```text
[Dark Shell]
  [Sidebar / Mobile Nav]
  [Command Header]
  [Main Intelligence Grid]
    [Overview Metrics]
    [Advisory Modules]
    [Financial / Scheme / Risk Panels]
    [History / Actions / Voice]
```

### Grid Standards

| Pattern | Recommended Classes |
|---|---|
| Feature grid | `grid gap-3 sm:grid-cols-2 lg:grid-cols-5` |
| Module grid | `grid gap-4 md:grid-cols-2 lg:grid-cols-3` |
| Workflow grid | `grid gap-4 md:grid-cols-2 lg:grid-cols-4` |
| Split content | `grid gap-12 lg:grid-cols-[1fr_1fr] lg:items-center` |
| Console preview | `grid lg:grid-cols-[1.15fr_0.85fr]` |

---

## 14. Responsive System

### Breakpoints

Use Tailwind defaults:

| Breakpoint | Purpose |
|---|---|
| Base | Mobile-first layout |
| `sm` | Larger mobile and small tablet refinement |
| `md` | Tablet grids and two-column transitions |
| `lg` | Desktop layout, side-by-side modules |
| `xl` / `2xl` | Large dashboard refinement if needed |

### Desktop

- Use wide max containers.
- Allow dashboard grids to breathe.
- Use side-by-side content for narrative and panels.
- Preserve strong visual hierarchy.

### Tablet

- Reduce grid density.
- Avoid forcing more than two columns for dense data.
- Keep touch targets large.
- Ensure cards do not become cramped.

### Mobile

- Stack sections vertically.
- CTAs should become full-width when useful.
- Dashboard cards should prioritize one-column readability.
- Avoid tiny table text; convert dense tables to stacked rows where needed.
- Keep sticky headers compact.

### Responsive Card Behavior

| Context | Mobile | Tablet | Desktop |
|---|---|---|---|
| Feature cards | 1 column | 2 columns | 3-5 columns |
| Dashboard metrics | 1 column | 2 columns | 3-4 columns |
| Advisory panels | 1 column | 1-2 columns | 2-3 columns |
| Forms | 1 column | 1 column | 1 focused column or split with context panel |

---

## 15. Empty States

Empty states should feel like the system is ready to create intelligence, not like the product is missing content.

### No Data

Use:

- Dark glass panel.
- System icon.
- Clear explanation.
- Primary CTA.
- Optional secondary guidance.

Tone:

```text
No farm intelligence has been generated yet.
Create your profile and generate the first advisory packet.
```

### No History

Frame as:

```text
Your advisory memory will appear here.
```

Use a timeline or memory metaphor rather than a generic empty list.

### No Advisory

Frame as:

```text
Generate an AI farm decision packet.
```

Include what will be created: weather timing, pest risk, finance, schemes, and action steps.

### No Profile

Frame as:

```text
Build your farm intelligence profile.
```

Explain that profile fields improve personalization.

---

## 16. Loading States

### Skeleton Loaders

Use dark skeletons:

```text
bg-white/[0.04]
animate-pulse
rounded-md
```

Avoid bright gray loading blocks on dark surfaces.

### Page Loading

Use a centered system boot state:

```text
AGROGUIA.AI
Initializing farm intelligence...
```

with subtle emerald pulse.

### Dashboard Loading

Use skeletons that match final card shapes:

- Metric card skeletons.
- Advisory text skeletons.
- Timeline row skeletons.
- Table row skeletons.

### AI Loading

AI generation should feel like reasoning, not waiting.

Recommended stages:

```text
Reading farm profile
Analyzing crop and weather context
Synthesizing risk and finance signals
Building dashboard advisory
```

---

## 17. Error States

### API Failures

Use a dark panel with red/amber low-opacity border and a clear retry action.

Tone:

```text
The intelligence service could not complete this request.
Your profile and history are safe. Try again.
```

### AI Failures

AI failures should avoid blaming the user. Explain that the advisory packet could not be generated or normalized.

Recommended actions:

- Retry.
- Check profile completeness.
- Use fallback advisory if available.

### Empty Responses

If AI returns incomplete content, show a dashboard-safe fallback panel:

```text
Partial advisory received.
Some modules could not be generated. Available recommendations are shown below.
```

### Form Validation

Validation should be:

- Specific.
- Short.
- Close to the field.
- Red text and border.
- No loud full-page alerts unless critical.

---

## 18. Design Tokens

This section consolidates the official design tokens for future implementation.

### Color Tokens

```text
--agro-bg-deep: #07100d
--agro-bg-section: #091410
--agro-surface-console: slate-950 / 90%
--agro-surface-glass: white / 3.5%
--agro-surface-glass-hover: white / 5.5%
--agro-surface-muted: white / 2.5%
--agro-surface-inset: black / 25-35%
--agro-border-default: white / 10%
--agro-border-muted: white / 5%
--agro-border-active: emerald-300 / 20-25%
--agro-text-primary: white / slate-100
--agro-text-secondary: slate-300 / slate-400
--agro-text-muted: slate-500
--agro-accent-primary: emerald-200
--agro-accent-signal: emerald-300
--agro-accent-secondary: teal-200
--agro-success: emerald
--agro-warning: amber
--agro-error: red
```

### Typography Tokens

```text
hero-title: text-5xl sm:text-6xl lg:text-7xl font-semibold leading-[1.03]
page-title: text-4xl sm:text-5xl lg:text-6xl font-semibold leading-tight
section-title: text-3xl sm:text-4xl lg:text-5xl font-semibold leading-tight
subsection-title: text-2xl sm:text-3xl font-semibold
card-title: text-lg/text-xl font-semibold
metric-value: text-2xl/text-4xl font-semibold
body: text-base leading-8
dashboard-body: text-sm leading-7
metadata: text-xs/text-[11px] text-slate-500
badge: text-xs font-medium
```

### Spacing Tokens

```text
space-xs: 0.5rem / gap-2
space-sm: 0.75rem / gap-3
space-md: 1rem / gap-4 / p-4
space-lg: 1.5rem / gap-6 / p-6
space-xl: 2rem / p-8 / mt-8
space-2xl: 2.5rem / gap-10
space-3xl: 3rem / gap-12
section-y: py-20 lg:py-28
container-x: px-4 sm:px-6
```

### Radius Tokens

```text
radius-control: rounded-md
radius-card: rounded-lg
radius-chip: rounded-full
radius-panel: rounded-lg
```

### Shadow Tokens

```text
shadow-console: shadow-2xl shadow-black/40
shadow-modal: shadow-2xl shadow-black/50
shadow-brand: shadow-lg shadow-emerald-950/30
shadow-hover: border/background elevation, not heavy shadow
```

### Animation Tokens

```text
motion-fast: duration-150 duration-200
motion-standard: duration-300
motion-slow: duration-500 duration-700
card-hover: hover:-translate-y-1 hover:border-emerald-300/20 hover:bg-white/[0.05]
nav-hover: hover:text-white
button-hover: subtle background/border change
```

---

## 19. Component Migration Plan

This plan uses Phase 1 findings and the official Phase 2 design system. It is a roadmap only and does not perform screen migration.

### Phase 3: Authentication Migration

Recommended scope:

- Login screen.
- Signup screen.
- Auth card.
- Auth inputs.
- Auth buttons.
- Auth copy hierarchy.

Migration objective:

```text
Landing CTA -> Auth
```

should feel continuous, premium, and trustworthy.

Implementation principles:

- Preserve authentication logic.
- Preserve form state.
- Preserve submit behavior.
- Change visual classes only.

### Phase 4: Onboarding Migration

Recommended scope:

- Profile wizard shell.
- Multi-step form layout.
- Progress indicator.
- Selectable option cards.
- Field and helper text design.

Migration objective:

Transform onboarding into:

```text
AI Farm Intelligence Profile Calibration
```

Implementation principles:

- Preserve profile schema.
- Preserve onboarding completion logic.
- Preserve dashboard routing behavior.

### Phase 5: Dashboard Shell Migration

Recommended scope:

- Authenticated app background.
- Sidebar.
- Header.
- Navigation.
- Language selector.
- Logout area.
- Main dashboard container.

Migration objective:

Make the authenticated product frame feel like the same AI infrastructure product promised by the landing page.

Implementation principles:

- Preserve tab routing.
- Preserve auth gate.
- Preserve user/session behavior.
- Preserve language switching.

### Phase 6: Dashboard Components Migration

Recommended scope:

- Dashboard hero.
- Metric cards.
- Weather cards.
- Pest cards.
- Financial cards.
- Scheme cards.
- Advisory tabs.
- History cards.
- Tables and badges.

Migration objective:

Make intelligence modules look like credible decision-system surfaces.

Implementation principles:

- Preserve advisory parsing.
- Preserve OpenRouter response handling.
- Preserve dashboard state.
- Preserve MongoDB persistence and history.

### Phase 7: Global Consistency Pass

Recommended scope:

- Buttons.
- Inputs.
- Cards.
- Badges.
- Tabs.
- Tables.
- Dialogs.
- Empty states.
- Loading states.
- Error states.

Migration objective:

Remove remaining default UI styling and unify product primitives.

Implementation principles:

- Prefer explicit variants.
- Avoid risky global overrides until validated.
- Test landing page after shared primitive changes.

### Phase 8: Final Product Audit

Recommended scope:

- Desktop visual QA.
- Tablet visual QA.
- Mobile visual QA.
- Accessibility and contrast.
- Keyboard navigation.
- Reduced motion.
- Demo screenshots.
- Regression check for auth, onboarding, dashboard, and advisory generation.

Migration objective:

Confirm AGROGUIA.AI feels like a single premium AI product from landing to dashboard.

---

## Phase 2 Validation Notes

This document creates the official AGROGUIA.AI design system blueprint only.

No application screens were redesigned.
No production UI components were modified.
No app routing was changed.
No business logic was changed.
No backend files were touched.
No API routes were touched.
No MongoDB logic was touched.
No OpenRouter logic was touched.

Phase 2 output:

```text
AGROGUIA_DESIGN_SYSTEM.md
```
