import React, { useState, useEffect } from 'react'
import { toast } from 'react-hot-toast'
import { apiService } from '../../services/api'

const ContactManagement = () => {
  const [contacts, setContacts] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [showForm, setShowForm] = useState(false)
  const [editingContact, setEditingContact] = useState(null)
  const [showEditForm, setShowEditForm] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    status: 'new' // Default status is 'new'
  })

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
        // Fallback to mock data if API fails
        console.error('API returned error:', response.error)
        setContacts(mockContacts)
        toast.error('Failed to load contacts')
      }
    } catch (error) {
      console.error('Error fetching contacts:', error)
      setContacts(mockContacts)
      toast.error('Failed to load contacts')
    } finally {
      setLoading(false)
    }
  }

  // Mock contacts data
  const mockContacts = [
    {
      _id: 1,
      id: 1,
      name: 'John Smith',
      email: 'john.smith@email.com',
      phone: '+971 50 123 4567',
      subject: 'Property Inquiry',
      message: 'I am interested in luxury properties in Downtown Dubai.',
      status: 'new',
      createdAt: new Date().toISOString()
    },
    {
      _id: 2,
      id: 2,
      name: 'Sarah Johnson',
      email: 'sarah.j@email.com',
      phone: '+971 55 987 6543',
      subject: 'Investment Consultation',
      message: 'Looking for investment opportunities in off-plan properties.',
      status: 'contacted',
      createdAt: new Date(Date.now() - 86400000).toISOString()
    },
    {
      _id: 3,
      id: 3,
      name: 'Ahmed Al-Rashid',
      email: 'ahmed.rashid@email.com',
      phone: '+971 52 456 7890',
      subject: 'Property Management',
      message: 'Need property management services for my villa in Palm Jumeirah.',
      status: 'resolved',
      createdAt: new Date(Date.now() - 172800000).toISOString()
    }
  ]

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

  const handleEditSubmit = async (e) => {
    e.preventDefault()
    try {
      // Make sure isEdited property is included in the update
      const contactToUpdate = {...editingContact, isEdited: true}
      const response = await apiService.updateContact(contactToUpdate._id, contactToUpdate)

      if (response.success) {
        // Update the contacts list with the edited contact including all updated fields
        setContacts(contacts.map(contact => 
          contact._id === contactToUpdate._id ? {...contactToUpdate, isEdited: true} : contact
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
    <div className="bg-black shadow rounded-lg border border-yellow-400/30">
      {/* Header */}
      <div className="px-6 py-4 border-b border-yellow-400/30">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-medium text-yellow-400">Contact Management</h2>
          <div className="text-sm text-yellow-300/70">
            Total Contacts: {contacts.length}
          </div>
        </div>
      </div>

      {/* Contacts List */}
      <div className="overflow-x-auto">
        {contacts.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-yellow-300/70 text-lg mb-2">No contacts found</div>
            <p className="text-yellow-300/50">Contact submissions will appear here</p>
          </div>
        ) : (
          <table className="min-w-full divide-y divide-yellow-400/30">
            <thead className="bg-gray-900">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-yellow-400 uppercase tracking-wider">
                  Contact Info
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-yellow-400 uppercase tracking-wider">
                  Subject
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-yellow-400 uppercase tracking-wider">
                  Message
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-yellow-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-yellow-400 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-yellow-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-black divide-y divide-yellow-400/30">
              {contacts.map((contact) => (
                <tr key={contact._id} className="hover:bg-gray-800">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-yellow-300">{contact.name}</div>
                      <div className="text-sm text-yellow-300/70">{contact.email}</div>
                      <div className="text-sm text-yellow-300/70">{contact.phone}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-yellow-300">{contact.subject}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-yellow-300 max-w-xs truncate" title={contact.message}>
                      {contact.message}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(contact.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-yellow-300/70">
                    {formatDate(contact.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleEdit(contact)}
                      className="text-yellow-400 hover:text-yellow-300 transition-colors mr-4"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(contact._id)}
                      className="text-red-400 hover:text-red-300 transition-colors"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Edit Contact Modal */}
      {showEditForm && editingContact && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Edit Contact</h3>
              <form onSubmit={handleEditSubmit}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    value={editingContact.name}
                    onChange={(e) => setEditingContact({...editingContact, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={editingContact.email}
                    onChange={(e) => setEditingContact({...editingContact, email: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={editingContact.phone}
                    onChange={(e) => setEditingContact({...editingContact, phone: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    value={editingContact.subject}
                    onChange={(e) => setEditingContact({...editingContact, subject: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message
                  </label>
                  <textarea
                    value={editingContact.message}
                    onChange={(e) => setEditingContact({...editingContact, message: e.target.value})}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    value={editingContact.status}
                    onChange={(e) => setEditingContact({...editingContact, status: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="new">New</option>
                    <option value="contacted">Contacted</option>
                    <option value="resolved">Resolved</option>
                  </select>
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowEditForm(false)
                      setEditingContact(null)
                    }}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Update Contact
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ContactManagement