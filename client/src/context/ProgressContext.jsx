import React, {createContext, useContext, useState, useEffect} from "react";

const ProgressContext = createContext();

export const useProgress = () => useContext(ProgressContext);

export const ProgressProvider = ({children}) => {
  // Structure: { [courseId]: [completedLessonId1, completedLessonId2, ...] }
  const [progress, setProgress] = useState(() => {
    const saved = localStorage.getItem("user_progress");
    return saved ? JSON.parse(saved) : {};
  });

  useEffect(() => {
    localStorage.setItem("user_progress", JSON.stringify(progress));
  }, [progress]);

  const markLessonCompleted = (courseId, lessonId) => {
    setProgress((prev) => {
      const courseProgress = prev[courseId] || [];
      if (courseProgress.includes(lessonId)) return prev; // Already done

      return {
        ...prev,
        [courseId]: [...courseProgress, lessonId],
      };
    });
  };

  const isLessonCompleted = (courseId, lessonId) => {
    return progress[courseId]?.includes(lessonId);
  };

  return (
    <ProgressContext.Provider
      value={{
        progress,
        markLessonCompleted,
        isLessonCompleted,
      }}
    >
      {children}
    </ProgressContext.Provider>
  );
};
