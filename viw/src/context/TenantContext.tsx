import { createContext, useContext, useState, type ReactNode } from "react";


interface Tenant {
  id: string;
  name: string;
}

interface TenantContextType {
  activeTenant: Tenant | null;
  setActiveTenant: (tenant: Tenant) => void;
}

//BELOW ONE EXPLAIN
// To Share the Data (CONDISERD AS GLOBAL) - TREE - React Components
// Therefore It Avoid Passing Props
//  https://legacy.reactjs.org/docs/context.html#when-to-use-context
const TenantContext = createContext<TenantContextType | undefined>(undefined);

export function TenantProvider({ children }: { children: ReactNode }) {

  // Hardcoded default for now. Later, this comes from a login API.
  // Work After Login API - Rivindu
  const [activeTenant, setActiveTenant] = useState<Tenant | null>({
    id: "tenant_123",
    name: "Engineering Workspace"
  });

  return (
    <TenantContext.Provider value={{ activeTenant, setActiveTenant }}>
      {children}
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