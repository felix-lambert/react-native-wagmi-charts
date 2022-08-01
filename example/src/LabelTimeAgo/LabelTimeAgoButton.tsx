import React, { FunctionComponent } from 'react';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';
import { TimeFilters } from './LabelTimeAgo';

interface Props {
  text: TimeFilters | 'Tout';
  currentLabel: TimeFilters | 'Tout';
  onPress: () => void;
}

export const GRAPH_TIME_LABEL_HEIGHT = 28;

export const LabelTimeAgoButton: FunctionComponent<Props> = ({ text, currentLabel, onPress }) => {
  const bgColor = {
    backgroundColor: 'transparent',
  };
  const textColor = {
    color: 'black'
  };

  return (
    <TouchableOpacity style={[bgColor, styles.button]} onPress={onPress}>
      <Text style={[textColor, styles.text]}>{text}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    width: 58,
    height: GRAPH_TIME_LABEL_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    marginTop: 2,
  },
});
