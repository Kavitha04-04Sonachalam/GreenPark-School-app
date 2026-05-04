import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  Image, 
  Dimensions,
  Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

const AboutScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();

  const sections = [
    {
      title: 'About School',
      icon: 'school-outline',
      content: [
        <Text key="p1">
          <Text style={styles.highlightText}>Green Park Matriculation Higher Secondary School</Text> is a leading institution committed to <Text style={styles.highlightText}>academic excellence, holistic development, and strong ethical values</Text>.
        </Text>,
        <Text key="p2">
          Established in <Text style={styles.highlightText}>2012</Text> as a Nursery & Primary School in Ayilur, the institution expanded into a full-fledged <Text style={styles.highlightText}>Higher Secondary School in 2016</Text> under the guidance of the <Text style={styles.highlightText}>Muthaiya Educational Trust</Text>.
        </Text>,
        <Text key="p3">
          Located in Siruvachur, Perambalur, the school provides education from <Text style={styles.highlightText}>Pre-Primary to Grade 12</Text>, creating a nurturing environment where students are encouraged to learn, grow, and excel.
        </Text>,
        <Text key="p4">
          At Green Park, education goes beyond academics — it is a transformative journey that shapes responsible, confident, and globally aware individuals rooted in <Text style={styles.highlightText}>Indian values</Text>.
        </Text>
      ]
    },
    {
      title: 'Vision',
      icon: 'eye-outline',
      content: 'Education is the foundation of character and integrity. We aim to nurture students with strong moral and social values, enabling them to make responsible decisions and contribute positively to society.'
    },
    {
      title: 'Mission',
      icon: 'rocket-outline',
      content: 'To provide quality education that develops intellectually capable, socially responsible, and globally competent individuals grounded in Indian culture and traditions.'
    },
    {
      title: 'Motto',
      icon: 'ribbon-outline',
      content: 'The pursuit of knowledge and excellence is a lifelong journey.'
    }
  ];

  return (
    <View style={styles.container}>
      {/* Custom Header */}
      <View style={[styles.header, { paddingTop: insets.top + (Platform.OS === 'ios' ? 0 : 10) }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={26} color="#ffffff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>About Us</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Logo Section */}
        <View style={styles.logoContainer}>
          <Image 
            source={require('../../assets/images/round.png')} 
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        {/* Content Sections */}
        {sections.map((section, index) => (
          <View key={index} style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={styles.iconContainer}>
                <Ionicons name={section.icon} size={24} color="#2e7d32" />
              </View>
              <Text style={styles.cardTitle}>{section.title}</Text>
            </View>
            <View style={styles.cardBody}>
              {Array.isArray(section.content) ? (
                section.content.map((para, pIndex) => (
                  <View key={pIndex} style={{ marginBottom: pIndex === section.content.length - 1 ? 0 : 12 }}>
                    <Text style={styles.cardText}>
                      {para}
                    </Text>
                  </View>
                ))
              ) : (
                <Text style={styles.cardText}>{section.content}</Text>
              )}
            </View>
          </View>
        ))}
        
        {/* Footer spacing */}
        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fdf9', // Very light green background
  },
  header: {
    backgroundColor: '#2e7d32',
    height: Platform.OS === 'ios' ? 100 : 100,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '700',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 15,
    marginBottom: 25,
  },
  logo: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#fff',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  iconContainer: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: '#e8f5e9',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1b5e20',
  },
  cardBody: {
    paddingLeft: 2,
  },
  cardText: {
    fontSize: 15,
    color: '#444',
    lineHeight: 24, // Consistent spacing (approx 1.6)
    textAlign: 'left',
  },
  highlightText: {
    fontWeight: 'bold',
    color: '#1b5e20', // Dark green for emphasis
  },
});

export default AboutScreen;
