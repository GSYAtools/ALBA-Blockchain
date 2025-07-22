-- Crear la base de datos y seleccionarla
CREATE DATABASE IF NOT EXISTS fabric_data;
USE fabric_data;

-- Tabla ligera: light_model_data (con nanosegundos)
CREATE TABLE light_model_data (
    id             BIGINT AUTO_INCREMENT PRIMARY KEY,
    data           TEXT         NOT NULL,
    timestamp      DATETIME     NOT NULL,
    start_tx_ns    BIGINT       NOT NULL DEFAULT 0,
    end_tx_ns      BIGINT       NOT NULL DEFAULT 0,
    tx_id          VARCHAR(128) NOT NULL,
    INDEX idx_lm_time     (timestamp),
    INDEX idx_lm_tx_id    (tx_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabla pesada: heavy_model_data (con nanosegundos)
CREATE TABLE heavy_model_data (
    id             BIGINT AUTO_INCREMENT PRIMARY KEY,
    tx_id          VARCHAR(128) NOT NULL,
    timestamp      DATETIME     NOT NULL,
    start_tx_ns    BIGINT       NOT NULL DEFAULT 0,
    end_tx_ns      BIGINT       NOT NULL DEFAULT 0,
    INDEX idx_hm_time     (timestamp),
    INDEX idx_hm_tx_id    (tx_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
