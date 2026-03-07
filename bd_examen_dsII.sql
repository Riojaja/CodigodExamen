-- Crear la base de datos
CREATE DATABASE IF NOT EXISTS bd_examen_practico_hotelsito;
USE bd_examen_practico_hotelsito;

-- =====================
-- TABLA: tipo_habitacion
-- =====================
CREATE TABLE tipo_habitacion (
    id_tipo INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50),
    descripcion VARCHAR(100),
    precio_noche DECIMAL(10,2)
);

-- =====================
-- TABLA: habitacion
-- =====================
CREATE TABLE habitacion (
    id_habitacion INT AUTO_INCREMENT PRIMARY KEY,
    numero VARCHAR(10),
    id_tipo INT,
    estado VARCHAR(20),
    FOREIGN KEY (id_tipo) REFERENCES tipo_habitacion(id_tipo)
);


-- =====================
-- TABLA: huesped
-- =====================
CREATE TABLE huesped (
    id_huesped INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100),
    dni VARCHAR(15),
    telefono VARCHAR(20),
    email VARCHAR(100)
);

-- =====================
-- TABLA: reserva
-- =====================
CREATE TABLE reserva (
    id_reserva INT AUTO_INCREMENT PRIMARY KEY,
    id_huesped INT,
    id_habitacion INT,
    fecha_inicio DATE,
    fecha_fin DATE,
    noches INT,
    precio_noche DECIMAL(10,2),
    total DECIMAL(10,2),
    FOREIGN KEY (id_huesped) REFERENCES huesped(id_huesped),
    FOREIGN KEY (id_habitacion) REFERENCES habitacion(id_habitacion)
);

-- =====================
-- TABLA: usuario (para autenticación JWT)
-- =====================
CREATE TABLE usuario (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(100) NOT NULL,
    role VARCHAR(20) NOT NULL
)
