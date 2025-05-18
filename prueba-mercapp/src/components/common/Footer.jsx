import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking, Platform, Image } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import Entypo from '@expo/vector-icons/Entypo';
import { COLORS } from '../themes/Colors';
import { theme } from '../themes/Theme';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <View style={[styles.footerContainer, theme.container]}>
            <View style={styles.footerContent}>
                {/* Sección de información de la empresa */}
                <View style={styles.footerSection}>
                    <Image
                        source={require('../../../assets/icon.png')}
                        style={styles.logo}
                        resizeMode="contain"
                    />
                    {/* <Text style={styles.footerTitle}>MercApp</Text> */}
                    <Text style={styles.footerText}>
                        Tu solución integral para la gestión de micronegocios
                    </Text>
                    <View style={styles.socialIcons}>
                        <TouchableOpacity onPress={() => Linking.openURL('https://facebook.com')}>
                            <MaterialIcons name="facebook" size={26} color={COLORS.BLANCO} style={styles.icon} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => Linking.openURL('https://twitter.com')}>
                            <Entypo name="twitter-with-circle" size={24} color={COLORS.BLANCO} style={styles.icon} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => Linking.openURL('https://instagram.com')}>
                            <Entypo name="instagram-with-circle" size={24} color={COLORS.BLANCO} style={styles.icon} />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Sección de enlaces rápidos */}
                <View style={styles.footerSection}>
                    <Text style={styles.footerTitle}>Enlaces Rápidos</Text>
                    <TouchableOpacity style={styles.link}>
                        <Text style={styles.footerText}>Sobre nosotros</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.link}>
                        <Text style={styles.footerText}>Características</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.link}>
                        <Text style={styles.footerText}>Precios</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.link}>
                        <Text style={styles.footerText}>Contacto</Text>
                    </TouchableOpacity>
                </View>

                {/* Sección de contacto */}
                <View style={styles.footerSection}>
                    <Text style={styles.footerTitle}>Contacto</Text>
                    <Text style={styles.footerText}>
                        <MaterialIcons name="email" size={16} color={COLORS.BLANCO} /> info@mercapp.com
                    </Text>
                    <Text style={styles.footerText}>
                        <MaterialIcons name="phone" size={16} color={COLORS.BLANCO} /> +57 300 123 4567
                    </Text>
                    <Text style={styles.footerText}>
                        <MaterialIcons name="location-on" size={16} color={COLORS.BLANCO} /> Popayán, Cauca, Colombia
                    </Text>
                </View>
            </View>

            {/* Copyright */}
            <View style={styles.copyright}>
                <Text style={styles.copyrightText}>
                    © {currentYear} MercApp. Todos los derechos reservados
                </Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    footerContainer: {
        backgroundColor: COLORS.PRIMARY,
        padding: 20,
        // marginTop: 40,

    },
    footerContent: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        flexWrap: 'wrap',
        maxWidth: 1200,
        alignSelf: 'center',
        width: '100%',
    },
    footerSection: {
        width: Platform.OS === 'web' ? '30%' : '100%',
        // marginBottom: 20,
    },
    footerTitle: {
        ...theme.typography.h2,
        color: COLORS.BLANCO,
        marginBottom: 15,
    },
    footerText: {
        ...theme.typography.body,
        color: COLORS.BLANCO,
        marginVertical: 5,
    },
    socialIcons: {
        flexDirection: 'row',
        marginTop: 10,
        justifyContent: 'space-evenly'
    },
    icon: {
        marginRight: 15,
    },
    link: {
        marginVertical: 5,
    },
    copyright: {
        borderTopWidth: 1,
        borderTopColor: COLORS.BLANCO + '50',
        paddingTop: 20,
        marginTop: 20,
        alignItems: 'center',
    },
    copyrightText: {
        ...theme.typography.body2,
        color: COLORS.BLANCO,
        opacity: 0.8,
    },
    logo: {
    height: '50%',
    marginBottom: 15,
    alignSelf: 'center'
  },
});

export default Footer;