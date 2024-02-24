import {LayoutItem} from 'customization-api';
import GridVideo from '../../components/GridVideo';
import PinnedVideo from '../../components/PinnedVideo';
import useLayoutsData from './useLayoutsData';
import {useLayout} from '../../utils/useLayout';
import {isMobileUA} from '../../utils/common';
import {
  toolbarItemLayoutOptionGridText,
  toolbarItemLayoutOptionSidebarText,
} from '../../language/default-labels/videoCallScreenLabels';
const isMobileView = isMobileUA();
const DefaultLayouts: LayoutItem[] = [
  {
    name: 'grid',
    label: 'Grid',
    translationKey: toolbarItemLayoutOptionGridText,
    //iconName: 'grid',
    icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEgAAABICAYAAABV7bNHAAAACXBIWXMAACE4AAAhOAFFljFgAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAFOSURBVHgB7drBTcNAEIXhWVeQEkwJVIDohA6gA2iBigIVhA6cEuhgGGNfd1+kZK1x9H/SyidbT0/ry+6YAQBwt9z9EOs91tFv4xTrZW8ZasHGWJP3Mc3fz56hiHBTPEbr5xzrsZTya0kzDLW3fNmCo/U1xnqzxBmG+nv2att4ssQZqr/Y/IPaRmJ7l6wZBkMTBQkUJFCQQEECBQkUJFCQQEECBQkUJFCQQEECBQkUJFCQ0Croy7bxY4kztAr6tm18WuIMrSPXQzxO1vlGIU46HyxxhuoOWq9Bnm25FunhvH7fMme4yHz94stt5C0cY32su2NXGQAAuDPOAFUzGANUIhwDVLW3nAGqfwxQiQwMUIkMnCgKFCRQkEBBAgUJFCRQkEBBAgUJFCRQkEBBAgUJFCRQkEBBAgNUIgMDVCIDA1QMUF2X4SLOABUAADv0Bxz9l6sMoGOZAAAAAElFTkSuQmCC',
    component: GridVideo,
  },
  {
    name: 'pinned',
    label: 'Sidebar',
    translationKey: toolbarItemLayoutOptionSidebarText,
    //iconName: 'pinned',
    //for mobile view top pinned icon and desktop left pinned icon
    icon: isMobileView
      ? 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEgAAABICAYAAABV7bNHAAAACXBIWXMAACE4AAAhOAFFljFgAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAFFSURBVHgB7dzhTcJQFEDhWybQDeoIjuAoTqKO4ASOAk6gG9gNZIN6TTUhhvdOAo9Iy/mSF3689JKeFH40lAhJkhZpHMc+1zrX53igP/OaaDjzJVdfa9DV4uTLOlcfR+jSzswxGmg8c8h1myO3+zZXlQMf4sg4M9Hneixt1q6gj2gQaAZX0Ldtjrze+16lI874ZE4+c9cqVGUgYCBgIGAgYCBgIGAgYCBgIGAgYCBgIEn/6eQ3zObCG2YHMhAwEDAQMBAwEDAQMBAwEDAQMBAwEDAQMBAwEDAQMBAwEDAQMBAwEDAQMBAwEDAQMBAwEDAQMBAwEDAQMBAwEKgF2sTleC9t1AK9xuV4Lm3UfqN4lS9vsfxHw4eu625Km8Ur6OdB+7uYHrxfqiGmcyyqfklnpN+691H5nM7QJtdTTP+4MIQkSYv0BZfkCSDYSwACAAAAAElFTkSuQmCC'
      : 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEgAAABICAYAAABV7bNHAAAACXBIWXMAACE4AAAhOAFFljFgAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAGCSURBVHgB7drdTYRAFIbhM1SwJWAJVmC2E61AO1BLsCKwgrUDKMEOxkPAS+a7YeCweZ9ksle7OXn3jzBjBgDA3co5X3y9++ryNm6+ns82w9pgra8h1zFMrx99hiSGG/yhtXpGX48ppV8LOkOz9qw8fwRbq6v19WaBZ2jWn2evto8nCzzD6lds+oLaTvzjnaLO0BiKCCQQSCCQQCCBQAKBBAIJBBIIJBBIIJBAIIFAAoEEAgmlQL3t48cCKwX6tn18WWClW64Xf7hZ5R0Fv9P5YOszxL3lumyDXG3eFqlhXF4/tOKPtEf6f4dfbLvfit7Xp817UaMFlywwdjVOgEACgQQCCQQSZKAc9fDSTtT5oNYfOqtzNT36upauhSL8zYc+QBX6OijC4aUIoh+gOhwHqMQM/M0LBBIIJBBIIJBAIIFAAoEEAgkEEggkEEggkEAggUACgYToB6h6O3iG6AeoDp8h+gGqw2cIfYDqNIe4pi2gZUd0C52vj+XTcaoZAAA4lz9x+tmcZ0GmbAAAAABJRU5ErkJggg==',
    component: PinnedVideo,
  },
];
export {DefaultLayouts};
export const getPinnedLayoutName = () => DefaultLayouts[1].name;
export const getGridLayoutName = () => DefaultLayouts[0].name;

export const useSetPinnedLayout = () => {
  const {setLayout} = useLayout();
  const layouts = useLayoutsData();
  const pinnedLayoutName = getPinnedLayoutName();
  let checkPinnedLayoutExist = false;
  if (layouts && Array.isArray(layouts) && layouts.length) {
    let data = layouts.filter(item => item.name === pinnedLayoutName);
    if (data && data.length) {
      checkPinnedLayoutExist = true;
    }
  }
  if (!checkPinnedLayoutExist) {
    return () => {};
  }
  return () => {
    setLayout(pinnedLayoutName);
  };
};

export const useChangeDefaultLayout = () => {
  const {setLayout} = useLayout();
  const layout = useLayoutsData();

  if (!layout) {
    return () => {};
  }

  if (
    layout &&
    Array.isArray(layout) &&
    (layout.length === 0 || layout.length === 1)
  ) {
    return () => {};
  }

  return () => {
    setLayout((activeLayout: string) =>
      activeLayout === layout[1].name ? layout[0].name : layout[1].name,
    );
  };
};
