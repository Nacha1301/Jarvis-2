import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { Vibration, Button, View, Text, TouchableOpacity, Animated } from 'react-native';

const AlarmContext = createContext();

export const useAlarmContext = () => useContext(AlarmContext);

const VIBRATION_PATTERN = [2000, 1000, 2000, 1000, 2000];

export const AlarmProvider = ({ children }) => {
  const [alarms, setAlarms] = useState([]);
  const [isNotificationVisible, setNotificationVisible] = useState(false);
  const alarmCheckTimeoutRef = useRef(null);
  const slideAnim = useRef(new Animated.Value(-100)).current;

  useEffect(() => {
    const loadAlarms = async () => {
      const storedAlarms = await AsyncStorage.getItem('alarms');
      if (storedAlarms) {
        setAlarms(JSON.parse(storedAlarms));
      }
    };
    loadAlarms();
  }, []);

  useEffect(() => {
    const saveAlarms = async () => {
      await AsyncStorage.setItem('alarms', JSON.stringify(alarms));
    };
    saveAlarms();
  }, [alarms]);

  useEffect(() => {
    const checkAlarms = () => {
      const currentTime = new Date();
      const currentHour = String(currentTime.getHours()).padStart(2, '0');
      const currentMinute = String(currentTime.getMinutes()).padStart(2, '0');
      const currentTimeFormatted = `${currentHour}:${currentMinute}`;

      alarms.forEach((alarm, index) => {
        if (alarm.enabled && alarm.time === currentTimeFormatted) {
          Vibration.vibrate(VIBRATION_PATTERN, true);
          setNotificationVisible(true);
          Animated.spring(slideAnim, {
            toValue: 10,
            useNativeDriver: true,
          }).start();
          const updatedAlarms = [...alarms];
          updatedAlarms[index] = { ...alarm, enabled: false };
          setAlarms(updatedAlarms);
        }
      });

      const timeToNextMinute = (60 - currentTime.getSeconds()) * 1000;
      alarmCheckTimeoutRef.current = setTimeout(checkAlarms, timeToNextMinute);
    };

    checkAlarms();
    return () => clearTimeout(alarmCheckTimeoutRef.current);
  }, [alarms, slideAnim]);

  const stopAlarm = () => {
    Vibration.cancel();
    setNotificationVisible(false);
    Animated.timing(slideAnim, {
      toValue: -100,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const addAlarm = (time) => {
    const newAlarm = { id: Math.random().toString(), time, enabled: true };
    setAlarms([...alarms, newAlarm]);
  };

  const deleteAllAlarms = async () => {
    Vibration.cancel();
    clearTimeout(alarmCheckTimeoutRef.current);
    setAlarms([]);
    await AsyncStorage.removeItem('alarms');
  };

  return (
    <AlarmContext.Provider value={{ alarms, addAlarm, deleteAllAlarms, stopAlarm, isNotificationVisible }}>
      {children}
      {isNotificationVisible && (
        <Animated.View style={{
          position: 'absolute',
          top: '10%',
          left: 10,
          right: 10,
          backgroundColor: '#FF6961',
          paddingVertical: 15,
          paddingHorizontal: 20,
          borderRadius: 12,
          flexDirection: 'row',
          alignItems: 'center',
          zIndex: 1,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.3,
          shadowRadius: 4,
          elevation: 5,
          transform: [{ translateY: slideAnim }]
        }}>
          <Text style={{ color: 'white', fontWeight: 'bold', flex: 1, fontSize: 16 }}>¡Alarma activa!</Text>
          <TouchableOpacity onPress={stopAlarm} style={{
            backgroundColor: 'white',
            paddingVertical: 5,
            paddingHorizontal: 12,
            borderRadius: 8,
          }}>
            <Text style={{ color: '#FF6961', fontWeight: 'bold' }}>Detener</Text>
          </TouchableOpacity>
        </Animated.View>
      )}
    </AlarmContext.Provider>
  );
};
