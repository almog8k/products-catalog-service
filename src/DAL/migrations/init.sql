-- CREATE EXTENSION IF NOT EXISTS postgis;
-- CREATE TYPE product_type AS ENUM ('RASTER', 'RASTERIZED_VECTOR', '3DTILES', 'QMESH');
-- CREATE TYPE consumption_protocol AS ENUM ('WMS', 'WMTS', 'XYZ', '3DTILES');

CREATE TABLE IF NOT EXISTS category (
    id UUID PRIMARY KEY,
    name TEXT,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);

CREATE TABLE IF NOT EXISTS subCategory (
    id UUID PRIMARY KEY,
    name TEXT,
    category_id UUID,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES category(id)
);

CREATE TABLE IF NOT EXISTS expense (
    id  UUID PRIMARY KEY,
    description TEXT,
    category_id UUID,
    subCategory_id UUID,
    currency varchar(3),
    price Numeric(15,2),
    image_url TEXT,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES category(id),
    FOREIGN KEY (subCategory_id) REFERENCES subCategory(id)
);