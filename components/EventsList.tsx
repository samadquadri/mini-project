import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Clock, MapPin, Users } from 'lucide-react-native';

interface EventsListProps {
  selectedDate: Date;
}

export function EventsList({ selectedDate }: EventsListProps) {
  // Mock events for the selected date
  const events = [
    {
      id: 1,
      title: 'Team Standup',
      time: '9:00 AM - 9:30 AM',
      location: 'Conference Room A',
      attendees: 5,
      color: '#3B82F6',
    },
    {
      id: 2,
      title: 'Client Presentation',
      time: '2:00 PM - 3:00 PM',
      location: 'Virtual Meeting',
      attendees: 8,
      color: '#8B5CF6',
    },
    {
      id: 3,
      title: 'Project Review',
      time: '4:00 PM - 5:00 PM',
      location: 'Main Office',
      attendees: 3,
      color: '#10B981',
    },
  ];

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Events for {formatDate(selectedDate)}</Text>
      
      <ScrollView style={styles.eventsList} showsVerticalScrollIndicator={false}>
        {events.length > 0 ? (
          events.map((event) => (
            <View key={event.id} style={styles.eventItem}>
              <View style={[styles.colorBar, { backgroundColor: event.color }]} />
              
              <View style={styles.eventContent}>
                <Text style={styles.eventTitle}>{event.title}</Text>
                
                <View style={styles.eventDetails}>
                  <View style={styles.detailRow}>
                    <Clock size={14} color="#6B7280" />
                    <Text style={styles.detailText}>{event.time}</Text>
                  </View>
                  
                  <View style={styles.detailRow}>
                    <MapPin size={14} color="#6B7280" />
                    <Text style={styles.detailText}>{event.location}</Text>
                  </View>
                  
                  <View style={styles.detailRow}>
                    <Users size={14} color="#6B7280" />
                    <Text style={styles.detailText}>{event.attendees} attendees</Text>
                  </View>
                </View>
              </View>
            </View>
          ))
        ) : (
          <View style={styles.noEvents}>
            <Text style={styles.noEventsText}>No events scheduled for this day</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
  },
  eventsList: {
    flex: 1,
  },
  eventItem: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  colorBar: {
    width: 4,
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
  },
  eventContent: {
    flex: 1,
    padding: 16,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  eventDetails: {
    gap: 4,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  detailText: {
    fontSize: 14,
    color: '#6B7280',
  },
  noEvents: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 32,
    alignItems: 'center',
  },
  noEventsText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
  },
});