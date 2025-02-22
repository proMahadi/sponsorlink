import { Input, Button, Divider, Spacer } from "@geist-ui/core";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import "@/styles/Auth.css";
import { FcGoogle } from "react-icons/fc";
import { useForm } from "react-hook-form";
import {z} from "zod"
import {zodResolver} from "@hookform/resolvers/zod"


const LoginSchema= z.object({
  email:z.string().email("invalid email address").min(1,"email is required"),
  password: z.string().min(length=8,"password length should be more then 8"),
})

export default function Login({
  User,
  setUser,
  isAuthenticated,
  setIsAuthenticated,
}) {
  const navigate = useNavigate();
  const {
    register,
    formState: { isLoading, errors, isSubmitting },
    handleSubmit,
    setError,
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver:zodResolver(LoginSchema)
  });
  // const [email, setEmail] = useState("");
  // const [password, setPassword] = useState("");
  // const [error, setError] = useState("");
  // const [isLoading, setIsLoading] = useState(false);

  // const handleLogin = async () => {
  //   if (isLoading) return;

  //   setIsLoading(true);
  //   setError("");

  //   const users = JSON.parse(localStorage.getItem("users") || "[]");
  //   const user = users.find(
  //     (u) => u.email === email && u.password === password
  //   );

  //   // Add 1.5 second delay
  //   await new Promise((resolve) => setTimeout(resolve, 1500));

  //   if (user) {
  //     setUser(user);
  //     sessionStorage.setItem("user", JSON.stringify(user));
  //     setIsAuthenticated(true);
  //     sessionStorage.setItem("isAuthenticated", "true");
  //     navigate("/");
  //   } else {
  //     setError("Invalid email or password");
  //   }

  //   setIsLoading(false);
  // };
  const onSubmit = async (data) => {
    const { email, password } = data;
    if (isLoading) return;

    setError("root", { type: "manual", message: "" });

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
      setError("root", {
        type: "manual",
        message: "Invalid email or password",
      });
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-container">
        <header>
          <h1>Log in to your account</h1>
          <div>Find your dream collaboration here!</div>
        </header>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="formInputs">
            <div>
              <Input
                placeholder="Email"
                // value={email}
                // onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                width={"100%"}
                {...register("email")}
              />
              {errors.email && (
                <p
                  style={{
                    color: "red",
                    fontSize: "12px",
                  }}
                >
                  {errors.email.message}
                </p>
              )}
            </div>
            <div>
              <Input.Password
                placeholder="Password"
                // value={password}
                // onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                width={"100%"}
                {...register("password")}
              />
              {errors.password && (
                <p
                  style={{
                    color: "red",
                    fontSize: "12px",
                  }}
                >
                  {errors.password.message}
                </p>
              )}
            </div>
          </div>
          <Spacer h={0.1} inline></Spacer>
          <Button
            htmlType="submit"
            type="secondary-light"
            // onClick={handleLogin}
            loading={isSubmitting}
          >
            Log in
          </Button>
        </form>

        <Divider> Or</Divider>

        <div className="prompt">
          {/* <div style={{ color: error ? "red" : "inherit" }}>
            {error || "Not yet a member?"}
          </div> */}
          {errors.root ? (
            <div
              style={{
                color: "red",
              }}
            >
              {errors.root.message}
            </div>
          ) : (
            <div>Not yet a member?</div>
          )}
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
              // onClick={handleLogin}
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
