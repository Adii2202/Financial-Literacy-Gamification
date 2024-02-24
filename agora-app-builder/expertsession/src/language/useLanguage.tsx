/*
********************************************
 Copyright © 2021 Agora Lab, Inc., all rights reserved.
 AppBuilder and all associated components, source code, APIs, services, and documentation 
 (the “Materials”) are owned by Agora Lab, Inc. and its licensors. The Materials may not be 
 accessed, used, modified, or distributed for any purpose without a license from Agora Lab, Inc.  
 Use without a license or in violation of any license terms and conditions (including use for 
 any purpose competitive to Agora Lab, Inc.’s business) is strictly prohibited. For more 
 information visit https://appbuilder.agora.io. 
*********************************************
*/
import React, {createContext, useContext, useEffect, useState} from 'react';
import {createHook, useCustomization} from 'customization-implementation';
import {DEFAULT_I18_DATA} from './index';
import StorageContext from '../components/StorageContext';

export interface LanguageContextInterface {
  languageCode: string;
  setLanguageCode: (code: string) => void;
}

export interface LanguagePropsInterface {
  children: React.ReactNode;
}

const LanguageContext = createContext<LanguageContextInterface>({
  languageCode: DEFAULT_I18_DATA.locale,
  setLanguageCode: () => {},
});

const LanguageProvider = (props: LanguagePropsInterface) => {
  const {store, setStore} = useContext(StorageContext);
  const i18nData = useCustomization((data) => data?.i18n);

  //If language code is stored in the localstorage no longer available in fpe data
  //then we will update the localstorage value to default value
  let storedCode =
    i18nData && Array.isArray(i18nData) && i18nData.length
      ? i18nData?.find((item) => item.locale === store.selectedLanguageCode)
        ? store.selectedLanguageCode
        : undefined
      : undefined;

  const [languageCode, setLanguageCodeLocal] = useState(
    storedCode ||
      (i18nData && Array.isArray(i18nData) && i18nData.length
        ? i18nData[0].locale
        : false) ||
      DEFAULT_I18_DATA.locale,
  );

  useEffect(() => {
    if (setStore) {
      setStore((prevState) => {
        return {
          ...prevState,
          selectedLanguageCode: languageCode,
        };
      });
    }
  }, [languageCode]);

  useEffect(() => {
    let storedCode =
      i18nData && Array.isArray(i18nData) && i18nData.length
        ? i18nData?.find((item) => item.locale === store.selectedLanguageCode)
          ? store.selectedLanguageCode
          : undefined
        : undefined;
    setLanguageCodeLocal(
      storedCode ||
        (i18nData && Array.isArray(i18nData) && i18nData.length
          ? i18nData[0].locale
          : false) ||
        DEFAULT_I18_DATA.locale,
    );
  }, [i18nData]);

  const setLanguageCode = (langCode: string) => {
    setLanguageCodeLocal(langCode);
  };

  return (
    <LanguageContext.Provider value={{languageCode, setLanguageCode}}>
      {props.children}
    </LanguageContext.Provider>
  );
};
const useLanguage = createHook(LanguageContext);

export {LanguageProvider, useLanguage};
