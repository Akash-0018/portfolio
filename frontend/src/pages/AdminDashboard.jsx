import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { fetchProjects, createProject, updateProject, deleteProject, fetchProfile, updateProfilePhoto, uploadFile, fetchSeminars, createSeminar, updateSeminar, deleteSeminar } from '../services/api'

const emptyForm = {
  title: '',
  description: '',
  long_description: '',
  tech_stack: '',
  github_url: '',
  live_url: '',
  image_url: '',
  category: 'Agentic AI',
  featured: false,
  order_index: 0,
}

export default function AdminDashboard({ onLogout }) {
  const [projects, setProjects] = useState([])
  const [seminars, setSeminars] = useState([])
  const [activeTab, setActiveTab] = useState('projects')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isSeminarModalOpen, setIsSeminarModalOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [editingSeminarId, setEditingSeminarId] = useState(null)
  const [formData, setFormData] = useState(emptyForm)
  const [seminarFormData, setSeminarFormData] = useState({
    title: '',
    organizer: '',
    description: '',
    tag: '',
    order_index: 0,
  })
  const [saving, setSaving] = useState(false)
  const [photoUrlInput, setPhotoUrlInput] = useState('/profile.png')
  const [savingPhoto, setSavingPhoto] = useState(false)
  const [uploadingProjectImage, setUploadingProjectImage] = useState(false)

  const loadProjects = async () => {
    try {
      setLoading(true)
      const res = await fetchProjects()
      setProjects(res.data || [])
    } catch (err) {
      setError('Failed to fetch projects.')
    } finally {
      setLoading(false)
    }
  }

  const loadSeminars = async () => {
    try {
      const res = await fetchSeminars()
      setSeminars(res.data || [])
    } catch (err) {
      console.error('Failed to fetch seminars.')
    }
  }

  useEffect(() => {
    loadProjects()
    loadSeminars()
    fetchProfile()
      .then((res) => {
        if (res.data?.photo_url) setPhotoUrlInput(res.data.photo_url)
      })
      .catch(() => {})
  }, [])


  const handleProfilePhotoUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    const fd = new FormData()
    fd.append('file', file)
    setSavingPhoto(true)
    try {
      const res = await uploadFile(fd)
      setPhotoUrlInput(res.data.url)
    } catch (err) {
      alert('Failed to upload profile photograph: ' + (err.response?.data?.detail || err.message))
    } finally {
      setSavingPhoto(false)
    }
  }

  const handleProjectImageUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    const fd = new FormData()
    fd.append('file', file)
    setUploadingProjectImage(true)
    try {
      const res = await uploadFile(fd)
      setFormData((prev) => ({ ...prev, image_url: res.data.url }))
    } catch (err) {
      alert('Failed to upload project image: ' + (err.response?.data?.detail || err.message))
    } finally {
      setUploadingProjectImage(false)
    }
  }

  const handlePhotoSubmit = async (e) => {
    e.preventDefault()
    setSavingPhoto(true)
    try {
      await updateProfilePhoto(photoUrlInput)
      alert('Profile photo updated successfully! Refresh main site to see changes.')
    } catch (err) {
      alert('Failed to update photo.')
    } finally {
      setSavingPhoto(false)
    }
  }


  const handleOpenAdd = () => {
    const maxOrderIndex = projects.reduce((max, p) => (p.order_index > max ? p.order_index : max), 0)
    setEditingId(null)
    setFormData({
      ...emptyForm,
      order_index: maxOrderIndex + 1
    })
    setIsModalOpen(true)
  }

  const handleOpenEdit = (project) => {
    setEditingId(project.id)
    setFormData({
      title: project.title || '',
      description: project.description || '',
      long_description: project.long_description || '',
      tech_stack: Array.isArray(project.tech_stack) ? project.tech_stack.join(', ') : '',
      github_url: project.github_url || '',
      live_url: project.live_url || '',
      image_url: project.image_url || '',
      category: project.category || '',
      featured: project.featured || false,
      order_index: project.order_index || 0,
    })
    setIsModalOpen(true)
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return
    try {
      await deleteProject(id)
      setProjects((prev) => prev.filter((p) => p.id !== id))
    } catch (err) {
      alert('Failed to delete project')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)

    const payload = {
      ...formData,
      tech_stack: formData.tech_stack
        ? formData.tech_stack.split(',').map((s) => s.trim()).filter(Boolean)
        : [],
      order_index: parseInt(formData.order_index, 10) || 0,
    }

    try {
      if (editingId) {
        const res = await updateProject(editingId, payload)
        setProjects((prev) => prev.map((p) => (p.id === editingId ? res.data : p)))
      } else {
        const res = await createProject(payload)
        setProjects((prev) => [...prev, res.data])
      }
      setIsModalOpen(false)
    } catch (err) {
      alert('Failed to save project: ' + (err.response?.data?.detail || err.message))
    } finally {
      setSaving(false)
    }
  }

  const handleOpenSeminarAdd = () => {
    const maxIndex = seminars.reduce((max, s) => (s.order_index > max ? s.order_index : max), 0)
    setEditingSeminarId(null)
    setSeminarFormData({
      title: '',
      organizer: '',
      description: '',
      tag: `Seminar ${String(maxIndex + 1).padStart(2, '0')}`,
      order_index: maxIndex + 1,
    })
    setIsSeminarModalOpen(true)
  }

  const handleOpenSeminarEdit = (seminar) => {
    setEditingSeminarId(seminar.id)
    setSeminarFormData({
      title: seminar.title || '',
      organizer: seminar.organizer || '',
      description: seminar.description || '',
      tag: seminar.tag || '',
      order_index: seminar.order_index || 0,
    })
    setIsSeminarModalOpen(true)
  }

  const handleSeminarDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this seminar?')) return
    try {
      await deleteSeminar(id)
      setSeminars((prev) => prev.filter((s) => s.id !== id))
    } catch (err) {
      alert('Failed to delete seminar')
    }
  }

  const handleSeminarSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    const payload = {
      ...seminarFormData,
      order_index: parseInt(seminarFormData.order_index, 10) || 0,
    }
    try {
      if (editingSeminarId) {
        const res = await updateSeminar(editingSeminarId, payload)
        setSeminars((prev) => prev.map((s) => (s.id === editingSeminarId ? res.data : s)))
      } else {
        const res = await createSeminar(payload)
        setSeminars((prev) => [...prev, res.data])
      }
      setIsSeminarModalOpen(false)
    } catch (err) {
      alert('Failed to save seminar: ' + (err.response?.data?.detail || err.message))
    } finally {
      setSaving(false)
    }
  }

  return (
    <div
      style={{
        position: 'relative',
        zIndex: 50,
        minHeight: '100vh',
        padding: '3rem 1.5rem',
        maxWidth: '1200px',
        margin: '0 auto',
        color: '#FFFFFF',
        fontFamily: 'Inter, sans-serif',
        background: '#121212',
      }}
    >
      <div className="admin-header">
        <div>
          <div className="identity-champagne" style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', marginBottom: '0.4rem' }}>
            ◈ ADMIN SYSTEM OS
          </div>
          <h1 style={{ fontSize: '2.25rem', fontWeight: 700 }}>System Control Dashboard</h1>
        </div>

        <div style={{ display: 'flex', gap: '1rem' }}>
          {activeTab === 'projects' ? (
            <button onClick={handleOpenAdd} className="btn btn-primary">
              + New Project
            </button>
          ) : (
            <button onClick={handleOpenSeminarAdd} className="btn btn-primary">
              + New Seminar
            </button>
          )}
          <button onClick={onLogout} className="btn btn-secondary">
            Sign Out
          </button>
        </div>
      </div>

      {/* Profile Photo Settings Card */}
      <div className="card-minimal" style={{ marginBottom: '2.5rem', borderColor: 'var(--champagne)' }}>
        <h2 className="identity-champagne" style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem' }}>
          ◈ Profile Photograph Settings
        </h2>
        <form onSubmit={handlePhotoSubmit} style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
          <div style={{ width: '60px', height: '60px', borderRadius: '50%', overflow: 'hidden', border: '1px solid var(--border)', flexShrink: 0 }}>
            <img src={photoUrlInput} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => { e.target.src = '/profile.png' }} />
          </div>
          <input
            className="input-minimal"
            style={{ flex: 1, minWidth: '200px' }}
            placeholder="PROFILE PHOTO URL (e.g. /profile.png or hosted image link)"
            value={photoUrlInput}
            onChange={(e) => setPhotoUrlInput(e.target.value)}
            required
          />
          <input
            type="file"
            accept="image/*"
            id="profile-photo-file"
            style={{ display: 'none' }}
            onChange={handleProfilePhotoUpload}
          />
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => document.getElementById('profile-photo-file').click()}
            disabled={savingPhoto}
          >
            Choose File
          </button>
          <button type="submit" className="btn btn-primary" disabled={savingPhoto}>
            {savingPhoto ? 'Saving...' : 'Update Photo URL'}
          </button>
        </form>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '2rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.75rem' }}>
        <button
          onClick={() => setActiveTab('projects')}
          style={{
            background: 'none',
            border: 'none',
            color: activeTab === 'projects' ? 'var(--lime)' : 'var(--text-secondary)',
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: '0.9rem',
            cursor: 'pointer',
            paddingBottom: '0.25rem',
            borderBottom: activeTab === 'projects' ? '2px solid var(--lime)' : 'none',
          }}
        >
          ◈ MANAGE PROJECTS
        </button>
        <button
          onClick={() => setActiveTab('seminars')}
          style={{
            background: 'none',
            border: 'none',
            color: activeTab === 'seminars' ? 'var(--lime)' : 'var(--text-secondary)',
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: '0.9rem',
            cursor: 'pointer',
            paddingBottom: '0.25rem',
            borderBottom: activeTab === 'seminars' ? '2px solid var(--lime)' : 'none',
          }}
        >
          ◈ MANAGE SEMINARS
        </button>
      </div>

      {/* Grid */}
      {loading ? (
        <div style={{ color: 'var(--text-muted)', fontFamily: 'JetBrains Mono, monospace' }}>Loading content...</div>
      ) : error ? (
        <div style={{ color: 'var(--error)', padding: '1rem', border: '1px solid var(--error)', borderRadius: '12px' }}>{error}</div>
      ) : activeTab === 'projects' ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.5rem' }}>
          {projects.map((project) => (
            <div key={project.id} className="card-minimal" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
                  <span className="identity-champagne" style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem' }}>
                    ◈ {project.category || 'SYSTEM'}
                  </span>
                  {project.featured && (
                    <span style={{ fontSize: '0.7rem', color: 'var(--lime)', fontFamily: 'JetBrains Mono, monospace' }}>★ FEATURED</span>
                  )}
                </div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '0.5rem' }}>{project.title}</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>{project.description}</p>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1rem', borderTop: '1px solid var(--border)' }}>
                <span style={{ fontSize: '0.75rem', fontFamily: 'JetBrains Mono, monospace', color: 'var(--text-muted)' }}>
                  #{project.order_index}
                </span>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button onClick={() => handleOpenEdit(project)} className="btn btn-secondary" style={{ padding: '0.4rem 0.85rem', fontSize: '0.78rem' }}>
                    Edit
                  </button>
                  <button onClick={() => handleDelete(project.id)} className="btn btn-secondary" style={{ padding: '0.4rem 0.85rem', fontSize: '0.78rem', color: 'var(--error)' }}>
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.5rem' }}>
          {seminars.map((seminar) => (
            <div key={seminar.id} className="card-minimal" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
                  <span className="identity-champagne" style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem' }}>
                    ◈ {seminar.organizer || 'ORGANIZER'}
                  </span>
                  <span style={{ fontSize: '0.7rem', color: 'var(--lime)', fontFamily: 'JetBrains Mono, monospace' }}>{seminar.tag}</span>
                </div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '0.5rem' }}>{seminar.title}</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>{seminar.description}</p>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1rem', borderTop: '1px solid var(--border)' }}>
                <span style={{ fontSize: '0.75rem', fontFamily: 'JetBrains Mono, monospace', color: 'var(--text-muted)' }}>
                  #{seminar.order_index}
                </span>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button onClick={() => handleOpenSeminarEdit(seminar)} className="btn btn-secondary" style={{ padding: '0.4rem 0.85rem', fontSize: '0.78rem' }}>
                    Edit
                  </button>
                  <button onClick={() => handleSeminarDelete(seminar.id)} className="btn btn-secondary" style={{ padding: '0.4rem 0.85rem', fontSize: '0.78rem', color: 'var(--error)' }}>
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 100,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '1.5rem',
              background: 'rgba(18, 18, 18, 0.85)',
              backdropFilter: 'blur(12px)',
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="card-minimal"
              style={{ width: '100%', maxWidth: '640px', maxHeight: '88vh', overflowY: 'auto', borderColor: 'var(--champagne)' }}
            >
              <h2 className="identity-champagne" style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1.5rem' }}>
                {editingId ? 'Edit System Project' : 'Add New System Project'}
              </h2>

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <input
                    className="input-minimal"
                    placeholder="TITLE *"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  />
                  <input
                    className="input-minimal"
                    placeholder="CATEGORY"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  />
                </div>

                <textarea
                  className="input-minimal"
                  placeholder="SHORT DESCRIPTION *"
                  required
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />

                <textarea
                  className="input-minimal"
                  placeholder="DETAILED ARCHITECTURE DESCRIPTION"
                  rows={3}
                  value={formData.long_description}
                  onChange={(e) => setFormData({ ...formData, long_description: e.target.value })}
                />

                <input
                  className="input-minimal"
                  placeholder="TECH STACK (comma-separated)"
                  value={formData.tech_stack}
                  onChange={(e) => setFormData({ ...formData, tech_stack: e.target.value })}
                />

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <input
                    className="input-minimal"
                    placeholder="GITHUB URL"
                    type="url"
                    value={formData.github_url}
                    onChange={(e) => setFormData({ ...formData, github_url: e.target.value })}
                  />
                  <input
                    className="input-minimal"
                    placeholder="LIVE URL"
                    type="url"
                    value={formData.live_url}
                    onChange={(e) => setFormData({ ...formData, live_url: e.target.value })}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <input
                      className="input-minimal"
                      placeholder="IMAGE URL"
                      value={formData.image_url}
                      onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                      style={{ flex: 1 }}
                    />
                    <input
                      type="file"
                      accept="image/*"
                      id="project-image-file"
                      style={{ display: 'none' }}
                      onChange={handleProjectImageUpload}
                    />
                    <button
                      type="button"
                      className="btn btn-secondary"
                      style={{ padding: '0 1rem', whiteSpace: 'nowrap', fontSize: '0.8rem' }}
                      onClick={() => document.getElementById('project-image-file').click()}
                      disabled={uploadingProjectImage}
                    >
                      {uploadingProjectImage ? 'Uploading...' : 'Choose File'}
                    </button>
                  </div>
                  <input
                    className="input-minimal"
                    placeholder="ORDER INDEX"
                    type="number"
                    value={formData.order_index}
                    onChange={(e) => setFormData({ ...formData, order_index: e.target.value })}
                  />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <input
                    type="checkbox"
                    id="featured"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    style={{ accentColor: 'var(--lime)', width: '16px', height: '16px' }}
                  />
                  <label htmlFor="featured" style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    Feature on Front Page
                  </label>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
                  <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-secondary">
                    Cancel
                  </button>
                  <button type="submit" disabled={saving} className="btn btn-primary">
                    {saving ? 'Saving...' : editingId ? 'Update Project' : 'Create Project'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isSeminarModalOpen && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 100,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '1.5rem',
              background: 'rgba(18, 18, 18, 0.85)',
              backdropFilter: 'blur(12px)',
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="card-minimal"
              style={{ width: '100%', maxWidth: '640px', maxHeight: '88vh', overflowY: 'auto', borderColor: 'var(--champagne)' }}
            >
              <h2 className="identity-champagne" style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1.5rem' }}>
                {editingSeminarId ? 'Edit Seminar / Workshop' : 'Add New Seminar / Workshop'}
              </h2>

              <form onSubmit={handleSeminarSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <input
                    className="input-minimal"
                    placeholder="TITLE *"
                    required
                    value={seminarFormData.title}
                    onChange={(e) => setSeminarFormData({ ...seminarFormData, title: e.target.value })}
                  />
                  <input
                    className="input-minimal"
                    placeholder="ORGANIZER *"
                    required
                    value={seminarFormData.organizer}
                    onChange={(e) => setSeminarFormData({ ...seminarFormData, organizer: e.target.value })}
                  />
                </div>

                <textarea
                  className="input-minimal"
                  placeholder="DESCRIPTION *"
                  required
                  rows={4}
                  value={seminarFormData.description}
                  onChange={(e) => setSeminarFormData({ ...seminarFormData, description: e.target.value })}
                />

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <input
                    className="input-minimal"
                    placeholder="TAG (e.g. Seminar 01) *"
                    required
                    value={seminarFormData.tag}
                    onChange={(e) => setSeminarFormData({ ...seminarFormData, tag: e.target.value })}
                  />
                  <input
                    className="input-minimal"
                    placeholder="ORDER INDEX"
                    type="number"
                    value={seminarFormData.order_index}
                    onChange={(e) => setSeminarFormData({ ...seminarFormData, order_index: e.target.value })}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
                  <button type="button" onClick={() => setIsSeminarModalOpen(false)} className="btn btn-secondary">
                    Cancel
                  </button>
                  <button type="submit" disabled={saving} className="btn btn-primary">
                    {saving ? 'Saving...' : editingSeminarId ? 'Update Seminar' : 'Create Seminar'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
