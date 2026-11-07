// Tiny bridge so any button can open the prototype guide without prop drilling.
export const GUIDE_EVENT = 'vangogh:open-guide'

export function openGuide(node = 'start') {
  window.dispatchEvent(new CustomEvent(GUIDE_EVENT, { detail: node }))
}
