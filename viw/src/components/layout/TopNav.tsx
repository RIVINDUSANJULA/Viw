import { useState } from "react";
import { Link } from "react-router-dom";
import { useTenant } from "../../context/TenantContext";

const AVAILABLE_TENANTS = [
  { id: "tenant_123", name: "Engineering Workspace" },
  { id: "tenant_456", name: "Marketing Workspace" },
  { id: "tenant_789", name: "Design Agency" },
];

export default function TopNav() {

    const { activeTenant, setActiveTenant } = useTenant();
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const handleTenantSwitch = (tenant: { id: string; name: string }) => {
        setActiveTenant(tenant);
        setDropdownOpen(false);
    };

  return (
    <nav>
        <div>
            <Link to="/projects">Viw App</Link>

            <div>
                <button onClick={() => setDropdownOpen(!dropdownOpen)}>
                    {/* Building2 */} {activeTenant?.name || "Select Workspace"} {/* ChevronDown */}
                </button>

                {/* dropdown */}
                {dropdownOpen && (
                    <div>
                    <div>
                        <p>Your Workspaces</p>
                        {AVAILABLE_TENANTS.map((tenant) => (
                        <button
                            key={tenant.id}
                            onClick={() => handleTenantSwitch(tenant)}
                            className={`${
                            activeTenant?.id === tenant.id 
                                ? "bg-blue-600/10 text-blue-400" 
                                : "text-gray-300 hover:bg-gray-800"
                            }`}
                        >
                            {tenant.name}
                        </button>
                        ))}
                    </div>
                    </div>
                )}
            </div>

            <button>UserCircle</button>
        </div>
    </nav>
  )
}
