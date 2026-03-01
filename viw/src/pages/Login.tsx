import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export default function Login() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
    } else {
      navigate("/projects");
    }
    setLoading(false);
  };

  return (
    <div>
        <div>
            Welcome 
            {error && <div>{error}</div>}

            <form onSubmit={handleLogin}>
                <div>
                    <label>Email</label>
                    <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    />
                </div>
                <div>
                    <label>Password</label>
                    <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    />
                </div>
                <button
                    type="submit"
                    disabled={loading}
                >
                    {loading ? "Signing in..." : "Sign In"}
                </button>
                </form>
        </div>
    </div>
  )
}
