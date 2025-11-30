import Shipment from '../models/Shipment.js'

// @desc    Récupérer toutes les expéditions
// @route   GET /api/shipments
export const getShipments = async (req, res) => {
  try {
    const shipments = await Shipment.find()
    res.status(200).json(shipments)
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message })
  }
}

// @desc    Ajouter une expédition
// @route   POST /api/shipments
export const addShipment = async (req, res) => {
  try {
    const { name } = req.body
    if (!name) {
      return res.status(400).json({ message: 'Le champ name est requis.' })
    }

    const newShipment = new Shipment({ name })
    const savedShipment = await newShipment.save()

    res.status(201).json(savedShipment)
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message })
  }
}