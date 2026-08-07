---
name: BharatAI System
colors:
  surface: '#f7f9fb'
  surface-dim: '#d8dadc'
  surface-bright: '#f7f9fb'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f4f6'
  surface-container: '#eceef0'
  surface-container-high: '#e6e8ea'
  surface-container-highest: '#e0e3e5'
  on-surface: '#191c1e'
  on-surface-variant: '#43474e'
  inverse-surface: '#2d3133'
  inverse-on-surface: '#eff1f3'
  outline: '#74777f'
  outline-variant: '#c4c6cf'
  surface-tint: '#455f88'
  primary: '#002045'
  on-primary: '#ffffff'
  primary-container: '#1a365d'
  on-primary-container: '#86a0cd'
  inverse-primary: '#adc7f7'
  secondary: '#8f4e00'
  on-secondary: '#ffffff'
  secondary-container: '#fe9832'
  on-secondary-container: '#683700'
  tertiary: '#012800'
  on-tertiary: '#ffffff'
  tertiary-container: '#024000'
  on-tertiary-container: '#49b538'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d6e3ff'
  primary-fixed-dim: '#adc7f7'
  on-primary-fixed: '#001b3c'
  on-primary-fixed-variant: '#2d476f'
  secondary-fixed: '#ffdcc2'
  secondary-fixed-dim: '#ffb77a'
  on-secondary-fixed: '#2e1500'
  on-secondary-fixed-variant: '#6d3a00'
  tertiary-fixed: '#8dfc75'
  tertiary-fixed-dim: '#72de5c'
  on-tertiary-fixed: '#012200'
  on-tertiary-fixed-variant: '#035300'
  background: '#f7f9fb'
  on-background: '#191c1e'
  surface-variant: '#e0e3e5'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 36px
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  container-max: 1280px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 32px
  stack-sm: 8px
  stack-md: 16px
  stack-lg: 32px
---

## Brand & Style
The design system is engineered for the "BharatAI" initiative, focusing on digital sovereignty, trust, and inclusivity. The brand personality is authoritative yet accessible, embodying the reliability of a government institution with the efficiency of modern AI technology.

The visual style follows a **Modern Corporate** aesthetic with a strong emphasis on **Minimalism** and **Accessibility**. It prioritizes high-legibility, structured information hierarchy, and a calm emotional response. The UI must feel stable and "official," avoiding transient design trends in favor of a timeless, service-oriented interface that serves a diverse citizenry.

## Colors
The color strategy is anchored by **Trustworthy Navy Blue (#1A365D)**, used for primary navigation, headers, and core action buttons to project stability. 

**Accent Palette:**
- **Saffron (#FF9933):** Used strictly for high-attention highlights, primary alerts, or specific "New" features.
- **Green (#138808):** Utilized for success states, completed verifications, and "Go" actions.
- **White (#FFFFFF) & Slate (#F8FAFC):** Provide the primary canvas and container backgrounds to maintain a clean, high-contrast environment.

All foreground-to-background combinations must maintain a minimum contrast ratio of 4.5:1 to ensure WCAG AA compliance.

## Typography
This design system utilizes **Inter** for all typographic needs due to its exceptional legibility at small sizes and its neutral, professional tone. 

**Hierarchy Rules:**
- **Headlines:** Use Bold (700) or SemiBold (600) weights in Navy Blue to establish clear content entry points.
- **Body Text:** Primarily uses Medium (16px) for optimal readability across age groups. 
- **Bilingual Support:** Line heights are slightly increased (1.5x minimum) to accommodate Hindi and Marathi scripts comfortably without crowding the interface.

## Layout & Spacing
The layout follows a **Fluid Grid** model with fixed maximum widths for desktop to prevent line lengths from becoming unreadable.

- **Mobile (Base):** A single-column layout with 16px side margins. Interactive elements (buttons/inputs) occupy the full width of the viewport minus margins.
- **Desktop:** A 12-column grid with a 1280px max-width container. 
- **Spacing Rhythm:** Based on an 8px base unit. Generous whitespace is mandated between sections (32px+) to reduce cognitive load for users navigating complex government services.

## Elevation & Depth
This design system employs a **Tonal Layering** approach combined with **Low-Contrast Outlines**.

- **Level 0 (Background):** Slate (#F8FAFC) creates a soft foundation.
- **Level 1 (Cards):** Pure White (#FFFFFF) surfaces with a subtle 1px border (#E2E8F0).
- **Elevation:** Shadows are used sparingly and are highly diffused (e.g., `box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05)`). This prevents the UI from feeling "heavy" while still providing a clear physical metaphor for tappable surfaces.

## Shapes
The shape language is defined by **Rounded (0.5rem)** corners. 

- **Cards & Modals:** Use `rounded-lg` (1rem / 16px) to create a friendly, modern container feel that softens the "official" nature of the content.
- **Buttons & Inputs:** Use the base `rounded` (0.5rem / 8px) for a precise, functional appearance.
- **Status Badges:** Utilize `rounded-xl` (1.5rem) or full pill-shapes to distinguish them from actionable buttons.

## Components
**Buttons:**
- **Primary:** Solid Navy Blue (#1A365D) with White text. Minimum height of 48px for touch accessibility.
- **Secondary:** White background with Navy Blue border and text.
- **Language Toggle:** Located in the persistent top header. Uses a segmented control style (e.g., EN | हिंदी) with the active state highlighted in Navy Blue.

**Input Fields:**
- Large touch targets with 16px internal padding. 
- Focus states must use a 2px Saffron (#FF9933) ring for high visibility.
- Labels are always persistent (not floating) to ensure context is never lost.

**Cards:**
- White background, 16px border-radius, and 24px internal padding. 
- Used to group related form fields or display "Service Snippets."

**Badges/Status:**
- Use Saffron for "Pending" or "Action Required."
- Use Green for "Verified" or "Success."
- Ensure icons (Checkmarks, Alerts) accompany color for color-blind accessibility.

**Header:**
- A persistent White header with the "BharatAI" logo, an Ashoka Pillar watermark/icon (if applicable), and the right-aligned language switcher.
