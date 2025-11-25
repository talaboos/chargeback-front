import { atomWithStorage } from 'jotai/utils';

// const storage = createJSONStorage(() => sessionStorage);

export const sessionAtom = atomWithStorage('info', true);

export default sessionAtom;
