import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { Vibration } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AlarmContext = createContext();

export const useAlarmContext = () => useContext(AlarmContext);

const VIBRATION_PATTERN = [2000, 1000, 2000, 1000, 2000];

export const AlarmProvider = ({ children }) => {
  const [alarms, setAlarms] = useState([]);
  const alarmCheckTimeoutRef = useRef(null);

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
          Vibration.vibrate(VIBRATION_PATTERN);
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
  }, [alarms]);

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
    <AlarmContext.Provider value={{ alarms, addAlarm, deleteAllAlarms }}>
      {children}
    </AlarmContext.Provider>
  );
};
