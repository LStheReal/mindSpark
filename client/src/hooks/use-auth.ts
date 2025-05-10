import { useQuery } from "@tanstack/react-query";
import type { User } from "@shared/schema";

/**
 * Hook for checking authentication status and getting user data
 */
export function useAuth() {
  const { data: user, isLoading } = useQuery<User | null>({
    queryKey: ["/api/auth/user"],
    retry: false,
  });

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
  };
}
