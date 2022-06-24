import React, { useState } from 'react';
import {
  Image,
  Platform,
  Text,
  TouchableOpacity,
  UIManager,
  LayoutAnimation,
  View,
  ScrollView,
} from 'react-native';
import down_arrow from '../../../assets/images/chevronDown.png';
import up_arrow from '../../../assets/images/chevronUp.png';
import styles from './styles';
if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}
export default function NFTDetailDropdown({
  children,
  title = '',
  icon,
  containerStyles = {},
  containerChildStyles = {},
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const handleToggle = () => {
    if (isExpanded) {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setIsExpanded(!isExpanded);
    } else {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
      setIsExpanded(!isExpanded);
    }
  };
  return (
    <View style={[styles.containerWrapper, containerStyles]}>
      <TouchableOpacity style={styles.container} onPress={() => handleToggle()}>
        <Image source={icon} style={styles.icon} />
        <Text style={styles.titleText}>{title}</Text>
        <Image
          source={isExpanded ? up_arrow : down_arrow}
          style={styles.downArrow}
        />
      </TouchableOpacity>
      {children && isExpanded && (
        <ScrollView
          showsVerticalScrollIndicator={false}
          nestedScrollEnabled={true}
          style={[styles.childrenContainer, containerChildStyles]}>
          {children}
        </ScrollView>
      )}
    </View>
  );
}
