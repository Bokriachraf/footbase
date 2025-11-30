'use client'

import Image from 'next/image'

export default function AboutPage() {
  return (
    <main className="pt-20 pb-24 px-6 bg-gray-50 text-gray-800 min-h-screen">
      <div className="max-w-5xl mx-auto space-y-12">
        <section className="text-center">
          <h1 className="text-4xl font-bold mb-4">À propos de <span className="text-yellow-500">Icicode</span></h1>
          <p className="text-lg text-gray-600">
            Centre de formation continue en développement Web, Mobile, IA, Data Science, Marketing digital et bien plus encore.
          </p>
        </section>

        <section className="grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="text-2xl font-semibold mb-3">🎯 Notre mission</h2>
            <p className="text-gray-700 leading-relaxed">
              Chez <strong>Icicode</strong>, nous croyons au pouvoir de la technologie pour transformer les carrières.
              Notre mission est d'offrir des formations pratiques et accessibles, en ligne et en présentiel à Tunis, pour préparer nos apprenants à exceller dans les métiers du numérique.
            </p>
          </div>
          <div className="rounded-lg overflow-hidden shadow-md">
            <Image
              src="/icicode-classroom.webp"
              alt="Formation Icicode"
              width={600}
              height={400}
              className="object-cover w-full h-full"
            />
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">🚀 Nos domaines de formation</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>Développement Web & Mobile (Fullstack, React, Node, Flutter…)</li>
            <li>Intelligence Artificielle & Machine Learning</li>
            <li>Data Science & Data Analysis</li>
            <li>Création de jeux vidéo (Unity, Godot)</li>
            <li>Marketing Digital & Community Management</li>
            <li>Management de projet et soft skills</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">💡 Pourquoi nous choisir ?</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>Formations 100% orientées pratique et projets réels</li>
            <li>Accès à des instructeurs expérimentés et disponibles</li>
            <li>Sessions en ligne & en présentiel</li>
            <li>Certificat de fin de formation</li>
          </ul>
        </section>

        <section id="contact">
          <h2 className="text-2xl font-semibold mb-3">📬 Nous contacter</h2>
          <p className="text-gray-700">
            Envie d’en savoir plus sur nos parcours ou de rejoindre une session ? Contactez-nous sur <a href="mailto:contact@icicode.tn" className="text-blue-600 underline">contact@icicode.tn</a> ou rendez-vous sur la page <a href="/contact" className="text-blue-600 underline">Contact</a>.
          </p>
        </section>
      </div>
    </main>
  )
}
