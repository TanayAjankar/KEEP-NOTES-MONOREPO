/**
 * Keep Notes Mobile App
 * https://github.com/TanayAjankar/KEEP-NOTES-MONOREPO
 *
 * @format
 */

import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  TouchableOpacity,
} from 'react-native';

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? '#1e1e1e' : '#f5f5f5',
    flex: 1,
  };

  const textStyle = {
    color: isDarkMode ? '#ffffff' : '#000000',
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        <View style={styles.container}>
          <Text style={[styles.title, textStyle]}>Keep Notes</Text>
          <Text style={[styles.subtitle, textStyle]}>
            Your notes, everywhere you go
          </Text>
          
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>Create Note</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={[styles.button, styles.secondaryButton]}>
              <Text style={[styles.buttonText, styles.secondaryButtonText]}>
                View Notes
              </Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.infoContainer}>
            <Text style={[styles.infoText, textStyle]}>
              Welcome to Keep Notes mobile app!
            </Text>
            <Text style={[styles.infoText, textStyle]}>
              This app is part of the Keep Notes monorepo and will sync with your server.
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 600,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 40,
    textAlign: 'center',
    opacity: 0.7,
  },
  buttonContainer: {
    width: '100%',
    maxWidth: 300,
    marginBottom: 40,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
    marginBottom: 15,
    alignItems: 'center',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#007AFF',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButtonText: {
    color: '#007AFF',
  },
  infoContainer: {
    padding: 20,
    borderRadius: 8,
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
    width: '100%',
    maxWidth: 300,
  },
  infoText: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 10,
    lineHeight: 20,
  },
});

export default App;
