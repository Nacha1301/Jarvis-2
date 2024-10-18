import AsyncStorage from '@react-native-async-storage/async-storage';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Pressable, FlatList, Modal, TextInput, Button } from 'react-native';
import { useEffect, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';

export default function App() {
  const [notes, setNotes] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMenuVisible, setModalMenuVisible] = useState(false);
  const [newNoteTitle, setNewNoteTitle] = useState('');
  const [newNoteContent, setNewNoteContent] = useState('');
  const [selectedNote, setSelectedNote] = useState(null);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editedNoteTitle, setEditedNoteTitle] = useState('');
  const [editedNoteContent, setEditedNoteContent] = useState('');

  useEffect(() => {
    const loadNotes = async () => {
      const storedNotes = await AsyncStorage.getItem('notes');
      if (storedNotes) {
        setNotes(JSON.parse(storedNotes));
      }
    };

    loadNotes();
  }, []);

  useEffect(() => {
    const saveNotes = async () => {
      await AsyncStorage.setItem('notes', JSON.stringify(notes));
    };

    saveNotes();
  }, [notes]);

  const addNote = () => {
    if (newNoteTitle.trim() === '' || newNoteContent.trim() === '') {
      return;
    }

    const note = {
      id: Math.random().toString(),
      title: newNoteTitle,
      content: newNoteContent,
    };

    setNotes([...notes, note]);
    setModalVisible(false);
    setNewNoteTitle('');
    setNewNoteContent('');
  };

  const editNote = () => {
    if (editedNoteTitle.trim() === '' || editedNoteContent.trim() === '') {
      return;
    }

    setNotes((prevNotes) =>
      prevNotes.map((note) =>
        note.id === selectedNote.id
          ? { ...note, title: editedNoteTitle, content: editedNoteContent }
          : note
      )
    );
    setEditModalVisible(false);
    setSelectedNote(null);
    setEditedNoteTitle('');
    setEditedNoteContent('');
  };

  const deleteNote = (noteId) => {
    setNotes(notes.filter((note) => note.id !== noteId));
    setEditModalVisible(false);
  };

  const deleteAllNotes = async () => {
    setNotes([]);
    await AsyncStorage.removeItem('notes');
    setModalMenuVisible(false);
  };

  const openEditModal = (note) => {
    setSelectedNote(note);
    setEditedNoteTitle(note.title);
    setEditedNoteContent(note.content);
    setEditModalVisible(true);
  };

  const openAddNoteModal = () => {
    setNewNoteTitle('');
    setNewNoteContent('');
    setModalVisible(true);
  };

  const closeAddNoteModal = () => {
    setNewNoteTitle('');
    setNewNoteContent('');
    setModalVisible(false);
  };

  const renderItem = ({ item }) => (
    <Pressable onPress={() => openEditModal(item)}>
      <View style={styles.noteContainer}>
        <View style={styles.noteRectangle}>
          <Text style={styles.noteContentPreview}>
            {item.content.length > 30 ? `${item.content.substring(0, 30)}...` : item.content}
          </Text>
        </View>
        <Text style={styles.noteTitle}>{item.title}</Text>
      </View>
    </Pressable>
  );

  return (
    <View style={styles.container}>
      <View style={styles.iconsContainer}>
        <Pressable onPress={() => setModalMenuVisible(true)}>
          <Ionicons name="ellipsis-vertical" size={37} color="black" />
        </Pressable>
      </View>

      <FlatList
        data={notes}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.list}
      />
      <StatusBar style="auto" />

      <Pressable style={styles.addButton} onPress={openAddNoteModal}>
        <Ionicons name="add" size={37} color="black" />
      </Pressable>

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeAddNoteModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Nueva Nota</Text>
            <TextInput
              style={styles.input}
              placeholder="Titulo (Max 15 caracteres)"
              maxLength={15}
              value={newNoteTitle}
              onChangeText={setNewNoteTitle}
            />
            <TextInput
              style={[styles.input, styles.noteInput]}
              placeholder="Escribe tu nota"
              multiline={true}
              numberOfLines={4}
              value={newNoteContent}
              onChangeText={setNewNoteContent}
            />
            <View style={styles.buttonRow}>
              <View style={styles.buttonSpacing}>
                <Button title="Cancelar" color="red" onPress={closeAddNoteModal} />
              </View>
              <View style={styles.buttonSpacing}>
                <Button title="Guardar" onPress={addNote} />
              </View>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="fade"
        transparent={true}
        visible={editModalVisible}
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Editar Nota</Text>
            <Pressable onPress={() => deleteNote(selectedNote.id)} style={styles.trashIcon}>
              <Ionicons name="trash-outline" size={37} color="black" />
            </Pressable>
            <TextInput
              style={styles.input}
              placeholder="Título"
              value={editedNoteTitle}
              onChangeText={setEditedNoteTitle}
            />
            <TextInput
              style={[styles.input, styles.noteInput]}
              placeholder="Escribe tu nota"
              multiline={true}
              numberOfLines={4}
              value={editedNoteContent}
              onChangeText={setEditedNoteContent}
            />
            <View style={styles.buttonRow}>
              <View style={styles.buttonSpacing}>
                <Button title="Cancelar" color="red" onPress={() => setEditModalVisible(false)} />
              </View>
              <View style={styles.buttonSpacing}>
                <Button title="Guardar" onPress={editNote} />
              </View>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalMenuVisible}
        onRequestClose={() => setModalMenuVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Queres eliminar todas las notas?</Text>
            <View style={styles.buttonRow}>
              <View style={styles.buttonSpacing}>
                <Button title="Cancelar" color="red" onPress={() => setModalMenuVisible(false)} />
              </View>
              <View style={styles.buttonSpacing}>
                <Button title="Aceptar" onPress={deleteAllNotes} />
              </View>
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
    backgroundColor: '#fff',
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  iconsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 20,
  },
  noteContainer: {
    flex: 1,
    margin: 10,
    alignItems: 'center',
  },
  noteRectangle: {
    width: 150,
    height: 200,
    backgroundColor: '#f1f1f1',
    borderColor: '#000',
    borderWidth: 2,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  noteContentPreview: {
    fontSize: 14,
    textAlign: 'center',
    color: '#333',
  },
  noteTitle: {
    marginTop: 5,
    fontSize: 16,
    color: '#000',
  },
  list: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#f1f1f1',
    borderRadius: 50,
    padding: 10,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: 20, 
    paddingVertical: 40, 
  },
  modalContainer: {
    width: 350,
    backgroundColor: 'white',
    padding: 30,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    marginBottom: 30,
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  noteInput: {
    height: 100,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginTop: 10,
  },
  buttonSpacing: {
    marginHorizontal: 5,
  },
  trashIcon: {
    position: 'absolute',
    left: 25,
    top: 25,
  },
});
