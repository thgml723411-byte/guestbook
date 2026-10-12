import { useEffect } from 'react'
import { Navigate, Routes, Route, useLocation } from 'react-router-dom'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from './firebase'
import useAuthStore from './store/useAuthStore'
import Home from './pages/Home'
import Guestbook from './pages/Guestbook'
import Login from './pages/Login'
import Signup from './pages/Signup'
import About from './pages/About'
import Header from './components/Header'
import styles from './App.module.scss'

export default function App() {
  const setUser = useAuthStore((state) => state.setUser)
  const clearUser = useAuthStore((state) => state.clearUser)
  const { pathname, hash } = useLocation()

  useEffect(() => onAuthStateChanged(auth, (user) => user ? setUser(user) : clearUser()), [setUser, clearUser])
  useEffect(() => {
    if (hash) document.getElementById(hash.slice(1))?.scrollIntoView()
    else window.scrollTo(0, 0)
  }, [pathname, hash])

  return <>
    <Header />
    <main className={styles.main}>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/about' element={<About />} />
        <Route path='/guestbook' element={<Guestbook />} />
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='*' element={<Navigate to='/' replace />} />
      </Routes>
    </main>
    <footer className={styles.footer}><span>흔적 보관소 · 다녀간 마음을 보관합니다.</span><span>SMALL WORDS, LASTING TRACES.</span></footer>
  </>
}
