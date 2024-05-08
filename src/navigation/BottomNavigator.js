import React, { useEffect, useState } from 'react';
import { View, Text, Platform, TouchableOpacity, Image } from 'react-native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Dashboard from '../screens/dashboard/Dashboard';
import Gift from 'react-native-vector-icons/AntDesign'
import Qrcode from 'react-native-vector-icons/AntDesign'
import Book from 'react-native-vector-icons/AntDesign'
import { useSelector, useDispatch } from 'react-redux';
import Wave from '../../assets/svg/bottomDrawer.svg'
import PoppinsTextMedium from '../components/electrons/customFonts/PoppinsTextMedium';
import BookOpen from 'react-native-vector-icons/Entypo'
import { useGetkycStatusMutation } from '../apiServices/kyc/KycStatusApi';
import { useIsFocused } from '@react-navigation/native';
import * as Keychain from 'react-native-keychain';


// import { Image } from 'react-native-svg';

const Tab = createBottomTabNavigator();

//custom bottom drawer 



function BottomNavigator({ navigation }) {
  const ternaryThemeColor = useSelector(
    state => state.apptheme.ternaryThemeColor,
  )
    ? useSelector(state => state.apptheme.ternaryThemeColor)
    : 'grey';
  const userData = useSelector(state => state.appusersdata.userData)
  const workflow = useSelector(state => state.appWorkflow.program)

  const [showKyc, setShowKyc] = useState(true)
  const [error, setError] = useState(false)
  const [message, setMessage] = useState("")

  const platformFontWeight = Platform.OS === "ios" ? "400" : "800"
  console.log("workflow", workflow, userData)

  const focused = useIsFocused()

  const [getKycStatusFunc, {
    data: getKycStatusData,
    error: getKycStatusError,
    isLoading: getKycStatusIsLoading,
    isError: getKycStatusIsError
  }] = useGetkycStatusMutation()





  useEffect(() => {
    const fetchOnPageActive = async () => {
      try {
        // Retrieve the credentials
        const credentials = await Keychain.getGenericPassword();
        if (credentials) {
          console.log(
            'Credentials successfully loaded for user ' + credentials?.username
          );
          const token = credentials?.username


          token && getKycStatusFunc(token)


          getMembership()
          console.log("fetching getDashboardFunc, getKycStatusFunc, getBannerFunc, getWorkflowFunc, getFormFunc")
        } else {
          console.log('No credentials stored');
        }
      } catch (error) {
        console.log("Keychain couldn't be accessed!", error);
      }
    }
    fetchOnPageActive()
  }, [focused])

  useEffect(() => {
    if (getKycStatusData) {
      console.log("getKycStatusData", getKycStatusData)
      if (getKycStatusData?.success) {
        const tempStatus = Object.values(getKycStatusData?.body)

        setShowKyc(tempStatus.includes(false))

        console.log("showKyc",showKyc)


      }
    }
    else if (getKycStatusError) {
      setError(true)
      setMessage("Can't get KYC status kindly retry after sometime.")
      console.log("getKycStatusError", getKycStatusError)
    }
  }, [getKycStatusData, getKycStatusError])


  return (
    <Tab.Navigator tabBar={() => <View style={{ alignItems: "center", justifyContent: "center", width: "100%", backgroundColor: "#F7F7F7" }}>
      <Wave style={{ top: 10 }} width={100}></Wave>
      <View style={{ alignItems: "center", justifyContent: "center", flexDirection: "row", height: 60, backgroundColor: "white", width: '100%' }}>
        <TouchableOpacity onPress={() => { navigation.navigate('ProductCatalogue') }} style={{ alignItems: "center", position: 'absolute', left: 30 }}>
          {/* <Gift name="gift" size={24} color={ternaryThemeColor}></Gift> */}
          {/* <BookOpen name="open-book" size={24} color={ternaryThemeColor}></BookOpen> */}
          <Image style={{ height: 23, width: 23 }} source={require("../../assets/images/booko2.png")}></Image>

          <PoppinsTextMedium style={{ marginTop: 4, fontSize: 12, fontWeight: platformFontWeight, color: 'black' }} content="Product Catalogue"></PoppinsTextMedium>
        </TouchableOpacity>
        {/* ozone change */}
        {((userData.user_type).toLowerCase() !== "dealer" && (userData.user_type).toLowerCase() !== "sales") ? <TouchableOpacity onPress={() => { !showKyc ? navigation.navigate('QrCodeScanner') : navigation.navigate("QrCodeScanner") }} style={{ alignItems: "center", justifyContent: "center", }}>
          <Qrcode name="qrcode" size={24} color={ternaryThemeColor}></Qrcode>
          <PoppinsTextMedium style={{ marginTop: 4, fontSize: 12, fontWeight: platformFontWeight, color: 'black' }} content="Scan QR Code"></PoppinsTextMedium>
        </TouchableOpacity>
          :
          workflow?.includes("Genuinity") && <TouchableOpacity onPress={() => { navigation.navigate('ScanAndRedirectToGenuinity') }} style={{ alignItems: "center", justifyContent: "center", }}>
            <Qrcode name="qrcode" size={24} color={ternaryThemeColor}></Qrcode>
            <PoppinsTextMedium style={{ marginTop: 4, fontSize: 12, fontWeight: platformFontWeight, color: 'black' }} content="Check Genuinity"></PoppinsTextMedium>
          </TouchableOpacity>
        }
        {(userData.user_type).toLowerCase() !== "sales" &&
          <TouchableOpacity onPress={() => { navigation.navigate('Passbook') }} style={{ alignItems: "center", justifyContent: "center", position: 'absolute', right: 30 }}>
            <Book name="book" size={24} color={ternaryThemeColor}></Book>
            <PoppinsTextMedium style={{ marginTop: 4, fontSize: 12, fontWeight: platformFontWeight, color: 'black' }} content="Passbook"></PoppinsTextMedium>
          </TouchableOpacity>
        }

        {(userData.user_type).toLowerCase() == "sales" &&
          <TouchableOpacity onPress={() => { navigation.navigate('ProductCatalogue') }} style={{ alignItems: "center", justifyContent: "center", position: 'absolute', right: 20 }}>
            <BookOpen name="open-book" size={24} color={ternaryThemeColor}></BookOpen>
            <PoppinsTextMedium style={{ marginTop: 4, fontSize: 12, fontWeight: platformFontWeight, color: 'black' }} content="Product Catalogue"></PoppinsTextMedium>
          </TouchableOpacity>
        }
      </View>
    </View>}>
      <Tab.Screen options={{
        headerShown: false,
        tabBarLabel: "Home",
        tabBarIcon: () => <Home name="home" size={24} color={ternaryThemeColor}></Home>
      }} name="DashboardBottom" component={Dashboard} />
    </Tab.Navigator>
  );
}

export default BottomNavigator