import {StyleSheet, Text, View, Platform} from 'react-native';
import React from 'react';
import CustomSwitch from './CustomSwitch';

interface SwitchProps {
  isEnabled: boolean;
  disabled?: boolean;
  toggleSwitch: (isEnabled: boolean) => void;
}

const Toggle = (props: SwitchProps) => {
  const {isEnabled, toggleSwitch, disabled = false} = props;
  return (
    <View>
      <CustomSwitch
        barHeight={20}
        switchWidth={16}
        switchHeight={16}
        value={isEnabled}
        onValueChange={toggleSwitch}
        disabled={false}
        backgroundActive={$config.PRIMARY_ACTION_BRAND_COLOR}
        backgroundInactive={$config.SEMANTIC_NEUTRAL}
        circleActiveColor={$config.CARD_LAYER_1_COLOR}
        circleInActiveColor={$config.CARD_LAYER_1_COLOR}
        // renderInsideCircle={() => <CustomComponent />} // custom component to render inside the Switch circle (Text, Image, etc.)
        changeValueImmediately={true} // if rendering inside circle, change state immediately or wait for animation to complete
        innerCircleStyle={{
          borderWidth: 0,
          alignItems: 'center',
          justifyContent: 'center',
        }} // style for inner animated circle for what you (may) be rendering inside the circle
        outerCircleStyle={{}} // style for outer animated circle
        renderActiveText={false}
        renderInActiveText={false}
        switchLeftPx={3} // denominator for logic when sliding to TRUE position. Higher number = more space from RIGHT of the circle to END of the slider
        switchRightPx={3} // denominator for logic when sliding to FALSE position. Higher number = more space from LEFT of the circle to BEGINNING of the slider
        switchWidthMultiplier={2} // multiplied by the `circleSize` prop to calculate total width of the Switch
        switchBorderRadius={30} // Sets the border Radius of the switch slider. If unset, it remains the circleSize.
      />
    </View>
  );
};

export default Toggle;

const styles = StyleSheet.create({});
