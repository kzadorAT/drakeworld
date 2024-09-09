import React, { useState, useEffect } from 'react';

const CreditCardForm = ({ onSubmit, initialData, onCancel }) => {
  const [formData, setFormData] = useState({
    card_issuer: '',
    bank_issuer: '',
    closing_date: '',
    due_date: '',
    expiration_date: '',
  });

  useEffect(() => {
    if (initialData) {
      // Convertir las fechas al formato YYYY-MM-DD para los inputs de tipo date
      setFormData({
        ...initialData,
        closing_date: formatDateForInput(initialData.closing_date),
        due_date: formatDateForInput(initialData.due_date),
        expiration_date: formatDateForInput(initialData.expiration_date),
      });
    }
  }, [initialData]);

  const formatDateForInput = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

  const formatDateForSubmit = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString();
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Convertir las fechas al formato ISO 8601 antes de enviar
    const submittedData = {
      ...formData,
      closing_date: formatDateForSubmit(formData.closing_date),
      due_date: formatDateForSubmit(formData.due_date),
      expiration_date: formatDateForSubmit(formData.expiration_date),
    };
    onSubmit(submittedData);
  };

  return (
    <form onSubmit={handleSubmit} className="credit-card-form">
      <div>
        <label htmlFor="card_issuer">Emisor de la tarjeta:</label>
        <input
          type="text"
          id="card_issuer"
          name="card_issuer"
          value={formData.card_issuer}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label htmlFor="bank_issuer">Banco emisor:</label>
        <input
          type="text"
          id="bank_issuer"
          name="bank_issuer"
          value={formData.bank_issuer}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label htmlFor="closing_date">Fecha de cierre:</label>
        <input
          type="date"
          id="closing_date"
          name="closing_date"
          value={formData.closing_date}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label htmlFor="due_date">Fecha de vencimiento:</label>
        <input
          type="date"
          id="due_date"
          name="due_date"
          value={formData.due_date}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label htmlFor="expiration_date">Fecha de expiración:</label>
        <input
          type="date"
          id="expiration_date"
          name="expiration_date"
          value={formData.expiration_date}
          onChange={handleChange}
          required
        />
      </div>
      <button type="submit">{initialData ? 'Actualizar' : 'Crear'}</button>
      {onCancel && <button type="button" onClick={onCancel}>Cancelar</button>}
    </form>
  );
};

export default CreditCardForm;
