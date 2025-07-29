-- Migration: Remove measurement_timing from metrics.metadata
-- This will remove the measurement_timing key from all metrics

BEGIN;

UPDATE metrics
SET metadata = metadata - 'measurement_timing'
WHERE metadata ? 'measurement_timing';

COMMIT;
