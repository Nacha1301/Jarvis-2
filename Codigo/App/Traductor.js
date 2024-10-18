import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, Modal, ScrollView, TouchableWithoutFeedback, Alert, Clipboard } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faArrowsLeftRight } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios'; 

const Translator = () => {
  const [text, setText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [sourceLanguage, setSourceLanguage] = useState('es');
  const [targetLanguage, setTargetLanguage] = useState('en');
  const [sourceModalVisible, setSourceModalVisible] = useState(false);
  const [targetModalVisible, setTargetModalVisible] = useState(false);

  const translateText = async () => {
    try {
      const response = await axios.get('https://api.mymemory.translated.net/get', {
        params: {
          q: text,
          langpair: `${sourceLanguage}|${targetLanguage}`, 
        },
      });

      const translated = response.data.responseData.translatedText;
      setTranslatedText(translated);
    } catch (error) {
      console.error('Error en la traducción:', error.message);
    }
  };

  const copyToClipboard = () => {
    Clipboard.setString(translatedText); 
  };

  const languageOptions = [
    { label: 'Español', value: 'es' },
    { label: 'Inglés', value: 'en' },
    { label: 'Francés', value: 'fr' },
    { label: 'Alemán', value: 'de' },
    { label: 'Italiano', value: 'it' },
    { label: 'Portugués', value: 'pt' },
    { label: 'Japonés', value: 'ja' },
    { label: 'Coreano', value: 'ko' },
  ];

  const filteredSourceOptions = languageOptions.filter(lang => lang.value !== targetLanguage);
  const filteredTargetOptions = languageOptions.filter(lang => lang.value !== sourceLanguage);

  const closeModalOutside = (setModalVisible) => {
    return (
      <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
        <View style={styles.modalOverlay} />
      </TouchableWithoutFeedback>
    );
  };

  const swapLanguages = () => {
    setSourceLanguage(targetLanguage);
    setTargetLanguage(sourceLanguage);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Texto a traducir</Text>
      <TextInput
        style={styles.input}
        value={text}
        onChangeText={setText}
        placeholder="Ingresa texto aquí"
      />
      <View style={styles.languageSelectors}>
        <View style={styles.languageSelector}>
          <TouchableOpacity
            style={styles.languageButton}
            onPress={() => setSourceModalVisible(true)}
          >
            <Text style={styles.buttonText}>
              {filteredSourceOptions.find(lang => lang.value === sourceLanguage)?.label || 'Seleccionar idioma'}
            </Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={swapLanguages} style={styles.swapButton}>
          <FontAwesomeIcon icon={faArrowsLeftRight} size={24} color="#333" />
        </TouchableOpacity>
        <View style={styles.languageSelector}>
          <TouchableOpacity
            style={styles.languageButton}
            onPress={() => setTargetModalVisible(true)}
          >
            <Text style={styles.buttonText}>
              {filteredTargetOptions.find(lang => lang.value === targetLanguage)?.label || 'Seleccionar idioma'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <Button title="Traducir" onPress={translateText} color="#4CAF50" />
      <Text style={styles.resultLabel}>Texto traducido:</Text>
      
      <TouchableOpacity onPress={copyToClipboard}>
        <Text style={styles.result}>{translatedText}</Text>
      </TouchableOpacity>
      <Modal
        transparent={true}
        animationType="fade"
        visible={sourceModalVisible}
        onRequestClose={() => setSourceModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          {closeModalOutside(setSourceModalVisible)}
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Idioma</Text>
            <ScrollView>
              {filteredSourceOptions.map((lang) => (
                <TouchableOpacity
                  key={lang.value}
                  style={styles.option}
                  onPress={() => {
                    setSourceLanguage(lang.value);
                    setSourceModalVisible(false);
                  }}
                >
                  <Text style={styles.optionText}>{lang.label}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
      <Modal
        transparent={true}
        animationType="fade"
        visible={targetModalVisible}
        onRequestClose={() => setTargetModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          {closeModalOutside(setTargetModalVisible)}
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Idioma</Text>
            <ScrollView>
              {filteredTargetOptions.map((lang) => (
                <TouchableOpacity
                  key={lang.value}
                  style={styles.option}
                  onPress={() => {
                    setTargetLanguage(lang.value);
                    setTargetModalVisible(false);
                  }}
                >
                  <Text style={styles.optionText}>{lang.label}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#f8f9fa',
  },
  label: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
  },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 10,
    fontSize: 16,
    borderRadius: 5,
    backgroundColor: '#fff',
    marginBottom: 20,
  },
  languageSelectors: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  languageSelector: {
    flex: 1,
  },
  languageButton: {
    backgroundColor: '#007bff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
  },
  swapButton: {
    marginHorizontal: 10,
    padding: 10,
  },
  resultLabel: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 20,
  },
  result: {
    fontSize: 18,
    color: 'black',
    marginTop: 10,
    backgroundColor: '#e9ecef',
    padding: 10,
    borderRadius: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalOverlay: {
    flex: 1,
  },
  modalContent: {
    backgroundColor: '#fff',
    margin: 20,
    padding: 20,
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 20,
  },
  option: {
    paddingVertical: 15,
  },
  optionText: {
    fontSize: 16,
  },
});

export default Translator;
