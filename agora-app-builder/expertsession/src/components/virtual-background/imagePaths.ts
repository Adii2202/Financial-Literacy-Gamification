import {Option} from './useVB';
import images from './images';
import {
  vbPanelOptionBlurText,
  vbPanelOptionCustomText,
  vbPanelOptionNoneText,
} from '../../language/default-labels/precallScreenLabels';

const imagePathsArray: Option[] = [
  {
    type: 'none',
    icon: 'remove',
    label: 'None',
    translationKey: vbPanelOptionNoneText,
    id: 'VBOption_1',
  },
  {
    type: 'blur',
    icon: 'blur',
    label: 'Blur',
    translationKey: vbPanelOptionBlurText,
    id: 'VBOption_2',
  },
  {
    type: 'custom',
    icon: 'upload-new',
    label: 'Custom',
    translationKey: vbPanelOptionCustomText,
    id: 'VBOption_3',
  },
  {
    type: 'image',
    icon: 'vb',
    path: images.bookImageBase64,
    id: 'VBOption_4',
  },
  {
    type: 'image',
    icon: 'vb',
    path: images.beachImageBase64,
    id: 'VBOption_5',
  },
  {
    type: 'image',
    icon: 'vb',
    path: images.office1ImageBase64,
    id: 'VBOption_6',
  },
  {
    type: 'image',
    icon: 'vb',
    path: images.bedroomImageBase64,
    id: 'VBOption_7',
  },
  {
    type: 'image',
    icon: 'vb',
    path: images.officeImageBase64,
    id: 'VBOption_8',
  },
  {
    type: 'image',
    icon: 'vb',
    path: images.earthImageBase64,
    id: 'VBOption_9',
  },
  {
    type: 'image',
    icon: 'vb',
    path: images.mountainsImageBase64,
    id: 'VBOption_10',
  },
  {
    type: 'image',
    icon: 'vb',
    path: images.plantsImageBase64,
    id: 'VBOption_11',
  },
  {
    type: 'image',
    icon: 'vb',
    path: images.wallImageBase64,
    id: 'VBOption_12',
  },
];

export default imagePathsArray;
