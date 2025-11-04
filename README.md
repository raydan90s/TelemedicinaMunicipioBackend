# 🏥 Backend — Consultorio Arrobo

Este repositorio contiene el **backend del sistema "Consultorio Arrobo"**, encargado de la **gestión de datos del consultorio odontológico**.  
Incluye la configuración de **PostgreSQL en Docker**, scripts de **importación automática de archivos CSV** y la estructura base para desarrollar las **API REST** que se conectarán con el frontend.

---

## ⚙️ Tecnologías utilizadas

- 🐘 **PostgreSQL 18**
- 🐳 **Docker & Docker Compose**
- 💻 **Bash Scripts** para inicialización e importación
- 🧩 **Estructura base para APIs (Node.js / Python)**
- 📁 **CSV Data Loader** (automatizado)


## 🚀 Puesta en marcha (desde cero)

Sigue estos pasos para levantar todo el entorno del backend:

```bash
# 1️⃣ Entra en la carpeta docker
cd docker

# 2️⃣ Construye e inicia los contenedores
docker-compose up --build -d

### 2️⃣ Cargar la estructura y datos de la base de datos

Una vez que el contenedor esté corriendo, carga los archivos SQL de estructura y datos:
```bash
# Copiar los archivos SQL al contenedor
docker cp docker/estructura_inversa.sql soacDB:/estructura_inversa.sql
docker cp docker/datos_inversa.sql soacDB:/datos_inversa.sql

# Acceder al contenedor
docker exec -it soacDB bash

# Dentro del contenedor, ejecutar los scripts SQL
psql -U Arrobo -d SOAC -f /estructura_inversa.sql
psql -U Arrobo -d SOAC -f /datos_inversa.sql

# Salir del contenedor
exit
```