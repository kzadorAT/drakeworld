import React, { useState, useEffect } from 'react';
import { getCreditCards, createCreditCard } from '../../api/creditCards';
import Modal from 'react-modal';
import CreditCardForm from '../CreditCards/CreditCardForm';
import './Modal.css';

Modal.setAppElement('#root'); // Asegúrate de que esto apunte al elemento raíz de tu aplicación

const ExpenseForm = ({ onSubmit, initialData, onCancel }) => {
  const [formData, setFormData] = useState({
    type: '',
    amount: '',
    payment_method: '',
    card_id: '',
    installments: '',
  });
  const [creditCards, setCreditCards] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
    fetchCreditCards();
  }, [initialData]);

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

  const handleAddCreditCard = async (cardData) => {
    try {
      await createCreditCard(cardData);
      fetchCreditCards();
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error al crear la tarjeta de crédito:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: type === 'number' ? (value === '' ? '' : parseFloat(value)) : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    if (!initialData) {
      setFormData({
        type: '',
        amount: '',
        payment_method: '',
        card_id: '',
        installments: '',
      });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="type">Tipo de gasto:</label>
        <input
          type="text"
          id="type"
          name="type"
          value={formData.type}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label htmlFor="amount">Monto:</label>
        <input
          type="number"
          id="amount"
          name="amount"
          value={formData.amount}
          onChange={handleChange}
          step="0.01"
          required
        />
      </div>
      <div>
        <label htmlFor="payment_method">Método de pago:</label>
        <input
          type="text"
          id="payment_method"
          name="payment_method"
          value={formData.payment_method}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label htmlFor="card_id">Tarjeta de crédito (opcional):</label>
        <select
          id="card_id"
          name="card_id"
          value={formData.card_id}
          onChange={handleChange}
        >
          <option value="">Seleccione una tarjeta</option>
          {creditCards.map((card) => (
            <option key={card.id} value={card.id}>
              {card.card_issuer} - {card.bank_issuer}
            </option>
          ))}
        </select>
        <button type="button" onClick={() => setIsModalOpen(true)}>
          Añadir nueva tarjeta
        </button>
      </div>
      <div>
        <label htmlFor="installments">Cuotas (opcional):</label>
        <input
          type="number"
          id="installments"
          name="installments"
          value={formData.installments}
          onChange={handleChange}
        />
      </div>
      <button type="submit">{initialData ? 'Actualizar' : 'Crear'}</button>
      {onCancel && <button type="button" onClick={onCancel}>Cancelar</button>}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        contentLabel="Añadir nueva tarjeta de crédito"
        className="ReactModal__Content"
        overlayClassName="ReactModal__Overlay"
      >
        <div className="modal-header">
          <h2>Añadir nueva tarjeta de crédito</h2>
          <button className="close-button" onClick={() => setIsModalOpen(false)}>&times;</button>
        </div>
        <CreditCardForm onSubmit={handleAddCreditCard} onCancel={() => setIsModalOpen(false)} />
      </Modal>
    </form>
  );
};

export default ExpenseForm;
