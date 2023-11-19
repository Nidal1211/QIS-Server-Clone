import axios from "axios";
export const createStudiengang = (studiengangData) => async (dispatch) => {
  try {
    dispatch({ type: "createStudiengangRequest" });

    const { data } = await axios.post(`/api/studiengang/add`, studiengangData, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    dispatch({ type: "createStudiengangSuccess", payload: data });
  } catch (error) {
    dispatch({
      type: "createStudiengangFailure",
      payload: error.response.data.message,
    });
  }
};
export const getStudiengangList = () => async (dispatch) => {
  try {
    dispatch({ type: "getstudiengangListRequest" });

    const { data } = await axios.get(`/api/studiengang/get`, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    dispatch({ type: "getstudiengangListSuccess", payload: data });
  } catch (error) {
    dispatch({
      type: "getstudiengangListFailure",
      payload: error.response.data.message,
    });
  }
};
export const deleteStudiengang = (id) => async (dispatch) => {
  try {
    dispatch({ type: "deleteSudiengangRequest" });

    const { data } = await axios.delete(`/api/studiengang/delete/${id}`, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    dispatch({ type: "deleteSudiengangSuccess", payload: data });
  } catch (error) {
    dispatch({
      type: "deleteSudiengangFailure",
      payload: error.response.data.message,
    });
  }
};
