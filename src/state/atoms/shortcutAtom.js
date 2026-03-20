import { atomWithStorage } from 'jotai/utils';

// 'show' = first visit, show modal
// 'later' = remind later, show again next visit
// 'done' = never show again
export const shortcutAtom = atomWithStorage('shortcut', 'show');

export default shortcutAtom;
