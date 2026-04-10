import "@testing-library/jest-dom/vitest";

// zustand persist middleware는 globalThis.localStorage를 기대.
// 일부 hoisted 의존성 조합에서 jsdom의 기본 localStorage가 zustand에서
// 인식되지 않는 경우가 있어 메모리 폴리필을 명시적으로 주입.
class MemoryStorage implements Storage {
  private store: Record<string, string> = {};

  get length(): number {
    return Object.keys(this.store).length;
  }

  clear(): void {
    this.store = {};
  }

  getItem(key: string): string | null {
    return this.store[key] ?? null;
  }

  key(index: number): string | null {
    return Object.keys(this.store)[index] ?? null;
  }

  removeItem(key: string): void {
    delete this.store[key];
  }

  setItem(key: string, value: string): void {
    this.store[key] = value;
  }
}

const memoryStorage = new MemoryStorage();
Object.defineProperty(globalThis, "localStorage", {
  value: memoryStorage,
  writable: true,
  configurable: true,
});
Object.defineProperty(globalThis, "sessionStorage", {
  value: memoryStorage,
  writable: true,
  configurable: true,
});
