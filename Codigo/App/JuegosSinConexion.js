import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

function JuegosSC({ navigation, route }) {
  const { themeColor = '#007BFF' } = route.params;

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={[styles.button, { backgroundColor: themeColor }]} 
        onPress={() => navigation.navigate('Memotest')}>
        <Text style={styles.buttonText}>Memotest</Text>
      </TouchableOpacity>
      <Text></Text>
      <TouchableOpacity 
        style={[styles.button, { backgroundColor: themeColor }]} 
        onPress={() => navigation.navigate('Snake')}>
        <Text style={styles.buttonText}>Snake</Text>
      </TouchableOpacity>
      <Text></Text>
      <TouchableOpacity 
        style={[styles.button, { backgroundColor: themeColor }]} 
        onPress={() => navigation.navigate('Buscaminas')}>
        <Text style={styles.buttonText}>Buscaminas</Text>
      </TouchableOpacity>
      <Text></Text>
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
  button: {
    backgroundColor: '#007BFF',
    padding: 15,
    borderRadius: 5,
    width: '80%',
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default JuegosSC;
