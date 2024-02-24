import {useCustomization} from 'customization-implementation';
import {DefaultLayouts} from './DefaultLayouts';

/**
 * if custom layouts provided in customization api
 * @returns customLayouts array
 * else
 * @returns defaultLayouts array
 */
function useLayoutsData() {
  const layoutsData = useCustomization((config) => {
    if (
      typeof config?.components?.videoCall === 'object' &&
      config?.components?.videoCall?.customLayout
    ) {
      return config.components.videoCall.customLayout(DefaultLayouts);
    } else {
      return DefaultLayouts;
    }
  });
  return layoutsData;
}
export default useLayoutsData;
