import { configureStore } from "@reduxjs/toolkit";

import { authReducer } from "./auth/reducers";
import { studiengangReducer } from "./studiengang/reducers";
import { professorReducer } from "./professor/reducers";
import { studentReducer } from "./student/reducers";
import { examReducer } from "./exams/reducers";

const store = configureStore({
  reducer: {
    auth: authReducer,
    studiengang: studiengangReducer,
    exam: examReducer,
    professor: professorReducer,
    student: studentReducer,
  },
});

export default store;
