import { useSyncExternalStore } from "react";

const subscribe = (): (() => void) => () => {};
const getSnapshot = (): true => true;
const getServerSnapshot = (): false => false;

/**
 * SSR-safe "am I running on the client?" check.
 *
 * React 19의 `react-hooks/set-state-in-effect` 규칙을 만족시키는 관용적 대체.
 * `useState(false) + useEffect(() => setMounted(true), [])` 대신 사용.
 *
 * 서버에서는 `false`, 클라이언트 hydration 이후 `true`를 반환.
 */
export function useIsClient(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
