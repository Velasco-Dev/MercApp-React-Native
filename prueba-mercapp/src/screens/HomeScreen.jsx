import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    Image,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    useWindowDimensions,
    Platform, Modal
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS } from '../components/themes/Colors';
import { theme } from '../components/themes/Theme';
import Footer from '../components/common/Footer';

import AsyncStorage from '@react-native-async-storage/async-storage';

// En el componente React donde necesites interactuar con la base de datos
import { ref, onValue, set, push, getDatabase, onChildAdded, onChildChanged, onChildRemoved } from 'firebase/database';
import { dbConfig } from '../services/config/firebase/firebase.config'; // Asegúrate de que la ruta sea correcta

import CustomAlert from '../components/common/CustomAlert';

import { useNotification } from '../context/NotificationContext';

export default function HomeScreen() {
    const { width } = useWindowDimensions();
    const isWeb = Platform.OS === 'web';
    const isLargeScreen = width > 768; // Tablet/Web breakpoint

    const [modalVisible, setModalVisible] = useState(false);
    const [selectedOption, setSelectedOption] = useState(null);

    const [alertVisible, setAlertVisible] = useState(false);
    const [alertTitle, setAlertTitle] = useState('');
    const [alertMessage, setAlertMessage] = useState('');
    const [alertStatus, setAlertStatus] = useState('loading'); // 'loading' | 'success' | 'error'


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

    const options = [
        { id: 1, label: 'Administrador', value: 'administrador' },
        { id: 2, label: 'Microempresario', value: 'microempresario' },
        { id: 3, label: 'Vendedor', value: 'vendedor' },
    ];

    const { addNotification } = useNotification();
    const [notificaciones, setNotificaciones] = useState([]); // Estado para la lista de notificaciones
    const db = getDatabase();

    useEffect(() => {
        setAlertTitle('Usuario');
        // Ejecutar solo al montar el componente
        addNotification({
            message: "Bienvenido Usuario",
        });

        const notificacionesRef = ref(db, 'notificaciones-rol-respuesta');

        let currentUserId = null;

        AsyncStorage.getItem('idPersona').then((id) => {

            currentUserId = id;

            const onChildAddedListener = onChildAdded(notificacionesRef, (snapshot) => {
                const nuevaNotificacion = {
                    id: snapshot.key,
                    ...snapshot.val()
                };

                console.log("Respuesta notificación:", nuevaNotificacion);

                if (nuevaNotificacion.userId === currentUserId) {
                    addNotification({
                        message: `${String(nuevaNotificacion.rol).toUpperCase().trim()}, su solicitud fue aceptada ${nuevaNotificacion.timestamp} Cierra sesión e inicia nuevamente con tus mismas credenciales.`
                    });

                    setNotificaciones(prev => [...prev, nuevaNotificacion]);
                }
            });

            return () => {
                onChildAddedListener();
            };
        });

    }, []);

    const PushAdminNotification = async (option) => {

        setSelectedOption(option);
        setModalVisible(false);

        try {
            const value = await AsyncStorage.getItem('idPersona');
            console.log(value)

            // Añadir un nuevo elemento a una lista (push genera una clave única)
            const postsRef = ref(db, 'notificaciones-rol');
            const newPostRef = push(postsRef); // Genera una nueva clave única en /posts
            const timestamp = new Date().toLocaleString('es-CO');

            set(newPostRef, {
                titulo: 'Cambio de Rol',
                rol: option.value,
                userId: value,
                timestamp: timestamp // Usa el tiempo del servidor
            })
                .then(() => {

                    setAlertStatus('success');
                    setAlertMessage('Solicitud enviada exitosamente');
                    console.log('Nuevo post añadido con clave:', newPostRef.key);

                }).catch((error) => {

                    setAlertStatus('error');
                    setAlertMessage('Error al enviar la solicitud');
                    console.error('Error al añadir post:', error);

                });

        } catch (error) {
            console.error('Error al enviar datos:', error);
        }
    }

    return (
        <View style={[styles.mainContainer, theme.container]}>
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={isWeb}
            >
                {/* Hero Banner */}
                <View style={styles.heroContainer}>
                    <Image
                        source={require('../../assets/b-registro.webp')}
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
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Nuestras Funcionalidades</Text>
                    <View style={[styles.featuresGrid, isLargeScreen && { flexDirection: 'row' }]}>
                        {features.map((feature, index) => (
                            <View
                                key={index}
                                style={[
                                    styles.featureCard,
                                    isLargeScreen && { width: '30%', marginHorizontal: '1.5%' }
                                ]}
                            >
                                <MaterialIcons
                                    name={feature.icon}
                                    size={isLargeScreen ? 50 : 40}
                                    color={COLORS.PRIMARY}
                                />
                                <Text style={styles.featureTitle}>{feature.title}</Text>
                                <Text style={styles.featureDescription}>{feature.description}</Text>
                            </View>
                        ))}
                    </View>
                </View>

                {/* About Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>¿Por qué elegirnos?</Text>
                    <View style={isLargeScreen ? styles.aboutContentWeb : styles.aboutContentMobile}>
                        <Image
                            source={{ uri: 'https://images.unsplash.com/photo-1550989460-0adf9ea622e2?q=80&w=1287&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' }}
                            style={isLargeScreen ? styles.aboutImageWeb : styles.aboutImageMobile}
                            resizeMode="cover"
                        />
                        <Text style={styles.aboutText}>
                            Nuestra plataforma está diseñada específicamente para micronegocios,
                            ofreciendo herramientas intuitivas y efectivas para ayudarte a crecer.
                            Con soporte multiplataforma que funciona perfectamente en cualquier dispositivo.
                        </Text>
                    </View>
                </View>

                {/* CTA Section */}
                <View style={styles.ctaSection}>
                    <Text style={styles.ctaTitle}>¿Listo para empezar?</Text>
                    <TouchableOpacity
                        onPress={() => setModalVisible(true)}
                        style={styles.ctaButton}>
                        <Text style={styles.ctaButtonText}>Comenzar Ahora</Text>
                    </TouchableOpacity>
                </View>

                <Footer />

            </ScrollView>
            <Modal
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <TouchableOpacity
                    style={styles.modalOverlay}
                    activeOpacity={1}
                    onPressOut={() => setModalVisible(false)}
                >
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Solicita un Rol</Text>
                        {options.map((option) => (
                            <TouchableOpacity
                                key={option.id}
                                style={styles.optionButton}
                                onPress={() => {
                                    setAlertVisible(true)
                                    PushAdminNotification(option)
                                }}
                            >
                                <Text style={styles.optionText}>{option.label}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </TouchableOpacity>
            </Modal>

            <CustomAlert
                visible={alertVisible}
                status={alertStatus}
                title={alertTitle}
                message={alertMessage}
                onClose={() => {
                    if (alertStatus !== 'loading') {
                        setAlertVisible(false);
                    } // Solo resetear si no está cargando
                }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    modalTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
        color: COLORS.TEXT,
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
        backgroundColor: 'white',
        borderRadius: 8,
        padding: 20,
        width: '80%',
    },
    optionButton: {
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    optionText: {
        fontSize: 16,
    },
    mainContainer: {
        flex: 1,
        backgroundColor: COLORS.BACKGROUND,
    },
    scrollView: {
        flex: 1,
        width: '100%',
    },
    scrollContent: {
        flexGrow: 1,
    },
    heroContainer: {
        height: Platform.select({ web: '80vh', default: 400 }),
        width: '100%',
        position: 'relative',
    },
    heroImage: {
        width: '100%',
        height: '100%',
        ...Platform.select({
            web: { objectFit: 'cover' },
            default: { resizeMode: 'cover' }
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
        fontSize: Platform.select({ web: 48, default: 36 }),
        fontWeight: 'bold',
        color: COLORS.BLANCO,
        textAlign: 'center',
        marginBottom: 10,
    },
    heroSubtitle: {
        fontSize: Platform.select({ web: 24, default: 18 }),
        color: COLORS.BLANCO,
        textAlign: 'center',
        maxWidth: 600,
    },
    section: {
        padding: 20,
        width: '100%',
        maxWidth: 1200,
        alignSelf: 'center',
    },
    sectionTitle: {
        fontSize: Platform.select({ web: 36, default: 28 }),
        fontWeight: 'bold',
        color: COLORS.TEXT,
        marginBottom: 20,
        textAlign: 'center',
    },
    featuresGrid: {
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    featureCard: {
        backgroundColor: COLORS.BLANCO,
        padding: 20,
        marginVertical: 10,
        borderRadius: 10,
        alignItems: 'center',
        width: '100%',
        ...Platform.select({
            web: {
                boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
            },
            default: {
                elevation: 5,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
            },
        }),
    },
    featureTitle: {
        fontSize: Platform.select({ web: 24, default: 20 }),
        fontWeight: 'bold',
        color: COLORS.TEXT,
        marginVertical: 10,
        textAlign: 'center',
    },
    featureDescription: {
        fontSize: Platform.select({ web: 18, default: 16 }),
        color: COLORS.SECONDARY,
        textAlign: 'center',
    },
    aboutContentWeb: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    aboutContentMobile: {
        alignItems: 'center',
    },
    aboutImageWeb: {
        width: '48%',
        height: 300,
        borderRadius: 10,
    },
    aboutImageMobile: {
        width: '100%',
        height: 200,
        borderRadius: 10,
        marginBottom: 20,
    },
    aboutText: {
        fontSize: Platform.select({ web: 18, default: 16 }),
        color: COLORS.SECONDARY,
        lineHeight: Platform.select({ web: 28, default: 24 }),
        textAlign: 'center',
        ...Platform.select({
            web: {
                width: '48%',
                textAlign: 'left',
            },
            default: {
                width: '100%',
            }
        })
    },
    ctaSection: {
        padding: 40,
        backgroundColor: COLORS.PRIMARY,
        alignItems: 'center',
        marginTop: 20,
    },
    ctaTitle: {
        fontSize: Platform.select({ web: 32, default: 24 }),
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
        fontSize: Platform.select({ web: 20, default: 18 }),
        fontWeight: 'bold',
        color: COLORS.PRIMARY,
    },
});