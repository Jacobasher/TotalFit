import ExerciseListPage from './ExerciseListPage';
import ExerciseCreatePage from './ExerciseCreatePage';
import ExerciseEditPage from './ExerciseEditPage';
import ExerciseArchivePage from './ExerciseArchivePage';
import * as ExerciseService from './ExerciseService';

export const module = {
  routes: [
    { path: '/exercises', element: <ExerciseListPage /> },
    { path: '/exercises/create', element: <ExerciseCreatePage /> },
    { path: '/exercises/:id/edit', element: <ExerciseEditPage /> },
    { path: '/exercises/:id/archive', element: <ExerciseArchivePage /> }
  ],
  dashboardWidgets: [],
  services: ExerciseService
};

export default module;
