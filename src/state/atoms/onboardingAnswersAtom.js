import { atomWithStorage } from 'jotai/utils';

const isClient = typeof window !== 'undefined';

const getInitialAnswers = () => {
  if (!isClient) return { answers: [] };

  const storedAnswers = JSON.parse(localStorage.getItem('onboardingAnswers'));

  return storedAnswers || { answers: [] };
};

export const onboardingAnswersAtom = atomWithStorage(
  'onboardingAnswers',
  getInitialAnswers(),
);

export default { onboardingAnswersAtom };
