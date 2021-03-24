import React, { useEffect, useState } from 'react';
import {
  Animated,
  Dimensions,
  StatusBar,
  StyleSheet,
  SafeAreaView
} from 'react-native';

import Gallery from './gallery';
import Header from './Header';
import Footer from './Footer';

const ComicBookViewer = (props) => {

  const isPortrait = () => {
    const dim = Dimensions.get('screen');
    return dim.height >= dim.width;
  };


  const [width, setWidth] = useState(Dimensions.get('window').width);
  const [height, setHeight] = useState(Dimensions.get('window').height);
  const [orientation, setOrientation] = useState(isPortrait() ? 'portrait' : 'landscape');
  const [isDisabled, setDisabled] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fadeAnim, setFadeAnim] = useState(new Animated.Value(1));

  const {
    pages,
    totalPages,
    title,
    pubYear,
    issueNumber,
    onClose,
    comicType,
    horizontal,
    inverted,
    onPageChange,
    volumeNumber,
  } = props;


  listRef = React.createRef();
  footerRef = React.createRef();


  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 0, duration: 3000 }).start();
    setDisabled(!isDisabled)
    Dimensions.addEventListener('change', ({ window }) => {
      setOrientation(isPortrait() ? 'portrait' : 'landscape')
      setWidth(window.width)
      setHeight(window.height)
    });
  }, [])

  const handleSliderValueChange = (index) => {
    setCurrentIndex(index)
    listRef.current.getViewPagerInstance().flingToPage(index, 1);
    props.onPageChange(index);
  }

  const handleClick = (arg) => {
    if (arg.x0 > (width * 2 / 3)) {
      let newIndex = currentIndex < (totalPages - 1) ? currentIndex + 1 : currentIndex;

      setCurrentIndex(newIndex)
      listRef.current.getViewPagerInstance().flingToPage(newIndex, 1);
      footerRef.current.forceUpdate();
    } else if (arg.x0 < (width / 3)) {
      let newIndex = currentIndex > 0 ? currentIndex - 1 : currentIndex;

      setCurrentIndex(newIndex)
      listRef.current.getViewPagerInstance().flingToPage(newIndex, 1);
      footerRef.current.forceUpdate();
    } else {
      Animated.timing(fadeAnim, { toValue: 1 - fadeAnim._value, duration: 50 },).start();
      setDisabled(!isDisabled)
    }
  };

  const snapToItem = (index) => {
    listRef.current.getViewPagerInstance().flingToPage(index);
    setCurrentIndex(index)
    footerRef.current.forceUpdate();
  }


  const handleLayout = (event) => {
    if (event.nativeEvent.layout.width !== width) {
      hasLayout = true;
      setWidth(event.nativeEvent.layout.width)
      setHeight(event.nativeEvent.layout.height)
    }
  };


  return (
    <SafeAreaView
      style={styles.container}
    >
      <Animated.View
        style={styles.content}
        onLayout={handleLayout}
      >
        <StatusBar hidden />
        <Animated.View style={[styles.header, { opacity: 1 }]}>
          <Header
            currentIndex={currentIndex || 0}
            title={title}
            pubYear={pubYear}
            issueNumber={issueNumber}
            onClose={onClose}
            volumeNumber={volumeNumber}
            isDisabled={isDisabled}
            width={width}
          />
        </Animated.View>
        <Gallery
          ref={this.listRef}
          style={{ flex: 1, backgroundColor: 'black' }}
          images={pages}
          onSingleTapConfirmed={(index, evt, gestureState) => {
            setCurrentIndex(index)
            handleClick(gestureState);
          }}
          onPageSelected={(setIndex) => {
            setCurrentIndex(setIndex)
            onPageChange(setIndex);
            footerRef.current?.forceUpdate();
          }}
          horizontal={horizontal}
          inverted={inverted}
        // onPageScrollStateChanged={state => console.log(state)}
        // onPageScroll={event => console.log(event)}
        />
        <Animated.View style={[styles.footer, { opacity: 1 }, orientation === 'portrait' ? {} : { bottom: 0 }]}>
          <Footer
            ref={footerRef}
            currentIndex={currentIndex || 0}
            totalPages={totalPages}
            onValueChange={handleSliderValueChange}
            isDisabled={isDisabled}
            width={width}
          />
        </Animated.View>
      </Animated.View>
    </SafeAreaView>
  );
}

export default ComicBookViewer;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
  imageZoom: {
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    top: 0, position: 'absolute', zIndex: 9,
  },
  footer: {
    bottom: 0, position: 'absolute', zIndex: 9,
  },
  spinnerStyle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
});
