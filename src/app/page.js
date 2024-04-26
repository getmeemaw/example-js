'use client';

import { useState, useEffect } from 'react'
import { supabase } from './supabaseClient'
import Login from './login'
import Tx from './tx'

export default function Home() {
  const [session, setSession] = useState(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
  }, [])

  return (
    <div>
      {!session ? <Login /> : <Tx />}
    </div>
  )
}
