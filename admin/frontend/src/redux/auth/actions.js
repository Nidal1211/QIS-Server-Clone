import axios from "axios";
export const login = (loginData) => async (dispatch) => {
  try {
    dispatch({ type: "loginRequest" });

    const { data } = await axios.post(
      `/api/login`,
      loginData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    dispatch({ type: "loginSuccess", payload: data });
    localStorage.setItem("isAuth", true);
  } catch (error) {
    localStorage.setItem("isAuth", false);
    dispatch({ type: "loginFailure", payload: error?.response?.data?.message });
  }
};

export const logOut = () => async (dispatch) => {
  try {
    dispatch({ type: "logOutRequest" });

    const { data } = await axios.get(`/api/logout`, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    dispatch({ type: "logOutSuccess", payload: data });
    localStorage.setItem("isAuth", false);
  } catch (error) {
    dispatch({
      type: "logOutFailure",
      payload: error.response.data.message,
    });
  }
};
