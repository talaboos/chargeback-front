import { atom } from 'jotai';

export const modalOpen = atom(false);
export const modalContent = atom(null);
export const modalAtom = atom(
  (get) => ({
    type: get(modalOpen),
    open: get(modalOpen),
    content: get(modalContent),
  }),
  (get, set, openModal) => {
    const { open, content, type } = openModal;
    if (!type) {
      set(modalOpen, open);
    } else {
      set(modalOpen, { open, type });
    }
    if (content) {
      set(modalContent, content);
    }
  },
);

export default { modalAtom, modalContent, modalOpen };
