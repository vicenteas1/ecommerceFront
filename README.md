# 🌐 Bootcamp UDD Desarrollo Fullstack - Proyecto Final

## 1. Introducción
En la era de la información, cada vez más servicios están disponibles en línea y, como desarrolladores, necesitamos saber cómo interactuar con ellos.  
La mayoría de estos servicios exponen una **API (Application Programming Interface)** para que podamos consumir datos y mostrarlos en nuestras aplicaciones.  

En este proyecto tendrás la oportunidad de trabajar con **APIs públicas** y mostrar la información en una interfaz construida con **React**.  

React permite a los desarrolladores crear aplicaciones **SPA (Single Page Applications)** que entregan una experiencia de usuario más rápida y fluida.

---

## 2. Demo
🔗 [Ver Demo Aquí](LINK)  

Para este laboratorio utilizamos la API gratuita [Exchangerate.host](https://exchangerate.host/) que provee información histórica sobre divisas en el tiempo.  

La idea es que explores esta aplicación como inspiración y luego construyas tu propia propuesta usando **APIs públicas**.

---

## 3. ¿Qué construirás?
Construirás una **aplicación web con React** que consuma datos desde una API pública y los muestre en una interfaz.  

Puedes buscar APIs públicas en este repositorio:  
👉 [Lista de APIs públicas](https://github.com/public-apis/public-apis)

Tu aplicación deberá:
- Conectarse a una API para obtener datos.
- Mostrar los datos en una interfaz amigable.
- Permitir alguna interacción del usuario (botones, formularios, filtros, etc).

> 🎨 ¡Tienes libertad de elegir la temática! Puede ser sobre clima, música, videojuegos, geografía, mascotas, etc.

---

## 4. Objetivos de aprendizaje
- Crear y organizar componentes en React.
- Pasar datos entre componentes con **props**.
- Manejar eventos en React.
- Usar **useState** y **useEffect**.
- Implementar rutas con **React Router**.
- Manejar errores con **Error Boundaries**.
- Conectar React con una API real.
- (Opcional) Uso de **useRef**, **useCallback** y **useMemo**.

---

## 5. Requisitos y entregables
### **React**
- Uso de **Vite** para crear el proyecto.  
- Crear componentes funcionales.  
- Consumir una API pública.  
- Uso de **Hooks** (mínimo `useEffect` para llamadas async).  
- Implementar rutas con **React Router**.  
- Manejar errores de renderizado con **Error Boundaries**.  
- Usar un framework CSS (**Bootstrap, TailwindCSS, MUI, etc.**).  

### **Control de versiones**
- Crear repositorio en GitHub.  
- Mínimo **5 commits** por persona.  
- Incluir un **README.md** (este archivo 📄).  

### **Despliegue**
- Subir tu proyecto a un servicio como **Netlify, GitHub Pages o Render**.  

### **Entrega a tiempo**
- Respetar las fechas definidas por el bootcamp.  

---

## 6. Criterios de evaluación
| Área                  | % del total |
|-----------------------|-------------|
| **React**             | 70%         |
| **Control de versiones** | 15%      |
| **Despliegue**        | 10%         |
| **Entrega a tiempo**  | 5%          |

---

## 7. Entregas
- Asegúrate de cumplir con todos los requisitos.  
- Entrega tu proyecto a tiempo.  
- Presenta tu proyecto frente a tus compañeros y coaches.  

> 💡 Esta instancia es ideal para recibir feedback y mejorar tus habilidades.

---

## 8. Instalación y ejecución
Clona el repositorio e instala las dependencias:

git clone https://github.com/vicenteas1/Lab5.git
cd Lab5
npm install
npm run dev

Se debe generar el un archivo environment.tsx en la siguiente ruta src/config/environment/
export const environment = {
  environment: {
    production: false,
    development: true,
    certification: false,
  },
  weatherApi: {
    url:
      import.meta.env.VITE_WEATHER_API_URL || "https://api.open-meteo.com/v1/forecast",
    key: import.meta.env.VITE_WEATHER_API_KEY || "",
  },
  nominatimApi: {
    url:
      import.meta.env.VITE_NOMINATIM_API_URL || "https://nominatim.openstreetmap.org",
    key: import.meta.env.VITE_WEATHER_API_KEY || "",
  },
};