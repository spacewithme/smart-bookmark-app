"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabaseClient"

export default function Dashboard() {
  const router = useRouter()

  const [bookmarks, setBookmarks] = useState<any[]>([])
  const [title, setTitle] = useState("")
  const [url, setUrl] = useState("")
  const [loading, setLoading] = useState(true)

  const fetchBookmarks = async () => {
    const { data, error } = await supabase
      .from("bookmarks")
      .select("*")
      .order("created_at", { ascending: false })

    if (!error) {
      setBookmarks(data || [])
    }
  }

  useEffect(() => {
  const checkSession = async () => {
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) {
      router.push("/")
      return
    }

    await fetchBookmarks()
    setLoading(false)
  }

  checkSession()

  const { data: { subscription } } =
    supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        router.push("/")
      }
    })

  return () => {
    subscription.unsubscribe()
  }
}, [])

  const channel = supabase
    .channel("realtime-bookmarks")
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "bookmarks",
      },
      () => fetchBookmarks()
    )
    .subscribe()

  return () => {
    subscription.unsubscribe()
    supabase.removeChannel(channel)
  }
}, [])
  const addBookmark = async () => {
    if (!title || !url) return

    const {
      data: { user },
    } = await supabase.auth.getUser()

    await supabase.from("bookmarks").insert({
      title,
      url,
      user_id: user?.id,
    })

    setTitle("")
    setUrl("")
  }

  const deleteBookmark = async (id: string) => {
    await supabase.from("bookmarks").delete().eq("id", id)
  }

  const logout = async () => {
    await supabase.auth.signOut()
    router.push("/")
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-lg font-medium">Loading...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white p-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-black">
          My Bookmarks
        </h1>

        <button
          onClick={logout}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Logout
        </button>
      </div>

      {/* Add Bookmark Form */}
      <div className="mb-8 flex gap-3">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border-2 border-gray-400 p-2 rounded w-1/3 text-black"
        />

        <input
          type="text"
          placeholder="URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="border-2 border-gray-400 p-2 rounded w-1/3 text-black"
        />

        <button
          onClick={addBookmark}
          className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800"
        >
          Add
        </button>
      </div>

      {/* Empty State */}
      {bookmarks.length === 0 && (
        <p className="text-black font-medium">
          No bookmarks yet.
        </p>
      )}

      {/* Bookmark List */}
      {bookmarks.map((bookmark) => (
        <div
          key={bookmark.id}
          className="flex justify-between items-center bg-gray-100 p-4 mb-3 rounded shadow-sm"
        >
          <a
            href={bookmark.url}
            target="_blank"
            className="text-blue-600 underline font-medium"
          >
            {bookmark.title}
          </a>

          <button
            onClick={() => deleteBookmark(bookmark.id)}
            className="text-red-600 font-medium hover:text-red-800"
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  )
}
