import { useState } from 'react'
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom'
import { signOut } from 'firebase/auth'
import { auth } from '../firebase'
import useAuthStore from '../store/useAuthStore'
import styles from './Header.module.scss'

export default function Header() {
  const user = useAuthStore((state) => state.user)
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const [error, setError] = useState('')
  async function logout() {
    try { await signOut(auth); setError(''); navigate('/') }
    catch { setError('로그아웃에 실패했습니다. 다시 시도해주세요.') }
  }
  return <header className={`${styles.header} ${pathname === '/' ? styles.overlay : ''}`}>
    <div className={styles.inner}>
      <Link to='/' className={styles.logo}><span>흔적 보관소<small>THE TRACE ARCHIVE</small></span></Link>
      <nav aria-label='주 메뉴'>
        <NavLink to='/' end className={({ isActive }) => isActive ? styles.active : undefined}>처음으로</NavLink>
        <NavLink to='/guestbook' className={({ isActive }) => isActive ? styles.active : undefined}>보관된 흔적</NavLink>
        <NavLink to='/about' className={({ isActive }) => isActive ? styles.active : undefined}>보관소 소개</NavLink>
      </nav>
      <div className={styles.account}>
        {user ? <><span className={styles.username}>{user.displayName || '방문자'}님</span><button onClick={logout}>로그아웃</button></> : <Link to='/login'>로그인</Link>}
      </div>
    </div>
    {error && <p role='alert' className='archive-error'>{error}</p>}
  </header>
}
