import React, { useEffect, useState } from 'react';
import { Modal, View, Text, Image, StyleSheet } from 'react-native';
import FastImage from 'react-native-fast-image';

const MaintenanceModal = ({ visible, onClose }) => {
  const gifUri = Image.resolveAssetSource(require('../../../assets/gif/maintanance.webp')).uri;
  const [modalVisible, setModalVisible] = useState(props.visible)
  useEffect(()=>{
  setModalVisible(props.visible)
  },[modalVisible])

  return (
    <Modal
      visible={visible}
      animationType="slide"
      // transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.card}>
          {/* <Image
            source={require('../../../assets/gif/maintanance.gif')}
            style={styles.image}
            resizeMode="contain"
          /> */}

          <FastImage
            style={{ width: 200, height: 200, alignSelf: 'center', marginTop: 20 }}
            source={{
              uri: gifUri, // Update the path to your GIF
              priority: FastImage.priority.normal,
            }}
            resizeMode={FastImage.resizeMode.contain}
          />

          <Text style={styles.text}>Under Maintenance</Text>
          <Text style={styles.subText}>We are performing maintenance on Server. Please check back later.</Text>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    height:'100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  card: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  image: {
    width: 100,
    height: 100,
    marginBottom: 10,
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
    color:'black'
  },
  subText: {
    fontSize: 16,
    color:"#808080",
    textAlign: 'center',
  },
});

export default MaintenanceModal;
