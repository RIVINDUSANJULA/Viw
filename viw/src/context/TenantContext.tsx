import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { supabase } from "../lib/supabase";


interface Tenant {
  id: string;
  name: string;
}

interface TenantContextType {
  activeTenant: Tenant | null;
  setActiveTenant: (tenant: Tenant) => void;
  isLoading: boolean;
}

//BELOW ONE EXPLAIN
// To Share the Data (CONDISERD AS GLOBAL) - TREE - React Components
// Therefore It Avoid Passing Props
//  https://legacy.reactjs.org/docs/context.html#when-to-use-context
const TenantContext = createContext<TenantContextType | undefined>(undefined);

export function TenantProvider({ children }: { children: ReactNode }) {

  const [activeTenant, setActiveTenant] = useState<Tenant | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchInitialTenant() {
      try {
        const { data, error } = await supabase
          .from('tenants')
          .select('*')
          .limit(1)
          .maybeSingle();

        if (error) {
          console.error("Error fetching tenant from Supabase:", error.message);
          return;
        }

        else if (data) {
          setActiveTenant({
            id: data.id,
            name: data.name
          });
        }
      } catch (err) {
        console.error("Unexpected error fetching tenant:", err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchInitialTenant();
  }, []);

  return (
    <TenantContext.Provider value={{ activeTenant, setActiveTenant, isLoading }}>
      {isLoading ? (
        <div>Loading Workspace Data...</div>
        ) : (
          children
        )}
    </TenantContext.Provider>
  );
}

// Disable The Below One - Rivindu - Manually
// eslint-disable-next-line react-refresh/only-export-components
export function useTenant() {
  const context = useContext(TenantContext);
  if (!context) {
    throw new Error("useTenant must be used within a TenantProvider");
  }
  return context;
}