import axios from "axios";

export const addExam = (examData) => async (dispatch) => {
  try {
    dispatch({ type: "addExamRequest" });

    const { data } = await axios.post(`/api/exam/add`, examData, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    dispatch({ type: "addExamSuccess", payload: data });
  } catch (error) {
    dispatch({
      type: "addExamFailure",
      payload: error.response.data.message,
    });
  }
};
export const getExams = () => async (dispatch) => {
  try {
    dispatch({ type: "getExamListRequest" });

    const { data } = await axios.get(`/api/exam/get`, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    dispatch({ type: "getExamListuccess", payload: data });
  } catch (error) {
    dispatch({
      type: "getExamListFailure",
      payload: error.response.data.message,
    });
  }
};
export const deleteExam = (examId) => async (dispatch) => {
  try {
    dispatch({ type: "deleteExamRequest" });

    const { data } = await axios.delete(`/api/exam/delete/${examId}`, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    dispatch({ type: "deleteExamSuccess", payload: data });
  } catch (error) {
    dispatch({
      type: "deleteExamFailure",
      payload: error.response.data.message,
    });
  }
};
export const getExamById = (id) => async (dispatch) => {
  try {
    dispatch({ type: "getExamRequest" });

    const { data } = await axios.get(`/api/exam/get/${id}`, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    dispatch({ type: "getExamSuccess", payload: data });
  } catch (error) {
    dispatch({
      type: "getExamFailure",
      payload: error.response.data.message,
    });
  }
};

export const updateCategory = (id, categoryData) => async (dispatch) => {
  try {
    dispatch({ type: "updatecategoryRequest" });

    const { data } = await axios.post(
      `/api/category/update/${id}`,
      categoryData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    dispatch({ type: "updatecategorySuccess", payload: data });
  } catch (error) {
    dispatch({
      type: "updatecategoryFailure",
      payload: error.response.data.message,
    });
  }
};
