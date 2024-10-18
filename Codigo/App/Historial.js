import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, Pressable, Modal, Button } from 'react-native';
import * as firebase from 'firebase';
import 'firebase/database';
import { Ionicons } from '@expo/vector-icons';

const firebaseConfig = {
  apiKey: "AIzaSyCCsdDdWwUEwtYTU9HNf5GQW8Hkf2NasLU",
  authDomain: "ultron-db141.firebaseapp.com",
  projectId: "ultron-db141",
  storageBucket: "ultron-db141.appspot.com",
  messagingSenderId: "151952143708",
  appId: "1:151952143708:web:1404c327f12bbec0747d99",
  measurementId: "G-R15LNPTJHT"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const database = firebase.database();

export default function App() {
  const [formattedData, setFormattedData] = useState("");
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const dataRef = database.ref('/BADAGral');

    const onDataChange = (snapshot) => {
      const data = snapshot.val();
      if (data) {
        formatData(data);
      } else {
        setFormattedData("");
      }
    };

    dataRef.on('value', onDataChange);

    return () => {
      dataRef.off('value', onDataChange);
    };
  }, []);

  const formatData = (data) => {
    let formattedString = "";

    Object.keys(data).forEach(category => {
      Object.keys(data[category]).forEach(itemKey => {
        const item = data[category][itemKey];
        formattedString += `${category} fue abierto por: ${item.HechoPor} a las 

${item.DiaYHora}\n\n`;
      });
    });

    setFormattedData(formattedString);
  };

  const handleDelete = () => {
    database.ref('BADAGral').remove();
    setFormattedData(""); 
    setModalVisible(false); 
  };

  return (
    <View style={styles.container}>
      <Pressable style={styles.trashIcon} onPress={() => setModalVisible(true)}>
        <Ionicons name="trash-outline" size={37} color="black" />
      </Pressable>

      <View style={styles.rectContainer}>
        <ScrollView contentContainerStyle={formattedData ? styles.scrollViewTop : 

styles.scrollViewCenter}>
          <Text style={formattedData ? styles.dataText : styles.emptyText}>
            {formattedData || "Historial Vacío"}
          </Text>
        </ScrollView>
      </View>

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
          <Text></Text>
            <Text style={styles.modalTitle}>¿Borrar todo?</Text>
            <Text></Text>
            <View style={styles.buttonContainer}>
            <Text></Text>
              <Button title="Cancelar" color="red" onPress={() => setModalVisible(false)} />
              <Button title="Aceptar" onPress={handleDelete} />
              <Text></Text>
            </View>
            <Text></Text>
          </View>
          <Text></Text>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  trashIcon: {
    position: 'absolute',
    top: 130,
    right: 50,
    zIndex: 1,
  },
  rectContainer: {
    width: '80%',
    height: 600,
    borderWidth: 2,
    borderColor: 'black',
    borderRadius: 10,
    padding: 20,
  },
  scrollViewTop: {
    flexGrow: 1,
    justifyContent: 'flex-start',
  },
  scrollViewCenter: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  dataText: {
    fontSize: 16,
    lineHeight: 24,
  },
  emptyText: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
    color: '#aaa',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: 300,
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    marginBottom: 15,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
});
