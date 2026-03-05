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
  availableTenants: Tenant[];
}

//BELOW ONE EXPLAIN
// To Share the Data (CONDISERD AS GLOBAL) - TREE - React Components
// Therefore It Avoid Passing Props
//  https://legacy.reactjs.org/docs/context.html#when-to-use-context
const TenantContext = createContext<TenantContextType | undefined>(undefined);

export function TenantProvider({ children }: { children: ReactNode }) {

  const [activeTenant, setActiveTenant] = useState<Tenant | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [availableTenants, setAvailableTenants] = useState<Tenant[]>([]); // <-- NEW
  

  useEffect(() => {
    async function fetchUserWorkspace() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        const user = session?.user;

        if (!user) {
          console.log("No user is logged in.");
          setIsLoading(false);
          return;
        }

        const { data, error } = await supabase
          .from('tenant_users')
          .select(`
            tenant_id,
            tenants ( id, name )
          `)
          .eq('user_id', user.id);
          // .limit(1)
          // .maybeSingle();

        if (error) {
          console.error("Error fetching user workspaces:", error.message);
        } else if (data && data.length > 0) {
          const tenantsList = data.map(row => {
            return Array.isArray(row.tenants) ? row.tenants[0] : row.tenants;
          }).filter(Boolean) as Tenant[];
          
          setAvailableTenants(tenantsList);
          
          if (!activeTenant) {
            setActiveTenant(tenantsList[0]);
          }
        }

      } catch (err) {
        console.error("Unexpected error fetching tenant:", err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchUserWorkspace();

    //Log OR Not - Instant Update
    const { data: authListener } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_IN') {
        setIsLoading(true);
        fetchUserWorkspace();
      } else if (event === 'SIGNED_OUT') {
        setActiveTenant(null);
        setAvailableTenants([]);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };

  }, [activeTenant]);

  return (
    <TenantContext.Provider value={{ activeTenant, setActiveTenant ,availableTenants, isLoading }}>
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
  // console.log(context?.activeTenant?.name)
  if (!context) {
    throw new Error("useTenant must be used within a TenantProvider");
  }
  return context;
}