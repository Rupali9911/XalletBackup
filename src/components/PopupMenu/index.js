import React from 'react';
import {Text} from 'react-native';
import {
  Menu,
  MenuOption,
  MenuOptions,
  MenuTrigger,
} from 'react-native-popup-menu';

const PopupMenu = props => {
  const opened = props.opened ? {opened: props.opened} : {};
  return (
    <Menu {...opened} style={props.menuStyle} onBackdropPress={props.onBackdropPress } onSelect={props.onSelect}>
      <MenuTrigger style={props.triggerStyle} children={props.children} />
      <MenuOptions optionsContainerStyle={props.containerStyle || {}}>
        {props?.items?.map((e, i) => (
          <MenuOption {...e} value={i} key={i}>
          { props.customRenderItem? e.label: <Text style={props.textStyle}>{e.label}</Text>}
          </MenuOption>
        ))}
      </MenuOptions>
    </Menu>
  );
};

export default PopupMenu;
