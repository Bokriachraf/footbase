'use client'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { listFootballeurs, deleteFootballeur } from '../../../redux/actions/footballeurActions'
import { Loader2, Trash2 } from 'lucide-react'
import { toast } from 'react-toastify'

export default function ClientsListPage() {
  const dispatch = useDispatch()

  const footballeurList = useSelector((state) => state.footballeurList)
  const { loading, error, footballeurs } = footballeurList || {}

  const footballeurDelete = useSelector((state) => state.footballeurDelete)
  const { loading: loadingDelete, success: successDelete, error: errorDelete } = footballeurDelete || {}

  useEffect(() => {
    dispatch(listFootballeurs())
  }, [dispatch, successDelete])

  const deleteHandler = (id) => {
    if (window.confirm('Confirmer la suppression de cet utilisateur ?')) {
      dispatch(deleteFootballeur(id))
    }
  }

  return (
    <div className="p-8 min-h-screen bg-gray-100 pt-20">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">📋 Liste des clients enregistrés</h1>

      {loading || loadingDelete ? (
        <div className="flex items-center text-gray-600">
          <Loader2 className="animate-spin mr-2" />
          Chargement...
        </div>
      ) : error || errorDelete ? (
        <div className="text-red-600 font-semibold">{error || errorDelete}</div>
      ) : (
        <table className="min-w-full bg-white shadow rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-gray-200 text-sm text-gray-700 text-left">
              <th className="p-3">Nom</th>
              <th className="p-3">Email</th>
              <th className="p-3">Rôle</th>
              <th className="p-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {footballeurs?.map((footballeur) => (
              <tr key={footballeur._id} className="border-t hover:bg-gray-50">
                <td className="p-3">{footballeur.name}</td>
                <td className="p-3">{footballeur.email}</td>
                <td className="p-3">
                  {footballeur.isAdmin ? (
                    <span className="text-green-600 font-semibold">Admin</span>
                  ) : (
                    'Client'
                  )}
                </td>
                <td className="p-3 text-center">
                  {!footballeur.isAdmin && (
                    <button
                      onClick={() => deleteHandler(footballeur._id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded flex items-center justify-center mx-auto"
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      Supprimer
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
