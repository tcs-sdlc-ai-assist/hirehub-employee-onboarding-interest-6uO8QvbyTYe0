import "@testing-library/jest-dom";

const createStorageMock = () => {
  let store = {};
  return {
    getItem: (key) => (key in store ? store[key] : null),
    setItem: (key, value) => {
      store[key] = String(value);
    },
    removeItem: (key) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
    get length() {
      return Object.keys(store).length;
    },
    key: (index) => {
      const keys = Object.keys(store);
      return keys[index] || null;
    },
  };
};

Object.defineProperty(globalThis, "localStorage", {
  value: createStorageMock(),
  writable: true,
});

Object.defineProperty(globalThis, "sessionStorage", {
  value: createStorageMock(),
  writable: true,
});

beforeEach(() => {
  localStorage.clear();
  sessionStorage.clear();
});