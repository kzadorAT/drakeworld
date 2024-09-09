import React, { useState, useEffect } from 'react';
import { getActiveExpenses, getAllExpenses, deleteExpense, createExpense, updateExpense } from '../../api/expenses';
import { getCreditCards } from '../../api/creditCards';
import { Link } from 'react-router-dom';
import ExpenseForm from './ExpenseForm';

const ExpenseList = () => {
  const [expenses, setExpenses] = useState([]);
  const [editingExpense, setEditingExpense] = useState(null);
  const [showAllExpenses, setShowAllExpenses] = useState(false);
  const [creditCards, setCreditCards] = useState({});

  useEffect(() => {
    fetchExpenses();
    fetchCreditCards();
  }, [showAllExpenses]);

  const fetchExpenses = async () => {
    try {
      const fetchedExpenses = showAllExpenses ? await getAllExpenses() : await getActiveExpenses();
      setExpenses(fetchedExpenses);
    } catch (error) {
      console.error('Error al obtener gastos:', error);
    }
  };

  const fetchCreditCards = async () => {
    try {
      const cards = await getCreditCards();
      const cardsMap = cards.reduce((acc, card) => {
        acc[card.id] = card;
        return acc;
      }, {});
      setCreditCards(cardsMap);
    } catch (error) {
      console.error('Error al obtener tarjetas de crédito:', error);
    }
  };

  const handleCreateExpense = async (expenseData) => {
    try {
      await createExpense(expenseData);
      fetchExpenses();
    } catch (error) {
      console.error('Error al crear gasto:', error);
    }
  };

  const handleUpdateExpense = async (id, expenseData) => {
    try {
      await updateExpense(id, expenseData);
      fetchExpenses();
      setEditingExpense(null);
    } catch (error) {
      console.error('Error al actualizar gasto:', error);
    }
  };

  const handleDeleteExpense = async (id) => {
    try {
      await deleteExpense(id);
      fetchExpenses();
    } catch (error) {
      console.error('Error al eliminar gasto:', error);
    }
  };

  return (
    <div>
      <h2>Gastos</h2>
      <button onClick={() => setShowAllExpenses(!showAllExpenses)}>
        {showAllExpenses ? 'Mostrar gastos activos' : 'Mostrar todos los gastos'}
      </button>
      <ExpenseForm onSubmit={handleCreateExpense} />
      <ul>
        {expenses.map((expense) => (
          <li key={expense.id}>
            {editingExpense === expense.id ? (
              <ExpenseForm
                onSubmit={(expenseData) => handleUpdateExpense(expense.id, expenseData)}
                initialData={expense}
                onCancel={() => setEditingExpense(null)}
              />
            ) : (
              <>
                <p><strong>Tipo:</strong> {expense.type}</p>
                <p><strong>Monto:</strong> ${expense.amount.toFixed(2)}</p>
                <p><strong>Método de pago:</strong> {expense.payment_method}</p>
                {expense.card_id && (
                  <p>
                    <strong>Tarjeta de crédito:</strong> {creditCards[expense.card_id]?.card_issuer} - {creditCards[expense.card_id]?.bank_issuer}
                    <Link to={`/credit-cards/${expense.card_id}`}>
                      <button>Editar tarjeta</button>
                    </Link>
                  </p>
                )}
                {expense.installments && <p><strong>Cuotas:</strong> {expense.installments}</p>}
                <p><strong>Fecha de creación:</strong> {new Date(expense.creation_date).toLocaleString()}</p>
                {expense.delete_date && <p><strong>Fecha de eliminación:</strong> {new Date(expense.delete_date).toLocaleString()}</p>}
                {!expense.delete_date && (
                  <>
                    <button onClick={() => setEditingExpense(expense.id)}>Editar</button>
                    <button onClick={() => handleDeleteExpense(expense.id)}>Eliminar</button>
                  </>
                )}
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ExpenseList;
