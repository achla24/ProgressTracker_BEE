import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { CheckCircle } from "lucide-react";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5001";

type AuthMode = "signin" | "signup";

export default function Auth() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [mode, setMode] = useState<AuthMode>("signin");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError("");
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await axios.post(`${API_BASE_URL}/auth/login`, {
        email: formData.email,
        password: formData.password,
      });

      if (response.data.token) {
        const userData = {
          id: formData.email,
          email: formData.email,
          name: formData.email.split("@")[0],
        };
        login(response.data.token, userData);
        navigate("/");
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || err.message || "Sign in failed. Please try again.";
      console.error("Sign in error:", err.response?.data || err);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!formData.name.trim()) {
      setError("Name is required");
      setLoading(false);
      return;
    }

    try {
      await axios.post(`${API_BASE_URL}/auth/register`, {
        email: formData.email,
        password: formData.password,
        name: formData.name,
      });

      const loginResponse = await axios.post(`${API_BASE_URL}/auth/login`, {
        email: formData.email,
        password: formData.password,
      });

      if (loginResponse.data.token) {
        const userData = {
          id: loginResponse.data.token,
          email: formData.email,
          name: formData.name,
        };
        login(loginResponse.data.token, userData);
        navigate("/");
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || err.message || "Sign up failed. Please try again.";
      console.error("Sign up error:", err.response?.data || err);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-card to-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <CheckCircle className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold text-foreground">ProgressSync</h1>
          </div>
          <p className="text-muted-foreground">
            Track your progress, achieve your goals
          </p>
        </div>

        <Card className="p-8 bg-card border-border">
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setMode("signin")}
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
                mode === "signin"
                  ? "bg-primary text-primary-foreground"
                  : "bg-background text-foreground hover:bg-secondary"
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setMode("signup")}
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
                mode === "signup"
                  ? "bg-primary text-primary-foreground"
                  : "bg-background text-foreground hover:bg-secondary"
              }`}
            >
              Sign Up
            </button>
          </div>

          <form onSubmit={mode === "signin" ? handleSignIn : handleSignUp}>
            {mode === "signup" && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-foreground mb-2">
                  Name
                </label>
                <Input
                  type="text"
                  name="name"
                  placeholder="Your name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full bg-background border-border text-foreground placeholder:text-muted-foreground"
                  required
                />
              </div>
            )}

            <div className="mb-4">
              <label className="block text-sm font-medium text-foreground mb-2">
                Email
              </label>
              <Input
                type="email"
                name="email"
                placeholder="your@email.com"
                value={formData.email}
                onChange={handleChange}
                className="w-full bg-background border-border text-foreground placeholder:text-muted-foreground"
                required
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-foreground mb-2">
                Password
              </label>
              <Input
                type="password"
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                className="w-full bg-background border-border text-foreground placeholder:text-muted-foreground"
                required
              />
            </div>

            {error && (
              <div className="mb-4 p-3 bg-destructive/10 border border-destructive/30 rounded-lg text-sm text-destructive">
                {error}
              </div>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-medium py-2"
            >
              {loading
                ? mode === "signin"
                  ? "Signing in..."
                  : "Creating account..."
                : mode === "signin"
                ? "Sign In"
                : "Sign Up"}
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-border">
            <p className="text-center text-sm text-muted-foreground">
              {mode === "signin"
                ? "Don't have an account? "
                : "Already have an account? "}
              <button
                onClick={() => {
                  setMode(mode === "signin" ? "signup" : "signin");
                  setError("");
                }}
                className="text-primary font-medium hover:underline"
              >
                {mode === "signin" ? "Sign up" : "Sign in"}
              </button>
            </p>
          </div>
        </Card>

        <div className="mt-6 text-center text-xs text-muted-foreground">
          <p>Demo credentials:</p>
          <p>Email: test@example.com | Password: password123</p>
        </div>
      </div>
    </div>
  );
}
