// import React from 'react';
// import {View, StyleSheet,ScrollView} from 'react-native';
// import MenuItems from '../atoms/MenuItems';
// import { BaseUrl } from '../../utils/BaseUrl';


// const DashboardMenuBox=(props)=>{
//     const data = props.data
//     const navigation = props.navigation
//     const handleMenuItemPress=(data)=>{
//         console.log(data)
//         if(data.substring(0,4).toLowerCase()==="scan" )
//         {
//             navigation.navigate('QrCodeScanner')
//         }
//         else if(data.toLowerCase()==="passbook")
//         {
//             navigation.navigate("Passbook")
//         }
//         else if(data.toLowerCase() === "rewards"){
//             navigation.navigate('RedeemRewardHistory')
//         }
//         else if(data.toLowerCase() === "profile"){
//             navigation.navigate('Profile')
//         }
//         else if(data.toLowerCase() === "warranty list"){
//             navigation.navigate('WarrantyHistory')
//         }
//         else if(data.toLowerCase() === "bank details" || data.toLowerCase() === "bank account"){
//             navigation.navigate('BankAccounts')
//         }
//         else if(data.toLowerCase().substring(0,5) === "check"){
//             if(data.toLowerCase().split(" ")[1]==="genuinity")
//             navigation.navigate('ScanAndRedirectToGenuinity')
//             else if(data.toLowerCase().split(" ")[1]==="warranty")
//             navigation.navigate('ScanAndRedirectToWarranty')
//         }
//         else if(data.toLowerCase().substring(0,8) === "activate"){
//             if(data.toLowerCase().split(" ")[1]==="genuinity")
//             navigation.navigate('ScanAndRedirectToGenuinity')
//             else if(data.toLowerCase().split(" ")[1]==="warranty")
//             navigation.navigate('ScanAndRedirectToWarranty')
//         }
//         else if(data.toLowerCase() === "product catalogue"){
//             navigation.navigate('ProductCatalogue')
//         }
//         else if(data.toLowerCase() === "customer support" || data.toLowerCase() === "help and support"){
//             navigation.navigate('HelpAndSupport')
//         }
//     }

//     return(
//         <View style={{borderColor:'#DDDDDD',borderRadius:20,borderWidth:1.2,width:'90%',alignItems:"center",justifyContent:"center",backgroundColor:'white',padding:4}}>
//         <ScrollView showsHorizontalScrollIndicator={false} contentContainerStyle={{width:'100%',flexWrap:"wrap",flexDirection:"row",alignItems:'center',justifyContent:"center"}} horizontal={true}>
//         {
//             data.map((item,index)=>{
//                 return(
                   
//                     <MenuItems handlePress={handleMenuItemPress} key={index} image={`${BaseUrl}/api/images/${item.icon}`} content={item.name}></MenuItems>
                   
//                 )
//             })
//         }
//         </ScrollView>
//         </View>
//     )
// }

// export default DashboardMenuBox;
import React, { useEffect, useState } from 'react';
import {View, StyleSheet,ScrollView,Dimensions} from 'react-native';
import MenuItems from '../atoms/MenuItems';
import { BaseUrl } from '../../utils/BaseUrl';
import { useGetkycStatusMutation } from '../../apiServices/kyc/KycStatusApi';
import { useIsFocused } from '@react-navigation/native';
import * as Keychain from 'react-native-keychain';




const DashboardMenuBox=(props)=>{
    const data = props.data
    const navigation = props.navigation
    const width = Dimensions.get('window').width

  const [showKyc, setShowKyc] = useState(true)
  const[error, setError] = useState(false)
    
    

    const [getKycStatusFunc, {
        data: getKycStatusData,
        error: getKycStatusError,
        isLoading: getKycStatusIsLoading,
        isError: getKycStatusIsError
      }] = useGetkycStatusMutation()

      const focused = useIsFocused()
      
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


        //   getMembership()
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

    const handleMenuItemPress=(data)=>{
        if(data.substring(0,4).toLowerCase()==="scan" )
        {
            if(getKycStatusData){
                !showKyc ?  navigation.navigate('QrCodeScanner') : navigation.navigate("QrCodeScanner")

            }
            console.log("show kyyyyyyyyyyy", showKyc,getKycStatusData)
        }
        else if(data.toLowerCase()==="passbook")
        {
            navigation.navigate("Passbook")
        }
        else if(data.toLowerCase() === "rewards"){
            navigation.navigate('RedeemRewardHistory')
        }
        else if(data.toLowerCase() === "profile"){
            navigation.navigate('Profile')
        }
        else if (data.toLowerCase() === "query list") {
            navigation.navigate('QueryList')
          }
        else if(data.toLowerCase() === "warranty list"){
            navigation.navigate('WarrantyHistory')
        }
        else if(data.toLowerCase() === "bank details" || data.toLowerCase() === "bank account"){
            navigation.navigate('BankAccounts')
        }
        else if(data.toLowerCase().substring(0,5) === "check"){
            if(data?.toLowerCase().split(" ")[1]==="genuinity")
            navigation.navigate('ScanAndRedirectToGenuinity')

            else if(data?.toLowerCase().split(" ")[1]==="warranty")
            navigation.navigate('ScanAndRedirectToWarranty')
        }
        else if(data?.toLowerCase().substring(0,8) === "activate"){
            if(data?.toLowerCase().split(" ")[1]==="genuinity")
            navigation.navigate('ScanAndRedirectToGenuinity')
            else if(data?.toLowerCase().split(" ")[1]==="warranty")
            navigation.navigate('ScanAndRedirectToWarranty')
        }
        else if(data.toLowerCase() === "product catalogue"){
            navigation.navigate('ProductCatalogue')
        }
        else if(data.toLowerCase() === "add user"){
            navigation.navigate('ListUsers')
        }
        else if(data.toLowerCase() === "customer support" || data.toLowerCase() === "help and support"){
            navigation.navigate('HelpAndSupport')
        }
        else if(data.toLowerCase() === "report an issue"){
            navigation.navigate('QueryList')
        }
    }

    return(
        <View style={{borderColor:'#DDDDDD',borderRadius:20,borderWidth:1.2,width:width-20,alignItems:"center",justifyContent:"center",backgroundColor:'white',padding:4,marginBottom:30}}>
        <View style={{width:'100%',flexWrap:"wrap",flexDirection:"row",alignItems:"center",justifyContent:'center', marginBottom:25}}>
        {
            data.map((item,index)=>{
                return(
                   
                    <MenuItems handlePress={handleMenuItemPress} key={index} image={item?.icon} content={item?.name}></MenuItems>
                   
                )
            })
        }
        </View>
        </View>
    )
}

export default DashboardMenuBox;

