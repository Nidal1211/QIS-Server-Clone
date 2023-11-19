import { configureStore } from "@reduxjs/toolkit";
import { billingPlanReducer } from "./billingPlans/reducers";
import { eventReducer, eventsReducer } from "./events/reducers";
import { userReducer, usersReducer } from "./users/reducers";
import { categoryReducer } from "./categories/reducers";
import { productReducer, productsReducer } from "./product/reducers";

const store = configureStore({
  reducer: {
    user: userReducer,
    categories: categoryReducer,
    product: productReducer,
    products: productsReducer,
    billingPlan: billingPlanReducer,
    users: usersReducer,
    event: eventReducer,
    events: eventsReducer,
  },
});

export default store;
