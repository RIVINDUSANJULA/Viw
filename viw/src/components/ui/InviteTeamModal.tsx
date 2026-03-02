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
      
      onClose();
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
    <Modal isOpen={isOpen} onClose={onClose} title="Invite Team Member">
      <form onSubmit={handleInvite}>
        
        {error && <div>{error}</div>}
        {success && <div>{success}</div>}

        <div>
          <label>User's Email Address</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="colleague@example.com"
          />
          <p>
            Note: The user must already have registered an account on this app.
          </p>
        </div>

        <div>
          <button type="button" onClick={onClose}>Cancel</button>
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Inviting..." : "Invite Member"}
          </button>
        </div>
      </form>
    </Modal>
  );
}

// function setErrorMessage(arg0: string) {
//     throw new Error("Function not implemented." + {arg0});
// }
