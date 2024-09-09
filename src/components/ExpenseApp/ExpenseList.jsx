import React, { useState, useEffect } from 'react';
import { getActiveExpenses, getAllExpenses, deleteExpense, createExpense, updateExpense } from '../../api/expenses';
import { getCreditCards } from '../../api/creditCards';
import ExpenseForm from './ExpenseForm';
import ExpenseChart from './ExpenseChart';
import Modal from 'react-modal';
import './Expenses.css';
import './Modal.css';

Modal.setAppElement('#root');

const ExpenseList = () => {
  const [expenses, setExpenses] = useState([]);
  const [editingExpense, setEditingExpense] = useState(null);
  const [showAllExpenses, setShowAllExpenses] = useState(false);
  const [creditCards, setCreditCards] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);

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
      setIsModalOpen(false);
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

  const openEditModal = (expense) => {
    setEditingExpense(expense);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setEditingExpense(null);
    setIsModalOpen(false);
  };

  return (
    <div className="expense-page">
      <div className="sidebar">
        <h2>Gastos</h2>
        <button onClick={() => setIsModalOpen(true)}>Agregar gasto</button>
        <button onClick={() => setShowAllExpenses(!showAllExpenses)}>
          {showAllExpenses ? 'Mostrar gastos activos' : 'Mostrar todos los gastos'}
        </button>
        <ul className="expense-list">
          {expenses.map((expense) => (
            <li key={expense.id} className="expense-item">
              <p><strong>{expense.type}</strong> - ${expense.amount.toFixed(2)}</p>
              <p>{expense.payment_method}</p>
              <button onClick={() => openEditModal(expense)}>Editar</button>
              <button onClick={() => handleDeleteExpense(expense.id)}>Eliminar</button>
            </li>
          ))}
        </ul>
      </div>
      <div className="main-content">
        <ExpenseChart expenses={expenses} />
      </div>
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel={editingExpense ? "Editar gasto" : "Agregar nuevo gasto"}
        className="modal-content"
        overlayClassName="modal-overlay"
      >
        <div className="modal-header">
          <h2>{editingExpense ? "Editar gasto" : "Agregar nuevo gasto"}</h2>
          <button onClick={closeModal} className="close-button">&times;</button>
        </div>
        <ExpenseForm
          onSubmit={(expenseData) => {
            if (editingExpense) {
              handleUpdateExpense(editingExpense.id, expenseData);
            } else {
              handleCreateExpense(expenseData);
            }
            closeModal();
          }}
          initialData={editingExpense}
          onCancel={closeModal}
        />
      </Modal>
    </div>
  );
};

export default ExpenseList;
