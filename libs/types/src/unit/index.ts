/**
 * @module unit
 *
 * Public surface for Velnora's unit type system.
 *
 * A **unit** is the fundamental extension primitive in Velnora. Every unit
 * carries shared metadata ({@link BaseUnit}), a kind discriminant
 * ({@link UnitKind}), and kind-specific lifecycle hooks. The discriminated
 * union {@link VelnoraUnit} ties them all together.
 *
 * Re-exports:
 * - `base-unit`           -- {@link BaseUnit} generic interface
 * - `unit-kind`           -- {@link UnitKind} enum
 * - `runtime-unit`        -- {@link RuntimeUnit} interface
 * - `integration-unit`    -- {@link IntegrationUnit} interface
 * - `integration/`        -- {@link UnitContext} and related types
 * - `velnora-unit`        -- {@link VelnoraUnit} discriminated union type
 */
export * from "./base-unit";
export * from "./integration";
export * from "./integration-unit";
export * from "./runtime-unit";
export * from "./unit-kind";
export * from "./velnora-unit";
