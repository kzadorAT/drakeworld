import React, { useState, useEffect } from "react";

const RedeemHistory = ({ userId, reloadData }) => {
    const [redeems, setRedeems] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchRedeems = async () => {
            try {
                const response = await fetch(`https://drakeworld-backend.vercel.app/api/redeems/user/${userId}`);
                const data = await response.json();
                setRedeems(data.sort((a, b) => new Date(b.redeemed_at) - new Date(a.redeemed_at)));
            } catch (error) {
                setError('Error al obtener el historial de canjes');
                console.error('Error fetching redeems:', error);
            }
        };

        fetchRedeems();
    }, [userId, reloadData]);

    return (
        <div>
            <h2>Historial de canjes</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <table>
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Fecha de Canje</th>
                        <th>Entregado</th>
                    </tr>
                </thead>
                <tbody>
                    {redeems.map((redeem) => (
                        <tr key={redeem.id}>
                            <td>{redeem.gift_name}</td>
                            <td>{new Date(redeem.redeemed_at).toLocaleDateString()}</td>
                            <td>{redeem.delivered ? 'Si' : 'No'}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default RedeemHistory;