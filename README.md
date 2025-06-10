# MercApp - Gestión de Micronegocios

MercApp es una aplicación móvil multiplataforma desarrollada con React Native que ayuda a microempresarios a gestionar su negocio de manera eficiente.

## Características Principales

- 🏪 **Gestión de Inventario**: Control de productos, stock y precios
- 👥 **Gestión de Usuarios**: Diferentes roles (Admin, Microempresario, Vendedor)  
- 📱 **Multiplataforma**: Funciona en iOS, Android y Web
- 🔔 **Notificaciones**: Alertas de stock bajo y cambios de rol
- 🔐 **Autenticación**: Sistema de registro y login seguro
- 🎨 **Interfaz Intuitiva**: Diseño moderno y fácil de usar

## Tecnologías Utilizadas

- React Native
- Firebase (Auth, Realtime Database)
- Expo
- AsyncStorage
- React Navigation
- Context API
- Custom Hooks

## Instalación

1. Clona el repositorio:
```sh
git clone https://github.com/Velasco-Dev/MercApp-React-Native.git
```

2. Instala las dependencias:
```sh
cd MercApp-React-Native
npm install
```

3. Configura las variables de entorno en `.env`:
```
REACT_APP_FB_API_KEY=your_firebase_api_key
REACT_APP_P_ID=your_project_id
```

4. Inicia el proyecto:
```sh
npx expo start
```

## Estructura del Proyecto

```
src/
  ├── components/               # Componentes reutilizables
  ├── context/                  # Context API y providers
  ├── navigation/               # Configuración de rutas
  ├── screens/                  # Pantallas principales
  ├── services/                 # Servicios y APIs
  └── components/themes/        # Estilos y temas
```

## Contacto

Email: info@mercapp.com
Website: https://mercapp.com
