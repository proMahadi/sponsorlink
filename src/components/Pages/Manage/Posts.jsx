import React, { useState, useEffect } from 'react'
import ListingCard from '@/components/Cards/listingCard'
import { Eye, Edit2, BarChart2, Users, Plus, Trash2 } from '@geist-ui/icons'
import { Button, Modal } from '@geist-ui/core'
import Sidebar from '@/components/Sidebar/Sidebar'
import PostModal from '@/utils/postModal'
import '@/styles/Posts.css'
import clientAxios from '@/api/axios'
import { useAuthContext } from '@/context/AuthContext'

export default function Posts() {
  const [posts, setPosts] = useState([])
  const [showPostModal, setShowPostModal] = useState(false)
  const [editingPost, setEditingPost] = useState(null)
  const [deleteConfirmId, setDeleteConfirmId] = useState(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const { user } = useAuthContext()

  const fetchPosts = async () => {
    clientAxios
      .get('/account/listings/?user_id=' + user.id)
      .then(({ data }) => {
        setPosts(data.results ?? [])
      })
  }

  useEffect(() => {
    fetchPosts()
  }, [user.id])

  const handlePostSubmit = async (newPost) => {
    // Generate random stats for the new post
    const enhancedPost = {
      ...newPost,
      views: Math.floor(Math.random() * 1000) + 100, // Random views between 100-1100
      applications: Array(Math.floor(Math.random() * 20)), // Random applications array 0-20
      engagementRate: `${(Math.random() * 15 + 5).toFixed(1)}%`, // Random rate between 5-20%
    }

    await clientAxios.patch('/account/listings/' + enhancedPost.id + '/', {
      ...enhancedPost,
      image: undefined,
    })

    console.log(enhancedPost, newPost)

    setPosts((prev) => {
      let updatedPosts
      if (editingPost) {
        // Keep existing stats when editing
        updatedPosts = prev.map((post) =>
          post.id === editingPost.id
            ? {
                ...post,
                ...enhancedPost,
                views: post.views,
                applications: post.applications,
                engagementRate: post.engagementRate,
              }
            : post
        )
      } else {
        updatedPosts = [...prev, enhancedPost]
      }

      localStorage.setItem('userPosts', JSON.stringify(updatedPosts))
      return updatedPosts
    })

    setEditingPost(null)
    setShowPostModal(false)
  }
  const handleEdit = (post) => {
    setEditingPost(post)
    setShowPostModal(true)
  }

  const handleDeleteClick = (postId) => {
    setDeleteConfirmId(postId)
  }

  const handleDeleteConfirm = async () => {
    if (deleteConfirmId) {
      setIsDeleting(true)
      console.log(deleteConfirmId)
      await clientAxios.delete('/account/listings/' + deleteConfirmId + '/')

      setPosts((prev) => {
        const updatedPosts = prev.filter((post) => post.id !== deleteConfirmId)
        localStorage.setItem('userPosts', JSON.stringify(updatedPosts))
        return updatedPosts
      })
      setIsDeleting(false)
      setDeleteConfirmId(null)
    }
  }

  console.log(posts)

  return (
    <>
      <Sidebar hasSidebar={false} />
      <div className="posts-container">
        <div className="posts-header">
          <div className="header-left">
            <div className="title">My Posts</div>
            <span>
              {posts.length} {posts.length === 1 ? 'Post' : 'Posts'}
            </span>
          </div>
          <Button
            type="secondary-light"
            auto
            icon={<Plus />}
            onClick={() => setShowPostModal(true)}
          >
            Create Post
          </Button>
        </div>

        <div className="posts-list">
          {posts
            .slice()
            .reverse()
            .map((post) => (
              <div key={post.id} className="post-item" id={post.id}>
                <ListingCard
                  listing={post}
                  showSave={false}
                  showApply={false}
                  maxLabels={4}
                />
                <div className="post-analytics">
                  <div className="analytics-header">
                    <div>Post Details</div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <Button
                        auto
                        scale={0.53}
                        icon={<Edit2 />}
                        onClick={() => handleEdit(post)}
                      >
                        Edit
                      </Button>
                      <Button
                        type="error"
                        auto
                        scale={0.53}
                        icon={<Trash2 />}
                        onClick={() => handleDeleteClick(post.id)}
                        ghost
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                  <div className="analytics-grid">
                    <div className="stat-item">
                      <Eye />
                      <div className="stat-info">
                        <span className="stat-value">{post.views || 0}</span>
                        <span className="stat-label">Views</span>
                      </div>
                    </div>
                    <div className="stat-item">
                      <Users />
                      <div className="stat-info">
                        <span className="stat-value">
                          {post.applications?.length || 0}
                        </span>
                        <span className="stat-label">Applications</span>
                      </div>
                    </div>
                    <div className="stat-item">
                      <BarChart2 />
                      <div className="stat-info">
                        <span className="stat-value">
                          {post.engagementRate || '0%'}
                        </span>
                        <span className="stat-label">Engagement</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>
        <PostModal
          isOpen={showPostModal}
          onClose={() => {
            setShowPostModal(false)
            setEditingPost(null)
          }}
          onSubmit={handlePostSubmit}
          initialData={editingPost}
        />
      </div>

      <Modal
        visible={!!deleteConfirmId}
        onClose={() => setDeleteConfirmId(null)}
      >
        <Modal.Title>Confirm Delete</Modal.Title>
        <Modal.Content>
          Are you sure you want to delete this post? This action cannot be
          undone.
        </Modal.Content>
        <Modal.Action passive onClick={() => setDeleteConfirmId(null)}>
          Cancel
        </Modal.Action>
        <Modal.Action loading={isDeleting} onClick={handleDeleteConfirm}>
          Delete
        </Modal.Action>
      </Modal>
    </>
  )
}
