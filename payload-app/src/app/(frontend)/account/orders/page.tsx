import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getCustomerIdFromPayload, getOrdersForCustomer } from '@/lib/emporix';

const STATUS_STYLES: Record<string, { bg: string; color: string }> = {
    CREATED: { bg: '#eef2ff', color: '#4338ca' },
    CONFIRMED: { bg: '#f3f4f6', color: '#374151' },
    DECLINED: { bg: '#fee2e2', color: '#dc2626' },
};

const DEFAULT_STATUS = { bg: '#f3f4f6', color: '#374151' };

const ACCENT = '#5145cd';
const CURRENCY = 'EUR';

function formatDate(iso: string) {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return iso;
    return d.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

function formatMoney(value: number) {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: CURRENCY }).format(value);
}

export default async function OrdersPage() {
    const cookieStore = await cookies();
    const token = cookieStore.get('payload-token')?.value;
    const customerId = token ? await getCustomerIdFromPayload(token) : null;

    if (!customerId) redirect('/');

    const orders = await getOrdersForCustomer(customerId);

    return (
        <div style={{
            minHeight: '100vh',
            fontFamily: 'system-ui, -apple-system, sans-serif',
            backgroundColor: '#f9fafb',
        }}>
            <div style={{ backgroundColor: ACCENT, padding: '48px 32px' }}>
                <div style={{ maxWidth: '900px', margin: '0 auto' }}>
                    <h1 style={{ margin: 0, fontSize: '32px', fontWeight: '800', color: '#ffffff' }}>
                        Order History
                    </h1>
                </div>
            </div>

            <div style={{ maxWidth: '900px', margin: '0 auto', padding: '32px' }}>
                <div style={{
                    backgroundColor: '#ffffff',
                    borderRadius: '12px',
                    border: '1px solid #e5e7eb',
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
                    overflow: 'hidden',
                }}>
                    {orders.length === 0 ? (
                        <div style={{ padding: '48px', textAlign: 'center', color: '#6b7280', fontSize: '15px' }}>
                            No orders found.
                        </div>
                    ) : (
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                                <thead>
                                    <tr style={{ borderBottom: '1px solid #e5e7eb', backgroundColor: '#f9fafb' }}>
                                        <th style={{ textAlign: 'left', padding: '14px 20px', color: '#374151', fontWeight: '600', whiteSpace: 'nowrap' }}>Order</th>
                                        <th style={{ textAlign: 'left', padding: '14px 20px', color: '#374151', fontWeight: '600', whiteSpace: 'nowrap' }}>Date</th>
                                        <th style={{ textAlign: 'left', padding: '14px 20px', color: '#374151', fontWeight: '600', whiteSpace: 'nowrap' }}>Status</th>
                                        <th style={{ textAlign: 'right', padding: '14px 20px', color: '#374151', fontWeight: '600', whiteSpace: 'nowrap' }}>Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orders.map((order, i) => {
                                        const statusStyle = STATUS_STYLES[order.status] ?? DEFAULT_STATUS;
                                        return (
                                            <tr key={order.id} style={{
                                                backgroundColor: i % 2 === 1 ? '#fafafa' : '#ffffff',
                                                borderBottom: i === orders.length - 1 ? 'none' : '1px solid #f3f4f6',
                                            }}>
                                                <td style={{ padding: '16px 20px' }}>
                                                    <span style={{ color: ACCENT, fontWeight: '600' }}>
                                                        {order.orderNumber}
                                                    </span>
                                                </td>
                                                <td style={{ padding: '16px 20px', color: '#374151', whiteSpace: 'nowrap' }}>
                                                    {formatDate(order.orderDate)}
                                                </td>
                                                <td style={{ padding: '16px 20px' }}>
                                                    <span style={{
                                                        display: 'inline-block',
                                                        padding: '4px 10px',
                                                        borderRadius: '6px',
                                                        fontSize: '11px',
                                                        fontWeight: '700',
                                                        letterSpacing: '0.03em',
                                                        backgroundColor: statusStyle.bg,
                                                        color: statusStyle.color,
                                                    }}>{order.status}</span>
                                                </td>
                                                <td style={{ padding: '16px 20px', color: '#111827', fontWeight: '600', whiteSpace: 'nowrap', textAlign: 'right' }}>
                                                    {formatMoney(order.total)}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}