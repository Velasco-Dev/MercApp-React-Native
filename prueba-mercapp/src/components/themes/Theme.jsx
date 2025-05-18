import { COLORS } from './Colors';
import { Platform } from 'react-native';

export const theme = {
    Colors: COLORS,
    spacing: {
        xs: 4,
        sm: 8,
        md: 16,
        lg: 24,
        xl: 32,
    },
    typography: {
        h1: {
            fontSize: 28,
            fontWeight: 'bold',
            color: '#2c3e50',
        },
        h2: {
            fontSize: 24,
            fontWeight: '600',
            color: '#2c3e50',
        },
        body: {
            fontSize: 16,
            color: '#2c3e50',
        },
        body2: {
            fontSize: 12,
            color: '#2c3e50',
        },
        button: {
            fontSize: 18,
            fontWeight: '600',
        },
    },
    button: {
        primary: {
            backgroundColor: COLORS.PRIMARY,
            padding: 15,
            borderRadius: 10,
            width: '50%',
            alignSelf: 'center',
            marginVertical: 10,
            // Sombras base para iOS
            shadowColor: "#000",
            shadowOffset: {
                width: 0,
                height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            // Sombra para Android
            elevation: 5,
        },
        secondary: {
            backgroundColor: COLORS.SECONDARY,
            padding: 15,
            borderRadius: 10,
            width: '40%',
            marginVertical: 10,
            // Sombras base para iOS
            shadowColor: "#000",
            shadowOffset: {
                width: 0,
                height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            // Sombra para Android
            elevation: 5,
        },
        textPrimary: {
            color: COLORS.BLANCO,
            textAlign: 'center',
            fontSize: 16,
            fontWeight: 'bold',
        },
        registerButtonText: {
            color: COLORS.PRIMARY,
            textAlign: 'center',
            fontSize: 14,
            textDecorationLine: 'underline',
        },
        logout: {
            backgroundColor: COLORS.ERROR,
            padding: 15,
            borderRadius: 10,
            width: 'auto',
            margin: 10,
            // Sombras base para iOS
            shadowColor: "#000",
            shadowOffset: {
                width: 0,
                height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            // Sombra para Android
            elevation: 5,
        },
        editar: {
            backgroundColor: COLORS.ACCENT,
            padding: 5,
            borderRadius: 10,
            width: 'auto',
            margin: 10,
            // Sombras base para iOS
            shadowColor: "#000",
            shadowOffset: {
                width: 0,
                height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            // Sombra para Android
            elevation: 5,
        },
        buttonContent: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
        },
        icon: {
            marginRight: -3,
        },
    },
    row: {
        flex: 1,
        justifyContent: 'space-around',
        marginBottom: 10,
    },
    card: {
        width: 'auto', // Ancho del 45% para dejar espacio entre cards
        backgroundColor: COLORS.BLANCO,
        borderRadius: 10,
        padding: 15,
        marginVertical: 8,
        // Sombras
        ...Platform.select({
            ios: {
                shadowColor: "#000",
                shadowOffset: {
                    width: 0,
                    height: 2,
                },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,
            },
            android: {
                elevation: 5,
            },
            web: {
                boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
            }
        }),
        buttonCardContainer: {
            flexDirection: 'row',
            justifyContent: 'flex-end',
            marginTop: 10,
        },
        actionCardButton: {
            padding: 8,
            borderRadius: 5,
        },
    },
    name: {
        fontSize: 16,
        fontWeight: 'bold',
        color: COLORS.TEXT,
        marginBottom: 8,
    },
    info: {
        fontSize: 14,
        color: COLORS.SECONDARY,
        marginBottom: 4,
    },
    picker: {
        borderWidth: 1,
        borderColor: COLORS.SECONDARY,
        borderRadius: 5,
        backgroundColor: COLORS.BACKGROUND,
        color: COLORS.TEXT,
        width: '100%',
        ...Platform.select({
            web: {
                height: 40,
            },
            android: {
                height: 50,
            },
            ios: {
                height: 150,
            }
        }),
    },
    flatList: {
        flex: 1,
        width: '100%',
    },
    flatListContent: {
        flexGrow: 1,
        paddingBottom: 20,
    },
    form: {
        alignSelf: 'center',
        justifyContent: 'center',
        ...Platform.select({
            web: {
                width: '70%', // Más pequeño en web
                // maxWidth: 400, // Tamaño máximo para pantallas grandes
                // minWidth: 300, // Tamaño mínimo para que sea usable
            },
            default: {
                width: '100%', // Mantiene el 100% en móvil
            }
        }),
        alignItems: 'center',
        borderRadius: 10,
        borderColor: '#ddd',
        borderWidth: 2,
        padding: 10,
        backgroundColor: COLORS.BLANCO,
        // Reemplaza boxShadow (que no funciona en React Native) por:
        ...Platform.select({
            web: {
                boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
            },
            default: {
                shadowColor: "#000",
                shadowOffset: {
                    width: 0,
                    height: 2,
                },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,
                elevation: 5,
            }
        }),
    },
    formRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginBottom: 10,
    },
    inputContainer: {
        width: '48%', // Deja un pequeño espacio entre inputs
    },
    container: {
        ...Platform.select({
            web: {
                userSelect: 'none',
                cursor: 'default',
            }
        })
    },
    backgroundImage: {
        flex: 1,
        width: '100%',
        height: '100%',
    },
    logo: {
        width: 100,
        height: 100,
        marginBottom: 20,
        ...Platform.select({
            web: {
                userSelect: 'none'
            }
        })
    },
    emptyContainer: {
        padding: 20,
        alignItems: 'center'
    },
    emptyText: {
        color: COLORS.SECONDARY,
        fontSize: 16
    },
  subtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
    color: COLORS.TEXT,
    alignSelf: 'center'
  },
};