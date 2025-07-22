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

--*** MODIFICACIONES PARA METRICS ***--

-- Asegurar que tx_id sea único en light_model_data
ALTER TABLE light_model_data
  ADD UNIQUE INDEX ux_light_tx_id (tx_id);

-- Asegurar que tx_id sea único en heavy_model_data
ALTER TABLE heavy_model_data
  ADD UNIQUE INDEX ux_heavy_tx_id (tx_id);

-- Tabla de métricas para Light Model
CREATE TABLE light_metrics (
    id         BIGINT AUTO_INCREMENT PRIMARY KEY,
    tx_id      VARCHAR(128) NOT NULL,
    metric     VARCHAR(64)  NOT NULL,
    value      DOUBLE       NOT NULL,
    timestamp  DATETIME     NOT NULL,
    -- Para garantizar integridad referencial:
    CONSTRAINT fk_light_tx
      FOREIGN KEY (tx_id) 
      REFERENCES light_model_data(tx_id)
      ON DELETE CASCADE,
    -- No puede haber dos métricas iguales para la misma tx
    UNIQUE KEY ux_light_tx_metric (tx_id, metric),
    INDEX idx_light_metrics_tx (tx_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabla de métricas para Heavy Model
CREATE TABLE heavy_metrics (
    id         BIGINT AUTO_INCREMENT PRIMARY KEY,
    tx_id      VARCHAR(128) NOT NULL,
    metric     VARCHAR(64)  NOT NULL,
    value      DOUBLE       NOT NULL,
    timestamp  DATETIME     NOT NULL,
    CONSTRAINT fk_heavy_tx 
      FOREIGN KEY (tx_id) 
      REFERENCES heavy_model_data(tx_id)
      ON DELETE CASCADE,
    UNIQUE KEY ux_heavy_tx_metric (tx_id, metric),
    INDEX idx_heavy_metrics_tx (tx_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
