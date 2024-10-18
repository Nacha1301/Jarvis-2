import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, Modal, TextInput, Animated } from 'react-native';
import * as firebase from 'firebase';
import 'firebase/database';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Historial from './Historial';
import Alarma from './Alarma';
import Notas from './Notas';
import Snake from './Snake';
import Traductor from './Traductor';
import Buscaminas from './Buscaminas';
import Memotest from './Memotest';
import JuegosSinConexion from './JuegosSinConexion';
import AsyncStorage from '@react-native-async-storage/async-storage';


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

function HomeScreen({ navigation }) {
  const [modalVisible, setModalVisible] = useState(true);
  const [name, setName] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(null);
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [menuAnimation] = useState(new Animated.Value(-300));
  const [overlayOpacity] = useState(new Animated.Value(0));
  const [selectedThemeColor, setSelectedThemeColor] = useState('#007bff');

   const avatarSources = {
    avatar1: require('./assets/1.jpeg'),
    avatar2: require('./assets/2.jpeg'),
    avatar3: require('./assets/3.png'),
  };

   const handleDeleteDatabase = () => {
    database.ref('BADAGral').remove();
    AsyncStorage.removeItem('alarms');
    AsyncStorage.removeItem('notes');
    AsyncStorage.removeItem('@max_score');
  };

  const handleHistorialPress = () => {
    const currentTime = new Date().toLocaleString();
    database.ref('BADAGral/Historial').push({
      DiaYHora: currentTime,
      HechoPor: name,
    });
    navigation.navigate('Historial');
  };

  const handleAlarmPress = () => {
    const currentTime = new Date().toLocaleString();
    database.ref('BADAGral/Alarma').push({
      DiaYHora: currentTime,
      HechoPor: name,
    });
    navigation.navigate('Alarma');
  };

  const handleNotesPress = () => {
    const currentTime = new Date().toLocaleString();
    database.ref('BADAGral/Notas - Listas de Tareas').push({
      DiaYHora: currentTime,
      HechoPor: name,
    });
    navigation.navigate('Notas');
  };

  const handleTraductorPress = () => {
    const currentTime = new Date().toLocaleString();
    database.ref('BADAGral/Traductor').push({
      DiaYHora: currentTime,
      HechoPor: name,
    });
    navigation.navigate('Traductor');
  };

  const handleGamesPress = () => {
    const currentTime = new Date().toLocaleString();
    database.ref('BADAGral/Juegos sin conexion').push({
      DiaYHora: currentTime,
      HechoPor: name,
    });
    navigation.navigate('JuegosSinConexion', { themeColor: selectedThemeColor });
  };


  useEffect(() => {
    setModalVisible(true);
  }, []);

  const toggleMenu = () => {
    const toValue = isMenuVisible ? -300 : 0;
    const opacityValue = isMenuVisible ? 0 : 0.5;

    Animated.parallel([
      Animated.timing(menuAnimation, {
        toValue,
        duration: 300,
        useNativeDriver: false,
      }),
      Animated.timing(overlayOpacity, {
        toValue: opacityValue,
        duration: 300,
        useNativeDriver: false,
      }),
    ]).start();
    setIsMenuVisible(!isMenuVisible);
  };

  const handleThemeChange = (color) => {
    setSelectedThemeColor(color);
  };

  return (
    <View style={styles.container}>
      {isMenuVisible && (
        <TouchableOpacity 
          style={[styles.overlay, { opacity: overlayOpacity }]} 
          onPress={toggleMenu}
          activeOpacity={1}
        />
      )}

      <Animated.View style={[styles.sideBar, { left: menuAnimation }]}>
        <TouchableOpacity style={styles.closeButton} onPress={toggleMenu}>
          <View style={styles.menuLine} />
          <View style={styles.menuLine} />
          <View style={styles.menuLine} />
        </TouchableOpacity>
        <View style={styles.avatarContainer}>
          <Image
            style={styles.avatar}
            source={selectedAvatar ? avatarSources[selectedAvatar] : require('./assets/logo.jpg')}
          />
          <Text></Text>
          <Text style={styles.userName}>{name}</Text>
        </View>
        <View style={styles.themeSection}>
          <Text style={styles.themeLabel}>Temas:</Text>
          <Text></Text>
          <View style={styles.themesContainer}>
            <TouchableOpacity
              style={[styles.themeCircle, { backgroundColor: '#007bff' }]}
              onPress={() => handleThemeChange('#007bff')}
            />
            <TouchableOpacity
              style={[styles.themeCircle, { backgroundColor: '#c3e88d' }]}
              onPress={() => handleThemeChange('#c3e88d')}
            />
            <TouchableOpacity
              style={[styles.themeCircle, { backgroundColor: '#ffcb6b' }]}
              onPress={() => handleThemeChange('#ffcb6b')}
            />
          </View>
        </View>
      </Animated.View>
      <View style={styles.header}>
        <TouchableOpacity style={styles.menuButton} onPress={toggleMenu}>
          <View style={styles.menuLine} />
          <View style={styles.menuLine} />
          <View style={styles.menuLine} />
        </TouchableOpacity>
        <Image style={styles.image} source={require('./assets/logo.jpg')} />
      </View>
      <View style={styles.content}>
        <Text style={styles.headerText}>¡Hola, Soy Ultron!</Text>
        <Text style={styles.subHeaderText}>¿En qué puedo ayudarte hoy?</Text>
        <Text></Text>
        <TouchableOpacity style={[styles.button, { backgroundColor: selectedThemeColor }]} 

onPress={handleAlarmPress}>
          <Text style={styles.buttonText}>Alarma</Text>
        </TouchableOpacity>
        <Text></Text>
        <TouchableOpacity style={[styles.button, { backgroundColor: selectedThemeColor }]} 

onPress={handleTraductorPress}>
          <Text style={styles.buttonText}>Traductor</Text>
        </TouchableOpacity>
        <Text></Text>
        <TouchableOpacity style={[styles.button, { backgroundColor: selectedThemeColor }]} 

onPress={handleHistorialPress}>
          <Text style={styles.buttonText}>Historial</Text>
        </TouchableOpacity>
        <Text></Text>
        <TouchableOpacity style={[styles.button, { backgroundColor: selectedThemeColor }]} 

onPress={handleGamesPress}>
          <Text style={styles.buttonText}>Juegos Sin Conexion</Text>
        </TouchableOpacity>
        <Text></Text>
        <TouchableOpacity style={[styles.button, { backgroundColor: selectedThemeColor }]} 

onPress={handleNotesPress}>
          <Text style={styles.buttonText}>Notas/Listas de Tareas</Text>
        </TouchableOpacity>
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Elije tu avatar</Text>
            <Text></Text>
            <View style={styles.avatarSelection}>
              <TouchableOpacity onPress={() => setSelectedAvatar('avatar1')}>
                <Image
                  style={[
                    styles.avatar,
                    selectedAvatar === 'avatar1' && styles.selectedAvatar,
                  ]}
                  source={require('./assets/1.jpeg')}
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setSelectedAvatar('avatar2')}>
                <Image
                  style={[
                    styles.avatar,
                    selectedAvatar === 'avatar2' && styles.selectedAvatar,
                  ]}
                  source={require('./assets/2.jpeg')}
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setSelectedAvatar('avatar3')}>
                <Image
                  style={[
                    styles.avatar,
                    selectedAvatar === 'avatar3' && styles.selectedAvatar,
                  ]}
                  source={require('./assets/3.png')}
                />
              </TouchableOpacity>
            </View>
            <Text></Text>
            <TextInput
              style={styles.input}
              placeholder="Ingresa tu nombre"
              onChangeText={(text) => setName(text)}
              value={name}
            />
            <TouchableOpacity
              style={[
                styles.acceptButton,
                (name === '' || selectedAvatar === null) && styles.disabledButton,
              ]}
              onPress={() => {
                                   if (name && selectedAvatar) {
                     handleDeleteDatabase();
                     setModalVisible(!modalVisible);
                   }
                 }}
                 disabled={name === '' || selectedAvatar === null}
               >
                 <Text style={styles.textStyle}>Aceptar</Text>
               </TouchableOpacity>
             </View>
           </View>
         </Modal>
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
     sideBar: {
       position: 'absolute',
       top: 0,
       bottom: 0,
       width: 300,
       backgroundColor: '#f0f0f0',
       paddingTop: 50,
       zIndex: 1000,
       paddingHorizontal: 20,
     },
     closeButton: {
       alignSelf: 'flex-end',
       marginBottom: 45,
       marginTop: 10,
       marginRight: 'auto',
     },
     avatarContainer: {
       alignItems: 'center',
       marginBottom: 30,
     },
     avatar: {
       width: 80,
       height: 80,
       borderRadius: 40,
       borderWidth: 3,
       marginBottom: 10,
     },
     userName: {
       fontSize: 18,
       fontWeight: 'bold',
     },
     themeLabel: {
       fontSize: 16,
       fontWeight: 'bold',
     },
     themeSection: {
       marginTop: 'auto',
       marginBottom: 100,
     },
     themesContainer: {
       flexDirection: 'row',
       justifyContent: 'space-around',
       width: '100%',
     },
     themeCircle: {
       width: 50,
       height: 50,
       borderRadius: 25,
     },
     content: {
       flex: 1,
       alignItems: 'center',
       justifyContent: 'center',
       paddingHorizontal: 20,
     },
     headerText: {
       fontSize: 24,
       fontWeight: 'bold',
       marginBottom: 10,
     },
     subHeaderText: {
       fontSize: 16,
       marginBottom: 30,
     },
     button: {
       backgroundColor: '#007BFF',
       padding: 15,
       borderRadius: 5,
       width: '100%',
       alignItems: 'center',
       marginBottom: 10,
     },
     buttonText: {
       color: 'white',
       fontSize: 18,
       fontWeight: 'bold',
     },
     centeredView: {
       flex: 1,
       justifyContent: 'center',
       alignItems: 'center',
       marginTop: 22,
     },
     modalView: {
       margin: 20,
       backgroundColor: 'white',
       borderRadius: 20,
       padding: 35,
       alignItems: 'center',
       shadowColor: '#000',
       shadowOffset: {
         width: 0,
         height: 2,
       },
       shadowOpacity: 0.25,
       shadowRadius: 4,
       elevation: 5,
     },
     modalText: {
       marginBottom: 15,
       textAlign: 'center',
       fontSize: 20,
       fontWeight: 'bold',
     },
     avatarSelection: {
       flexDirection: 'row',
       justifyContent: 'space-between',
       width: '100%',
       marginBottom: 20,
     },
     selectedAvatar: {
       borderColor: '#007BFF',
       borderWidth: 3,
     },
     input: {
       height: 40,
       borderColor: '#000',
       borderWidth: 1,
       borderRadius: 5,
       marginBottom: 15,
       paddingHorizontal: 10,
       width: '80%',
     },
     acceptButton: {
       backgroundColor: '#007BFF',
       padding: 10,
       borderRadius: 5,
     },
     textStyle: {
       color: 'white',
       fontWeight: 'bold',
       textAlign: 'center',
     },
      headerRightContainer: {
       paddingRight: 15,
     },
       avatar2: {
       width: 40,
       height: 40,
     },
     overlay: {
       position: 'absolute',
       top: 0,
       bottom: 0,
       left: 0,
       right: 0,
       backgroundColor: 'rgba(0, 0, 0, 0.5)',
       zIndex: 999,
     },
     disabledButton: {
       backgroundColor: '#cccccc',
     },
   });

   const Stack = createStackNavigator();

   export default function App() {
     return (
       <NavigationContainer>
         <Stack.Navigator>
           <Stack.Screen
             name="Home"
             component={HomeScreen}
             options={{ headerShown: false }}
           />
           <Stack.Screen
            name="Notas"
            component={Notas}
            options={{
              headerRight: () => (
                <View style={styles.headerRightContainer}>
                  <Image
                    style={styles.avatar2}
                    source={require('./assets/logo.jpg')}
                  />
                </View>
              ),
            }}
          />
           <Stack.Screen
            name="Historial"
            component={Historial}
            options={{
              headerRight: () => (
                <View style={styles.headerRightContainer}>
                  <Image
                    style={styles.avatar2}
                    source={require('./assets/logo.jpg')}
                  />
                </View>
              ),
            }}
          />
          <Stack.Screen
            name="Alarma"
            component={Alarma}
            options={{
              headerRight: () => (
                <View style={styles.headerRightContainer}>
                  <Image
                    style={styles.avatar2}
                    source={require('./assets/logo.jpg')}
                  />
                </View>
              ),
            }}
          />
          <Stack.Screen
            name="JuegosSinConexion"
            component={JuegosSinConexion}
            options={{
              headerRight: () => (
                <View style={styles.headerRightContainer}>
                  <Image
                    style={styles.avatar2}
                    source={require('./assets/logo.jpg')}
                  />
                </View>
              ),
            }}
          />
          <Stack.Screen
            name="Snake"
            component={Snake}
            options={{
              headerRight: () => (
                <View style={styles.headerRightContainer}>
                  <Image
                    style={styles.avatar2}
                    source={require('./assets/logo.jpg')}
                  />
                </View>
              ),
            }}
          />
          <Stack.Screen
            name="Buscaminas"
            component={Buscaminas}
            options={{
              headerRight: () => (
                <View style={styles.headerRightContainer}>
                  <Image
                    style={styles.avatar2}
                    source={require('./assets/logo.jpg')}
                  />
                </View>
              ),
            }}
          />
          <Stack.Screen
            name="Traductor"
            component={Traductor}
            options={{
              headerRight: () => (
                <View style={styles.headerRightContainer}>
                  <Image
                    style={styles.avatar2}
                    source={require('./assets/logo.jpg')}
                  />
                </View>
              ),
            }}
          />
          <Stack.Screen
            name="Memotest"
            component={Memotest}
            options={{
              headerRight: () => (
                <View style={styles.headerRightContainer}>
                  <Image
                    style={styles.avatar2}
                    source={require('./assets/logo.jpg')}
                  />
                </View>
              ),
            }}
          />
         </Stack.Navigator>
       </NavigationContainer>
     );
   }
