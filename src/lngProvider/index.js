import enLang from "./entries/en-US";
import arLang from "./entries/ar_SA";
import frLang from "./entries/fr_FR";
import { addLocaleData } from "react-intl";

const AppLocale = {
  en: enLang,
  ar: arLang,
  fr: frLang
};
addLocaleData(AppLocale.en.data);
addLocaleData(AppLocale.ar.data);
addLocaleData(AppLocale.fr.data);

export default AppLocale;
