import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, Image, TouchableOpacity, ImageBackground } from 'react-native';
import DotHorizontalList from '../../components/molecules/DotHorizontalList';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { user_type_option } from '../../utils/usertTypeOption';
import { useSelector } from 'react-redux';
import { useGetAppUsersDataMutation } from '../../apiServices/appUsers/AppUsersApi';



const Introduction = ({ navigation }) => {
    const [imageIndex, setImageIndex] = useState(0)
    const [skipEnabled, setSkipEnabled] = useState(false)
    const [listUsers, setListUsers] = useState([]);

    // const [isAlreadyIntroduced, setIsAlreadyIntroduced] = useState(null)

    const registrationRequired = useSelector(state => state.appusers.registrationRequired)
    const manualApproval = useSelector(state => state.appusers.manualApproval)
    const otpLogin = useSelector(state => state.apptheme.otpLogin)


    const [
        getUsers,
        {
            data: getUsersData,
            error: getUsersError,
            isLoading: getUsersDataIsLoading,
            isError: getUsersDataIsError,
        },
    ] = useGetAppUsersDataMutation();


    //asynch storage data saving
    const storeData = async () => {
        try {
            await AsyncStorage.setItem('isAlreadyIntroduced', "Yes");
            //   console.log("saved")
        } catch (e) {
            // saving error
            console.log("error", e)

        }
    };

    useEffect(() => {
        getUsers();
    }, [])

    useEffect(() => {
        if (getUsersData) {
            console.log("type of users", getUsersData.body);
            const appUsers = getUsersData.body.map((item, index) => {
                return item.name
            })
            const appUsersData = getUsersData.body.map((item, index) => {
                return {
                    "name": item.name,
                    "id": item.user_type_id
                }
            })

            setListUsers(getUsersData.body);


        } else if (getUsersError) {
            console.log("getUsersError", getUsersError);
        }
    }, [getUsersData, getUsersError]);


    useEffect(() => {
        setTimeout(() => {
            setSkipEnabled(true)
        }, 1500);

    }, [])
    // This is the array used to display images, add or remove image from the array to modify as per clients need----------------

    const descriptionImages = [require('../../../assets/images/rewardify.png')]



    // function to handle next button press and to navigate to Select Language page when all the images are showed-----------------
    const handleNext = () => {
        console.log(descriptionImages.length)
        if (imageIndex < descriptionImages.length) {

            if (imageIndex == descriptionImages.length - 1) {
                storeData();
                if (user_type_option == "single") {
                    checkRegistrationRequired()
                }
                else {
                    navigation.navigate('SelectUser');
                }

            }
            else {
                setImageIndex(imageIndex + 1)
            }
        }

    }


    const handleSkip = () => {
        // navigation.navigate('SelectLanguage')
        storeData();
        if(user_type_option == "single"){
            checkRegistrationRequired()
        }
        else{        
            navigation.navigate('SelectUser')
        }

    }



    const checkRegistrationRequired = () => {

        if (registrationRequired.includes(getUsersData.body[0]?.user_type)) {
            checkApprovalFlow(true)
            console.log("registration required")
        }
        else {
            checkApprovalFlow(false)
            console.log("registration not required")

        }

    }

    const checkApprovalFlow = (registrationRequired) => {
        if (manualApproval.includes(getUsersData?.body?.[0].user_type)) {
            handleNavigationBaseddOnUser(true, registrationRequired)
        }
        else {
            handleNavigationBaseddOnUser(false, registrationRequired)
        }
    }

    const handleNavigationBaseddOnUser = (needsApproval, registrationRequired) => {
        console.log("Needs Approval", needsApproval)
        if (otpLogin.includes(getUsersData?.body?.[0].user_type)
        ) {
          navigation.navigate('OtpLogin', { needsApproval: needsApproval, userType: listUsers[0]?.user_type, userId: listUsers[0]?.user_type_id, registrationRequired: registrationRequired })
        }
        else {
         navigation.navigate('OtpLogin', { needsApproval: needsApproval, userType: listUsers[0]?.user_type, userId: listUsers[0]?.user_type_id, registrationRequired: registrationRequired })
       
        }
      }
    
    


    return (
        <ImageBackground source={descriptionImages[imageIndex]} resizeMode='stretch' style={{ backgroundColor: "#F2F2F2", height: '100%', width: '100%', flex: 1, }}>

            {/* <View style={{width:'100%',height:'60%'}}>
                <Image style={{height:"100%",width:"100%"}} source={descriptionImages[imageIndex]}></Image>
            </View> */}
            <View style={{ width: '100%', position: 'absolute', bottom: 30 }}>
                <DotHorizontalList no={descriptionImages.length} primaryColor="white" secondaryColor="#0085A2" selectedNo={imageIndex} ></DotHorizontalList>

                <View style={{ width: "100%", height: '100%', marginTop: 20 }}>
                    {skipEnabled && <TouchableOpacity disabled={!skipEnabled} style={{ position: "absolute", left: 40, bottom: 20 }} onPress={() => { handleSkip() }}>
                        <Text style={{ fontSize: 18, color: "#0087A2", fontWeight: '600' }}>Skip</Text>

                    </TouchableOpacity>}
                    <Text onPress={() => { handleNext() }} style={{ fontSize: 18, color: "#0087A2", position: "absolute", right: 40, bottom: 20, fontWeight: '600' }}>Next</Text>
                </View>
            </View>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({})

export default Introduction;