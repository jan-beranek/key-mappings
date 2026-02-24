import { ConfigStore } from './config-store.js';

export const store = new ConfigStore();

export const state = {
  selectedTrigger: 'caps_lock',
  selectedSublayer: null,
  selectedBinding: null,
  editingBinding: null,
};

export const expandedNodes = new Set();

export const KEY_ROWS = [
  ['1','2','3','4','5','6','7','8','9','0'],
  ['q','w','e','r','t','y','u','i','o','p'],
  ['a','s','d','f','g','h','j','k','l'],
  ['z','x','c','v','b','n','m']
];
