import React, { useState, useEffect } from 'react'
import { toast } from 'react-hot-toast'
import { apiService } from '../../services/api'
import GenericCard from './GenericCard'
import GenericModal from './GenericModal'

const ContactManagement = () => {
  const [contacts, setContacts] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [showForm, setShowForm] = useState(false)
  const [editingContact, setEditingContact] = useState(null)
  const [showEditForm, setShowEditForm] = useState(false)

  // Fetch contacts from API
  useEffect(() => {
    fetchContacts()
  }, [])

  const fetchContacts = async () => {
    try {
      setLoading(true)
      const response = await apiService.getContactSubmissions()
      
      if (response.success) {
        setContacts(response.data || [])
      } else {
        console.error('API returned error:', response.error)
        toast.error('Failed to load contacts')
      }
    } catch (error) {
      console.error('Error fetching contacts:', error)
      toast.error('Failed to load contacts')
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (contactId, newStatus) => {
    try {
      // Update with isEdited flag
      const response = await apiService.updateContactStatus(contactId, newStatus, true)

      if (response.success) {
        // Update the contacts list with the edited status and isEdited flag
        setContacts(contacts.map(contact => 
          contact._id === contactId ? {...contact, status: newStatus, isEdited: true} : contact
        ))
        toast.success('Contact status updated successfully')
      } else {
        console.error('API returned error:', response.error)
        toast.error('Failed to update contact status')
      }
    } catch (error) {
      console.error('Error updating contact status:', error)
      toast.error('Failed to update contact status')
    }
  }

  const handleEdit = (contact) => {
    // Mark the contact as edited when admin clicks edit button
    const updatedContact = {...contact, isEdited: true}
    setEditingContact(updatedContact)
    setShowEditForm(true)
  }

  const handleEditSubmit = async (submitData) => {
    try {
      // Make sure isEdited property is included in the update
      const contactToUpdate = {...submitData, isEdited: true}
      const response = await apiService.updateContact(editingContact._id, contactToUpdate)

      if (response.success) {
        // Update the contacts list with the edited contact including all updated fields
        setContacts(contacts.map(contact =>
          contact._id === editingContact._id ? {...contactToUpdate, _id: editingContact._id} : contact
        ))
        toast.success('Contact updated successfully')
      } else {
        console.error('API returned error:', response.error)
        toast.error('Failed to update contact')
      }
      setShowEditForm(false)
      setEditingContact(null)
    } catch (error) {
      console.error('Error updating contact:', error)
      toast.error('Failed to update contact')
      setShowEditForm(false)
      setEditingContact(null)
    }
  }

  const handleDelete = async (contactId) => {
    if (!window.confirm('Are you sure you want to delete this contact?')) {
      return
    }

    try {
      const response = await apiService.deleteContact(contactId)

      if (response.success) {
        setContacts(contacts.filter(contact => contact._id !== contactId))
        toast.success('Contact deleted successfully')
      } else {
        console.error('API returned error:', response.error)
        toast.error('Failed to delete contact')
      }
    } catch (error) {
      console.error('Error deleting contact:', error)
      toast.error('Failed to delete contact')
    }
  }

  const getStatusBadge = (status) => {
    const statusStyles = {
      new: 'bg-blue-100 text-blue-800',
      contacted: 'bg-yellow-100 text-yellow-800',
      resolved: 'bg-green-100 text-green-800'
    }
    
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusStyles[status] || statusStyles.new}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    )
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <>
      <div className="space-y-6">
      {/* Header */}

      {/* Contacts List */}
      <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 rounded-2xl shadow-2xl border border-yellow-400/30 backdrop-blur-sm">
        <div className="px-8 py-6 border-b border-yellow-400/20">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-200 bg-clip-text text-transparent">All Contacts ({contacts.length})</h3>
          </div>
        </div>
        <div className="p-8">
          {contacts.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-yellow-400/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="text-yellow-300 text-lg font-medium">No contacts found</div>
              <p className="text-yellow-300/60 mt-2">Contact submissions will appear here</p>
            </div>
          ) : (
            <div className="grid gap-6">
              {contacts.map((contact) => (
                <GenericCard
                  key={contact._id}
                  item={contact}
                  type="contact"
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  titleField="name"
                  subtitleField="subject"
                  descriptionField="message"
                  dateField="createdAt"
                  fields={[
                    { key: 'email', label: 'Email', className: 'text-yellow-300/70' },
                    { key: 'phone', label: 'Phone', className: 'text-yellow-300/70' }
                  ]}
                  actions={['edit', 'delete']}
                />
              ))}
            </div>
          )}
        </div>
      </div>
      </div>

      {/* Edit Contact Modal */}
      <GenericModal
        isOpen={showEditForm}
        onClose={() => {
          setShowEditForm(false)
          setEditingContact(null)
        }}
        title="Edit Contact"
        onSubmit={handleEditSubmit}
        submitButtonText="Update Contact"
        sections={[
          {
            title: 'Contact Information',
            fields: [
              {
                name: 'name',
                label: 'Name',
                type: 'text',
                required: true,
                placeholder: 'Enter full name'
              },
              {
                name: 'email',
                label: 'Email',
                type: 'email',
                required: true,
                placeholder: 'Enter email address'
              },
              {
                name: 'phone',
                label: 'Phone',
                type: 'tel',
                placeholder: 'Enter phone number'
              },
              {
                name: 'subject',
                label: 'Subject',
                type: 'text',
                required: true,
                placeholder: 'Enter subject'
              }
            ]
          },
          {
            title: 'Message',
            fields: [
              {
                name: 'message',
                label: 'Message',
                type: 'textarea',
                required: true,
                placeholder: 'Enter message',
                rows: 4
              }
            ]
          },
          {
            title: 'Status',
            fields: [
              {
                name: 'status',
                label: 'Status',
                type: 'select',
                options: [
                  { value: 'new', label: 'New' },
                  { value: 'contacted', label: 'Contacted' },
                  { value: 'resolved', label: 'Resolved' }
                ]
              }
            ]
          }
        ]}
        initialData={editingContact ? {
          name: editingContact.name,
          email: editingContact.email,
          phone: editingContact.phone || '',
          subject: editingContact.subject,
          message: editingContact.message,
          status: editingContact.status
        } : {
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: '',
          status: 'new'
        }}
      />
    </>
  )
}

export default ContactManagement