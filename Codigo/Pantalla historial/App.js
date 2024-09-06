import { StyleSheet, View, TouchableOpacity, Image, Text } from 'react-native';
import * as firebase from 'firebase';
import 'firebase/database';
import React, { useState, useEffect } from 'react';

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

  useEffect(() => {
    const dataRef = database.ref('/BADAGral');

    const onDataChange = (snapshot) => {
      const data = snapshot.val();
      if (data) {  // Verifica si los datos no son null
        formatData(data);
      } else {
        setFormattedData("");  // Si los datos son null, establece el estado como una cadena vacía
      }
    };

    dataRef.on('value', onDataChange);

    // Cleanup function to remove listener
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

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.menuButton}>
          <View style={styles.menuLine} />
          <View style={styles.menuLine} />
          <View style={styles.menuLine} />
        </TouchableOpacity>
        <Image style={styles.image} source={require('./assets/snack-icon.png')} />
      </View>
      <Text style={styles.dataText}>
        {formattedData}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  menuButton: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuLine: {
    width: 30,
    height: 3,
    backgroundColor: 'black',
    marginVertical: 2,
  },
  image: {
    width: 40,
    height: 40,
  },
  dataText: {
    padding: 20,
  },
});
