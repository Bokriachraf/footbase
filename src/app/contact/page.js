'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

export default function ContactPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Ici tu peux ajouter l'envoi réel (API, mail, etc.)
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen pt-24 pb-24 px-6 bg-gradient-to-br from-yellow-50 to-yellow-100 text-gray-800">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg p-8"
      >
        <h1 className="text-4xl font-bold mb-6 text-center">Contactez-nous</h1>

        {submitted ? (
          <div className="text-green-600 text-center font-semibold text-lg">
            Merci pour votre message, nous vous répondrons bientôt !
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block mb-1 font-medium">
                Nom complet <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                className="w-full border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                placeholder="Votre nom"
              />
            </div>

            <div>
              <label htmlFor="email" className="block mb-1 font-medium">
                Email <span className="text-red-600">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                placeholder="exemple@domaine.com"
              />
            </div>

            <div>
              <label htmlFor="subject" className="block mb-1 font-medium">
                Sujet
              </label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={form.subject}
                onChange={handleChange}
                className="w-full border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                placeholder="Sujet de votre message"
              />
            </div>

            <div>
              <label htmlFor="message" className="block mb-1 font-medium">
                Message <span className="text-red-600">*</span>
              </label>
              <textarea
                id="message"
                name="message"
                rows={5}
                value={form.message}
                onChange={handleChange}
                required
                className="w-full border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400 resize-none"
                placeholder="Votre message ici..."
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full bg-yellow-500 text-black font-semibold py-3 rounded hover:bg-yellow-600 transition"
            >
              Envoyer
            </button>
          </form>
        )}
      </motion.div>
    </div>
  );
}
