import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Play, Pause, Square, RotateCcw, Plus } from 'lucide-react-native';
import { CircularProgress } from '@/components/CircularProgress';
import { TimerControls } from '@/components/TimerControls';
import { TaskSelector } from '@/components/TaskSelector';
import { SessionComplete } from '@/components/SessionComplete';

const { width, height } = Dimensions.get('window');

interface Task {
  id: string;
  title: string;
  estimatedTime: number;
  completed: boolean;
}

export default function TimerScreen() {
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes in seconds
  const [initialTime, setInitialTime] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [showTaskSelector, setShowTaskSelector] = useState(false);
  const [showSessionComplete, setShowSessionComplete] = useState(false);
  const [sessionType, setSessionType] = useState<'work' | 'break'>('work');
  const [completedSessions, setCompletedSessions] = useState(0);
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const tasks: Task[] = [
    { id: '1', title: 'Complete project proposal', estimatedTime: 45, completed: false },
    { id: '2', title: 'Review code changes', estimatedTime: 30, completed: false },
    { id: '3', title: 'Design system updates', estimatedTime: 60, completed: false },
    { id: '4', title: 'Team meeting preparation', estimatedTime: 20, completed: false },
  ];

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            setShowSessionComplete(true);
            setCompletedSessions(prev => prev + 1);
            
            // Trigger haptic feedback on mobile
            if (Platform.OS !== 'web') {
              // Would use Haptics.impactAsync() here
            }
            
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePlayPause = () => {
    setIsRunning(!isRunning);
  };

  const handleStop = () => {
    setIsRunning(false);
    setTimeLeft(initialTime);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(initialTime);
  };

  const setTimer = (minutes: number) => {
    const seconds = minutes * 60;
    setTimeLeft(seconds);
    setInitialTime(seconds);
    setIsRunning(false);
  };

  const progress = initialTime > 0 ? (initialTime - timeLeft) / initialTime : 0;

  const handleSessionComplete = () => {
    setShowSessionComplete(false);
    
    // Switch between work and break sessions
    if (sessionType === 'work') {
      setSessionType('break');
      setTimer(5); // 5 minute break
    } else {
      setSessionType('work');
      setTimer(25); // 25 minute work session
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={sessionType === 'work' ? ['#6366F1', '#8B5CF6'] : ['#10B981', '#059669']}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.header}>
          <Text style={styles.sessionType}>
            {sessionType === 'work' ? 'Focus Time' : 'Break Time'}
          </Text>
          <Text style={styles.sessionCount}>
            Session {completedSessions + 1}
          </Text>
        </View>

        <View style={styles.timerContainer}>
          <CircularProgress
            size={280}
            strokeWidth={8}
            progress={progress}
            color="#FFFFFF"
            backgroundColor="rgba(255, 255, 255, 0.2)"
          >
            <View style={styles.timerContent}>
              <Text style={styles.timeDisplay}>{formatTime(timeLeft)}</Text>
              {selectedTask && (
                <Text style={styles.taskTitle} numberOfLines={2}>
                  {selectedTask.title}
                </Text>
              )}
            </View>
          </CircularProgress>
        </View>

        <View style={styles.controls}>
          <TouchableOpacity
            style={[styles.controlButton, styles.secondaryButton]}
            onPress={handleReset}
          >
            <RotateCcw size={24} color="#FFFFFF" />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.controlButton, styles.primaryButton]}
            onPress={handlePlayPause}
          >
            {isRunning ? (
              <Pause size={32} color="#FFFFFF" />
            ) : (
              <Play size={32} color="#FFFFFF" />
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.controlButton, styles.secondaryButton]}
            onPress={handleStop}
          >
            <Square size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {!selectedTask && sessionType === 'work' && (
          <TouchableOpacity
            style={styles.selectTaskButton}
            onPress={() => setShowTaskSelector(true)}
          >
            <Plus size={20} color="#FFFFFF" />
            <Text style={styles.selectTaskText}>Select a task to focus on</Text>
          </TouchableOpacity>
        )}
      </LinearGradient>

      <TimerControls onSetTimer={setTimer} currentTime={initialTime} />

      <TaskSelector
        visible={showTaskSelector}
        tasks={tasks}
        onSelectTask={(task) => {
          setSelectedTask(task);
          setShowTaskSelector(false);
        }}
        onClose={() => setShowTaskSelector(false)}
      />

      <SessionComplete
        visible={showSessionComplete}
        sessionType={sessionType}
        onContinue={handleSessionComplete}
        onClose={() => setShowSessionComplete(false)}
        task={selectedTask}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  gradient: {
    flex: 1,
    paddingTop: 60,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  sessionType: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  sessionCount: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  timerContainer: {
    alignItems: 'center',
    marginBottom: 60,
  },
  timerContent: {
    alignItems: 'center',
  },
  timeDisplay: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  taskTitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    maxWidth: 200,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 24,
    marginBottom: 40,
  },
  controlButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  primaryButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  secondaryButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  selectTaskButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    marginHorizontal: 40,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    gap: 8,
  },
  selectTaskText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});