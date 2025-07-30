"use client";
import { persistor, store } from "@/store/store";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import Loading from "./Loading";

export default function GlobalProvider({children}) {
  return (
    <Provider store={store}>
        <PersistGate persistor = {persistor} loading={<Loading />}>
            {children}
        </PersistGate>
    </Provider>
  )
}
