import { createTranslationProvider } from './translation-provider';
import viewarApi from 'viewar-api';
import config from '../config';

const getLanguageKey = () => config.app.language;

const getLanguage = () => getLanguageKey().replace(/(\w{2})-\w{2}/, '$1');
const getIsWebVersion = () => viewarApi.coreInterface.platform === 'Emscripten';
const getIsMobilePhoneDevice = () => viewarApi.appConfig.deviceType === 'phone';

export const translationProvider = createTranslationProvider({
  getIsWebVersion,
  getIsMobilePhoneDevice,
  getLanguage,
});

export const translate = (id, asHtml) =>
  translationProvider ? translationProvider.translate(id, asHtml) : id;
