import React, { useRef, useState, useEffect } from 'react';
import { StyleSheet, View, FlatList, Dimensions, Animated, TouchableOpacity ,Image} from 'react-native';

// Importing SVG components directly
import Slider1 from '../../assets/images/slider1.svg';
import Slider2 from '../../assets/images/slider2.svg';
import Slider3 from '../../assets/images/slider3.svg';

// https://res.cloudinary.com/doagrwjza/image/upload/v1734288164/balloons-charity-colorful-colourful_wb9g6x.jpg
// https://res.cloudinary.com/doagrwjza/image/upload/v1734288164/money-hands-message-quote_xa5vmx.jpg
// https://res.cloudinary.com/doagrwjza/image/upload/v1734288164/240_F_327392447_VT7K8QUTmTZWI3UbeCsYdlpU5Qr508vL_zlyb72.jpg
// https://res.cloudinary.com/doagrwjza/image/upload/v1734288164/alliance-american-arms-blue_witzgj.jpg
// https://res.cloudinary.com/doagrwjza/image/upload/v1734288164/240_F_103149261_I53FAObzpAiNmB82R1TCeBfGcOJRsTW1_fdxya1.jpg
// https://res.cloudinary.com/doagrwjza/image/upload/v1734288164/240_F_576126362_ll2tqdvXs27cDRRovBTmFCkPM9iX68iL_o6udgo.jpg
// https://res.cloudinary.com/doagrwjza/image/upload/v1734351232/Screenshot_2024-12-16_174245_tkon17.png

const SliderImages = [
  {
      id: 1,
      image: "https://res.cloudinary.com/doagrwjza/image/upload/v1734288164/money-hands-message-quote_xa5vmx.jpg",

      
  },
  {
      id: 2,
      image: "https://res.cloudinary.com/doagrwjza/image/upload/v1734351232/Screenshot_2024-12-16_174245_tkon17.png",

     
  },
  {
      id: 3,
      image: "https://res.cloudinary.com/doagrwjza/image/upload/v1734288164/alliance-american-arms-blue_witzgj.jpg",
    
  }
  , {
      id: 4,
      image: "https://res.cloudinary.com/doagrwjza/image/upload/v1734288164/240_F_103149261_I53FAObzpAiNmB82R1TCeBfGcOJRsTW1_fdxya1.jpg",

      
  },{
    id:5,
      image:"https://res.cloudinary.com/doagrwjza/image/upload/v1734288164/240_F_576126362_ll2tqdvXs27cDRRovBTmFCkPM9iX68iL_o6udgo.jpg"
   
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
    width: 4,
    height: 4,
    borderRadius: 4,
    backgroundColor: '#d3d3d3',
    marginHorizontal: 3,
  },
  activePointer: {
    backgroundColor: '#31c1c9',
  },
});