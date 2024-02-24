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
// @ts-nocheck
import React, {useState, useRef} from 'react';
import {View, Text, Modal, TouchableOpacity, TouchableWithoutFeedback, StyleSheet, useWindowDimensions} from 'react-native';
/**
 * Component showing text with tooltip on mobile native
 */
const TextWithToolTip = (props: {value: string, style: object, touchable?: boolean}) => {
    const {width:globalWidth, height:globalHeight} = useWindowDimensions();
    const [toolTipVisible, setToolTipVisible] = useState(false);
    const [position, setPosition] = useState({})
    const ref = useRef(null);
    /**
     * Private chat user list - we are using this component to show the username and that component itself clickable 
     * and user will navigate to next screen(chatting screen) so if we had touchable here they can't proceed futher, 
     * hence checked tocuable flag and creating the view based on that
     *  */     
    const CustomView = props?.touchable === false ? View : TouchableOpacity
    return(
        <View style={{flex: 1}}>
            <Modal
                animationType="fade"
                transparent={true}
                visible={toolTipVisible}
                onRequestClose={() => {
                    setToolTipVisible(!toolTipVisible);
                }}
            >
                <TouchableWithoutFeedback onPress={()=>{setToolTipVisible(!toolTipVisible)}}>
                    <View 
                        style={style.backDrop} 
                    />
                </TouchableWithoutFeedback>
                <View style={[style.textContainer, position]}>
                    <Text style={style.textStyle}>{props.value}</Text>
                </View>
            </Modal>
            <CustomView style={{flex:1}} ref={ref} onPress={() => {
                    ref?.current?.measure( (fx: number, fy: number, localWidth: number, localHeight: number, px: number, py: number) => {
                        /* To display the tooltip we are setting to position and maxwidth. so it will display above and below actual name present with modal.
                        ---------
                        | A | B |
                        ---------
                        | C | D |
                        ---------
                        Assume we are spliting mobile/tablet screen into 4 section

                        When user click any username doing below the calculation to find (left or right postion and maxwidth). 
                        so it won't hidden and we can use the maximum area to show tooltip
                        
                        For ex:
                        Case 1: If element is present in the A or C section then we will set position top and left
                        Case 2: If element is present in the B or D section then we will set position top and right position

                        Note : we are also can doing some calculation based on height so that text won't hidden in the bottom.
                        **/

                        const rightPos = (globalWidth - (px + localWidth)) - 20 < 0 ? 10 : (globalWidth - (px + localWidth)) - 20
                        const leftPos = px < 0 ? 10 : px
                        if(px > globalWidth/2){
                            if(py > globalHeight/2){
                                setPosition({
                                    top: py - localHeight,
                                    right: rightPos,
                                    maxWidth: (globalWidth - rightPos) - 30,
                                })
                            }else{
                                setPosition({
                                    top: py+localHeight,
                                    right: rightPos,
                                    maxWidth: (globalWidth - rightPos) - 30,
                                })
                            }
                        }else{
                            if(py > globalHeight/2){
                                setPosition({
                                    top: py - localHeight,
                                    left: leftPos,
                                    maxWidth: (globalWidth - leftPos - 5),
                                })
                            }else{
                                setPosition({
                                    top: py+localHeight,
                                    left: leftPos,
                                    maxWidth: (globalWidth - leftPos - 5),
                                })
                            }
                        }
                        setTimeout(() =>{
                            setToolTipVisible(!toolTipVisible)
                        })
                    })     
                }}>
                <Text style={props.style} numberOfLines={1}>{props.value}</Text>
            </CustomView>
        </View>
    )
};

const style = StyleSheet.create({
    backDrop:{
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(0,0,0,0.5)'
    },
    textContainer:{ 
        position: 'absolute',
        zIndex: 999,
        marginRight: 20
    },
    textStyle:{
        backgroundColor:'white', padding: 5, margin: 5        
    }
})

export default TextWithToolTip;
