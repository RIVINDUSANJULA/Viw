import { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { registerAndCreateWorkspace } from '../features/auth/authApi';

export default function Register() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [workspaceName, setWorkspaceName] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            await registerAndCreateWorkspace(email, password, workspaceName);
            navigate("/projects");
            } 
        catch (err: unknown) { 
            if (err instanceof Error) {
                setError(err.message);
                } 
            else {
                setError("An error occurred during registration.");
                }
            } 
        finally {
            setLoading(false);
        }
    };


  return (
    <div>
        <div>{error && <div >{error}</div>}</div>

        <form onSubmit={handleRegister}>
            <div>
                <label>Company / Workspace Name</label>
                <input
                type="text"
                placeholder="e.g., Acme Corp"
                value={workspaceName}
                onChange={(e) => setWorkspaceName(e.target.value)}
                required
                />
            </div>
            <div>
                <label>Your Email</label>
                <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Password</label>
                <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required minLength={6}
                />
            </div>
            <button
                type="submit"
                disabled={loading}
            >
                {loading ? "Creating Workspace..." : "Create Account"}
            </button>
        </form>
    </div>
  )
}
