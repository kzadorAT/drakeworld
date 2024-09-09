import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getCreditCardById, updateCreditCard } from '../../api/creditCards';
import CreditCardForm from './CreditCardForm';

const EditCreditCard = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [creditCard, setCreditCard] = useState(null);

  useEffect(() => {
    const fetchCreditCard = async () => {
      try {
        const card = await getCreditCardById(id);
        setCreditCard(card);
      } catch (error) {
        console.error('Error al obtener la tarjeta de crédito:', error);
      }
    };

    fetchCreditCard();
  }, [id]);

  const handleSubmit = async (cardData) => {
    try {
      await updateCreditCard(id, cardData);
      navigate('/expenses');
    } catch (error) {
      console.error('Error al actualizar la tarjeta de crédito:', error);
    }
  };

  if (!creditCard) {
    return <div>Cargando...</div>;
  }

  return (
    <div>
      <h2>Editar Tarjeta de Crédito</h2>
      <CreditCardForm onSubmit={handleSubmit} initialData={creditCard} />
    </div>
  );
};

export default EditCreditCard;
