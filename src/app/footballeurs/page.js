"use client";
import React, { useEffect } from 'react';
import StadiumBackground from "@/components/StadiumBackground";
import { useDispatch, useSelector } from 'react-redux';
import { listFootballeurs } from '../../redux/actions/footballeurActions';

export default function FootballeursPage() {
  const dispatch = useDispatch();

  const footballeurList = useSelector((state) => state.footballeurList || {});
  const { loading, error, footballeurs } = footballeurList;

  useEffect(() => {
    dispatch(listFootballeurs());
  }, [dispatch]);

  return (
    <StadiumBackground>
    <div className="p-8 text-center">
      <h1 className="text-3xl font-bold mb-6">Liste des Footballeurs</h1>
      {loading ? (
        <p>Chargement...</p>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : (
        <div className="grid md:grid-cols-3 gap-4">
          {footballeurs.map((f) => (
            <div key={f._id} className="p-4 bg-yellow-100 rounded-lg shadow">
              <h3 className="font-bold text-lg">{f.name}</h3>
              <p>Poste : {f.position}</p>
              <p>Note moyenne : {f.averageRating || '–'}</p>
            </div>
          ))}
        </div>
      )}
    </div>
    </StadiumBackground>
  );
}
