const utilities: Record<string, string> = {
  'access-dialog':
    '[position:fixed] [z-index:100] [top:50%] [left:50%] [width:min(calc(100%_-_2rem),_52rem)] [max-height:min(90vh,_56rem)] [padding:clamp(1.5rem,_4vw,_3.5rem)] [overflow-y:auto] [transform:translate(-50%,_-50%)] [border:1px_solid_var(--border-strong)] [background:var(--surface-strong)] [box-shadow:10px_10px_0_rgb(0_0_0_/_24%)] [animation:dialog-in_180ms_ease-out] [&_h2]:[max-width:12ch] [&_h2]:[margin:0] [&_h2]:[font-family:var(--font-display)] [&_h2]:[font-size:clamp(2.7rem,_7vw,_5rem)] [&_h2]:[font-weight:400] [&_h2]:[letter-spacing:-0.04em] [&_h2]:[line-height:0.92]',
  'application-actions':
    '[display:grid] [grid-template-columns:1fr_1fr] [gap:0.7rem] max-[44.001rem]:[grid-template-columns:1fr]',
  'application-disabled-note':
    '[margin:0] [padding:0.75rem_0.9rem] [border-left:3px_solid_var(--warning)] [background:var(--surface)] [color:var(--text-muted)] [font-size:0.72rem]',
  'application-preview-form':
    '[display:grid] [gap:1.15rem] [&_>_label:not(.rules-agreement)]:[display:grid] [&_>_label:not(.rules-agreement)]:[gap:0.4rem] [&_>_label:not(.rules-agreement)]:[color:var(--text-muted)] [&_>_label:not(.rules-agreement)]:[font-size:0.7rem] [&_>_label:not(.rules-agreement)]:[font-weight:700] [&_>_label:not(.rules-agreement)]:[letter-spacing:0.07em] [&_>_label:not(.rules-agreement)]:[text-transform:uppercase] [&_input]:[width:100%] [&_input]:[padding:0.75rem_0.85rem] [&_input]:[resize:vertical] [&_input]:[border:1px_solid_var(--border-strong)] [&_input]:[border-radius:0] [&_input]:[background:var(--surface)] [&_input]:[color:var(--text)] [&_input]:[font-size:0.9rem] [&_input]:[letter-spacing:0] [&_input]:[text-transform:none] [&_textarea]:[width:100%] [&_textarea]:[padding:0.75rem_0.85rem] [&_textarea]:[resize:vertical] [&_textarea]:[border:1px_solid_var(--border-strong)] [&_textarea]:[border-radius:0] [&_textarea]:[background:var(--surface)] [&_textarea]:[color:var(--text)] [&_textarea]:[font-size:0.9rem] [&_textarea]:[letter-spacing:0] [&_textarea]:[text-transform:none] [&_input::placeholder]:[color:var(--text-muted)] [&_input::placeholder]:[opacity:0.72] [&_textarea::placeholder]:[color:var(--text-muted)] [&_textarea::placeholder]:[opacity:0.72]',
  brand:
    '[display:inline-flex] [align-items:center] [gap:0.75rem] [text-decoration:none]',
  'brand-logo':
    '[width:clamp(4.75rem,_6vw,_6rem)] [height:auto] [max-height:3.5rem] [object-fit:contain] max-[44.001rem]:[width:4.5rem]',
  'button-secondary':
    "[align-self:center] [margin-left:1.25rem] [padding:0.65rem_0] [border-top:0] [border-right:0] [border-bottom:1px_solid_var(--border-strong)] [border-left:0] [background:transparent] [color:var(--text-muted)] [font-size:0.72rem] [&:hover]:[border-color:var(--accent-strong)] [&:hover]:[color:var(--accent-strong)] [&::after]:[margin-left:0.45rem] [&::after]:[content:'↗'] max-[44.001rem]:[align-self:flex-start] max-[44.001rem]:[margin-left:0]",
  'community-grid':
    '[display:grid] [grid-template-columns:minmax(0,_1.7fr)_minmax(22rem,_0.7fr)] [align-items:start] [gap:clamp(3rem,_5vw,_6rem)] [&_.home-section]:[min-width:0] max-[58.001rem]:[grid-template-columns:1fr] max-[58.001rem]:[gap:0] max-[58.001rem]:[&_.events-section]:[padding-top:0] max-[44.001rem]:[&_.story-preview]:[grid-template-columns:1fr] max-[44.001rem]:[&_.event-preview]:[grid-template-columns:1fr] max-[44.001rem]:[&_.event-organiser]:[grid-column:auto] max-[44.001rem]:[&_.event-organiser]:[text-align:left]',
  'community-section':
    "[position:relative] [&::before]:[position:absolute] [&::before]:[top:0] [&::before]:[left:50%] [&::before]:[width:min(calc(100%_-_2rem),_88rem)] [&::before]:[height:1px] [&::before]:[transform:translateX(-50%)] [&::before]:[background:var(--border)] [&::before]:[content:'']",
  'content-state':
    "[display:grid] [grid-template-columns:auto_minmax(0,_1fr)_auto] [align-items:start] [padding:1.25rem] [gap:1rem] [border:1px_solid_var(--border-strong)] [background:var(--surface)] [&[data-kind='error']_.content-state-marker]:[background:var(--accent)] [&[data-kind='unavailable']_.content-state-marker]:[background:var(--text-muted)] [&_.eyebrow]:[margin-bottom:0.35rem] [&_strong]:[font-family:var(--font-display)] [&_strong]:[font-size:1.35rem] [&_strong]:[font-weight:400] [&_p:last-child]:[margin:0.35rem_0_0] [&_p:last-child]:[color:var(--text-muted)] max-[44.001rem]:[grid-template-columns:auto_minmax(0,_1fr)]",
  'content-state-action':
    '[padding:0.55rem_0.8rem] [border:1px_solid_var(--border-strong)] [background:transparent] [color:var(--text)] [font:inherit] [font-size:0.72rem] [font-weight:700] [letter-spacing:0.08em] [text-transform:uppercase] [&:hover]:[background:var(--surface-strong)] max-[44.001rem]:[grid-column:2] max-[44.001rem]:[justify-self:start]',
  'content-state-marker':
    '[width:0.7rem] [height:0.7rem] [margin-top:0.25rem] [border:1px_solid_currentColor] [background:var(--warning)]',
  'copy-address-button':
    '[display:flex] [min-width:min(100%,_19rem)] [align-items:center] [justify-content:space-between] [padding:0.8rem_1rem] [gap:1rem] [border:1px_solid_var(--border-strong)] [background:var(--text)] [box-shadow:var(--shadow)] [color:var(--background)] [text-align:left] [&_span:first-child]:[display:grid] [&_span:first-child]:[min-width:0] [&_small]:[margin-bottom:0.1rem] [&_small]:[font-size:0.6rem] [&_small]:[font-weight:700] [&_small]:[letter-spacing:0.14em] [&_small]:[text-transform:uppercase] [&_strong]:[overflow:hidden] [&_strong]:[font-size:0.88rem] [&_strong]:[text-overflow:ellipsis] [&_strong]:[white-space:nowrap] [&_svg]:[width:1.3rem] [&_svg]:[flex:0_0_auto] [&_svg]:[fill:none] [&_svg]:[stroke:currentColor] [&_svg]:[stroke-width:1.6] [&:hover]:[background:var(--accent-strong)]',
  'corner-left': '[left:0.65rem] [border-left:1px_solid_var(--text)]',
  'corner-right': '[right:0.65rem] [border-right:1px_solid_var(--text)]',
  'dialog-close':
    '[position:absolute] [top:1rem] [right:1rem] [display:grid] [width:2.6rem] [height:2.6rem] [place-items:center] [border:1px_solid_var(--border)] [background:var(--surface)] [&:hover]:[border-color:var(--border-strong)] [&_svg]:[width:1.1rem] [&_svg]:[fill:none] [&_svg]:[stroke:currentColor] [&_svg]:[stroke-width:1.7]',
  'dialog-description':
    '[max-width:42rem] [margin:1.3rem_0_0] [color:var(--text-muted)]',
  'dialog-heading': '[padding-right:3rem]',
  'dialog-overlay':
    '[position:fixed] [z-index:90] [inset:0] [background:rgb(19_17_15_/_72%)] [backdrop-filter:blur(3px)] [animation:overlay-in_160ms_ease-out]',
  'discord-preview-button':
    '[padding:0.8rem_1rem] [border:1px_solid_var(--border-strong)] [font-size:0.72rem] [font-weight:700] [letter-spacing:0.07em] [text-transform:uppercase] [background:var(--text)] [color:var(--background)] [&:disabled]:[cursor:not-allowed] [&:disabled]:[filter:grayscale(0.45)] [&:disabled]:[opacity:0.55]',
  'event-archive-entry':
    '[display:grid] [grid-template-columns:11rem_minmax(0,_1fr)_minmax(12rem,_0.3fr)] [align-items:center] [padding-block:1.6rem] [gap:2rem] [border-bottom:1px_solid_var(--border)] [&_time]:[display:grid] [&_time_strong]:[color:var(--accent-strong)] [&_time_strong]:[font-family:var(--font-display)] [&_time_strong]:[font-size:1.8rem] [&_time_strong]:[font-weight:400] [&_time_span]:[color:var(--text-muted)] [&_time_span]:[font-size:0.7rem] [&_>_p]:[color:var(--text-muted)] [&_>_p]:[font-size:0.7rem] [&_h3]:[margin:0] [&_h3]:[font-family:var(--font-display)] [&_h3]:[font-size:1.7rem] [&_h3]:[font-weight:400] [&_div_p]:[margin:0.25rem_0_0] [&_>_p]:[margin:0.25rem_0_0] [&_>_p]:[text-align:right] [&_>_p_strong]:[display:block] [&_>_p_strong]:[color:var(--text)] [&_>_p_strong]:[font-size:0.8rem] max-[44.001rem]:[grid-template-columns:1fr] max-[44.001rem]:[gap:0.5rem] max-[44.001rem]:[&_>_p]:[text-align:left]',
  'event-date':
    '[color:var(--accent-strong)] [font-family:var(--font-display)] [font-size:2rem]',
  'event-group-title':
    '[display:flex] [align-items:baseline] [justify-content:space-between] [padding-bottom:1rem] [border-bottom:1px_solid_var(--border-strong)] [&_h2]:[margin:0] [&_h2]:[font-family:var(--font-display)] [&_h2]:[font-size:clamp(2.5rem,_5vw,_5rem)] [&_h2]:[font-weight:400] [&_span]:[color:var(--accent)] [&_span]:[font-family:var(--font-display)] [&_span]:[font-size:2rem]',
  'event-organiser':
    '[display:grid] [color:var(--text)]! [font-size:0.75rem] [font-weight:700] [text-align:right] [&_span]:[color:var(--text-muted)] [&_span]:[font-weight:400] max-[44.001rem]:[grid-column:auto] max-[44.001rem]:[text-align:left]',
  'event-preview':
    '[&_h3]:[margin:0] [&_h3]:[font-family:var(--font-display)] [&_h3]:[font-weight:400] [display:grid] [grid-template-columns:7rem_minmax(0,_1fr)_minmax(12rem,_0.35fr)] [align-items:center] [padding-block:1.7rem] [gap:2rem] [border-bottom:1px_solid_var(--border-strong)] [&_h3]:[font-size:1.8rem] [&_p]:[margin:0.3rem_0_0] [&_p]:[color:var(--text-muted)] max-[44.001rem]:[grid-template-columns:1fr] max-[44.001rem]:[gap:0.5rem]',
  'event-preview-list': '[border-top:1px_solid_var(--border-strong)]',
  'events-archive': '[display:grid] [gap:clamp(5rem,_9vw,_9rem)]',
  eyebrow:
    '[display:flex] [align-items:center] [gap:0.7rem] [margin:0_0_1rem] [color:var(--accent-strong)] [font-size:0.7rem] [font-weight:700] [letter-spacing:0.18em] [text-transform:uppercase] [&::before]:[display:none]',
  'featured-event':
    '[padding:0.5rem] [border:1px_solid_var(--border-strong)] [background:repeating-linear-gradient(_135deg,_transparent_0_15px,_color-mix(in_srgb,_var(--border)_7%,_transparent)_15px_16px_),_var(--surface)] [box-shadow:9px_9px_0_color-mix(in_srgb,_var(--border-strong)_18%,_transparent)] [&_h2]:[max-width:10ch] [&_h2]:[margin:0] [&_h2]:[font-family:var(--font-display)] [&_h2]:[font-size:clamp(2.4rem,_4vw,_4rem)] [&_h2]:[font-weight:400] [&_h2]:[letter-spacing:-0.04em] [&_h2]:[line-height:0.95]',
  'featured-event-date':
    '[display:grid] [width:min(100%,_11rem)] [margin-block:2rem] [padding-block:1rem] [border-block:1px_solid_var(--border-strong)] [&_strong]:[color:var(--text)] [&_strong]:[font-family:var(--font-display)] [&_strong]:[font-size:2.5rem] [&_strong]:[font-weight:400] [&_strong]:[line-height:1] [&_span]:[margin-top:0.35rem] [&_span]:[color:var(--text-muted)] [&_span]:[font-size:0.62rem]',
  'featured-event-description': '[color:var(--text-muted)] [font-size:0.82rem]',
  'featured-event-inner':
    '[padding:clamp(1.5rem,_3vw,_2.75rem)] [border:1px_solid_var(--border)]',
  'featured-event-link':
    '[display:block] [padding:0.8rem_1rem] [border:1px_solid_var(--accent)] [color:var(--accent-strong)] [font-size:0.7rem] [text-align:center] [text-decoration:none] [&:hover]:[background:var(--accent)] [&:hover]:[color:var(--accent-contrast)]',
  'featured-event-organiser':
    '[&_span]:[display:grid] [&_span]:[width:2rem] [&_span]:[height:2rem] [&_span]:[place-items:center] [&_span]:[border:1px_solid_var(--border-strong)] [&_span]:[background:var(--surface)] [&_span]:[color:var(--text)] [&_span]:[font-size:0.6rem] [display:flex] [align-items:center] [margin-block:1.5rem] [gap:0.65rem] [color:var(--text-muted)] [font-size:0.68rem]',
  'footer-brand':
    '[display:inline-flex] [align-items:center] [justify-self:start] [text-decoration:none] [&_img]:[width:4.5rem] [&_img]:[height:auto] [&_img]:[max-height:2.75rem] [&_img]:[object-fit:contain]',
  'footer-credit':
    '[margin:0] [color:var(--text-muted)] [font-size:0.62rem] max-[58.001rem]:[display:none]',
  'footer-inner':
    '[display:grid] [grid-template-columns:1fr_auto_1fr] [width:min(100%_-_2rem,_88rem)] [align-items:center] [justify-content:space-between] [margin-inline:auto] [padding-block:1.15rem] [gap:2rem] [border-top:1px_solid_var(--border)] max-[58.001rem]:[grid-template-columns:1fr_auto] max-[44.001rem]:[grid-template-columns:auto_1fr] max-[44.001rem]:[padding-block:1rem] max-[44.001rem]:[gap:0.6rem]',
  'footer-links':
    '[display:flex] [align-items:center] [gap:clamp(0.75rem,_2vw,_1.5rem)] [justify-self:end] [&_a]:[color:var(--text-muted)] [&_a]:[font-size:0.65rem] [&_a]:[font-weight:700] [&_a]:[letter-spacing:0.06em] [&_a]:[text-decoration:none] [&_a]:[text-transform:uppercase] [&_a:hover]:[color:var(--accent-strong)] max-[44.001rem]:[justify-self:end] max-[44.001rem]:[gap:0.4rem]',
  'header-actions': '[display:flex] [align-items:center] [gap:0.65rem]',
  'header-inner':
    '[position:relative] [display:grid] [grid-template-columns:auto_1fr_auto] [align-items:center] [width:min(100%_-_2rem,_88rem)] [height:100%] [margin-inline:auto] [gap:clamp(1rem,_2vw,_2.5rem)] [border-bottom:1px_solid_var(--border)] max-[72.001rem]:[grid-template-columns:1fr_auto_auto] max-[44.001rem]:[width:min(100%_-_1.25rem,_88rem)] max-[44.001rem]:[gap:0.65rem]',
  'hero-actions':
    '[display:flex] [align-items:stretch] [margin-top:2.2rem] [gap:0.8rem] max-[44.001rem]:[align-items:stretch] max-[44.001rem]:[flex-direction:column]',
  'hero-copy':
    '[&_h1]:[max-width:11ch] [&_h1]:[margin:0] [&_h1]:[font-family:var(--font-display)] [&_h1]:[font-size:clamp(3.2rem,_5.5vw,_6rem)] [&_h1]:[font-weight:400] [&_h1]:[letter-spacing:-0.05em] [&_h1]:[line-height:0.9] [&_h1_em]:[color:var(--accent)] [&_h1_em]:[font-weight:400] max-[44.001rem]:[&_h1]:[font-size:clamp(3.4rem,_18vw,_5.4rem)]',
  'hero-intro':
    '[max-width:39rem] [margin:2rem_0_0] [color:var(--text-muted)] [font-size:clamp(1rem,_1.3vw,_1.2rem)]',
  'hero-settlement':
    '[position:relative] [margin-bottom:5.5rem] [padding:0.65rem] [border:1px_solid_var(--border-strong)] [background:var(--surface)] [box-shadow:9px_9px_0_color-mix(in_srgb,_var(--border-strong)_18%,_transparent)] [&_.settlement-visual]:[min-height:clamp(18rem,_22vw,_23rem)] [&_.settlement-visual]:[border:0] [&_.settlement-visual]:[box-shadow:none] [&_.settlement-copy]:[position:absolute] [&_.settlement-copy]:[bottom:-1.25rem] [&_.settlement-copy]:[left:clamp(1.5rem,_4vw,_3rem)] [&_.settlement-copy]:[width:min(70%,_20rem)] [&_.settlement-copy]:[padding:0.85rem_1rem] [&_.settlement-copy]:[border:1px_solid_var(--border-strong)] [&_.settlement-copy]:[background:var(--surface-strong)] [&_.settlement-copy]:[box-shadow:4px_4px_0_color-mix(in_srgb,_var(--border-strong)_18%,_transparent)] [&_.settlement-copy_h2]:[font-size:clamp(1.35rem,_2vw,_1.8rem)] [&_.settlement-copy_.eyebrow]:[margin-bottom:0.35rem] [&_.settlement-copy_.eyebrow]:[font-size:0.55rem] [&_.settlement-copy_>_div]:[display:flex] [&_.settlement-copy_>_div]:[align-items:baseline] [&_.settlement-copy_>_div]:[justify-content:space-between] [&_.settlement-copy_>_div]:[gap:1rem] [&_.settlement-copy_span]:[color:var(--text-muted)] [&_.settlement-copy_span]:[font-size:0.58rem] [&_.settlement-copy_span]:[white-space:nowrap] max-[44.001rem]:[&_.settlement-visual]:[min-height:20rem] max-[44.001rem]:[margin-bottom:6.5rem]',
  'home-hero':
    '[display:grid] [grid-template-columns:minmax(0,_1fr)_minmax(22rem,_0.82fr)] [min-height:auto] [align-items:center] [padding-block:clamp(3rem,_5vw,_5rem)] [gap:clamp(3rem,_7vw,_8rem)] max-[72.001rem]:[grid-template-columns:minmax(0,_1fr)_minmax(18rem,_0.7fr)] max-[72.001rem]:[gap:3rem] max-[44.001rem]:[grid-template-columns:1fr] max-[44.001rem]:[min-height:auto] max-[44.001rem]:[padding-top:4rem]',
  'home-section': '[padding-block:clamp(3.5rem,_6vw,_6.5rem)]',
  'icon-button':
    '[display:grid] [width:2.5rem] [height:2.5rem] [place-items:center] [border:1px_solid_var(--border)] [background:var(--surface)] [&:hover]:[border-color:var(--border-strong)] [&:hover]:[background:var(--surface-strong)] [&_svg]:[width:1.15rem] [&_svg]:[fill:none] [&_svg]:[stroke:currentColor] [&_svg]:[stroke-linecap:square] [&_svg]:[stroke-width:1.7]',
  'join-details':
    '[display:grid] [grid-template-columns:repeat(3,_1fr)] [margin-block:2rem] [border-block:1px_solid_var(--border)] [&_div]:[display:grid] [&_div]:[padding:0.9rem_1rem] [&_div_+_div]:[border-left:1px_solid_var(--border)] [&_span]:[color:var(--text-muted)] [&_span]:[font-size:0.6rem] [&_span]:[font-weight:700] [&_span]:[letter-spacing:0.1em] [&_span]:[text-transform:uppercase] [&_strong]:[margin-top:0.2rem] [&_strong]:[font-family:var(--font-display)] [&_strong]:[font-size:1.15rem] [&_strong]:[font-weight:400] max-[44.001rem]:[grid-template-columns:1fr] max-[44.001rem]:[&_div_+_div]:[border-top:1px_solid_var(--border)] max-[44.001rem]:[&_div_+_div]:[border-left:0]',
  'ledger-heading':
    '[display:flex] [align-items:center] [justify-content:space-between] [padding-bottom:1rem] [border-bottom:1px_solid_var(--border-strong)] [&_p]:[display:flex] [&_p]:[align-items:center] [&_p]:[margin:0] [&_p]:[gap:0.7rem] [&_p]:[font-weight:700] [&_>_span]:[color:var(--text-muted)] [&_>_span]:[font-size:0.7rem] [&_>_span]:[font-weight:700] [&_>_span]:[letter-spacing:0.1em] [&_>_span]:[text-transform:uppercase]',
  'login-button':
    '[font-size:0.77rem] [font-weight:700] [letter-spacing:0.08em] [text-decoration:none] [text-transform:uppercase] [display:inline-flex] [height:2.5rem] [align-items:center] [padding:0.65rem_0.9rem] [border:1px_solid_var(--border-strong)] [background:var(--text)] [color:var(--background)]',
  'login-dialog':
    '[width:min(calc(100%_-_2rem),_34rem)] [&_h2]:[font-size:clamp(2.4rem,_6vw,_4rem)]! [&_.discord-preview-button]:[width:100%] [&_.discord-preview-button]:[margin-top:1.5rem]',
  'map-contours':
    "[position:absolute] [border:1px_solid_color-mix(in_srgb,_var(--border-strong)_50%,_transparent)] [border-radius:48%_52%_62%_38%] [content:''] [&::before]:[position:absolute] [&::before]:[border:1px_solid_color-mix(in_srgb,_var(--border-strong)_50%,_transparent)] [&::before]:[border-radius:48%_52%_62%_38%] [&::before]:[content:''] [&::after]:[position:absolute] [&::after]:[border:1px_solid_color-mix(in_srgb,_var(--border-strong)_50%,_transparent)] [&::after]:[border-radius:48%_52%_62%_38%] [&::after]:[content:''] [inset:12%_42%_42%_8%] [transform:rotate(12deg)] [box-shadow:0_0_0_2rem_color-mix(in_srgb,_var(--border)_18%,_transparent),_0_0_0_5rem_color-mix(in_srgb,_var(--border)_10%,_transparent)] [&::before]:[inset:18%] [&::after]:[inset:34%]",
  'map-page': '[padding-block:clamp(3rem,_6vw,_6rem)]',
  'map-page-toolbar':
    '[display:flex] [align-items:end] [justify-content:space-between] [margin-bottom:1.5rem] [gap:2rem] [&_h2]:[margin:0] [&_h2]:[font-family:var(--font-display)] [&_h2]:[font-size:clamp(2rem,_4vw,_4rem)] [&_h2]:[font-weight:400] [&_>_p]:[display:grid] [&_>_p]:[margin:0] [&_>_p]:[color:var(--warning)] [&_>_p]:[font-size:0.7rem] [&_>_p]:[font-weight:700] [&_>_p]:[letter-spacing:0.08em] [&_>_p]:[text-align:right] [&_>_p]:[text-transform:uppercase] [&_>_p_span]:[color:var(--text-muted)] [&_>_p_span]:[font-size:0.65rem] [&_>_p_span]:[font-weight:400] [&_>_p_span]:[letter-spacing:0] [&_>_p_span]:[text-transform:none] max-[44.001rem]:[align-items:start] max-[44.001rem]:[flex-direction:column] max-[44.001rem]:[&_>_p]:[text-align:left]',
  'map-place':
    '[position:absolute] [padding:0.45rem_0.65rem] [border:1px_solid_var(--border-strong)] [background:var(--surface-strong)] [box-shadow:3px_3px_0_color-mix(in_srgb,_var(--border-strong)_23%,_transparent)] [font-size:0.68rem] [font-weight:700] [letter-spacing:0.06em] [text-transform:uppercase] max-[44.001rem]:[font-size:0.55rem]',
  'map-preview':
    '[position:relative] [min-height:clamp(28rem,_48vw,_44rem)] [overflow:hidden] [background:color-mix(in_srgb,_var(--success)_13%,_var(--surface))]',
  'map-preview-full': '[min-height:calc(100vh_-_var(--header-height)_-_5rem)]!',
  'map-river':
    '[position:absolute] [top:-12%] [left:62%] [width:8%] [height:130%] [transform:rotate(19deg)] [border-inline:1px_solid_color-mix(in_srgb,_var(--focus)_70%,_transparent)] [background:color-mix(in_srgb,_var(--focus)_20%,_transparent)]',
  'map-road':
    '[position:absolute] [display:block] [width:58%] [height:1px] [border-top:2px_dashed_var(--accent)]',
  'map-scale':
    '[position:absolute] [right:1rem] [bottom:1rem] [padding:0.45rem_0.65rem] [background:var(--text)] [color:var(--background)] [font-size:0.62rem] [font-weight:700] [letter-spacing:0.1em] [text-transform:uppercase]',
  'map-section':
    "[position:relative] [&::before]:[position:absolute] [&::before]:[top:0] [&::before]:[left:50%] [&::before]:[width:min(calc(100%_-_2rem),_88rem)] [&::before]:[height:1px] [&::before]:[transform:translateX(-50%)] [&::before]:[background:var(--border)] [&::before]:[content:'']",
  'map-window':
    '[border:1px_solid_var(--border-strong)] [background:var(--surface)] [box-shadow:10px_10px_0_color-mix(in_srgb,_var(--border-strong)_18%,_transparent)]',
  'map-window-controls':
    '[display:flex] [border:1px_solid_var(--border-strong)] [&_span]:[display:grid] [&_span]:[width:2rem] [&_span]:[height:2rem] [&_span]:[place-items:center] [&_span]:[font-size:0.75rem] [&_span]:[line-height:1] [&_span_+_span]:[border-left:1px_solid_var(--border)]',
  'map-window-footer':
    '[display:flex] [align-items:center] [justify-content:space-between] [padding-inline:0.9rem] [gap:1rem] [min-height:3.4rem] [border-top:1px_solid_var(--border)] [color:var(--text-muted)] [font-size:0.66rem] [&_a]:[color:var(--text)] [&_a]:[font-weight:700] [&_a]:[text-decoration:none] [&_a:hover]:[color:var(--accent-strong)] max-[44.001rem]:[padding-inline:0.65rem] max-[44.001rem]:[&_>_span]:[display:none]',
  'map-window-title':
    '[display:inline-flex] [align-items:center] [gap:0.65rem] [font-size:0.62rem] [font-weight:700] [letter-spacing:0.14em] [text-transform:uppercase] [&_>_span]:[width:0.75rem] [&_>_span]:[height:0.75rem] [&_>_span]:[transform:rotate(32deg)] [&_>_span]:[background:var(--accent)]',
  'map-window-toolbar':
    '[display:flex] [min-height:3rem] [align-items:center] [justify-content:space-between] [padding-inline:0.9rem] [gap:1rem] [border-bottom:1px_solid_var(--border)] max-[44.001rem]:[padding-inline:0.65rem]',
  'masthead-summary':
    '[&_>_p:first-child]:[margin-top:0] [&_>_p:first-child]:[color:var(--text-muted)] [&_>_p:first-child]:[font-size:1.05rem] max-[72.001rem]:[grid-column:2] max-[44.001rem]:[grid-column:auto]',
  'menu-button':
    '[display:none] [align-items:center] [gap:0.65rem] [padding:0.45rem] [border:1px_solid_transparent] [background:none] [font-size:0.75rem] [font-weight:700] [letter-spacing:0.08em] [text-transform:uppercase] [&:hover]:[border-color:var(--border)] [&:hover]:[background:var(--surface)] max-[72.001rem]:[display:flex] max-[44.001rem]:[width:2.5rem] max-[44.001rem]:[height:2.5rem] max-[44.001rem]:[justify-content:center] max-[44.001rem]:[padding:0] max-[44.001rem]:[&_>_span:first-child]:[position:absolute] max-[44.001rem]:[&_>_span:first-child]:[width:1px] max-[44.001rem]:[&_>_span:first-child]:[height:1px] max-[44.001rem]:[&_>_span:first-child]:[overflow:hidden] max-[44.001rem]:[&_>_span:first-child]:[clip:rect(0_0_0_0)] max-[44.001rem]:[&_>_span:first-child]:[white-space:nowrap]',
  'menu-lines':
    "[position:relative] [display:block] [width:1.4rem] [height:1px] [background:currentColor] [transition:background-color_120ms_ease] [content:''] [&::before]:[position:absolute] [&::before]:[top:0] [&::before]:[left:0] [&::before]:[display:block] [&::before]:[width:1.4rem] [&::before]:[height:1px] [&::before]:[background:currentColor] [&::before]:[transition:transform_120ms_ease] [&::before]:[content:''] [&::after]:[position:absolute] [&::after]:[top:0] [&::after]:[left:0] [&::after]:[display:block] [&::after]:[width:1.4rem] [&::after]:[height:1px] [&::after]:[background:currentColor] [&::after]:[transition:transform_120ms_ease] [&::after]:[content:''] [&::before]:[transform:translateY(-0.35rem)] [&::after]:[transform:translateY(0.35rem)] [&[data-open='true']]:[background:transparent] [&[data-open='true']::before]:[transform:rotate(45deg)] [&[data-open='true']::after]:[transform:rotate(-45deg)]",
  'nav-join':
    '[background:transparent] [font-size:0.77rem] [font-weight:700] [letter-spacing:0.08em] [text-decoration:none] [text-transform:uppercase] [padding:0.55rem_0.85rem] [border:1px_solid_var(--border-strong)] [color:var(--text)] [&:hover]:[border-color:var(--accent)] [&:hover]:[color:var(--accent-strong)] max-[72.001rem]:[grid-column:1_/_-1] max-[72.001rem]:[height:auto] max-[72.001rem]:[min-height:3rem] max-[72.001rem]:[padding:0.8rem_1rem] max-[72.001rem]:[background:var(--text)] max-[72.001rem]:[color:var(--background)] max-[72.001rem]:[text-align:left] max-[72.001rem]:[&:hover]:[background:var(--accent-strong)] max-[72.001rem]:[&:hover]:[color:var(--accent-contrast)]',
  'page-content': '[padding-block:clamp(4rem,_8vw,_8rem)]',
  'page-index':
    '[align-self:start] [color:var(--accent)] [font-family:var(--font-display)] [font-size:clamp(3rem,_6vw,_6rem)] [line-height:0.8] max-[44.001rem]:[font-size:2.5rem]',
  'page-masthead':
    '[display:grid] [grid-template-columns:auto_minmax(0,_1fr)_minmax(20rem,_0.55fr)] [align-items:end] [padding-block:clamp(5rem,_10vw,_9rem)_clamp(3rem,_7vw,_6rem)] [gap:clamp(2rem,_5vw,_6rem)] [border-bottom:1px_solid_var(--border-strong)] [&_h1]:[max-width:12ch] [&_h1]:[margin:0] [&_h1]:[font-family:var(--font-display)] [&_h1]:[font-size:clamp(3.6rem,_7vw,_7rem)] [&_h1]:[font-weight:400] [&_h1]:[letter-spacing:-0.05em] [&_h1]:[line-height:0.9] max-[72.001rem]:[grid-template-columns:auto_minmax(0,_1fr)] max-[44.001rem]:[grid-template-columns:1fr] max-[44.001rem]:[align-items:start] max-[44.001rem]:[gap:1.5rem]',
  'page-shell': '[width:min(100%_-_2rem,_88rem)] [margin-inline:auto]',
  'place-harbour': '[right:9%] [bottom:19%]',
  'place-main': '[top:43%] [left:47%]',
  'place-north': '[top:12%] [right:25%]',
  'place-quarry': '[top:20%] [left:13%]',
  'placeholder-page':
    '[display:grid] [min-height:65vh] [align-content:center] [justify-items:start] [padding-block:clamp(5rem,_11vw,_10rem)] [&_h1]:[max-width:12ch] [&_h1]:[margin:0] [&_h1]:[font-family:var(--font-display)] [&_h1]:[font-size:clamp(3.2rem,_9vw,_7rem)] [&_h1]:[font-weight:400] [&_h1]:[letter-spacing:-0.04em] [&_h1]:[line-height:0.94] [&_>_p:not(.eyebrow)]:[max-width:36rem] [&_>_p:not(.eyebrow)]:[margin:1.5rem_0] [&_>_p:not(.eyebrow)]:[color:var(--text-muted)] [&_>_p:not(.eyebrow)]:[font-size:1.1rem]',
  'player-avatar':
    '[display:grid] [width:2.6rem] [height:2.6rem] [place-items:center] [overflow:hidden] [border:1px_solid_var(--border-strong)] [background:var(--surface-strong)]',
  'player-avatar-large': '[width:4.5rem] [height:4.5rem]',
  'player-head-image':
    '[width:100%] [height:100%] [padding:0.12rem] [object-fit:contain] [image-rendering:pixelated]',
  'player-identity':
    '[&_h2]:[margin:0] [&_h2]:[font-family:var(--font-display)] [&_h2]:[font-size:2rem] [&_h2]:[font-weight:400] [&_p]:[margin:0] [&_p]:[color:var(--text-muted)] [&_p]:[font-size:0.75rem]',
  'player-ledger': '[border-bottom:1px_solid_var(--border-strong)]',
  'player-ledger-detail':
    '[margin:0] [padding:0.7rem_0] [border-bottom:1px_solid_var(--border)] [color:var(--text-muted)] [font-size:0.7rem]',
  'player-ledger-message':
    "[display:grid] [justify-items:start] [padding:clamp(2rem,_5vw,_4rem)] [gap:0.45rem] [border-bottom:1px_solid_var(--border-strong)] [&_.eyebrow]:[margin:0] [&_strong]:[font-family:var(--font-display)] [&_strong]:[font-size:clamp(1.8rem,_3vw,_2.8rem)] [&_strong]:[font-weight:400] [&_p:last-of-type]:[max-width:42rem] [&_p:last-of-type]:[margin:0] [&_p:last-of-type]:[color:var(--text-muted)] [&_.content-state-action]:[margin-top:0.8rem] [&[data-state='online']]:[border-left:3px_solid_var(--success)] [&[data-state='offline']]:[border-left:3px_solid_var(--accent)] [&[data-state='unavailable']]:[border-left:3px_solid_var(--warning)] [&[data-state='loading']]:[border-left:3px_solid_var(--warning)]",
  'player-preview':
    '[display:grid] [grid-template-columns:auto_1fr] [align-items:center] [padding:0] [gap:0.65rem] [&_h3]:[margin:0] [&_h3]:[font-family:var(--font-body)] [&_h3]:[font-size:0.78rem] [&_h3]:[font-weight:600] [&_p]:[margin:0] [&_p]:[color:var(--text-muted)] [&_p]:[font-size:0.72rem]',
  'player-preview-grid':
    '[display:grid] [grid-template-columns:repeat(4,_minmax(0,_1fr))] [gap:clamp(0.75rem,_2vw,_1.5rem)] max-[72.001rem]:[grid-template-columns:repeat(2,_minmax(0,_1fr))] max-[44.001rem]:[grid-template-columns:1fr]',
  'player-presence':
    '[margin:0] [color:var(--success)] [font-size:0.68rem] [font-weight:700] [letter-spacing:0.08em] [text-transform:uppercase]',
  'player-record':
    '[display:grid] [grid-template-columns:3rem_auto_minmax(12rem,_1fr)_auto] [align-items:center] [padding-block:1.3rem] [gap:clamp(1rem,_3vw,_3rem)] [border-bottom:1px_solid_var(--border)] [&:last-child]:[border-bottom:0] max-[72.001rem]:[grid-template-columns:2rem_auto_1fr_auto] max-[44.001rem]:[grid-template-columns:auto_1fr] max-[44.001rem]:[&_.player-presence]:[grid-column:2]',
  'player-stats':
    '[display:grid] [grid-template-columns:repeat(3,_1fr)] [margin:0] [border-left:1px_solid_var(--border)] [&_div]:[padding-left:clamp(0.8rem,_2vw,_2rem)] [&_dt]:[color:var(--text-muted)] [&_dt]:[font-size:0.62rem] [&_dt]:[font-weight:700] [&_dt]:[letter-spacing:0.1em] [&_dt]:[text-transform:uppercase] [&_dd]:[margin:0.2rem_0_0] [&_dd]:[font-family:var(--font-display)] [&_dd]:[font-size:1.4rem] max-[72.001rem]:[grid-column:3] max-[44.001rem]:[grid-column:1_/_-1] max-[44.001rem]:[border-top:1px_solid_var(--border)] max-[44.001rem]:[border-left:0] max-[44.001rem]:[&_div]:[padding-top:0.8rem] max-[44.001rem]:[&_div]:[padding-left:0]',
  'players-section':
    "[position:relative] [padding-block:1.4rem]! [&_.page-shell]:[display:grid] [&_.page-shell]:[grid-template-columns:minmax(10rem,_0.3fr)_minmax(0,_1fr)_auto] [&_.page-shell]:[align-items:center] [&_.page-shell]:[gap:clamp(1.5rem,_4vw,_4rem)] [&::before]:[position:absolute] [&::before]:[top:0] [&::before]:[left:50%] [&::before]:[width:min(calc(100%_-_2rem),_88rem)] [&::before]:[height:1px] [&::before]:[transform:translateX(-50%)] [&::before]:[background:var(--border)] [&::before]:[content:''] max-[72.001rem]:[&_.page-shell]:[grid-template-columns:1fr_auto] max-[72.001rem]:[&_.page-shell]:[gap:1.25rem] max-[72.001rem]:[&_.player-preview-grid]:[grid-column:1_/_-1]",
  'players-strip-heading':
    '[&_p]:[margin:0_0_0.3rem] [&_p]:[color:var(--text-muted)] [&_p]:[font-size:0.57rem] [&_p]:[font-weight:700] [&_p]:[letter-spacing:0.12em] [&_p]:[text-transform:uppercase] [&_h2]:[margin:0] [&_h2]:[font-family:var(--font-display)] [&_h2]:[font-size:1.35rem] [&_h2]:[font-weight:400]',
  'players-strip-link':
    '[color:var(--text-muted)] [font-size:0.64rem] [text-decoration:none] [white-space:nowrap] [&:hover]:[color:var(--accent-strong)]',
  'player-status-message':
    '[grid-column:1_/_-1] [margin:0] [padding:0.75rem_1rem] [border-left:3px_solid_var(--border-strong)] [background:var(--surface)] [color:var(--text-muted)] [font-size:0.75rem]',
  'preview-disclaimer':
    '[margin:1rem_0_0] [color:var(--text-muted)] [font-size:0.72rem]',
  'server-status-detail':
    '[margin:1rem_0_0] [color:var(--text-muted)] [font-size:0.72rem]',
  'preview-entry-label':
    '[display:inline-block] [margin-top:0.6rem] [padding:0.25rem_0.45rem] [border:1px_solid_var(--border)] [color:var(--text-muted)] [font-size:0.6rem] [font-weight:700] [letter-spacing:0.1em] [text-transform:uppercase]',
  'preview-note':
    '[padding:0.8rem_1rem] [border-left:3px_solid_var(--warning)] [background:var(--surface)] [color:var(--text-muted)] [font-size:0.75rem]',
  'primary-navigation':
    "[display:flex] [height:100%] [align-items:center] [justify-content:center] [gap:clamp(0.7rem,_1.5vw,_1.5rem)] [&_a]:[border-top:0] [&_a]:[border-right:0] [&_a]:[border-bottom:1px_solid_transparent] [&_a]:[border-left:0] [&_a]:[background:transparent] [&_a]:[color:var(--text-muted)] [&_a]:[font-size:0.77rem] [&_a]:[font-weight:700] [&_a]:[letter-spacing:0.08em] [&_a]:[text-decoration:none] [&_a]:[text-transform:uppercase] [&_a]:[display:flex] [&_a]:[height:100%] [&_a]:[align-items:center] [&_a]:[padding-block:0.75rem] [&_[aria-current='page']]:[border-bottom-color:var(--accent)] [&_[aria-current='page']]:[color:var(--text)] [&_a:hover]:[border-bottom-color:var(--accent)] [&_a:hover]:[color:var(--text)] max-[72.001rem]:[position:absolute] max-[72.001rem]:[grid-column:1_/_-1] max-[72.001rem]:[top:calc(100%_-_1px)] max-[72.001rem]:[right:0] max-[72.001rem]:[left:auto] max-[72.001rem]:[display:none] max-[72.001rem]:[width:min(24rem,_calc(100vw_-_2rem))] max-[72.001rem]:[height:auto] max-[72.001rem]:[grid-template-columns:repeat(2,_minmax(0,_1fr))] max-[72.001rem]:[align-items:stretch] max-[72.001rem]:[justify-content:stretch] max-[72.001rem]:[padding:0.75rem] max-[72.001rem]:[gap:0.4rem] max-[72.001rem]:[border:1px_solid_var(--border-strong)] max-[72.001rem]:[background:var(--surface-strong)] max-[72.001rem]:[box-shadow:8px_8px_0_color-mix(in_srgb,_var(--border-strong)_25%,_transparent)] max-[72.001rem]:[&[data-open='true']]:[display:grid] max-[72.001rem]:[&_a]:[height:auto] max-[72.001rem]:[&_a]:[min-height:3rem] max-[72.001rem]:[padding:0.8rem_1rem] max-[72.001rem]:[border:1px_solid_var(--border)] max-[72.001rem]:[background:var(--surface)] max-[72.001rem]:[text-align:left] max-[72.001rem]:[&_[aria-current='page']]:[border-color:var(--accent)] max-[72.001rem]:[&_a:hover]:[background:color-mix(in_srgb,_var(--accent)_10%,_var(--surface))] max-[44.001rem]:[width:calc(100vw_-_1.25rem)]",
  'record-number':
    '[color:var(--text-muted)] [font-family:var(--font-display)] [font-size:1.3rem] max-[44.001rem]:[display:none]',
  'ridge-back': '[bottom:-28%] [transform:rotate(-8deg)] [opacity:0.7]',
  'ridge-front':
    '[right:-22%] [bottom:-42%] [left:-4%] [height:82%] [background:color-mix(in_srgb,_var(--accent)_38%,_var(--surface))]',
  'road-north': '[top:35%] [left:20%] [transform:rotate(-17deg)]',
  'road-south': '[right:6%] [bottom:26%] [transform:rotate(24deg)]',
  'rules-agreement':
    '[display:grid] [grid-template-columns:auto_1fr] [align-items:start] [gap:0.7rem] [color:var(--text-muted)] [font-size:0.78rem] [&_input]:[width:1rem]! [&_input]:[height:1rem]! [&_input]:[margin-top:0.2rem]! [&_input]:[accent-color:var(--accent)]!',
  'screenshot-artwork':
    "[&::before]:[position:absolute] [&::before]:[inset:22%_-15%_-35%] [&::before]:[transform:rotate(-9deg)] [&::before]:[border:1px_solid_rgb(255_255_255_/_30%)] [&::before]:[background:rgb(0_0_0_/_16%)] [&::before]:[content:''] data-[tone=river]:[background:#566f78] data-[tone=forest]:[background:#53634a] data-[tone=ember]:[background:#8a593d] data-[tone=stone]:[background:#686964] [position:relative] [min-height:20rem] [overflow:hidden] [border:1px_solid_var(--border-strong)] [box-shadow:4px_4px_0_color-mix(in_srgb,_var(--border-strong)_20%,_transparent)] [&::after]:[position:absolute] [&::after]:[top:12%] [&::after]:[right:14%] [&::after]:[width:3.5rem] [&::after]:[height:3.5rem] [&::after]:[border:1px_solid_rgb(255_255_255_/_50%)] [&::after]:[border-radius:50%] [&::after]:[background:rgb(255_255_255_/_18%)] [&::after]:[content:''] data-[tone=dawn]:[background:#a66f51] data-[tone=cavern]:[background:#3f4b55] data-[tone=harbour]:[background:#4f6c70] data-[tone=nether]:[background:#733e37] data-[tone=snow]:[background:#89999b] data-[tone=village]:[background:#8a6d45]",
  'screenshot-artwork-large': '[min-height:clamp(22rem,_40vw,_38rem)]',
  'screenshot-gallery':
    '[display:grid] [grid-template-columns:repeat(12,_1fr)] [gap:clamp(2rem,_5vw,_5rem)_1.5rem]',
  'screenshot-gallery-entry':
    "[grid-column:span_4] [&[data-featured='true']]:[grid-column:span_8] [&:not([data-featured='true'])_.screenshot-artwork-large]:[min-height:clamp(18rem,_30vw,_28rem)] [&_>_div:last-child]:[position:relative] [&_>_div:last-child]:[padding:1rem_0_0_2.5rem] [&_>_div:last-child_>_span]:[position:absolute] [&_>_div:last-child_>_span]:[top:1.2rem] [&_>_div:last-child_>_span]:[left:0] [&_>_div:last-child_>_span]:[color:var(--accent)] [&_>_div:last-child_>_span]:[font-family:var(--font-display)] [&_h2]:[margin:0] [&_h2]:[font-family:var(--font-display)] [&_h2]:[font-size:clamp(1.6rem,_3vw,_2.8rem)] [&_h2]:[font-weight:400] [&_h2]:[line-height:1] [&_p]:[margin:0.5rem_0_0] [&_p]:[color:var(--text-muted)] [&_p]:[font-size:0.7rem] max-[72.001rem]:[grid-column:span_6] max-[72.001rem]:[&[data-featured='true']]:[grid-column:span_6] max-[44.001rem]:[grid-column:1_/_-1] max-[44.001rem]:[&[data-featured='true']]:[grid-column:1_/_-1]",
  'screenshot-preview':
    '[&_h3]:[margin:0] [&_h3]:[font-family:var(--font-display)] [&_h3]:[font-weight:400] [grid-column:span_3] [&:nth-child(2)]:[margin-top:2.5rem] [&:nth-child(4)]:[margin-top:2.5rem] [&_h3]:[margin-top:1rem] [&_h3]:[font-size:1.45rem] [&_p]:[margin:0.15rem_0_0] [&_p]:[color:var(--text-muted)] [&_p]:[font-size:0.7rem] max-[72.001rem]:[grid-column:span_6] max-[44.001rem]:[grid-column:1_/_-1] max-[44.001rem]:[&:nth-child(2)]:[margin-top:0] max-[44.001rem]:[&:nth-child(4)]:[margin-top:0]',
  'screenshot-preview-grid':
    '[display:grid] [grid-template-columns:repeat(12,_1fr)] [gap:1.2rem]',
  'screenshots-section':
    "[position:relative] [&::before]:[position:absolute] [&::before]:[top:0] [&::before]:[left:50%] [&::before]:[width:min(calc(100%_-_2rem),_88rem)] [&::before]:[height:1px] [&::before]:[transform:translateX(-50%)] [&::before]:[background:var(--border)] [&::before]:[content:'']",
  'section-heading':
    '[display:grid] [grid-template-columns:minmax(16rem,_1fr)_minmax(16rem,_0.7fr)_auto] [align-items:end] [margin-bottom:clamp(2rem,_3vw,_3rem)] [padding-bottom:1.2rem] [gap:2rem] [&_.eyebrow]:[margin-bottom:0.6rem] [&_h2]:[max-width:15ch] [&_h2]:[margin:0] [&_h2]:[font-family:var(--font-display)] [&_h2]:[font-size:clamp(2.6rem,_5vw,_5rem)] [&_h2]:[font-weight:400] [&_h2]:[letter-spacing:-0.04em] [&_h2]:[line-height:0.95] [&_>_p]:[margin:0] [&_>_p]:[color:var(--text-muted)] max-[72.001rem]:[grid-template-columns:1fr_1fr] max-[72.001rem]:[&_.section-link]:[grid-column:2] max-[44.001rem]:[grid-template-columns:1fr] max-[44.001rem]:[gap:1.2rem] max-[44.001rem]:[&_.section-link]:[grid-column:auto]',
  'section-link':
    '[display:inline-flex] [align-items:center] [justify-content:space-between] [min-width:11rem] [padding:0.7rem_0] [gap:1rem] [border-bottom:1px_solid_var(--accent)] [color:var(--accent-strong)] [font-size:0.75rem] [font-weight:700] [letter-spacing:0.07em] [text-decoration:none] [text-transform:uppercase] [&:hover]:[color:var(--text)]',
  'settlement-copy':
    '[&_h2]:[max-width:15ch] [&_h2]:[margin:0] [&_h2]:[font-family:var(--font-display)] [&_h2]:[font-size:clamp(2.6rem,_5vw,_5rem)] [&_h2]:[font-weight:400] [&_h2]:[letter-spacing:-0.04em] [&_h2]:[line-height:0.95] [&_>_p:last-child]:[color:var(--text-muted)]',
  'settlement-corner':
    '[position:absolute] [z-index:2] [top:0.65rem] [width:1rem] [height:1rem] [border-top:1px_solid_var(--text)]',
  'settlement-facts':
    '[display:grid] [grid-template-columns:1fr_1fr] [margin-block:2rem] [border-block:1px_solid_var(--border)] [&_div]:[padding-block:1rem] [&_div_+_div]:[padding-left:1rem] [&_div_+_div]:[border-left:1px_solid_var(--border)] [&_dt]:[color:var(--text-muted)] [&_dt]:[font-size:0.62rem] [&_dt]:[font-weight:700] [&_dt]:[letter-spacing:0.12em] [&_dt]:[text-transform:uppercase] [&_dd]:[margin:0.3rem_0_0] [&_dd]:[font-family:var(--font-display)] [&_dd]:[font-size:1.2rem]',
  'settlement-frame-note':
    '[position:absolute] [top:calc(100%_+_3.5rem)] [right:0] [display:flex] [max-width:72%] [justify-content:flex-end] [gap:1.5rem] [color:var(--text-muted)] [font-size:0.58rem] [text-align:right] [&_strong]:[color:var(--text)] [&_strong]:[font-weight:500] [&_strong]:[white-space:nowrap] max-[44.001rem]:[max-width:90%]',
  'settlement-image':
    '[position:absolute] [inset:0] [width:100%] [height:100%] [object-fit:cover]',
  'settlement-keep':
    '[position:absolute] [bottom:26%] [left:37%] [width:23%] [height:25%] [border:2px_solid_var(--border-strong)] [background:var(--surface-strong)] [box-shadow:-2.5rem_2rem_0_-1rem_var(--surface-strong),_2.5rem_1rem_0_-0.7rem_var(--surface-strong)]',
  'settlement-ridge':
    '[position:absolute] [right:-15%] [bottom:-20%] [left:-15%] [height:70%] [transform:rotate(7deg)] [border:1px_solid_var(--border-strong)] [background:color-mix(in_srgb,_var(--success)_38%,_var(--surface))]',
  'settlement-sun':
    '[position:absolute] [top:16%] [right:13%] [width:7rem] [height:7rem] [border:1px_solid_var(--accent)] [border-radius:50%] [background:color-mix(in_srgb,_var(--warning)_35%,_var(--surface))]',
  'settlement-visual':
    '[position:relative] [min-height:clamp(26rem,_48vw,_40rem)] [overflow:hidden] [border:1px_solid_var(--border-strong)] [background:color-mix(in_srgb,_var(--accent)_13%,_var(--surface))] [box-shadow:var(--shadow)]',
  'site-header':
    '[position:sticky] [top:0] [z-index:50] [height:var(--header-height)] [background:color-mix(in_srgb,_var(--background)_68%,_transparent)] [backdrop-filter:blur(14px)_saturate(0.85)]',
  'skip-link':
    '[position:fixed] [top:0.75rem] [left:0.75rem] [z-index:100] [padding:0.7rem_1rem] [transform:translateY(-180%)] [border:1px_solid_var(--border-strong)] [background:var(--surface-strong)] [color:var(--text)] [font-weight:700] [&:focus]:[transform:translateY(0)]',
  'status-pip':
    "[width:0.55rem] [height:0.55rem] [border:1px_solid_var(--success)] [background:var(--success)] [box-shadow:0_0_0_3px_color-mix(in_srgb,_var(--success)_18%,_transparent)] [&[data-state='loading']]:[border-color:var(--warning)] [&[data-state='loading']]:[background:var(--warning)] [&[data-state='loading']]:[box-shadow:0_0_0_3px_color-mix(in_srgb,_var(--warning)_18%,_transparent)] [&[data-state='offline']]:[border-color:var(--accent)] [&[data-state='offline']]:[background:var(--accent)] [&[data-state='offline']]:[box-shadow:0_0_0_3px_color-mix(in_srgb,_var(--accent)_18%,_transparent)] [&[data-state='unavailable']]:[border-color:var(--text-muted)] [&[data-state='unavailable']]:[background:transparent] [&[data-state='unavailable']]:[box-shadow:none] [&[data-state='stale']]:[border-color:var(--warning)] [&[data-state='stale']]:[background:var(--warning)] [&[data-state='stale']]:[box-shadow:0_0_0_3px_color-mix(in_srgb,_var(--warning)_18%,_transparent)]",
  'story-archive':
    '[display:grid] [grid-template-columns:repeat(2,_minmax(0,_1fr))] [gap:clamp(2rem,_5vw,_5rem)_clamp(1.5rem,_4vw,_4rem)] max-[44.001rem]:[grid-template-columns:1fr]',
  'story-archive-entry':
    '[&:nth-child(even)]:[margin-top:5rem] [&_h2]:[margin:1rem_0_0] [&_h2]:[font-family:var(--font-display)] [&_h2]:[font-size:clamp(2rem,_3.6vw,_3.6rem)] [&_h2]:[font-weight:400] [&_h2]:[line-height:1] [&_>_div:last-child_>_p:not(.story-meta)]:[color:var(--text-muted)] max-[44.001rem]:[&:nth-child(even)]:[margin-top:0]',
  'story-artwork':
    "[position:relative] [display:grid] [min-height:12rem] [align-items:end] [padding:1rem] [overflow:hidden] [border:1px_solid_var(--border-strong)] [background:var(--surface-strong)] [&::before]:[position:absolute] [&::before]:[inset:22%_-15%_-35%] [&::before]:[transform:rotate(-9deg)] [&::before]:[border:1px_solid_rgb(255_255_255_/_30%)] [&::before]:[background:rgb(0_0_0_/_16%)] [&::before]:[content:''] data-[tone=river]:[background:#566f78] data-[tone=forest]:[background:#53634a] data-[tone=ember]:[background:#8a593d] data-[tone=stone]:[background:#686964] [&_span]:[position:relative] [&_span]:[z-index:1] [&_span]:[color:#fffaf1] [&_span]:[font-family:var(--font-display)] [&_span]:[font-size:2.5rem] data-[tone=dawn]:[background:#a66f51] data-[tone=cavern]:[background:#3f4b55] data-[tone=harbour]:[background:#4f6c70] data-[tone=nether]:[background:#733e37] data-[tone=snow]:[background:#89999b] data-[tone=village]:[background:#8a6d45]",
  'story-artwork-large': '[min-height:clamp(20rem,_35vw,_31rem)]',
  'story-author':
    '[display:flex] [align-items:center] [margin:0] [gap:0.55rem] [color:var(--text-muted)] [font-size:0.68rem] [white-space:nowrap] [&_span]:[display:grid] [&_span]:[width:2rem] [&_span]:[height:2rem] [&_span]:[place-items:center] [&_span]:[border:1px_solid_var(--border-strong)] [&_span]:[background:var(--surface)] [&_span]:[color:var(--text)] [&_span]:[font-size:0.6rem] max-[44.001rem]:[grid-column:2]',
  'story-copy':
    '[align-self:center] [&_>_p:last-child]:[max-width:45rem] [&_>_p:last-child]:[margin-bottom:0] [&_>_p:last-child]:[color:var(--text-muted)]',
  'story-ledger-entry':
    '[display:grid] [grid-template-columns:2.5rem_minmax(0,_1fr)_auto] [align-items:center] [padding-block:1.55rem] [gap:clamp(1rem,_2.5vw,_2.5rem)] [border-bottom:1px_solid_var(--border)] [&_h3]:[margin:0] [&_h3]:[font-family:var(--font-display)] [&_h3]:[font-size:clamp(1.45rem,_2vw,_2rem)] [&_h3]:[font-weight:400] [&_h3]:[line-height:1.1] [&_>_div_>_p:last-child]:[margin:0.55rem_0_0] [&_>_div_>_p:last-child]:[color:var(--text-muted)] [&_>_div_>_p:last-child]:[font-size:0.78rem] max-[44.001rem]:[grid-template-columns:2rem_minmax(0,_1fr)]',
  'story-ledger-heading':
    '[display:flex] [align-items:end] [justify-content:space-between] [padding-bottom:2rem] [gap:2rem] [border-bottom:1px_solid_var(--border-strong)] [&_h2]:[margin:0] [&_h2]:[font-family:var(--font-display)] [&_h2]:[font-size:clamp(2.8rem,_5vw,_5rem)] [&_h2]:[font-weight:400] [&_h2]:[letter-spacing:-0.04em] [&_h2]:[line-height:0.95] [&_a]:[padding-bottom:0.35rem] [&_a]:[color:var(--text-muted)] [&_a]:[font-size:0.68rem] [&_a]:[text-decoration:none] [&_a]:[white-space:nowrap] [&_a:hover]:[color:var(--accent-strong)] max-[44.001rem]:[align-items:start] max-[44.001rem]:[flex-direction:column] max-[44.001rem]:[gap:1rem]',
  'story-meta':
    '[margin:0_0_0.6rem] [color:var(--accent-strong)] [font-size:0.67rem] [font-weight:700] [letter-spacing:0.08em] [text-transform:uppercase]',
  'story-number':
    '[align-self:start] [color:var(--accent-strong)] [font-family:var(--font-display)] [font-size:1rem]',
  'story-preview':
    '[&_h3]:[margin:0] [&_h3]:[font-family:var(--font-display)] [&_h3]:[font-weight:400] [display:grid] [grid-template-columns:minmax(12rem,_0.55fr)_minmax(0,_1.45fr)] [padding-block:1.5rem] [gap:clamp(1.5rem,_4vw,_4rem)] [border-bottom:1px_solid_var(--border-strong)] [&_h3]:[font-size:clamp(2rem,_3.2vw,_3.5rem)] [&_h3]:[line-height:1] max-[44.001rem]:[grid-template-columns:1fr]',
  'story-preview-list': '[border-top:1px_solid_var(--border-strong)]',
  'submit-preview-button':
    '[padding:0.8rem_1rem] [border:1px_solid_var(--border-strong)] [font-size:0.72rem] [font-weight:700] [letter-spacing:0.07em] [text-transform:uppercase] [background:var(--accent)] [color:var(--accent-contrast)] [&:disabled]:[cursor:not-allowed] [&:disabled]:[filter:grayscale(0.45)] [&:disabled]:[opacity:0.55]',
  'text-link': '[color:var(--accent-strong)] [font-weight:700]',
  'visually-hidden':
    '[position:absolute] [width:1px] [height:1px] [padding:0] [overflow:hidden] [clip:rect(0_0_0_0)] [white-space:nowrap] [border:0]',
}

export function tw(classNames: string) {
  return classNames
    .split(/\s+/)
    .flatMap((className) => [className, utilities[className]])
    .filter(Boolean)
    .join(' ')
}
