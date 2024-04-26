import { useState } from 'react'
import { supabase } from './supabaseClient'
import Image from 'next/image'

export default function Login() {
  const [signup, setSignup] = useState(false)
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSignup = async (event) => {
    event.preventDefault()

    setLoading(true)
    const { error } = await supabase.auth.signUp({ email, password })

    if (error) {
      alert(error.error_description || error.message)
    } else {
      alert('Signed up! You have received a confirmation email.')
    }

    setLoading(false)
  };

  const goToSignup = async (event) => {
    event.preventDefault()

    setSignup(true)
    // window.location.reload(false);
  };

  const handleLogin = async (event) => {
    event.preventDefault()

    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      alert(error.error_description || error.message)
    } else {
      alert('Logged in!')
    }

    setLoading(false)
  };

  const goToLogin = async (event) => {
    event.preventDefault()

    setSignup(false)
    // window.location.reload(false);
  };

  return (
    <main>
      <div>
        <Image
          src="https://influchain.fra1.digitaloceanspaces.com/meemaw/static/img/logo/grandma.webp"
          alt="Meemaw Logo"
          width={180}
          height={180}
          priority
        />
      </div>

      <div>
        <h1>Meemaw: Web SDK Example</h1>

        {signup ? (
          <div>
            <p>Sign up</p>
            <form onSubmit={handleSignup}>
              <div>
                <input
                  type="email"
                  placeholder="Your email"
                  value={email}
                  required={true}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <br />
                <input
                  type="password"
                  placeholder="Your password"
                  value={password}
                  required={true}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div style={{ marginTop: "1em" }}>
                <button disabled={loading}>
                  {loading ? <span>Loading</span> : <span>Signup</span>}
                </button>
              </div>
            </form>

            <p>
              <a href="#" onClick={goToLogin}>I already have an account</a>
            </p>
          </div>
        ) : (
          <div>
            <p>Sign in to access your wallet</p>
            <form onSubmit={handleLogin}>
              <div>
                <input
                  type="email"
                  placeholder="Your email"
                  value={email}
                  required={true}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <br />
                <input
                  type="password"
                  placeholder="Your password"
                  value={password}
                  required={true}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div style={{ marginTop: "1em" }}>
                <button disabled={loading}>
                  {loading ? <span>Loading</span> : <span>Login</span>}
                </button>
              </div>
            </form>
            <p>
              <a href="#" onClick={goToSignup}>I don't have an account yet</a>
            </p>

          </div>
        )}
      </div>
    </main>
  )
}