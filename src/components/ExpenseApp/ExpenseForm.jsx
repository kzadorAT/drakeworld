import React, { useState, useEffect } from 'react';

const ExpenseForm = ({ onSubmit, initialData, onCancel }) => {
  const [formData, setFormData] = useState({
    type: '',
    amount: '',
    payment_method: '',
    card_id: '',
    installments: '',
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

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
        <label htmlFor="card_id">ID de tarjeta (opcional):</label>
        <input
          type="number"
          id="card_id"
          name="card_id"
          value={formData.card_id}
          onChange={handleChange}
        />
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
    </form>
  );
};

export default ExpenseForm;
