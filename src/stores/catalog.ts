import { create } from "zustand";

export type WaterTankPrice = {
  capacity_liters: number;
  price: number;
};

const WATER_TANK_PRICING: WaterTankPrice[] = [
  { capacity_liters: 1000, price: 4500 },
  { capacity_liters: 2000, price: 10500 },
  { capacity_liters: 3000, price: 12500 },
  { capacity_liters: 4000, price: 14500 },
  { capacity_liters: 5000, price: 16500 },
  { capacity_liters: 6000, price: 19500 },
  { capacity_liters: 8000, price: 24500 },
  { capacity_liters: 10000, price: 32500 },
  { capacity_liters: 16000, price: 88500 },
  { capacity_liters: 20000, price: 137500 },
  { capacity_liters: 24000, price: 162500 },
];

const priceByCapacity = WATER_TANK_PRICING.reduce<Record<number, number>>((acc, item) => {
  acc[item.capacity_liters] = item.price;
  return acc;
}, {});

export const getMarketValue = (price: number) => Math.round(price * 1.25);

export const getSavePercent = (price: number) => {
  const marketValue = getMarketValue(price);
  return Math.round(((marketValue - price) / marketValue) * 100);
};

type CatalogState = {
  waterTankPricing: WaterTankPrice[];
  getPriceForCapacity: (capacity: number | null | undefined) => number | null;
};

export const useCatalogStore = create<CatalogState>(() => ({
  waterTankPricing: WATER_TANK_PRICING,
  getPriceForCapacity: (capacity) => {
    if (!capacity) return null;
    return priceByCapacity[capacity] ?? null;
  },
}));

export const getCatalogPrice = (capacity: number | null | undefined) =>
  useCatalogStore.getState().getPriceForCapacity(capacity);
