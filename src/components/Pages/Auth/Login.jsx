import { Input, Button, Divider } from "@geist-ui/core";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import "@/styles/Auth.css";
import { FcGoogle } from "react-icons/fc";

export default function Login({
  User,
  setUser,
  isAuthenticated,
  setIsAuthenticated,
}) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (isLoading) return;

    setIsLoading(true);
    setError("");

    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const user = users.find(
      (u) => u.email === email && u.password === password
    );

    // Add 1.5 second delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    if (user) {
      setUser(user);
      sessionStorage.setItem("user", JSON.stringify(user));
      setIsAuthenticated(true);
      sessionStorage.setItem("isAuthenticated", "true");
      navigate("/");
    } else {
      setError("Invalid email or password");
    }

    setIsLoading(false);
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-container">
        <header>
          <h1>Log in to your account</h1>
          <div>Find your dream collaboration here!</div>
        </header>
        <form>
          <Input
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
            width={"100%"}
          />
          <Input.Password
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
            width={"100%"}
          />
        </form>
        <Button
          type="secondary-light"
          onClick={handleLogin}
          loading={isLoading}
        >
          Log in
        </Button>


        <Divider> Or</Divider>

        <div className="prompt">
          <div style={{ color: error ? "red" : "inherit" }}>
            {error || "Not yet a member?"}
          </div>
          <div className="prompt-btns">
          <Button
            // style={{ width: "fit-content" }}
            scale={0.7}
            onClick={() => navigate("/signup")}
            disabled={isLoading}
          >
            Sign up
          </Button>
          <Button
          className="signin-google-btn"
          // style={{ width: "fit-content" }}
          onClick={handleLogin}
          loading={isLoading}
          disabled={isLoading}
        >
          <FcGoogle className="google-icon" />
          Sign in With Google
        </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
