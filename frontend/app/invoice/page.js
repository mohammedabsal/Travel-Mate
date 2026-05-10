'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const demoInvoice = {
  id: 'INV-XYZ-30290',
  trip: {
    title: 'Trip to Europe Adventure',
    dates: 'May 15 - Jun 05, 2025',
    stops: 4,
    owner: 'James'
  },
  travelers: ['James', 'Arjun', 'Jenny', 'Cristina'],
  generated: 'May 20, 2025',
  status: 'pending',
  items: [
    { id: 1, category: 'hotel', description: 'hotel booking paris', qty: '3 nights', unit: 3000, amount: 9000 },
    { id: 2, category: 'travel', description: 'flight bookings (DEL -> PAR)', qty: '1', unit: 12000, amount: 12000 }
  ],
  subtotal: 21000,
  tax: 1050,
  discount: 50,
  total: 22000
};

export default function InvoicePage() {
  const [invoice] = useState(demoInvoice);

  function downloadInvoice() {
    alert('Download invoice (placeholder)');
  }

  function exportPdf() {
    alert('Export as PDF (placeholder)');
  }

  function markPaid() {
    alert('Mark as paid (placeholder)');
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-8">
      <div className="mb-4">
        <a href="/trips" className="text-sm text-muted-foreground">&larr; back to My Trips</a>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2">
          <Card className="mb-6 rounded-lg">
            <CardContent>
              <div className="flex items-start justify-between gap-6">
                <div className="flex gap-4">
                  <div className="h-24 w-24 rounded bg-muted" />
                  <div>
                    <h4 className="text-lg font-semibold">{invoice.trip.title}</h4>
                    <p className="text-sm text-muted-foreground">{invoice.trip.dates} · {invoice.trip.stops} stops</p>
                    <p className="text-xs text-muted-foreground">created by {invoice.trip.owner}</p>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-sm">Invoice Id</div>
                  <div className="font-medium">{invoice.id}</div>
                  <div className="mt-2 text-sm">Generated date</div>
                  <div className="font-medium">{invoice.generated}</div>
                  <div className="mt-2 text-sm">Payment status - <span className="font-medium">{invoice.status}</span></div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-lg">
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full table-auto border-collapse">
                  <thead>
                    <tr className="text-left">
                      <th className="p-3 border">#</th>
                      <th className="p-3 border">Category</th>
                      <th className="p-3 border">Description</th>
                      <th className="p-3 border">Qty/details</th>
                      <th className="p-3 border">Unit Cost</th>
                      <th className="p-3 border">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoice.items.map((it) => (
                      <tr key={it.id}>
                        <td className="p-3 border">{it.id}</td>
                        <td className="p-3 border">{it.category}</td>
                        <td className="p-3 border">{it.description}</td>
                        <td className="p-3 border">{it.qty}</td>
                        <td className="p-3 border">{it.unit}</td>
                        <td className="p-3 border">{it.amount}</td>
                      </tr>
                    ))}

                    {/* empty rows for spacing */}
                    {Array.from({ length: 6 }).map((_, i) => (
                      <tr key={`e${i}`}>
                        <td className="p-3 border">&nbsp;</td>
                        <td className="p-3 border">&nbsp;</td>
                        <td className="p-3 border">&nbsp;</td>
                        <td className="p-3 border">&nbsp;</td>
                        <td className="p-3 border">&nbsp;</td>
                        <td className="p-3 border">&nbsp;</td>
                      </tr>
                    ))}

                    <tr>
                      <td colSpan="5" className="p-3 border text-right">Subtotal</td>
                      <td className="p-3 border text-right">${invoice.subtotal}</td>
                    </tr>
                    <tr>
                      <td colSpan="5" className="p-3 border text-right">tax(5%)</td>
                      <td className="p-3 border text-right">${invoice.tax}</td>
                    </tr>
                    <tr>
                      <td colSpan="5" className="p-3 border text-right">Discount</td>
                      <td className="p-3 border text-right">${invoice.discount}</td>
                    </tr>
                    <tr>
                      <td colSpan="5" className="p-3 border text-right font-bold">Grand Total</td>
                      <td className="p-3 border text-right font-bold">${invoice.total}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          <div className="mt-4 flex items-center gap-4">
            <Button variant="outline" onClick={downloadInvoice}>Download Invoice</Button>
            <Button variant="outline" onClick={exportPdf}>Export as PDF</Button>
            <div className="flex-1" />
            <Button onClick={markPaid}>Mark as paid</Button>
          </div>
        </div>

        <aside>
          <Card className="rounded-lg p-4">
            <CardContent>
              <div className="mb-4">
                <h5 className="text-sm font-medium">Budget Insights</h5>
              </div>
              <div className="mb-4 flex items-center justify-center">
                <div className="h-36 w-36 rounded-full bg-sky-200" />
              </div>
              <div className="text-sm">
                <div>Total Budget: {invoice.total}</div>
                <div>Total spent: {invoice.subtotal + invoice.tax}</div>
                <div>Remaining: {invoice.total - (invoice.subtotal + invoice.tax)}</div>
              </div>
              <div className="mt-4">
                <Button variant="outline">View Full Budget</Button>
              </div>
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  );
}
