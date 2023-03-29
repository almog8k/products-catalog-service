CREATE EXTENSION IF NOT EXISTS postgis;
CREATE TYPE product_type AS ENUM ('RASTER', 'RASTERIZED_VECTOR', '3DTILES', 'QMESH');
CREATE TYPE consumption_protocol AS ENUM ('WMS', 'WMTS', 'XYZ', '3DTILES');

CREATE TABLE IF NOT EXISTS product (
    id  UUID PRIMARY KEY,
    name VARCHAR(48),
    description TEXT,
    bounding_polygon GEOMETRY(POLYGON, 4326),
    consumption_link TEXT,
    type product_type,
    consumption_protocol consumption_protocol,
    resolution_best FLOAT,
    min_zoom INTEGER,
    max_zoom INTEGER
);