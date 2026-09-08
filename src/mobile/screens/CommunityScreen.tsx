import { useMemo, useState } from 'react'
import {
  BadgeCheck,
  BookOpenText,
  Flag,
  Heart,
  ImagePlus,
  MessageCircle,
  MoreHorizontal,
  Plus,
  Send,
  ShieldQuestion,
  Sparkles,
  X,
} from 'lucide-react'
import { POSTS } from '../../shared/data/community'
import type { CommunityPost } from '../../shared/types'
import { t } from '../../shared/i18n'
import { useApp } from '../AppContext'
import { Avatar, LangSwitcher, PageTitle } from '../ui'

const TAB_KEYS: ('discover' | 'questions' | 'stories')[] = ['discover', 'questions', 'stories']

export function CommunityScreen() {
  const { locale } = useApp()
  const [posts, setPosts] = useState<CommunityPost[]>(POSTS)
  const [tab, setTab] = useState<'discover' | 'questions' | 'stories'>('discover')
  const [composeOpen, setComposeOpen] = useState(false)

  const visible = useMemo(() => {
    if (tab === 'discover') return posts
    if (tab === 'questions') return posts.filter((p) => p.kind === 'question')
    return posts.filter((p) => p.kind !== 'question')
  }, [posts, tab])

  const toggleLike = (id: string) => {
    setPosts((list) =>
      list.map((p) => {
        if (p.id !== id) return p
        return { ...p, liked: !p.liked, likes: p.likes + (p.liked ? -1 : 1) }
      }),
    )
  }

  const addPost = (title: string, body: string) => {
    const post: CommunityPost = {
      id: `new-${Date.now()}`,
      author: 'You',
      country: 'Guest',
      flagLetter: 'GU',
      accent: '#211c15',
      title,
      body,
      language: 'en',
      likes: 0,
      comments: 0,
      kind: 'story',
      image: '/images/places/20231125_Statue_of_Sun_Yat-sen_in_front_of_the_1911_Revolution_Museum.jpg',
    }
    setPosts((list) => [post, ...list])
    setComposeOpen(false)
  }

  return (
    <div>
      <PageTitle
        eyebrow={
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 text-[0.78rem] font-semibold text-clay">
              <Sparkles size={13} /> 23 countries · stories, questions, answers
            </span>
            <LangSwitcher compact />
          </div>
        }
        title={t(locale, 'community.title')}
      />

      {/* Compose affordance */}
      <div className="m-section mt-5">
        <button
          className="flex w-full items-center gap-3 rounded-full border border-line bg-paper px-3 py-2 text-left"
          onClick={() => setComposeOpen(true)}
        >
          <Avatar name="Guest" letter="Y" accent="#211c15" size="sm" />
          <span className="flex-1 text-[0.88rem] text-ink-faint">
            Share what you discovered today…
          </span>
          <span className="mr-2 inline-flex items-center gap-1 rounded-full bg-clay px-3 py-1.5 text-[0.72rem] font-bold text-white">
            <Plus size={14} /> Post
          </span>
        </button>
      </div>

      {/* Tabs */}
      <div className="m-section mt-4">
        <div className="flex gap-5 border-b border-line">
          {TAB_KEYS.map((key) => (
            <button
              key={key}
              className="relative pb-2.5 text-[0.9rem] font-semibold transition-colors"
              style={{ color: tab === key ? 'var(--ink)' : 'var(--ink-faint)' }}
              aria-pressed={tab === key}
              onClick={() => setTab(key)}
            >
              {t(locale, `community.tabs.${key}`)}
              {tab === key ? <span className="absolute inset-x-0 bottom-[-1px] h-[2px] bg-clay" /> : null}
            </button>
          ))}
          <span className="ml-auto pb-2.5 text-[0.72rem] font-semibold text-ink-faint">
            {visible.length}
          </span>
        </div>
      </div>

      {/* Feed */}
      <div className="m-section mt-2 grid gap-4">
        {visible.map((post) => (
          <PostCard key={post.id} post={post} onLike={toggleLike} />
        ))}
      </div>

      <div className="m-section mt-10 pb-4">
        <div className="rounded-[16px] bg-paper-deep/70 px-4 py-4">
          <p className="text-[0.72rem] font-bold uppercase tracking-[0.14em] text-clay">
            Why the community matters
          </p>
          <p className="mt-2 text-[0.86rem] leading-relaxed text-ink-soft">
            When visitors ask questions, volunteers and fellow travellers answer — turning a
            one-way broadcast into a two-way conversation between China’s revolutionary history
            and the world.
          </p>
        </div>
      </div>

      {composeOpen ? <Composer onClose={() => setComposeOpen(false)} onPublish={addPost} /> : null}
    </div>
  )
}

function PostCard({
  post,
  onLike,
}: {
  post: CommunityPost
  onLike: (id: string) => void
}) {
  const { locale, toast, go } = useApp()
  const [commentOpen, setCommentOpen] = useState(false)

  return (
    <article className="overflow-hidden rounded-[18px] border border-line bg-paper">
      <div className="flex items-center gap-2.5 px-4 pb-2 pt-3.5">
        <Avatar name={post.author} letter={post.flagLetter.slice(0, 1)} accent={post.accent} />
        <div className="min-w-0 flex-1">
          <p className="flex items-center gap-1.5 truncate text-[0.9rem] font-bold text-ink">
            {post.author}
            {post.kind !== 'question' ? (
              <BadgeCheck size={14} className="text-gold" aria-label="Verified contributor" />
            ) : null}
          </p>
          <p className="truncate text-[0.72rem] font-medium text-ink-faint">
            {post.country} · {post.kind === 'question' ? 'Question' : 'Visitor story'}
          </p>
        </div>
        <button className="icon-btn !size-9 text-ink-faint" aria-label="More actions">
          <MoreHorizontal size={18} />
        </button>
      </div>

      {post.image ? (
        <div className="mx-4 h-[224px] overflow-hidden rounded-[12px] bg-paper-deep">
          <img className="media-cover" src={post.image} alt="" loading="lazy" />
        </div>
      ) : null}

      <div className="px-4 pb-4 pt-3">
        <h2 className="font-display text-[1.18rem] font-medium leading-snug tracking-[-0.01em] text-ink">
          {post.title}
        </h2>
        <p className="mt-1.5 line-clamp-3 text-[0.84rem] leading-relaxed text-ink-soft">
          {post.body}
        </p>
        {post.placeSlug ? (
          <button
            className="mt-2.5 inline-flex items-center gap-1.5 rounded-full bg-clay-wash px-3 py-1.5 text-[0.72rem] font-bold text-clay-deep"
            onClick={() => go(`#/place/${post.placeSlug}`)}
          >
            <BookOpenText size={13} /> View this heritage site
          </button>
        ) : null}

        <div className="mt-3.5 flex items-center gap-1 border-t border-line/80 pt-3">
          <button
            className="flex min-h-[40px] items-center gap-1.5 rounded-full px-2.5 text-[0.8rem] font-semibold"
            style={{ color: post.liked ? 'var(--clay)' : 'var(--ink-soft)' }}
            onClick={() => onLike(post.id)}
            aria-pressed={post.liked}
          >
            <Heart size={17} fill={post.liked ? 'currentColor' : 'none'} />
            {post.likes}
          </button>
          <button
            className="flex min-h-[40px] items-center gap-1.5 rounded-full px-2.5 text-[0.8rem] font-semibold text-ink-soft"
            onClick={() => setCommentOpen((v) => !v)}
            aria-expanded={commentOpen}
          >
            <MessageCircle size={17} />
            {post.comments}
          </button>
          <button
            className="ml-auto flex min-h-[40px] items-center gap-1 rounded-full px-2.5 text-[0.74rem] font-semibold text-ink-faint"
            onClick={() => toast('Thanks — our content team will review it')}
          >
            <Flag size={14} /> Report
          </button>
        </div>

        {commentOpen ? <CommentStrip post={post} /> : null}
      </div>
    </article>
  )
}

function CommentStrip({ post }: { post: CommunityPost }) {
  const { toast } = useApp()
  const [reply, setReply] = useState('')
  const comments = [
    {
      name: 'Volunteer · CCNU',
      text:
        post.kind === 'question'
          ? 'Great question! In short, “red tourism” in China includes study, commemoration and tourism together — and it is very much a younger generation now.'
          : 'Thank you for sharing this — we have forwarded it to our translation review group.',
    },
  ]
  return (
    <div className="mt-2 rounded-[12px] bg-paper-soft/80 p-3">
      {comments.map((c) => (
        <div key={c.name} className="flex gap-2.5">
          <Avatar name={c.name} letter="V" accent="#a4752f" size="sm" />
          <div>
            <p className="text-[0.74rem] font-bold text-ink">{c.name}</p>
            <p className="mt-0.5 text-[0.78rem] leading-relaxed text-ink-soft">{c.text}</p>
          </div>
        </div>
      ))}
      <div className="mt-3 flex gap-2">
        <input
          className="field !min-h-[42px] flex-1 rounded-full bg-paper-warm text-[0.8rem]"
          placeholder="Write a reply…"
          value={reply}
          onChange={(e) => setReply(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && reply.trim()) {
              toast('Reply posted — thank you for joining the conversation')
              setReply('')
            }
          }}
        />
        <button
          className="icon-btn !size-10 bg-ink text-white"
          aria-label="Send reply"
          disabled={!reply.trim()}
          onClick={() => {
            toast('Reply posted — thank you for joining the conversation')
            setReply('')
          }}
        >
          <Send size={16} />
        </button>
      </div>
    </div>
  )
}

function Composer({
  onClose,
  onPublish,
}: {
  onClose: () => void
  onPublish: (title: string, body: string) => void
}) {
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  return (
    <>
      <div className="sheet-backdrop" onClick={onClose} aria-hidden />
      <section className="sheet" role="dialog" aria-modal="true" aria-label="Compose story">
        <button className="absolute right-3 top-3 icon-btn" onClick={onClose} aria-label="Close">
          <X size={18} />
        </button>
        <div className="sheet__grab" />
        <div className="px-5 pb-7 pt-2">
          <div className="flex items-center gap-2.5">
            <Avatar name="Guest" letter="Y" accent="#211c15" />
            <div>
              <p className="text-[0.9rem] font-bold text-ink">Share your visit</p>
              <p className="text-[0.72rem] text-ink-faint">Tell the story onward · translated to all visitors</p>
            </div>
          </div>
          <input
            className="field mt-4"
            placeholder="Title — what did you understand today?"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={80}
          />
          <textarea
            className="field mt-2.5 min-h-[120px]"
            placeholder="One small observation about the place, the story, or the people who lived it…"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            maxLength={500}
          />
          <div className="mt-3 flex items-center gap-2">
            <button
              className="icon-btn icon-btn-solid !size-10"
              aria-label="Add photo"
              onClick={() => {
                /* demo only — file input comes with real API */
              }}
            >
              <ImagePlus size={18} />
            </button>
            <button
              className="icon-btn icon-btn-solid !size-10"
              aria-label="Add heritage tag"
              onClick={() => {
                /* demo only */
              }}
            >
              <ShieldQuestion size={18} />
            </button>
            <span className="ml-auto text-[0.7rem] font-medium text-ink-faint">{body.length}/500</span>
          </div>
          <button
            className="btn btn-clay mt-5 w-full"
            disabled={!title.trim() || !body.trim()}
            onClick={() => {
              onPublish(title.trim(), body.trim())
            }}
          >
            Publish to the community
          </button>
          <p className="mt-2.5 text-center text-[0.68rem] leading-relaxed text-ink-faint">
            Posts are reviewed by volunteers before appearing. Demo mode publishes instantly.
          </p>
        </div>
      </section>
    </>
  )
}
