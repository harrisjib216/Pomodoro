import React, { useState } from 'react';
import { StyleSheet, View, Text, SafeAreaView, TouchableHighlight } from 'react-native';

const TIMERS = {
  work: {
    duration: 1500,
    color: '#ef5350',
    boxColor: '#e53935',
    nextIndex: 'short break',
  },
  'short break': {
    duration: 300,
    color: '#66bb6a',
    boxColor: '#43a047',
    nextIndex: 'work',
  },
  'long break': {
    duration: 900,
    color: '#42a5f5',
    boxColor: '#1e88e5',
    nextIndex: 'work',
  },
};

export default function App() {
  const [state, setState] = useState({
    session: 'work',
    isRunning: false,
    color: TIMERS.work.color,
    boxColor: TIMERS.work.boxColor,
    currentTime: TIMERS.work.duration,
  });

  let interval = null;

  if (state.isRunning) {
    // count down
    interval = setTimeout(() => {
      // handle session selection
      if (state.currentTime - 1 <= 0) {
        let nextSession = TIMERS[state.session].nextIndex;
        setState({
          ...state,
          session: nextSession,
          color: TIMERS[nextSession].color,
          boxColor: TIMERS[nextSession].boxColor,
          currentTime: TIMERS[nextSession].duration,
        });
      } else {
        setState({
          ...state,
          currentTime: state.currentTime - 1,
        });
      }
    }, 1000);
  } else {
    // top loop
    clearTimeout(interval);
  }

  const toggleTimer = newSession => {
    clearTimeout(interval);

    if (newSession) {
      // reset
      setState({
        ...state,
        isRunning: false,
        session: newSession,
        color: TIMERS[newSession].color,
        boxColor: TIMERS[newSession].boxColor,
        currentTime: TIMERS[newSession].duration,
      });
    } else {
      // start/pause
      setState({
        ...state,
        isRunning: !state.isRunning,
      });
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: state.color }]}>
      {/* current session */}
      <View style={[styles.timerBackground, { backgroundColor: state.boxColor }]}>

        {/* sessions */}
        <View style={styles.timmerWrappers}>
          {Object.keys(TIMERS).map(key => {
            return (
              <TouchableHighlight
                key={key}
                onPress={() => toggleTimer(key)}
                underlayColor={TIMERS[key].boxColor}
                style={[
                  styles.timerBox,
                  state.session === key && {
                    opacity: 0.87,
                    backgroundColor: state.color,
                  },
                  key === 'work' && {borderTopLeftRadius: 15},
                  key === 'long break' && {borderTopRightRadius: 15},
                ]}>
                <Text style={styles.timerBoxText}>
                  {key}
                </Text>
              </TouchableHighlight>
            );
          })}
        </View>

        {/* current time */}
        <Text style={styles.currentTime}>
          {parseInt(state.currentTime / 60)}:
          {state.currentTime % 60 === 0 ? '00' : state.currentTime % 60}
        </Text>
      </View>

      {/* start/stop */}
      <TouchableHighlight
        onPress={() => toggleTimer()}
        underlayColor={state.color}
        style={[styles.toggleTimerBtn, { backgroundColor: state.boxColor }]}>
        <Text style={styles.toggleText}>
          {state.isRunning ? 'Stop' : 'Start'}
        </Text>
      </TouchableHighlight>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'column',
  },
  timerBackground: {
    height: 300,
    width: '80%',
    marginTop: 50,
    borderRadius: 15,
    position: 'relative',
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  timmerWrappers: {
    top: 0,
    position: 'absolute',
    flexDirection: 'row',
  },
  timerBox: {
    flex: 1,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timerBoxText: {
    color: 'white',
    textAlign: 'center',
  },

  currentTime: {
    fontSize: 32,
    color: 'white',
  },
  
  toggleTimerBtn: {
    height: 50,
    width: '80%',
    marginTop: 15,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toggleText: {
    fontSize: 16,
    color: 'white',
  },
});
