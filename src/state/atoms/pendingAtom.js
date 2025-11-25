import { atomWithStorage, createJSONStorage } from 'jotai/utils';

const storage = createJSONStorage(() => sessionStorage);

export const pendingAtom = atomWithStorage('responses', [], storage);

export default pendingAtom;
