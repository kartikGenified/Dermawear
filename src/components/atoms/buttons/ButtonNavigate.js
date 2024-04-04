import React,{useState} from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import PoppinsText from '../../electrons/customFonts/PoppinsText';
import {useNavigation} from '@react-navigation/native';
import { useSelector } from 'react-redux';

const ButtonNavigate = props => {
  const [isClicked, setIsClicked] = useState(false)

  const navigation = useNavigation();
  const ternaryThemeColor = useSelector(
    state => state.apptheme.ternaryThemeColor,
  )
    ? useSelector(state => state.apptheme.ternaryThemeColor)
    : 'grey';
  const backgroundColor = props.backgroundColor ? props.backgroundColor : ternaryThemeColor
  // prop to manipulate background color of button
  const style = props.style;
  // prop to manipulate text color of button
  const navigateTo = props.navigateTo;
  // prop to navigate to another page
  const content = props.content;
  const properties  = props.properties
  const disable = props.disable
  // prop to display text inside the button
  
  const handleButtonPress = () => {
    if(!isClicked){
      if(content==="Register")
  {
    props.handleOperation()
  }
  else{
    console.log('buttonpressed');
    navigateTo &&  navigation.navigate(navigateTo,properties)
  }
      setIsClicked(true);
    }
   setTimeout(() => {
    setIsClicked(false);
   }, 1000);
    console.log("buttonpressed");
  };

  

  

  return (
    <TouchableOpacity
      onPress={() => {
      !disable && handleButtonPress()
      }}
      style={{
        padding: 10,
        borderRadius: 4,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: !disable ? backgroundColor : "#808080",
        margin: 10,
        paddingLeft: 20,
        paddingRight: 20,
      }}>
      <PoppinsText style={style} content={content}></PoppinsText>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({});

export default ButtonNavigate;
