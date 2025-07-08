import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';

interface CalendarViewProps {
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
  viewMode: string;
}

const { width } = Dimensions.get('window');

export function CalendarView({ selectedDate, onDateSelect, viewMode }: CalendarViewProps) {
  if (viewMode === 'month') {
    return <MonthView selectedDate={selectedDate} onDateSelect={onDateSelect} />;
  }
  
  return (
    <View style={styles.container}>
      <Text style={styles.placeholder}>
        {viewMode.charAt(0).toUpperCase() + viewMode.slice(1)} view coming soon
      </Text>
    </View>
  );
}

function MonthView({ selectedDate, onDateSelect }: { selectedDate: Date; onDateSelect: (date: Date) => void }) {
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const today = new Date();
  
  // Get first day of the month
  const firstDay = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1);
  const lastDay = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0);
  
  // Get starting day of week
  const startingDay = firstDay.getDay();
  const daysInMonth = lastDay.getDate();
  
  // Create calendar grid
  const calendarDays = [];
  
  // Empty cells for days before the month starts
  for (let i = 0; i < startingDay; i++) {
    calendarDays.push(null);
  }
  
  // Days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day);
  }

  const isToday = (day: number) => {
    return today.getDate() === day &&
           today.getMonth() === selectedDate.getMonth() &&
           today.getFullYear() === selectedDate.getFullYear();
  };

  const isSelected = (day: number) => {
    return selectedDate.getDate() === day;
  };

  const hasEvent = (day: number) => {
    // Mock events for demo
    return [5, 12, 18, 25].includes(day);
  };

  return (
    <View style={styles.container}>
      {/* Days of week header */}
      <View style={styles.weekHeader}>
        {daysOfWeek.map((day) => (
          <Text key={day} style={styles.weekDay}>
            {day}
          </Text>
        ))}
      </View>

      {/* Calendar grid */}
      <View style={styles.calendarGrid}>
        {calendarDays.map((day, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.dayCell,
              day && isToday(day) && styles.todayCell,
              day && isSelected(day) && styles.selectedCell,
            ]}
            onPress={() => {
              if (day) {
                const newDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), day);
                onDateSelect(newDate);
              }
            }}
            disabled={!day}
          >
            {day && (
              <>
                <Text style={[
                  styles.dayText,
                  isToday(day) && styles.todayText,
                  isSelected(day) && styles.selectedText,
                ]}>
                  {day}
                </Text>
                {hasEvent(day) && <View style={styles.eventDot} />}
              </>
            )}
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    padding: 20,
  },
  placeholder: {
    textAlign: 'center',
    fontSize: 16,
    color: '#6B7280',
    padding: 40,
  },
  weekHeader: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  weekDay: {
    flex: 1,
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
    paddingVertical: 8,
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayCell: {
    width: width / 7 - 6,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 1,
    borderRadius: 8,
    position: 'relative',
  },
  todayCell: {
    backgroundColor: '#FEF3C7',
  },
  selectedCell: {
    backgroundColor: '#3B82F6',
  },
  dayText: {
    fontSize: 16,
    color: '#1F2937',
  },
  todayText: {
    color: '#F59E0B',
    fontWeight: '600',
  },
  selectedText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  eventDot: {
    position: 'absolute',
    bottom: 4,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#EF4444',
  },
});