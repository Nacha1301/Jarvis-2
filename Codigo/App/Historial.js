import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, Pressable, Modal, TouchableOpacity } from 'react-native';
import * as firebase from 'firebase';
import 'firebase/database';
import { Ionicons } from '@expo/vector-icons';

const firebaseConfig = {
  apiKey: "AIzaSyBjdSByv2slcL-XFYQhdjs3hNEkjjTfmfw",
  authDomain: "ultron-5c2bf.firebaseapp.com",
  databaseURL: "https://ultron-5c2bf-default-rtdb.firebaseio.com",
  projectId: "ultron-5c2bf",
  storageBucket: "ultron-5c2bf.appspot.com",
  messagingSenderId: "99416634310",
  appId: "1:99416634310:web:d5c6ebe950e1992988b8c7",
  measurementId: "G-QRJ2ZNXWKP"
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
        formattedString += `${category} fue abierto por: ${item.HechoPor} a las ${item.DiaYHora}\n\n`;
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
      <View style={styles.rectContainer}>
        <Pressable style={styles.trashIcon} onPress={() => setModalVisible(true)}>
          <Ionicons name="trash-outline" size={35} color="black" />
        </Pressable>
        <ScrollView contentContainerStyle={formattedData ? styles.scrollViewTop : styles.scrollViewCenter}>
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
            <Text style={styles.modalTitle}>¿Borrar todo?</Text>
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={[styles.modalButton, { backgroundColor: '#FF6961' }]} onPress={() => setModalVisible(false)}>
                <Text style={styles.buttonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalButton, { backgroundColor: '#77DD77' }]} onPress={handleDelete}>
                <Text style={styles.buttonText}>Aceptar</Text>
              </TouchableOpacity>
            </View>
          </View>
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
    backgroundColor: '#f0f4f7',
  },
  trashIcon: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 1,
  },
  rectContainer: {
    width: '80%',
    height: 600,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 15,
    padding: 20,
    backgroundColor: '#fff',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
    position: 'relative',
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
    lineHeight: 28,
    color: '#333',
    maxWidth: '90%',
  },
  emptyText: {
    fontSize: 16,
    lineHeight: 28,
    textAlign: 'center',
    color: '#999',
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
    borderRadius: 20,
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    marginBottom: 20,
    color: '#333',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalButton: {
    flex: 1,
    margin: 10,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});
