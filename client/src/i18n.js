// modules
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
// components
// redux
import store from "./store/Store";
// assets
import strings from "./assets/strings.json";
// styles

i18n.use(initReactI18next).init({
    resources: strings,
    // get language from redux state
    lng: store.getState().preferences.locale,
    keySeparator: false,
    interpolation: {
        escapeValue: false
    }
});

export default i18n;
