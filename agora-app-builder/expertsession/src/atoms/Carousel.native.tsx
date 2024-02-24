import React, {useState} from 'react';
import {View, StyleSheet, Dimensions, Pressable} from 'react-native';
import {FlatList} from 'react-native-gesture-handler';

const {width} = Dimensions.get('window');

interface CarouselItem {
  id: string;
  component: React.ReactNode;
}

interface CarouselProps {
  data: CarouselItem[];
}

const Carousel: React.FC<CarouselProps> = ({data}) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const flatListRef = React.useRef<FlatList | null>(null);

  const handleScroll = event => {
    const {contentOffset} = event.nativeEvent;
    const index = Math.round(contentOffset.x / width);
    setActiveIndex(index);
  };
  const renderItem = ({item}: {item: CarouselItem}) => {
    return <View style={[styles.item, {width: width}]}>{item.component}</View>;
  };

  const scrollToIndex = (index: number) => {
    if (flatListRef.current) {
      flatListRef.current.scrollToOffset({
        offset: index * width,
        animated: true,
      });
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={data}
        renderItem={renderItem}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(_, index) => index.toString()}
        onScroll={handleScroll}
      />
      <View style={styles.indicatorContainer}>
        {data.map((_, index) => (
          <Pressable
            key={index}
            onPress={() => {
              scrollToIndex(index);
              setActiveIndex(index);
            }}
            hitSlop={5} // to increase clickable area
          >
            {({pressed}) => (
              <View
                style={[
                  styles.dot,
                  index === activeIndex && styles.activeDot,
                  pressed && styles.pressedDot,
                ]}
              />
            )}
          </Pressable>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  item: {},
  indicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',

    width: '100%',
    marginBottom: 24,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: $config.SEMANTIC_NEUTRAL,
    marginHorizontal: 5,
  },
  activeDot: {
    backgroundColor: $config.FONT_COLOR,
  },
  pressedDot: {
    backgroundColor: $config.PRIMARY_ACTION_BRAND_COLOR,
  },
});

export default Carousel;
