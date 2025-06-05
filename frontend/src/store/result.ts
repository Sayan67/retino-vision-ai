import { atom } from "jotai";

export const resultAtom = atom<{ confidence: number[]; prediction: number }>();
