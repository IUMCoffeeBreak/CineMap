import React, { useCallback, memo, useRef, useState } from "react";
import {
  FlatList,
  View,
  Dimensions,
  Text,
  StyleSheet,
  Image,
} from "react-native";

const { width: windowWidth, height: windowHeight } = Dimensions.get("window");

const slideList = Array.from({ length: 5 }).map((_, i) => {
  return {
    id: i.toString(),
    image: `https://picsum.photos/1440/2842?random=${i}`,
  };
});


const Slide = ({ data }) => {
    return (
      <View
        style={ carouselStyle.slide }
      >
        <Image
          source={{ uri: data.image }}
          style={carouselStyle.slideImage}
        ></Image>
      </View>
    );
  }

function Pagination({ index }) {
return (
    <View style={carouselStyle.pagination} pointerEvents="none">
    {slideList.map((_, i) => {
        return (
        <View
            key={i}
            style={[
            carouselStyle.paginationDot,
            index === i
                ? carouselStyle.paginationDotActive
                : carouselStyle.paginationDotInactive,
            ]}
        />
        );
    })}
    </View>
);
}
  
const Carousel = () => {
    const [index, setIndex] = useState(0);
    const indexRef = useRef(index);
    indexRef.current = index;
    const onScroll = useCallback((event) => {
      const slideSize = event.nativeEvent.layoutMeasurement.width;
      const index = event.nativeEvent.contentOffset.x / slideSize;
      const roundIndex = Math.round(index);
      const distance = Math.abs(roundIndex - index);
      const isNoMansLand = 0.4 < distance;
  
      if (roundIndex !== indexRef.current && !isNoMansLand) {
        setIndex(roundIndex);
      }
    }, []);
  
    const flatListOptimizationProps = {
      initialNumToRender: 0,
      maxToRenderPerBatch: 1,
      removeClippedSubviews: true,
      scrollEventThrottle: 16,
      windowSize: 2,
      keyExtractor: useCallback(s => String(s.id), []),
      getItemLayout: useCallback(
        (_, index) => ({
          index,
          length: windowWidth,
          offset: index * windowWidth,
        }),
        []
      ),
    };
  
    const renderItem = useCallback(function renderItem({ item }) {
      return <Slide data={item} />;
    }, []);
    return (
        <>
        <FlatList
          data={slideList}
          style={carouselStyle.carousel}
          renderItem={renderItem}
          pagingEnabled
          horizontal
          showsHorizontalScrollIndicator={false}
          bounces={false}
          onScroll={onScroll}
          {...flatListOptimizationProps}
        />
        <Pagination index={index}></Pagination>
      </>
    );
};

const carouselStyle = StyleSheet.create({
    slide: {
        height: windowHeight,
        width: windowWidth,
        justifyContent: "center",
        alignItems: "center",
      },
    slideImage: { 
        width: windowWidth * 0.9,
        height: "100%" 
    },    
      pagination: {
        position: "absolute",
        bottom: 8,
        width: "100%",
        justifyContent: "center",
        flexDirection: "row",
      },
      paginationDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginHorizontal: 2,
      },
      paginationDotActive: { backgroundColor: "lightblue" },
      paginationDotInactive: { backgroundColor: "gray" },
    
      carousel: { flex: 1 },
});
  
export default Carousel;