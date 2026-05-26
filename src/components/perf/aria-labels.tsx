/**
 * ARIA attribute helpers for generating accessible markup.
 */

export function ariaLabel(label: string) {
  return { "aria-label": label };
}

export function ariaDescribedBy(id: string) {
  return { "aria-describedby": id };
}

export function ariaExpanded(expanded: boolean) {
  return { "aria-expanded": expanded };
}

export function ariaSelected(selected: boolean) {
  return { "aria-selected": selected };
}

export function ariaHidden(hidden: boolean) {
  return { "aria-hidden": hidden };
}

export function ariaCurrent(current: "page" | "step" | "location" | "date" | "time" | true) {
  return { "aria-current": current };
}

export function ariaLive(mode: "polite" | "assertive" | "off") {
  return { "aria-live": mode };
}

/**
 * Generate props for a disclosure (expandable) trigger button.
 */
export function disclosureProps(expanded: boolean, controlsId: string) {
  return {
    "aria-expanded": expanded,
    "aria-controls": controlsId,
    role: "button",
  };
}

/**
 * Generate props for a tab element.
 */
export function tabProps(selected: boolean, panelId: string) {
  return {
    role: "tab",
    "aria-selected": selected,
    "aria-controls": panelId,
    tabIndex: selected ? 0 : -1,
  };
}

/**
 * Generate props for a tab panel.
 */
export function tabPanelProps(tabId: string) {
  return {
    role: "tabpanel",
    "aria-labelledby": tabId,
    tabIndex: 0,
  };
}
