import { useState } from "react";
import Modal from "./Modal";
// import { supabase } from "../../lib/supabase";
import { useTenant } from "../../context/TenantContext";
import { inviteUserToWorkspace } from "../../features/api/kanbanApi";

// interface Props {
//   isOpen: boolean;
//   onClose: () => void;
// }

export default function InviteTeamModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { activeTenant } = useTenant();
//   const [formData, setFormData] = useState<InviteData>({ email: "", role: "member" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);


  const [email, setEmail] = useState("");
  const [success, setSuccess] = useState<string | null>(null);

  if (!isOpen) return null;
  
  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeTenant || !email.trim()) return;

    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      await inviteUserToWorkspace(activeTenant.id, email);
      
      setSuccess("User successfully added to workspace!");
      setEmail("");
      
      setTimeout(() => {
        setSuccess(null);
        onClose();
      }, 1500);
      
    //   setFormData({ email: "", role: "member" });
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      }
      else if (typeof err === 'object' && err !== null && 'message' in err) {
        setError(String((err as { message: string }).message));
      } 
      else {
        setError("An unexpected error occurred");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="relative w-full max-w-md rounded-xl border border-border bg-card p-6 shadow-2xl">
          <Modal isOpen={isOpen} onClose={onClose} title="Invite Team Member">
            <form onSubmit={handleInvite} className="space-y-4">
              
              {error && <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">{error}</div>}
              {success && <div className="rounded-md bg-green-500/15 p-3 text-sm text-green-600">{success}</div>}

              <div className="space-y-2">
                <label className="block text-sm font-medium text-foreground">User's Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="colleague@example.com"
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/20"
                />
                <p className="text-xs text-muted-foreground">
                  Note: The user must already have registered an account on this app.
                </p>
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={onClose}
                className="flex-1 rounded-md border border-input px-4 py-2 text-sm font-medium text-foreground hover:bg-accent/5 focus:outline-none focus:ring-2 focus:ring-ring">
                  Cancel
                </button>
                <button type="submit" disabled={isSubmitting}
                className="flex-1 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50 disabled:cursor-not-allowed">
                  {isSubmitting ? "Inviting..." : "Invite Member"}
                </button>
              </div>
            </form>
          </Modal>
      </div>
    </div>
    
  );
}

