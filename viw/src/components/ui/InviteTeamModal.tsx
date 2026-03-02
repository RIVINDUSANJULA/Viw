import { useState } from "react";
import Modal from "../ui/Modal"; // Adjust path if needed
import { inviteUserToWorkspace } from "../../features/api/kanbanApi";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  tenantId: string;
}

export default function InviteTeamModal({ isOpen, onClose, tenantId }: Props) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<{ type: 'error' | 'success' | null, message: string }>({ type: null, message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !tenantId) return;

    setIsSubmitting(true);
    setStatus({ type: null, message: "" });

    try {
      await inviteUserToWorkspace(tenantId, email);
      setStatus({ type: 'success', message: "User successfully added to workspace!" });
      setEmail(""); // Clear the form
    } catch (error: unknown) {
      setStatus({ type: 'error', message: error.message || "Failed to invite user." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Invite Team Member">
      <form onSubmit={handleInvite}>
        
        {status.type === 'error' && <div>{status.message}</div>}
        {status.type === 'success' && <div>{status.message}</div>}

        <div>
          <label>User's Email Address</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="colleague@example.com"
            required
        />
          <p>
            Note: The user must already have a registered account to be invited.
          </p>
        </div>

        <div>
          <button type="button" onClick={onClose}>
            Close
          </button>
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Inviting..." : "Add to Workspace"}
          </button>
        </div>
      </form>
    </Modal>
  );
}