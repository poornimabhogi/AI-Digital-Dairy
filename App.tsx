import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Share,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons, Ionicons, Feather, AntDesign } from '@expo/vector-icons';
import { toast } from 'sonner';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Diary states
  const [isNewEntry, setIsNewEntry] = useState(false);
  const [entry, setEntry] = useState('');
  const [isAIAnalyzing, setIsAIAnalyzing] = useState(false);
  const [showAIPanel, setShowAIPanel] = useState(false);
  const [mood, setMood] = useState('neutral');
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const [savedEntries, setSavedEntries] = useState([
    {
      id: '1',
      content: 'Today was an amazing day! I finally completed my project and celebrated with friends. The weather was perfect for a walk in the park.',
      date: new Date(Date.now() - 86400000),
      mood: 'positive'
    },
    {
      id: '2',
      content: 'Spent the morning reading my favorite book and working on personal goals. Sometimes quiet days are the best days.',
      date: new Date(Date.now() - 172800000),
      mood: 'neutral'
    },
  ]);

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      setIsAuthenticated(true);
      toast.success('Welcome back!');
    } catch (error) {
      toast.error('Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      setIsAuthenticated(true);
      toast.success('Account created successfully!');
    } catch (error) {
      toast.error('Sign up failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      setIsAuthenticated(true);
      toast.success('Welcome back!');
    } catch (error) {
      toast.error('Google login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGuestLogin = () => {
    setIsAuthenticated(true);
    toast.success('Welcome, Guest!');
  };

  const handleSave = async (isAutoSave = false) => {
    setIsSaving(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newEntry = {
        id: Date.now().toString(),
        content: entry,
        date: new Date(),
        mood,
      };
      
      setSavedEntries(prev => [newEntry, ...prev]);
      setLastSaved(new Date());
      
      if (!isAutoSave) {
        toast.success('Entry saved successfully!');
        setIsNewEntry(false);
      }
    } catch (error) {
      toast.error('Failed to save entry');
    } finally {
      setIsSaving(false);
    }
  };

  const handleExport = async () => {
    try {
      const date = new Date().toLocaleDateString().replace(/\//g, '-');
      const title = `Diary Entry - ${date}`;
      const message = `${title}\n\n${entry}\n\nMood: ${mood}\nWritten on: ${date}`;
      
      await Share.share({
        message,
        title,
      });
      
      toast.success('Entry exported successfully!');
    } catch (error) {
      toast.error('Failed to export entry');
    }
  };

  if (!isAuthenticated) {
    return (
      <View style={styles.container}>
        <LinearGradient
          colors={['#4A90E2', '#357ABD']}
          style={styles.authContainer}
        >
          <View style={styles.logoContainer}>
            <Image 
              source={{ uri: 'https://api.a0.dev/assets/image?text=diary%20app%20logo%20minimalist&aspect=1:1' }}
              style={styles.logo}
            />
            <Text style={styles.appName}>AI Diary</Text>
            <Text style={styles.appTagline}>Document your journey with AI</Text>
          </View>

          <View style={styles.authForm}>
            {isSignUp && (
              <TextInput
                style={styles.authInput}
                placeholder="Full Name"
                placeholderTextColor="#999"
                value={name}
                onChangeText={setName}
              />
            )}
            <TextInput
              style={styles.authInput}
              placeholder="Email"
              placeholderTextColor="#999"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <TextInput
              style={styles.authInput}
              placeholder="Password"
              placeholderTextColor="#999"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />

            <TouchableOpacity
              style={[styles.authButton, isLoading && styles.authButtonDisabled]}
              onPress={isSignUp ? handleSignUp : handleLogin}
              disabled={isLoading}
            >
              <Text style={styles.authButtonText}>
                {isLoading ? 'Please wait...' : isSignUp ? 'Sign Up' : 'Login'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.googleButton}
              onPress={handleGoogleLogin}
              disabled={isLoading}
            >
              <AntDesign name="google" size={24} color="#DB4437" />
              <Text style={styles.googleButtonText}>Continue with Google</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.guestButton}
              onPress={handleGuestLogin}
              disabled={isLoading}
            >
              <Text style={styles.guestButtonText}>Continue as Guest</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.switchAuth}
              onPress={() => setIsSignUp(!isSignUp)}
              disabled={isLoading}
            >
              <Text style={styles.switchAuthText}>
                {isSignUp
                  ? 'Already have an account? Login'
                  : "Don't have an account? Sign Up"}
              </Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </View>
    );
  }

  if (isNewEntry) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.closeButton}
            onPress={() => setIsNewEntry(false)}
          >
            <MaterialIcons name="close" size={24} color="#666" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>New Entry</Text>
          <TouchableOpacity 
            style={[styles.actionButton, styles.saveButton]}
            onPress={() => handleSave()}
          >
            <Feather name="save" size={20} color="#2196F3" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.scrollView}>
          <View style={styles.editorHeader}>
            <Text style={styles.date}>
              {new Date().toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </Text>
            <View style={styles.headerActions}>
              <TouchableOpacity 
                style={styles.actionButton}
                onPress={handleExport}
              >
                <Feather name="download" size={20} color="#666" />
              </TouchableOpacity>
              <LinearGradient
                colors={
                  mood === 'positive' 
                    ? ['#4CAF50', '#81C784']
                    : mood === 'negative'
                      ? ['#FF5252', '#FF8A80']
                      : ['#90A4AE', '#B0BEC5']
                }
                style={styles.moodIndicator}
              >
                <Ionicons 
                  name={
                    mood === 'positive' 
                      ? 'happy' 
                      : mood === 'negative'
                        ? 'sad'
                        : 'happy'
                  } 
                  size={24} 
                  color="white" 
                />
              </LinearGradient>
            </View>
          </View>

          {isSaving && (
            <View style={styles.saveStatus}>
              <Text style={styles.saveStatusText}>Saving...</Text>
            </View>
          )}

          <View style={styles.editorContainer}>
            <TextInput
              style={styles.editor}
              multiline
              placeholder="Dear Diary..."
              value={entry}
              onChangeText={setEntry}
              textAlignVertical="top"
              fontFamily={Platform.OS === 'ios' ? 'Helvetica Neue' : 'Roboto'}
            />
          </View>

          {showAIPanel && (
            <View style={styles.aiPanel}>
              <LinearGradient
                colors={['rgba(255,255,255,0.9)', 'rgba(255,255,255,0.7)']}
                style={styles.aiPanelContent}
              >
                <Text style={styles.aiTitle}>AI Insights</Text>
                <View style={styles.aiStats}>
                  <View style={styles.aiStatItem}>
                    <Ionicons name="heart" size={24} color="#FF4081" />
                    <Text style={styles.aiStatText}>Emotional Tone</Text>
                    <Text style={styles.aiStatValue}>
                      {mood === 'positive' ? 'Positive' : mood === 'negative' ? 'Negative' : 'Neutral'}
                    </Text>
                  </View>
                  <View style={styles.aiStatItem}>
                    <Ionicons name="timer" size={24} color="#7C4DFF" />
                    <Text style={styles.aiStatText}>Reading Time</Text>
                    <Text style={styles.aiStatValue}>{Math.ceil(entry.length / 200)} min</Text>
                  </View>
                  <View style={styles.aiStatItem}>
                    <Ionicons name="analytics" size={24} color="#00BCD4" />
                    <Text style={styles.aiStatText}>Word Count</Text>
                    <Text style={styles.aiStatValue}>{entry.split(/\s+/).length}</Text>
                  </View>
                </View>
              </LinearGradient>
            </View>
          )}
        </ScrollView>

        <View style={styles.toolbar}>
          <TouchableOpacity style={styles.toolbarButton}>
            <MaterialIcons name="format-bold" size={24} color="#666" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.toolbarButton}>
            <MaterialIcons name="format-italic" size={24} color="#666" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.toolbarButton}>
            <MaterialIcons name="format-underlined" size={24} color="#666" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.toolbarButton}>
            <MaterialIcons name="format-list-bulleted" size={24} color="#666" />
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.analyzeButton, isAIAnalyzing && styles.analyzeButtonActive]}
            onPress={() => {
              setIsAIAnalyzing(true);
              setTimeout(() => {
                setMood(entry.length > 50 ? 'positive' : 'neutral');
                setIsAIAnalyzing(false);
                setShowAIPanel(true);
              }, 1500);
            }}
          >
            <Text style={styles.analyzeButtonText}>
              {isAIAnalyzing ? 'Analyzing...' : 'Analyze with AI'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {savedEntries.length > 0 ? (
        <ScrollView style={styles.entriesScroll}>
          {savedEntries.map((entry) => (
            <TouchableOpacity 
              key={entry.id}
              style={styles.entryItem}
              onPress={() => {
                setEntry(entry.content);
                setMood(entry.mood);
                setIsNewEntry(true);
              }}
            >
              <View style={styles.entryHeader}>
                <Text style={styles.entryDate}>
                  {new Date(entry.date).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </Text>
                <LinearGradient
                  colors={
                    entry.mood === 'positive' 
                      ? ['#4CAF50', '#81C784']
                      : entry.mood === 'negative'
                        ? ['#FF5252', '#FF8A80']
                        : ['#90A4AE', '#B0BEC5']
                  }
                  style={styles.entryMood}
                >
                  <Ionicons 
                    name={
                      entry.mood === 'positive' 
                        ? 'happy' 
                        : entry.mood === 'negative'
                          ? 'sad'
                          : 'happy'
                    } 
                    size={16} 
                    color="white" 
                  />
                </LinearGradient>
              </View>
              <Text style={styles.entryPreview} numberOfLines={2}>
                {entry.content}
              </Text>
              <View style={styles.entryFooter}>
                <Text style={styles.entryStats}>
                  {entry.content.split(/\s+/).length} words • {Math.ceil(entry.content.length / 200)} min read
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      ) : (
        <View style={styles.noEntries}>
          <Feather name="book" size={48} color="#666" />
          <Text style={styles.noEntriesText}>No entries yet</Text>
          <Text style={styles.noEntriesSubtext}>Start writing your thoughts...</Text>
        </View>
      )}
      
      <TouchableOpacity 
        style={styles.newEntryButton}
        onPress={() => setIsNewEntry(true)}
      >
        <MaterialIcons name="add" size={32} color="#FFF" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  authContainer: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 48,
  },
  logo: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
  },
  appName: {
    fontSize: 32,
    fontWeight: '700',
    color: '#FFF',
    marginBottom: 8,
    fontFamily: Platform.OS === 'ios' ? 'Helvetica Neue' : 'sans-serif-medium',
  },
  appTagline: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    fontFamily: Platform.OS === 'ios' ? 'Helvetica Neue' : 'sans-serif',
  },
  authForm: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  authInput: {
    backgroundColor: '#FFF',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    fontSize: 16,
    color: '#333',
    fontFamily: Platform.OS === 'ios' ? 'Helvetica Neue' : 'Roboto',
  },
  authButton: {
    backgroundColor: '#2196F3',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  authButtonDisabled: {
    opacity: 0.7,
  },
  authButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: Platform.OS === 'ios' ? 'Helvetica Neue' : 'sans-serif-medium',
  },
  googleButton: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  googleButtonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 12,
    fontFamily: Platform.OS === 'ios' ? 'Helvetica Neue' : 'sans-serif-medium',
  },
  guestButton: {
    backgroundColor: 'transparent',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  guestButtonText: {
    color: '#2196F3',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: Platform.OS === 'ios' ? 'Helvetica Neue' : 'sans-serif-medium',
  },
  switchAuth: {
    alignItems: 'center',
  },
  switchAuthText: {
    color: '#666',
    fontSize: 14,
    fontFamily: Platform.OS === 'ios' ? 'Helvetica Neue' : 'sans-serif',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    fontFamily: Platform.OS === 'ios' ? 'Helvetica Neue' : 'sans-serif-medium',
  },
  closeButton: {
    padding: 8,
  },
  editorHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFF',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  actionButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    backgroundColor: '#F0F0F0',
  },
  saveButton: {
    backgroundColor: '#E3F2FD',
  },
  date: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    fontFamily: Platform.OS === 'ios' ? 'Helvetica Neue' : 'sans-serif-medium',
  },
  saveStatus: {
    padding: 8,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  saveStatusText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    fontFamily: Platform.OS === 'ios' ? 'Helvetica Neue' : 'sans-serif',
  },
  moodIndicator: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  editorContainer: {
    margin: 16,
    backgroundColor: '#FFF',
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  editor: {
    minHeight: 200,
    padding: 16,
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
    fontFamily: Platform.OS === 'ios' ? 'Helvetica Neue' : 'Roboto',
  },
  toolbar: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#FFF',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    alignItems: 'center',
  },
  toolbarButton: {
    marginRight: 16,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    backgroundColor: '#F0F0F0',
  },
  analyzeButton: {
    flex: 1,
    backgroundColor: '#2196F3',
    paddingVertical: 12,
    borderRadius: 24,
    alignItems: 'center',
  },
  analyzeButtonActive: {
    backgroundColor: '#1976D2',
  },
  analyzeButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: Platform.OS === 'ios' ? 'Helvetica Neue' : 'sans-serif-medium',
  },
  aiPanel: {
    margin: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  aiPanelContent: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
  },
  aiTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
    fontFamily: Platform.OS === 'ios' ? 'Helvetica Neue' : 'sans-serif-medium',
  },
  aiStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  aiStatItem: {
    alignItems: 'center',
    flex: 1,
  },
  aiStatText: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
    fontFamily: Platform.OS === 'ios' ? 'Helvetica Neue' : 'sans-serif',
  },
  aiStatValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginTop: 2,
    fontFamily: Platform.OS === 'ios' ? 'Helvetica Neue' : 'sans-serif-medium',
  },
  newEntryButton: {
    position: 'absolute',
    bottom: 24,
    alignSelf: 'center',
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#2196F3',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  entriesScroll: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  entryItem: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    marginHorizontal: 16,
    marginTop: 16,
  },
  entryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  entryDate: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
    fontFamily: Platform.OS === 'ios' ? 'Helvetica Neue' : 'sans-serif-medium',
  },
  entryMood: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  entryPreview: {
    fontSize: 14,
    color:
