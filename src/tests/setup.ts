import '@testing-library/jest-dom';

// Tell React it is running inside a test environment so act() warnings are suppressed
globalThis.IS_REACT_ACT_ENVIRONMENT = true;

// ── localStorage mock ─────────────────────────────────────────────────────────
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] ?? null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// ── window.matchMedia mock ────────────────────────────────────────────────────
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }),
});

// ── window.location mock ──────────────────────────────────────────────────────
Object.defineProperty(window, 'location', {
  writable: true,
  value: { href: '/', assign: vi.fn(), reload: vi.fn() },
});

// ── Reset localStorage between tests ─────────────────────────────────────────
beforeEach(() => {
  localStorage.clear();
  vi.clearAllMocks();
});
