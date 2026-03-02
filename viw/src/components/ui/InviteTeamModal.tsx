import { useState } from "react";
import Modal from "./Modal";
import { supabase } from "../../lib/supabase";
import { useTenant } from "../../context/TenantContext";

interface InviteData {
  email: string;
  role: 'admin' | 'member';
}

export default function InviteTeamModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { activeTenant } = useTenant();
  const [formData, setFormData] = useState<InviteData>({ email: "", role: "member" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeTenant) return;

    setIsSubmitting(true);
    setError(null);

    try {
      // Logic to invite user (usually involves inserting into tenant_users)
      const { error: inviteError } = await supabase
        .from('tenant_users')
        .insert([
          { 
            tenant_id: activeTenant.id, 
            email: formData.email, // Note: You'll need to map this to a user_id later
            role: formData.role 
          }
        ]);

      if (inviteError) throw inviteError;
      
      onClose();
      setFormData({ email: "", role: "member" });
    } catch (err: unknown) { 
      if (err instanceof Error) {
        setErrorMessage(err.message);
      } 
      else if (typeof err === 'object' && err !== null && 'message' in err) {
        setErrorMessage(String((err as { message: string }).message));
      } 
      else {
        setErrorMessage("An unexpected error occurred");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Invite Team Member">
      <form onSubmit={handleInvite}>
        {error && <div>{error}</div>}
        
        <div>
          <label>Email Address</label>
          <input
            type="email"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="colleague@company.com"
          />
        </div>

        <div>
          <label>Role</label>
          <select
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value as 'admin' | 'member' })}
          >
            <option value="member">Member</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <div>
          <button type="button" onClick={onClose}>Cancel</button>
          <button
            type="submit"
            disabled={isSubmitting}
        >
            {isSubmitting ? "Sending..." : "Invite Member"}
          </button>
        </div>
      </form>
    </Modal>
  );
}

function setErrorMessage(arg0: string) {
    throw new Error("Function not implemented." + {arg0});
}
