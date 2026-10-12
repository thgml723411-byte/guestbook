import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { collection, addDoc, deleteDoc, doc, updateDoc, onSnapshot, orderBy, query, serverTimestamp } from 'firebase/firestore'
import { db } from '../firebase'
import useAuthStore from '../store/useAuthStore'
import GuestbookForm from '../components/GuestbookForm'
import ArchiveCharacter from '../components/ArchiveCharacter'
import { getGuestbookCharacter, getStamp, formatDate } from '../components/archiveData'
import styles from './Guestbook.module.scss'

const COLLECTION_NAME = 'guestbookPosts'
const PAGE_SIZE = 6

export default function Guestbook() {
  const user = useAuthStore((state) => state.user)
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState(false)
  const [retry, setRetry] = useState(0)
  const [search, setSearch] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [editingId, setEditingId] = useState(null)
  const [editMessage, setEditMessage] = useState('')
  const [busy, setBusy] = useState(false)
  const [actionError, setActionError] = useState('')
  const [status, setStatus] = useState('')
  const filtered = posts.filter((post) => `${post.nickname} ${post.message}`.toLowerCase().includes(search.trim().toLowerCase()))
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const page = Math.min(currentPage, totalPages)
  const displayed = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  useEffect(() => {
    setLoading(true); setLoadError(false)
    const q = query(collection(db, COLLECTION_NAME), orderBy('createdAt', 'desc'))
    return onSnapshot(q, (snapshot) => {
      setPosts(snapshot.docs.map((item) => ({ ...item.data(), id: item.id })))
      setLoading(false); setLoadError(false)
    }, () => { setLoading(false); setLoadError(true) })
  }, [retry])

  async function addPost(data) {
    if (!user) throw new Error('로그인이 필요합니다.')
    await addDoc(collection(db, COLLECTION_NAME), { ...data, uid: user.uid, createdAt: serverTimestamp() })
    setSearch(''); setCurrentPage(1)
  }
  async function removePost(post) {
    if (!user || user.uid !== post.uid || busy) return
    if (!window.confirm('이 흔적을 보관소에서 삭제할까요?')) return
    setBusy(true); setActionError(''); setStatus('')
    try { await deleteDoc(doc(db, COLLECTION_NAME, post.id)); setStatus('흔적을 삭제했습니다.') }
    catch { setActionError('삭제하지 못했습니다. 잠시 후 다시 시도해주세요.') }
    finally { setBusy(false) }
  }
  async function savePost(post) {
    if (!user || user.uid !== post.uid || busy) return
    if (!editMessage.trim()) { setActionError('한마디를 입력해주세요.'); return }
    setBusy(true); setActionError(''); setStatus('')
    try {
      await updateDoc(doc(db, COLLECTION_NAME, post.id), { message: editMessage.trim(), updatedAt: serverTimestamp() })
      setEditingId(null); setStatus('흔적을 수정했습니다.')
    } catch { setActionError('수정하지 못했습니다. 작성한 내용은 유지됩니다.') }
    finally { setBusy(false) }
  }

  return <section className={styles.page}>
    <div className={styles.heading}>
      <div><p className='archive-label'>THE COLLECTION / GUESTBOOK</p><h1>보관된 흔적<span>.</span></h1><p className={styles.subtitle}>다녀간 이름, 놓고 간 마음. 당신의 한마디도 이곳에 남겨주세요.</p></div>
      <span className={styles.count}>{loading || loadError ? '—' : String(posts.length).padStart(3, '0')}<small>COLLECTED TRACES</small></span>
    </div>
    {user ? <GuestbookForm key={user.uid} onAddpost={addPost} defaultNickname={user.displayName || ''} /> : <div className={styles.loginNotice} id='write'><div><span className='archive-label'>LEAVE YOUR TRACE</span><h2>당신의 자리도 비워두었어요.</h2><p>기록은 누구나 둘러볼 수 있어요. 한마디를 남기려면 로그인해주세요.</p></div><Link to='/login' className='archive-button'>로그인하고 남기기 <span aria-hidden='true'>↗</span></Link></div>}
    <div className={styles.listHead}><h2>흔적 목록 <span>{loadError ? '—' : filtered.length}</span></h2><label className={styles.search}><span>기록 찾기</span><input type='search' value={search} onChange={(event) => { setSearch(event.target.value); setCurrentPage(1) }} placeholder='이름 또는 한마디 검색' /></label></div>
    {actionError && <p className='archive-error' role='alert'>{actionError}</p>}
    {status && <p role='status' className={styles.status}>{status}</p>}
    {loading ? <p className={styles.empty} role='status'>보관된 흔적을 꺼내고 있어요…</p> : loadError ? <div className={styles.empty} role='alert'><p>기록을 불러오지 못했습니다.</p><button className='archive-link' onClick={() => setRetry((value) => value + 1)}>다시 불러오기 ↻</button></div> : displayed.length === 0 ? <p className={styles.empty}>{search ? '찾는 흔적이 없어요. 다른 이름이나 단어로 찾아보세요.' : '아직 보관된 흔적이 없어요. 첫 번째 한마디를 남겨주세요.'}</p> : <div className={styles.grid}>
      {displayed.map((post) => <article key={post.id} className={styles.record}>
        <div className={styles.recordTop}><span>No. {post.id.slice(0, 6).toUpperCase()}</span><time>{formatDate(post.createdAt)}</time></div>
        {getGuestbookCharacter(post.character, post.message) && <div className={styles.recordCharacter}><ArchiveCharacter character={post.character} message={post.message} /></div>}
        {editingId === post.id && user?.uid === post.uid ? <form className={styles.edit} onSubmit={(event) => { event.preventDefault(); savePost(post) }}><label htmlFor={`edit-${post.id}`}>한마디 수정</label><textarea id={`edit-${post.id}`} value={editMessage} maxLength={500} required disabled={busy} onChange={(event) => setEditMessage(event.target.value)} /><div><button type='submit' disabled={busy}>{busy ? '저장 중…' : '저장'}</button><button type='button' disabled={busy} onClick={() => { setEditingId(null); setActionError('') }}>취소</button></div></form> : <p className={styles.message}>{post.message}</p>}
        <div className={styles.recordBottom}><div><strong>{post.nickname}</strong><span className={styles.note}>이곳에 다녀간 사람{post.updatedAt ? ' · 수정됨' : ''}</span></div><span className='archive-stamp'>{getStamp(post.stamp ?? post.character).label}</span></div>
        {user?.uid === post.uid && editingId !== post.id && <div className={styles.actions}><button disabled={busy} onClick={() => { setEditingId(post.id); setEditMessage(post.message); setActionError('') }}>수정</button><button disabled={busy} onClick={() => removePost(post)}>삭제</button></div>}
      </article>)}
    </div>}
    {!loading && !loadError && totalPages > 1 && <nav className={styles.pagination} aria-label='기록 페이지'><button disabled={page === 1} onClick={() => setCurrentPage(page - 1)} aria-label='이전 페이지'>←</button><span>{page} / {totalPages}</span><button disabled={page === totalPages} onClick={() => setCurrentPage(page + 1)} aria-label='다음 페이지'>→</button></nav>}
  </section>
}
