import React, { useRef, useState, useEffect } from 'react';
import { StyleSheet, View, FlatList, Dimensions, Animated, TouchableOpacity ,Image} from 'react-native';

// Importing SVG components directly
import Slider1 from '../../assets/images/slider1.svg';
import Slider2 from '../../assets/images/slider2.svg';
import Slider3 from '../../assets/images/slider3.svg';


const SliderImages = [
  {
      id: 1,
      image: "https://res.cloudinary.com/doagrwjza/image/upload/v1709576294/samples/balloons.jpg",

      
  },
  {
      id: 2,
      image: "https://res.cloudinary.com/doagrwjza/image/upload/v1709576304/cld-sample-4.jpg",

     
  },
  {
      id: 3,
      image: "https://res.cloudinary.com/doagrwjza/image/upload/v1726565253/f6tyz0prghhzbunghjax.jpg",
    
  }
  , {
      id: 4,
      image: "https://res.cloudinary.com/doagrwjza/image/upload/v1709576303/cld-sample-2.jpg",

      
  }
]


const { width } = Dimensions.get('window');

const HomeSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const scrollX = useRef(new Animated.Value(0)).current;

  const viewableItemsChanged = useRef(({ viewableItems }: any) => {
    setCurrentIndex(viewableItems[0]?.index || 0);
  }).current;

  const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  useEffect(() => {
    const interval = setInterval(() => {
      let nextIndex = (currentIndex + 1) % SliderImages.length;
      flatListRef.current?.scrollToIndex({ animated: true, index: nextIndex });
    }, 3000);

    return () => clearInterval(interval);
  }, [currentIndex]);

  return (
    <View style={styles.sliderContainer}>
      <FlatList
        data={SliderImages}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item }) => (
          <View key={item.id} style={styles.imageContainer}>
            <Image source={{uri:item.image}} width={width*0.8} height={160} style={{borderRadius:16}} />

          </View>
        )}
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        bounces={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
        onViewableItemsChanged={viewableItemsChanged}
        viewabilityConfig={viewConfig}
        ref={flatListRef}
      />
      <View style={styles.pointersContainer}>
        {SliderImages.map((_, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.pointer,
              index === currentIndex && styles.activePointer,
            ]}
            onPress={() => flatListRef.current?.scrollToIndex({ index })}
          />
        ))}
      </View>
    </View>
  );
};

export default HomeSlider;

const styles = StyleSheet.create({
  sliderContainer: {
    width:width,
    height: 200, // Set the height for the slider section
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 10, 
    // paddingHorizontal:30// Add padding to give some space at the top
  },
  imageContainer: {
    width:width,
    borderRadius:16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pointersContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
  pointer: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#d3d3d3',
    marginHorizontal: 5,
  },
  activePointer: {
    backgroundColor: '#333',
  },
});