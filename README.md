# Proyecto Humble - Sistema de Librería

[![GitHub issues](https://img.shields.io/github/issues/Areshkew/humble-project)](https://github.com/Areshkew/humble-project/issues)
[![GitHub forks](https://img.shields.io/github/forks/Areshkew/humble-project)](https://github.com/Areshkew/humble-project/network)
[![GitHub stars](https://img.shields.io/github/stars/Areshkew/humble-project)](https://github.com/Areshkew/humble-project/stargazers)
[![GitHub license](https://img.shields.io/github/license/Areshkew/humble-project)](https://github.com/Areshkew/humble-project/blob/main/LICENSE)

El Proyecto Humble es un sistema avanzado de librería en línea, diseñado para ofrecer una experiencia de usuario fluida y eficiente tanto para la compra como para la reserva de libros. Con una gama completa de características, este sistema soporta la gestión integral de usuarios y contenidos, así como funcionalidades avanzadas de comercio electrónico y comunicación.

## Características Principales

### Administración de Usuarios

- **Autenticación y Registro:** Soporte para iniciar sesión, registrarse y recuperación de contraseña para usuarios.
- **Gestión de Perfil:** Permite a los usuarios editar su información personal y cambiar su contraseña.
- **Roles y Permisos:** Administración avanzada de usuarios para administradores y acceso a funcionalidades específicas.

### Gestión de Libros

- **Catálogo de Libros:** Visualización y navegación a través de una vasta colección de libros.
- **Detalles de Libros:** Presentación detallada de la información de cada libro, incluyendo autor, sinopsis y reseñas.
- **Administración de Contenidos:** Herramientas para agregar, editar y eliminar libros del catálogo.

### Funcionalidades de la Tienda

- **Carrito de Compras:** Funcionalidad completa para agregar libros al carrito, revisar y modificar la selección antes de la compra.
- **Sistema de Pago:** Procesamiento seguro de pagos para la compra de libros.
- **Reserva de Libros:** Opción para reservar libros y gestionar las reservas de manera eficiente.
- **Historial de Compras:** Acceso al historial de compras y devoluciones para los usuarios.
- **Sistema de Cupones:** Implementación de cupones de descuento para promociones y ofertas especiales.

### Filtrado y Búsqueda

- **Búsqueda Avanzada:** Filtrado de libros por diversos criterios como género, autor, y popularidad.
- **Recomendaciones Personalizadas:** Sistema de recomendaciones basado en el historial de usuario y preferencias.

### Comunicación y Soporte

- **Tickets:** Funcionalidad de ticket para comunicación instantánea entre usuarios y soporte.
- **Historial:** Gestión y revisión de conversaciones pasadas.

### Automatización y Noticias

- **Noticias Automatizadas:** Sistema para la publicación automática de noticias y actualizaciones relevantes sobre libros y eventos.
- **Sistema de Recomendaciones:** Algoritmo inteligente que sugiere libros basados en los intereses y comportamientos de los usuarios.

## Enlaces y Recursos

- [Repositorio del Backend](https://github.com/Areshkew/humble-project)
- [Demo del Sistema](http://libhub.live/) (El dominio estará disponible hasta abril del 2025, la conexión puede detenerse si Oracle Cloud tiene horas de alta intensidad en sus servidores.)

## Instalación

Para configurar y ejecutar este proyecto localmente, sigue estos pasos:

1. Clona el repositorio:
   ```bash
   git clone https://github.com/Areshkew/humble-project-ui.git
   ```

2. Accede al directorio del proyecto:
   ```bash
   cd humble-project-ui
   ```

3. Instala las dependencias necesarias:
   ```bash
   npm install
   ```

4. Inicia la aplicación:
   ```bash
   npm start
   ```

## Stack Tecnológico

### Backend: Python con FastAPI

![Python](https://img.shields.io/badge/Python-3.8%2B-blue?style=for-the-badge&logo=python)
![FastAPI](https://img.shields.io/badge/FastAPI-0.68.0%2B-green?style=for-the-badge&logo=fastapi)

El backend del Proyecto Humble está desarrollado en Python utilizando el framework FastAPI. Esta elección nos permite construir APIs rápidas y de alto rendimiento con una sintaxis limpia y sencilla.

- **Python:** Un lenguaje versátil y poderoso, conocido por su legibilidad y simplicidad.
- **FastAPI:** Un moderno framework de alto rendimiento para construir APIs en Python, optimizado para obtener el mejor rendimiento gracias a su uso intensivo de async y await.

### Frontend: Angular

![Angular](https://img.shields.io/badge/Angular-12.0.0%2B-red?style=for-the-badge&logo=angular)

Para el frontend, utilizamos Angular, un framework de desarrollo web conocido por su capacidad de construir aplicaciones de una sola página (SPA) con una experiencia de usuario fluida y responsiva.

- **Angular:** Proporciona una sólida arquitectura basada en componentes y un ecosistema robusto para la gestión del estado y el enrutamiento de la aplicación.

### Base de Datos: PostgreSQL

![PostgreSQL](https://img.shields.io/badge/PostgreSQL-13.0%2B-blue?style=for-the-badge&logo=postgresql)

PostgreSQL es la base de datos relacional elegida para este proyecto. Es conocida por su estabilidad, escalabilidad y capacidad de manejar grandes volúmenes de datos con eficiencia.

- **PostgreSQL:** Ofrece soporte para operaciones complejas y garantiza la integridad de los datos con características avanzadas como transacciones ACID y extensibilidad.

### Seguridad: JWT (JSON Web Tokens)

![JWT](https://img.shields.io/badge/JWT-JSON%20Web%20Tokens-orange?style=for-the-badge&logo=json-web-tokens)

La seguridad es una prioridad en el Proyecto Humble. Utilizamos JSON Web Tokens (JWT) para la autenticación y autorización, asegurando que las comunicaciones y el acceso a los recursos estén protegidos.

- **JWT:** Proporciona una forma compacta y segura de transmitir información entre partes, utilizada comúnmente para la autenticación basada en tokens en APIs web.

## Integración y Despliegue

![CI/CD](https://img.shields.io/badge/CI%2FCD-GitHub%20Actions-yellow?style=for-the-badge&logo=github-actions)

El despliegue y la integración continua son facilitados con GitHub Actions, asegurando que el código se construya, pruebe y despliegue de manera consistente y eficiente.

- **GitHub Actions:** Herramientas de CI/CD para automatizar el flujo de trabajo de desarrollo y despliegue, desde las pruebas hasta la entrega.

## Contribuciones

Contribuciones al proyecto son bienvenidas. Puedes abrir un "issue" para reportar problemas o enviar un "pull request" para sugerir mejoras.


## Licencia

Este proyecto está licenciado bajo la Licencia MIT. Consulta el archivo [LICENSE](LICENSE) para más información.
