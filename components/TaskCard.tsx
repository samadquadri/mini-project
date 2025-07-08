import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { CircleCheck as CheckCircle, Circle, Clock, Play, Flag } from 'lucide-react-native';

interface Task {
  id: string;
  title: string;
  description?: string;
  estimatedTime: number;
  timeSpent: number;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  category: string;
  createdAt: Date;
}

interface TaskCardProps {
  task: Task;
  onToggleComplete: (taskId: string) => void;
  onStartTimer: () => void;
}

export function TaskCard({ task, onToggleComplete, onStartTimer }: TaskCardProps) {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return '#EF4444';
      case 'medium':
        return '#F59E0B';
      case 'low':
        return '#10B981';
      default:
        return '#6B7280';
    }
  };

  const getProgressPercentage = () => {
    if (task.estimatedTime === 0) return 0;
    return Math.min((task.timeSpent / task.estimatedTime) * 100, 100);
  };

  return (
    <View style={[styles.container, task.completed && styles.completedContainer]}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.checkbox}
          onPress={() => onToggleComplete(task.id)}
        >
          {task.completed ? (
            <CheckCircle size={24} color="#10B981" />
          ) : (
            <Circle size={24} color="#D1D5DB" />
          )}
        </TouchableOpacity>

        <View style={styles.content}>
          <Text style={[styles.title, task.completed && styles.completedTitle]}>
            {task.title}
          </Text>
          {task.description && (
            <Text style={[styles.description, task.completed && styles.completedText]}>
              {task.description}
            </Text>
          )}
        </View>

        {!task.completed && (
          <TouchableOpacity style={styles.playButton} onPress={onStartTimer}>
            <Play size={16} color="#6366F1" />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.footer}>
        <View style={styles.meta}>
          <View style={styles.priority}>
            <Flag size={12} color={getPriorityColor(task.priority)} />
            <Text style={[styles.priorityText, { color: getPriorityColor(task.priority) }]}>
              {task.priority}
            </Text>
          </View>

          <Text style={styles.category}>{task.category}</Text>

          <View style={styles.timeInfo}>
            <Clock size={12} color="#6B7280" />
            <Text style={styles.timeText}>
              {task.timeSpent}m / {task.estimatedTime}m
            </Text>
          </View>
        </View>

        {!task.completed && (
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill, 
                  { width: `${getProgressPercentage()}%` }
                ]} 
              />
            </View>
            <Text style={styles.progressText}>
              {Math.round(getProgressPercentage())}%
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  completedContainer: {
    opacity: 0.7,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  checkbox: {
    marginRight: 12,
    marginTop: 2,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  completedTitle: {
    textDecorationLine: 'line-through',
    color: '#9CA3AF',
  },
  description: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  completedText: {
    color: '#9CA3AF',
  },
  playButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footer: {
    gap: 8,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  priority: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  priorityText: {
    fontSize: 12,
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  category: {
    fontSize: 12,
    color: '#6B7280',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  timeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  timeText: {
    fontSize: 12,
    color: '#6B7280',
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  progressBar: {
    flex: 1,
    height: 4,
    backgroundColor: '#E5E7EB',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#6366F1',
    borderRadius: 2,
  },
  progressText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
    minWidth: 32,
    textAlign: 'right',
  },
});