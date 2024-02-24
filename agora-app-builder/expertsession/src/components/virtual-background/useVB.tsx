import {createHook} from 'customization-implementation';
import React, {useContext} from 'react';
import {useEffect, useRef} from 'react';
import {SidePanelType, useRtc, useSidePanel} from 'customization-api';
import AgoraRTC, {ILocalVideoTrack} from 'agora-rtc-sdk-ng';
import Image from 'react-native';
import VirtualBackgroundExtension from 'agora-extension-virtual-background';
//@ts-ignore
import wasm1 from '../../../node_modules/agora-extension-virtual-background/wasms/agora-wasm.wasm';
import {IconsInterface} from '../../atoms/CustomIcon';
import {PropsContext} from '../../../agora-rn-uikit';
import {isMobileUA} from '../../utils/common';
import {retrieveImagesFromIndexDB} from './VButils';
import imagePathsArray from './imagePaths';
import getUniqueID from '../../../src/utils/getUniqueID';
import {TextDataInterface} from '../../../src/language/default-labels';
//@ts-ignore

export type VBMode = 'blur' | 'image' | 'custom' | 'none';

export type Option = {
  type: VBMode;
  icon: keyof IconsInterface;
  path?: string & {default?: string};
  label?: string;
  id?: string;
  translationKey?: keyof TextDataInterface;
};

// processors for the main view and preview view
let mainViewProcessor: ReturnType<
  VirtualBackgroundExtension['_createProcessor']
> | null = null;
let previewViewProcessor: ReturnType<
  VirtualBackgroundExtension['_createProcessor']
> | null = null;

// fn to initialize processors
const initializeProcessors = () => {
  const mainViewExtension = new VirtualBackgroundExtension();
  AgoraRTC.registerExtensions([mainViewExtension]);
  mainViewProcessor = mainViewExtension.createProcessor();
  mainViewProcessor.init(wasm1).then(() => {
    mainViewProcessor.disable();
  });

  previewViewProcessor = mainViewExtension.createProcessor();
  previewViewProcessor.init(wasm1).then(() => {
    previewViewProcessor.disable();
  });
};

type VirtualBackgroundConfig = {
  blurDegree?: number;
  type: 'blur' | 'img' | 'custom'; // Adjust this as needed based on your configuration options
  source?: HTMLImageElement; // Adjust this based on the type of source you expect
};

type VBContextValue = {
  isVBActive: boolean;
  setIsVBActive: React.Dispatch<React.SetStateAction<boolean>>;
  vbMode: VBMode;
  setVBmode: React.Dispatch<React.SetStateAction<VBMode>>;
  selectedImage: string | null;
  setSelectedImage: React.Dispatch<React.SetStateAction<string | null>>;
  previewVideoTrack: ILocalVideoTrack | null;
  setPreviewVideoTrack: React.Dispatch<React.SetStateAction<ILocalVideoTrack> | null>;
  saveVB: boolean;
  setSaveVB: React.Dispatch<React.SetStateAction<boolean>>;
  options: Option[];
  setOptions: React.Dispatch<React.SetStateAction<Option[]>>;
};

export const VBContext = React.createContext<VBContextValue>({
  isVBActive: false,
  setIsVBActive: () => {},
  vbMode: 'none',
  setVBmode: () => {},
  selectedImage: null,
  setSelectedImage: () => {},
  previewVideoTrack: null,
  setPreviewVideoTrack: () => {},
  saveVB: false,
  setSaveVB: () => {},
  options: [],
  setOptions: () => {},
});

const VBProvider: React.FC = ({children}) => {
  const [isVBActive, setIsVBActive] = React.useState<boolean>(false);
  const [vbMode, setVBmode] = React.useState<VBMode>('none');
  const [selectedImage, setSelectedImage] = React.useState<string | null>(null);
  const [saveVB, setSaveVB] = React.useState(false);
  const {RtcEngineUnsafe} = useRtc();
  // can be original video track/clone track
  const [previewVideoTrack, setPreviewVideoTrack] =
    React.useState<ILocalVideoTrack | null>(null);
  const {sidePanel} = useSidePanel();
  const [options, setOptions] = React.useState<Option[]>(imagePathsArray);

  const {
    rtcProps: {callActive},
  } = useContext(PropsContext);

  const isPreCallScreen = !callActive;
  const isMobile = isMobileUA();

  let processor =
    useRef<ReturnType<VirtualBackgroundExtension['_createProcessor']>>(null);

  useEffect(() => {
    initializeProcessors();
  }, []);

  //if vitrual got closed by some other settings/chat panel then update the state
  //ex: user open vitrual background using more menu and then open chat will hide the vitrual background panel
  //so we need to update the state
  useEffect(() => {
    if (sidePanel !== SidePanelType.VirtualBackground) {
      setIsVBActive(false);
    }
  }, [sidePanel]);

  const applyVirtualBackgroundToMainView = async (
    config: VirtualBackgroundConfig,
  ) => {
    //@ts-ignore
    const localVideoTrack = RtcEngineUnsafe?.localStream?.video;
    //  mainViewProcessor && (await mainViewProcessor.disable()); // Disable the old processor
    localVideoTrack
      ?.pipe(mainViewProcessor)
      .pipe(localVideoTrack?.processorDestination);
    mainViewProcessor.setOptions(config);
    await mainViewProcessor.enable();
  };

  // Function to apply virtual background to the preview view
  const applyVirtualBackgroundToPreviewView = async (
    config: VirtualBackgroundConfig,
  ) => {
    const localVideoTrack = previewVideoTrack; // Use the preview view's video track
    // previewViewProcessor && (await previewViewProcessor.disable()); // Disable the old processor
    if (!localVideoTrack) return;
    localVideoTrack
      ?.pipe(previewViewProcessor)
      .pipe(localVideoTrack?.processorDestination);
    previewViewProcessor.setOptions(config);
    await previewViewProcessor.enable();
  };

  /* VB Change modes */
  React.useEffect(() => {
    switch (vbMode) {
      case 'blur':
        blurVB();
        break;
      case 'image':
        imageVB();
        break;
      case 'none':
        disableVB();
        break;
    }
  }, [vbMode, selectedImage, saveVB, previewVideoTrack]);

  /* Fetch Saved Images from IndexDB to show in VBPanel */
  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const customImages = await retrieveImagesFromIndexDB();
        setOptions((prevOptions: Option[]) => [
          ...prevOptions,
          ...(customImages?.map(
            base64Data =>
              ({
                type: 'image',
                icon: 'vb',
                path: base64Data,
                id: getUniqueID(),
              } as Option),
          ) || []),
        ]);
      } catch (error) {
        console.error('Error fetching data:', error);
        // Handle the error as needed
      }
    };

    fetchData();
  }, []);

  const blurVB = async () => {
    const blurConfig: VirtualBackgroundConfig = {blurDegree: 3, type: 'blur'};
    if (isMobile) {
      await applyVirtualBackgroundToMainView(blurConfig);
    } else {
      if (saveVB || isPreCallScreen) {
        await applyVirtualBackgroundToMainView(blurConfig);
      } else {
        previewVideoTrack &&
          (await applyVirtualBackgroundToPreviewView(blurConfig));
      }
    }
  };

  const imageVB = async () => {
    const imagePath = selectedImage;
    let htmlElement = document.createElement('img');
    const imgConfig: VirtualBackgroundConfig = {
      source: htmlElement,
      type: 'img',
    };

    // htmlElement.crossorigin = 'anonymous'
    htmlElement.src =
      //@ts-ignore
      typeof imagePath === 'string' ? imagePath : imagePath?.default || '';
    htmlElement.onload = async () => {
      if (isMobile) {
        await applyVirtualBackgroundToMainView(imgConfig);
      } else {
        if (saveVB || isPreCallScreen) {
          await applyVirtualBackgroundToMainView(imgConfig);
        } else {
          previewVideoTrack &&
            (await applyVirtualBackgroundToPreviewView(imgConfig));
        }
      }
    };
  };

  const disableVB = async () => {
    if (isMobile) {
      await mainViewProcessor.disable();
    } else {
      if (saveVB || isPreCallScreen) {
        await mainViewProcessor.disable();
      } else {
        previewVideoTrack && (await previewViewProcessor.disable());
      }
    }
  };

  return (
    <VBContext.Provider
      value={{
        isVBActive,
        setIsVBActive,
        vbMode,
        setVBmode,
        selectedImage,
        setSelectedImage,
        previewVideoTrack,
        setPreviewVideoTrack,
        saveVB,
        setSaveVB,
        options,
        setOptions,
      }}>
      {children}
    </VBContext.Provider>
  );
};

const useVB = createHook(VBContext);

export {VBProvider, useVB};
