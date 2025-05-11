import React from 'react';
import {
    View,
    Text,
    Image,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    useWindowDimensions,
    Platform,
    KeyboardAvoidingView
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS } from '../components/themes/Colors';
import { theme } from '../components/themes/Theme';

export default function HomeScreen() {
    const { width } = useWindowDimensions();
    const isWeb = Platform.OS === 'web';

    const features = [
        {
            icon: 'store',
            title: 'Gestión de Inventario',
            description: 'Controla tu inventario de manera eficiente y en tiempo real'
        },
        {
            icon: 'trending-up',
            title: 'Análisis de Ventas',
            description: 'Visualiza el rendimiento de tu negocio con estadísticas detalladas'
        },
        {
            icon: 'people',
            title: 'Gestión de Clientes',
            description: 'Mantén un registro de tus clientes y sus preferencias'
        }
    ];

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{ flex: 1 }}
        >
            <View style={[styles.mainContainer, theme.container]}>

                <ScrollView style={styles.scrollView}
                    contentContainerStyle={styles.scrollViewContent}>
                    {/* Hero Section */}
                    <View style={styles.heroSection}>
                        <Image
                            source={{ uri: 'https://img.freepik.com/free-photo/small-business-owner-with-tablet_23-2149049669.jpg' }}
                            style={styles.heroImage}
                            resizeMode="cover"
                        />
                        <View style={styles.heroOverlay}>
                            <Text style={styles.heroTitle}>Impulsa tu Micronegocio</Text>
                            <Text style={styles.heroSubtitle}>
                                Gestiona tu inventario, ventas y clientes de manera eficiente
                            </Text>
                        </View>
                    </View>

                    {/* Features Section */}
                    <View style={[styles.section, styles.featuresContainer]}>
                        {features.map((feature, index) => (
                            <View key={index} style={styles.featureCard}>
                                <MaterialIcons name={feature.icon} size={40} color={COLORS.PRIMARY} />
                                <Text style={styles.featureTitle}>{feature.title}</Text>
                                <Text style={styles.featureDescription}>{feature.description}</Text>
                            </View>
                        ))}
                    </View>

                    {/* About Section */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>¿Por qué elegirnos?</Text>
                        <Image
                            source={{ uri: 'https://img.freepik.com/free-photo/business-people-discussing-charts_23-2148473260.jpg' }}
                            style={styles.sectionImage}
                            resizeMode="cover"
                        />
                        <Text style={styles.sectionText}>
                            Nuestra plataforma está diseñada específicamente para micronegocios,
                            ofreciendo herramientas intuitivas y efectivas para ayudarte a crecer.
                        </Text>
                    </View>

                    {/* Call to Action */}
                    <View style={styles.ctaSection}>
                        <Text style={styles.ctaTitle}>¿Listo para empezar?</Text>
                        <TouchableOpacity style={styles.ctaButton}>
                            <Text style={styles.ctaButtonText}>Comenzar Ahora</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>

            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: COLORS.BACKGROUND,
        ...Platform.select({
            web: {
                overflow: 'auto',
                height: '100vh',
            }
        })
    },
    scrollView: {
        flex: 1,
        width: '100%',
    },
    scrollViewContent: {
        flexGrow: 1,
        ...Platform.select({
            web: {
                minHeight: '100%',
            }
        })
    },
    container: {
        flex: 1,
        backgroundColor: COLORS.BACKGROUND,
    },
    heroSection: {
        height: Platform.OS === 'web' ? '80vh' : 400,
        position: 'relative',
        width: '100%',
    },
    heroImage: {
        width: '100%',
        height: '100%',
        ...Platform.select({
            web: {
                objectFit: 'cover',
            }
        })
    },
    heroOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    heroTitle: {
        fontSize: 36,
        fontWeight: 'bold',
        color: COLORS.BLANCO,
        textAlign: 'center',
        marginBottom: 10,
    },
    heroSubtitle: {
        fontSize: 18,
        color: COLORS.BLANCO,
        textAlign: 'center',
    },
    section: {
        padding: 20,
        width: '100%',
        ...Platform.select({
            web: {
                maxWidth: 1200,
                alignSelf: 'center',
            }
        })
    },
    featuresContainer: {
        flexDirection: Platform.OS === 'web' ? 'row' : 'column',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        alignItems: 'center',
        ...Platform.select({
            web: {
                maxWidth: 1200,
                marginLeft: 'auto',
                marginRight: 'auto',
            }
        })
    },
    featureCard: {
        width: Platform.OS === 'web' ? '30%' : '90%',
        backgroundColor: COLORS.BLANCO,
        padding: 20,
        marginVertical: 10,
        borderRadius: 10,
        alignItems: 'center',
        ...Platform.select({
            web: {
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            },
            default: {
                elevation: 3,
            },
        }),
    },
    featureTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: COLORS.TEXT,
        marginVertical: 10,
    },
    featureDescription: {
        fontSize: 16,
        color: COLORS.SECONDARY,
        textAlign: 'center',
    },
    sectionTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: COLORS.TEXT,
        marginBottom: 20,
        textAlign: 'center',
    },
    sectionImage: {
        width: '100%',
        height: 300,
        borderRadius: 10,
        marginVertical: 20,
    },
    sectionText: {
        fontSize: 16,
        color: COLORS.SECONDARY,
        lineHeight: 24,
        textAlign: 'center',
    },
    ctaSection: {
        padding: 40,
        backgroundColor: COLORS.PRIMARY,
        alignItems: 'center',
    },
    ctaTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: COLORS.BLANCO,
        marginBottom: 20,
    },
    ctaButton: {
        backgroundColor: COLORS.BLANCO,
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 25,
    },
    ctaButtonText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.PRIMARY,
    },
});