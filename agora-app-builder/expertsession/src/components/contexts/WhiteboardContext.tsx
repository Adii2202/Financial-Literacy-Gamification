// import {DispatchContext, UidType} from '../../../agora-rn-uikit';
// import React, {
//   createContext,
//   Dispatch,
//   SetStateAction,
//   useContext,
//   useEffect,
//   useState,
// } from 'react';
// import {createHook} from 'customization-implementation';
// import {filterObject} from '../../utils/index';

// export interface WhiteboardObjectInterface {
//   [key: number]: {
//     active: boolean;
//     parentId: UidType;
//     type: 'whiteboard';
//   };
// }
// export interface WhiteboardContextInterface {
//   whiteboardData: WhiteboardObjectInterface;
//   setWhiteboardData: Dispatch<SetStateAction<WhiteboardObjectInterface>>;
// }
// const Whiteboard = createContext<WhiteboardContextInterface>({
//   whiteboardData: {},
//   setWhiteboardData: () => {},
// });

// interface WhiteboardProviderProps {
//   children: React.ReactNode;
// }
// const WhiteboardProvider = (props: WhiteboardProviderProps) => {
//   const [whiteboardData, setWhiteboardData] =
//     useState<WhiteboardObjectInterface>({});
//   const {dispatch} = useContext(DispatchContext);

//   useEffect(() => {
//     const activeData = filterObject(
//       whiteboardData,
//       ([k, v]) => v.active === true,
//     );
//     Object.keys(activeData).map((uid) => {
//       const uidAsNumber = parseInt(uid);
//       // dispatch({
//       //   type: 'AddCustomContent',
//       //   value: [uidAsNumber, activeData[uidAsNumber]],
//       // });
//     });
//   }, [whiteboardData]);

//   return (
//     <Whiteboard.Provider value={{whiteboardData, setWhiteboardData}}>
//       {props.children}
//     </Whiteboard.Provider>
//   );
// };
// const useWhiteBoard = createHook(Whiteboard);

// export {useWhiteBoard, WhiteboardProvider};
