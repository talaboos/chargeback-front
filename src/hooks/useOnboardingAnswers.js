import { useAtom } from 'jotai';
import { onboardingAnswersAtom } from '@/state/atoms/onboardingAnswersAtom';

export const useOnboardingAnswers = () => {
  const [onboardingAnswers, setOnboardingAnswers] = useAtom(
    onboardingAnswersAtom,
  );

  const setAnswer = (key, value) => {
    setOnboardingAnswers((prev) => {
      const updatedAnswers = { ...prev.answers, [key]: value };

      return {
        ...prev,
        answers: updatedAnswers,
      };
    });
  };
  const getAnswer = (key) => onboardingAnswers.answers?.[key];

  return {
    setAnswer,
    getAnswer,
    onboardingAnswers,
  };
};

export default useOnboardingAnswers;
