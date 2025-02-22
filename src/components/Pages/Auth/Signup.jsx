import { Input, Button, Divider, Spacer } from "@geist-ui/core";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import "@/styles/Auth.css";
import { FcGoogle } from "react-icons/fc";
import { useForm } from "react-hook-form";
import {z} from "zod"
import {zodResolver} from "@hookform/resolvers/zod"


const SignupSchema= z.object({
  email:z.string().email("invalid email address").min(1,"email is required"),
  password: z.string().min(length=8,"password length should be more then 8"),
})

export default function Signup({
  User,
  setUser,
  isAuthenticated,
  setIsAuthenticated,
}) {
  const navigate = useNavigate();
  // const [email, setEmail] = useState("");
  // const [password, setPassword] = useState("");
  // const [error, setError] = useState("");
  // const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    formState: { errors, isLoading, isSubmitting },
    handleSubmit,
    setError,
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver:zodResolver(SignupSchema)
  });

  // const handleSignup = async () => {
  //   if (isLoading) return;

  //   // setIsLoading(true);
  //   setError("");

  //   const users = JSON.parse(localStorage.getItem("users") || "[]");

  //   if (users.some((user) => user.email === email)) {
  //     setError("You are already a member");
  //     // setIsLoading(false);
  //     return;
  //   }

  //   // Add 1.5 second delay
  //   await new Promise((resolve) => setTimeout(resolve, 1500));

  //   const userId = crypto.randomUUID();
  //   users.push({ id: userId, email, password, hasRegistered: false });
  //   localStorage.setItem("users", JSON.stringify(users));
  //   setUser({ id: userId, email, password, hasRegistered: false });
  //   sessionStorage.setItem(
  //     "user",
  //     JSON.stringify({ id: userId, email, password, hasRegistered: false })
  //   );
  //   sessionStorage.setItem("isAuthenticated", "true");
  //   setIsAuthenticated(true);
  //   navigate("/");
  // };

  // const onSubmit = async () => {
  //   if (isLoading) return;

  //   setError("");

  //   const users = JSON.parse(localStorage.getItem("users") || "[]");

  //   if (users.some((user) => user.email === email)) {
  //     setError("root", {
  //       message: "You are already a member",
  //     });

  //     return;
  //   }

  //   // Add 1.5 second delay
  //   await new Promise((resolve) => setTimeout(resolve, 1500));

  //   const userId = crypto.randomUUID();
  //   users.push({ id: userId, email, password, hasRegistered: false });
  //   localStorage.setItem("users", JSON.stringify(users));
  //   setUser({ id: userId, email, password, hasRegistered: false });
  //   sessionStorage.setItem(
  //     "user",
  //     JSON.stringify({ id: userId, email, password, hasRegistered: false })
  //   );
  //   sessionStorage.setItem("isAuthenticated", "true");
  //   setIsAuthenticated(true);
  //   navigate("/");
  // };
  const onSubmit= async (data) => {
    console.log(data)
    const { email, password } = data;
  
    if (isLoading) return;
  
    setError("root", { type: "manual", message: "" });
  
    const users = JSON.parse(localStorage.getItem("users") || "[]");
  
    if (users.some((user) => user.email === email)) {
      setError("root", { type: "manual", message: "You are already a member" });
      return;
    }
  
    // Simulate a delay
    await new Promise((resolve) => setTimeout(resolve, 1500));
  
    const userId = crypto.randomUUID();
    users.push({ id: userId, email, password, hasRegistered: false });
    localStorage.setItem("users", JSON.stringify(users));
  
    setUser({ id: userId, email, password, hasRegistered: false });
    sessionStorage.setItem("user", JSON.stringify({ id: userId, email, password, hasRegistered: false }));
    sessionStorage.setItem("isAuthenticated", "true");
    setIsAuthenticated(true);
    navigate("/");
  };
  

  return (
    <div className="auth-wrapper">
      <div className="auth-container">
        <header>
          <h1>Create an account</h1>
          <div>Find your dream collaboration here!</div>
        </header>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div>
            <Input
              width={"100%"}
              placeholder="Email"
              // value={email}
              // onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
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
          <Spacer h={0.01} inline></Spacer>
          <div>
            <Input.Password
              width={"100%"}
              placeholder="Password"
              // value={password}
              // onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
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
          <Spacer h={0.1} inline></Spacer>
          <Button
            htmlType="submit"
            className="signup-btn"
            // onClick={handleSignup}
            loading={isSubmitting}
            disabled={isLoading}
          >
            Sign up
          </Button>
          <Spacer h={0.1} inline></Spacer>
          <Button
            className="signup-google-btn"
            // onClick={handleSignup}
            loading={isSubmitting}
            disabled={isLoading}
          >
            <FcGoogle className="google-icon" />
            Sign up With Google
          </Button>
        </form>

        <Divider>Or</Divider>

        <div className="login-prompt">
          {/* <div style={{ color: error ? "red" : "inherit" }}>
            {error || "Already a member?"}{" "}
            <span
              style={{ color: error ? "black" : "" }}
              className="login-link"
              onClick={() => navigate("/login")}
            >
              {" "}
              {`Log in ->`}
            </span>
          </div> */}
          {errors.root ? (
            <div>
              {errors.root.message}
              <span className="login-link" onClick={() => navigate("/login")}>
                {` Log in ->`}
              </span>
            </div>
          ) : (
            <div>
              Already a member?
              <span className="login-link" onClick={() => navigate("/login")}>
                {` Log in ->`}
              </span>
            </div>
          )}
          <subtitle>
            By proceeding, you agree to the <span>Terms and Conditions</span>{" "}
            and <span>Privacy Policy</span>
          </subtitle>
        </div>
      </div>
    </div>
  );
}
