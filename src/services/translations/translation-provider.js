import React from 'react';

import en from '../../../assets/translations/en.js';
import de from '../../../assets/translations/de.js';

const MOBILEPHONE_SUFFIX = '_Phone';
const WEBVERSION_SUFFIX = '_Web';

let translationList = {
  en,
  de,
};

export function createTranslationProvider({
  getIsWebVersion,
  getIsMobilePhoneDevice,
  getLanguage,
}) {
  let language = Object.keys(translationList)[0];
  let translations = {};
  let isMobilePhoneDevice = false;
  let isWebVersion = false;
  let initialized = false;

  let translationProvider = {
    translate,
    init,
    setLanguage,
    get language() {
      return language;
    },
    get translations() {
      return translations;
    },
  };

  return translationProvider;

  function init() {
    isWebVersion = getIsWebVersion();
    isMobilePhoneDevice = getIsMobilePhoneDevice();

    setLanguage(getLanguage());

    initialized = true;
  }

  function setLanguage(lang) {
    if (translationList[lang]) {
      language = lang;
      translations = translationList[lang];
    }
  }

  function translate(id, asHtml = true) {
    if (!initialized) {
      init();
    }

    let translation = getTranslation(id);

    if (isMobilePhoneDevice) {
      translation = getTranslation(id, MOBILEPHONE_SUFFIX, translation);
    }

    if (isWebVersion) {
      translation = getTranslation(id, WEBVERSION_SUFFIX, translation);
    }

    if (strNotNull(translation)) {
      return asHtml ? (
        <span dangerouslySetInnerHTML={{ __html: translation }} />
      ) : (
        translation
      );
    } else {
      // TODO: Log missing translation to server.
      return asHtml ? <span dangerouslySetInnerHTML={{ __html: id }} /> : id;
    }
  }

  function getTranslation(id, suffix = '', defaultValue = null) {
    if (strNotNull(translations[id + suffix])) {
      return translations[id + suffix];
    } else {
      return defaultValue;
    }
  }

  function strNotNull(string) {
    return string || string === '';
  }
}
