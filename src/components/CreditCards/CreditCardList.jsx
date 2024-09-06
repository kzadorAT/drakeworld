import React, { useState, useEffect } from 'react';
import { getCreditCards, createCreditCard, updateCreditCard, deleteCreditCard } from '../../api/creditCards';
import CreditCardForm from './CreditCardForm';

const CreditCardList = () => {
  const [creditCards, setCreditCards] = useState([]);
  const [editingCard, setEditingCard] = useState(null);

  useEffect(() => {
    fetchCreditCards();
  }, []);

  const fetchCreditCards = async () => {
    try {
      const cards = await getCreditCards();
      // Filtrar las tarjetas que no han sido borradas
      const activeCards = cards.filter(card => card.delete_date === null);
      setCreditCards(activeCards);
    } catch (error) {
      console.error('Error al obtener las tarjetas de crédito:', error);
    }
  };

  const handleCreateCard = async (cardData) => {
    try {
      await createCreditCard(cardData);
      fetchCreditCards();
    } catch (error) {
      console.error('Error creating credit card:', error);
    }
  };

  const handleUpdateCard = async (id, cardData) => {
    try {
      await updateCreditCard(id, cardData);
      fetchCreditCards();
      setEditingCard(null);
    } catch (error) {
      console.error('Error updating credit card:', error);
    }
  };

  const handleDeleteCard = async (id) => {
    try {
      await deleteCreditCard(id);
      fetchCreditCards();
    } catch (error) {
      console.error('Error deleting credit card:', error);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', { year: 'numeric', month: '2-digit', day: '2-digit' });
  };

  return (
    <div>
      <h2>Tarjetas de Crédito</h2>
      <CreditCardForm onSubmit={handleCreateCard} />
      <ul>
        {creditCards.map((card) => (
          <li key={card.id}>
            {editingCard === card.id ? (
              <CreditCardForm
                onSubmit={(cardData) => handleUpdateCard(card.id, cardData)}
                initialData={{
                  ...card,
                  closing_date: card.closing_date.split('T')[0],
                  due_date: card.due_date.split('T')[0],
                  expiration_date: card.expiration_date.split('T')[0],
                }}
                onCancel={() => setEditingCard(null)}
              />
            ) : (
              <>
                <p><strong>Emisor:</strong> {card.card_issuer}</p>
                <p><strong>Banco:</strong> {card.bank_issuer}</p>
                <p><strong>Fecha de cierre:</strong> {formatDate(card.closing_date)}</p>
                <p><strong>Fecha de vencimiento:</strong> {formatDate(card.due_date)}</p>
                <p><strong>Fecha de expiración:</strong> {formatDate(card.expiration_date)}</p>
                <button onClick={() => setEditingCard(card.id)}>Editar</button>
                <button onClick={() => handleDeleteCard(card.id)}>Eliminar</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CreditCardList;