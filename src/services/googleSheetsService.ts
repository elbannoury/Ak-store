import type { CartItem } from '@/store/cartStore';

// Google Sheets Service for order management
export class GoogleSheetsService {
  private scriptUrl: string;

  constructor(scriptUrl: string) {
    this.scriptUrl = scriptUrl;
  }

  // Submit order to Google Sheets
  async submitOrder(
    items: CartItem[],
    customerInfo: {
      name: string;
      phone: string;
      email?: string;
      address: string;
      city: string;
      notes?: string;
    },
    totalPrice: number
  ): Promise<{ success: boolean; message: string; orderId?: string }> {
    if (!this.scriptUrl) {
      return {
        success: false,
        message: 'Google Sheets not configured.',
      };
    }

    try {
      const orderId = `AK-${Date.now()}`;
      const itemsJson = JSON.stringify(items);

      const formData = new FormData();
      formData.append('orderId', orderId);
      formData.append('customerName', customerInfo.name);
      formData.append('phone', customerInfo.phone);
      formData.append('email', customerInfo.email || '');
      formData.append('address', customerInfo.address);
      formData.append('city', customerInfo.city);
      formData.append('items', itemsJson);
      formData.append('total', totalPrice.toString());
      formData.append('notes', customerInfo.notes || '');
      formData.append('timestamp', new Date().toISOString());

      const response = await fetch(this.scriptUrl, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        await response.json();
        return {
          success: true,
          message: 'Order saved successfully!',
          orderId: orderId,
        };
      } else {
        throw new Error('Failed to submit order');
      }
    } catch (error) {
      console.error('Google Sheets Error:', error);
      return {
        success: false,
        message: 'Failed to save order. Please try again.',
      };
    }
  }

  // Get all orders (for admin dashboard)
  async getOrders(): Promise<any[]> {
    if (!this.scriptUrl) {
      return [];
    }

    try {
      const response = await fetch(`${this.scriptUrl}?action=getOrders`);
      if (response.ok) {
        return await response.json();
      }
      return [];
    } catch (error) {
      console.error('Error fetching orders:', error);
      return [];
    }
  }

  // Update order status
  async updateOrderStatus(
    orderId: string,
    status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled'
  ): Promise<boolean> {
    if (!this.scriptUrl) {
      return false;
    }

    try {
      const formData = new FormData();
      formData.append('action', 'updateStatus');
      formData.append('orderId', orderId);
      formData.append('status', status);

      const response = await fetch(this.scriptUrl, {
        method: 'POST',
        body: formData,
      });

      return response.ok;
    } catch (error) {
      console.error('Error updating order:', error);
      return false;
    }
  }
}

// Create default instance
export const googleSheetsService = new GoogleSheetsService(
  import.meta.env.VITE_GOOGLE_SHEETS_URL || ''
);

// Google Apps Script for Sheet (copy this to your Google Apps Script project):
/*
function doPost(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  
  const orderId = e.parameter.orderId;
  const customerName = e.parameter.customerName;
  const phone = e.parameter.phone;
  const email = e.parameter.email;
  const address = e.parameter.address;
  const city = e.parameter.city;
  const items = e.parameter.items;
  const total = e.parameter.total;
  const notes = e.parameter.notes;
  const timestamp = e.parameter.timestamp;
  
  sheet.appendRow([
    orderId,
    timestamp,
    customerName,
    phone,
    email,
    address,
    city,
    items,
    total,
    notes,
    'pending' // status
  ]);
  
  return ContentService.createTextOutput(JSON.stringify({
    success: true,
    message: 'Order saved successfully'
  })).setMimeType(ContentService.MimeType.JSON);
}

function doGet(e) {
  const action = e.parameter.action;
  
  if (action === 'getOrders') {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    const data = sheet.getDataRange().getValues();
    
    const orders = data.slice(1).map(row => ({
      orderId: row[0],
      timestamp: row[1],
      customerName: row[2],
      phone: row[3],
      email: row[4],
      address: row[5],
      city: row[6],
      items: row[7],
      total: row[8],
      notes: row[9],
      status: row[10]
    }));
    
    return ContentService.createTextOutput(JSON.stringify(orders))
      .setMimeType(ContentService.MimeType.JSON);
  }
  
  return ContentService.createTextOutput(JSON.stringify([]))
    .setMimeType(ContentService.MimeType.JSON);
}
*/

export default GoogleSheetsService;
