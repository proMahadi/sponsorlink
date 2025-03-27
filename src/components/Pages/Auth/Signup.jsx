import { Input, Button, Divider, Spacer } from '@geist-ui/core'
import { NavLink, useNavigate, useLocation } from 'react-router-dom'
import { useState } from 'react'
import '@/styles/Auth.css'
import { FcGoogle } from 'react-icons/fc'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { login, signup } from '@/api/user'
import { useAuthContext } from '@/context/AuthContext'
import { isAxiosError } from 'axios'

const SignupSchema = z.object({
  email: z.string().email('invalid email address').min(1, 'email is required'),
  password: z.string().min(4, 'password length should be more then 4'),
})

export default function Signup() {
  const navigate = useNavigate()
  // const [email, setEmail] = useState("");
  // const [password, setPassword] = useState("");
  // const [error, setError] = useState("");
  // const [isLoading, setIsLoading] = useState(false);

  const { setAuth } = useAuthContext()

  const {
    register,
    formState: { errors, isLoading, isSubmitting },
    handleSubmit,
    setError,
  } = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
    resolver: zodResolver(SignupSchema),
  })

  const onSubmit = async ({ email, password }) => {
    if (isLoading) return

    try {
      const data = await signup(email, password)
      setAuth(data.user_info, data.profile, data.access, data.refresh)

      navigate('/')
    } catch (err) {
      if (isAxiosError(err)) {
        setError('email', { message: err.response?.data?.email?.[0] })
        setError('password', { message: err.response?.data?.password?.[0] })
        setError('root', {
          message: err?.response?.data?.detail ?? err?.response?.data?.error,
        })
      } else {
        console.log(err)
        setError('root', { message: 'An error occurred' })
      }
    }
  }

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
              width={'100%'}
              placeholder="Email"
              // value={email}
              // onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              {...register('email')}
            />
            {errors.email && (
              <p
                style={{
                  color: 'red',
                  fontSize: '12px',
                }}
              >
                {errors.email.message}
              </p>
            )}
          </div>
          <Spacer h={0.01} inline></Spacer>
          <div>
            <Input.Password
              width={'100%'}
              placeholder="Password"
              // value={password}
              // onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              {...register('password')}
            />
            {errors.password && (
              <p
                style={{
                  color: 'red',
                  fontSize: '12px',
                }}
              >
                {errors.password.message}
              </p>
            )}
          </div>
          <Spacer h={0.1} inline></Spacer>

          {errors.root && (
            <>
              <p
                style={{
                  color: 'red',
                  fontSize: '12px',
                }}
              >
                {errors.root.message}
              </p>
            </>
          )}

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
              <span className="login-link" onClick={() => navigate('/login')}>
                {` Log in ->`}
              </span>
            </div>
          ) : (
            <div>
              Already a member?
              <span className="login-link" onClick={() => navigate('/login')}>
                {` Log in ->`}
              </span>
            </div>
          )}
          <subtitle>
            By proceeding, you agree to the <span>Terms and Conditions</span>{' '}
            and <span>Privacy Policy</span>
          </subtitle>
        </div>
      </div>
    </div>
  )
}
