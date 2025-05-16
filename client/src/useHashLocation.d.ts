declare module "./useHashLocation" {
  const useHashLocation: () => [string, (to: string) => void];
  export default useHashLocation;
} 