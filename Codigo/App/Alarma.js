import React, { useState, useRef } from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Pressable, Switch, FlatList, Modal, Button } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Picker } from '@react-native-picker/picker';
import { useAlarmContext } from './AlarmContext';

export default function AlarmaScreen() {
  const { alarms, addAlarm, deleteAllAlarms } = useAlarmContext();
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMenuVisible, setModalMenuVisible] = useState(false);
  const [selectedHour, setSelectedHour] = useState("00");
  const [selectedMinute, setSelectedMinute] = useState("00");

  const handleAddAlarm = () => {
    const timeInput = `${selectedHour}:${selectedMinute}`;
    addAlarm(timeInput);
    setModalVisible(false);
    setSelectedHour("00");
    setSelectedMinute("00");
  };

  const renderItem = ({ item }) => (
    <View style={styles.alarmContainer}>
      <Text style={styles.alarmTime}>{item.time}</Text>
      <Switch
        trackColor={{ false: "#767577", true: "#4CAF50" }}
        thumbColor={item.enabled ? "#f4f3f4" : "#f4f3f4"}
        onValueChange={() => toggleAlarm(item.id)}
        value={item.enabled}
      />
    </View>
  );

const toggleAlarm = (id) => {
    const updatedAlarms = alarms.map((alarm) => {
      if (alarm.id === id) {
        return { ...alarm, enabled: !alarm.enabled };
      }
      return alarm;
    });
    setAlarms(updatedAlarms);
  };

  return (
    <View style={styles.container}>
      <View style={styles.iconsContainer}>
        <Pressable onPress={() => setModalVisible(true)}>
          <Ionicons name="add-circle-outline" size={37} color="black" />
        </Pressable>
        <Pressable onPress={() => setModalMenuVisible(true)}>
          <Ionicons name="ellipsis-vertical" size={37} color="black" />
        </Pressable>
      </View>
      <Text></Text><Text></Text>
      <FlatList
        data={alarms}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
      <StatusBar style="auto" />

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Nueva Alarma</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={selectedHour}
                style={styles.picker}
                onValueChange={(itemValue) => setSelectedHour(itemValue)}
              >
                {Array.from({ length: 24 }, (_, i) => String(i).padStart(2, "0")).map((hour) => (
                  <Picker.Item key={hour} label={hour} value={hour} />
                ))}
              </Picker>
              <Text style={styles.separator}>:</Text>
              <Picker
                selectedValue={selectedMinute}
                style={styles.picker}
                onValueChange={(itemValue) => setSelectedMinute(itemValue)}
              >
                {Array.from({ length: 60 }, (_, i) => String(i).padStart(2, "0")).map((minute) => (
                  <Picker.Item key={minute} label={minute} value={minute} />
                ))}
              </Picker>
            </View>
            <View style={styles.buttonContainer}>
              <Button title="Cancelar" color="red" onPress={() => setModalVisible(false)} />
              <Button title="Agregar" onPress={handleAddAlarm} />
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
            <Text style={styles.modalTitle}>¿Borrar todas las alarmas?</Text>
            <View style={styles.buttonContainer}>
              <Button title="Cancelar" color="red" onPress={() => setModalMenuVisible(false)} />
              <Button title="Aceptar" onPress={deleteAllAlarms} />
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
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: 50,
  },
  alarmContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#dcdcdc",
    width: "90%",
    padding: 15,
    borderRadius: 30,
    marginVertical: 10,
    marginHorizontal: "5%",
  },
  alarmTime: {
    fontSize: 18,
  },
  iconsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "25%",
    marginTop: 5,
    marginLeft: '66%',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    width: 300,
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    marginBottom: 15,
  },
  pickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  picker: {
    height: 50,
    width: 100,
  },
  separator: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginTop: 20,
    width: '80%',
  },
});
