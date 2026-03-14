import type { CartItem } from '@/store/cartStore';

// WhatsApp Service for sending orders
export class WhatsAppService {
  private phoneNumber: string;
  private apiKey: string;
  private useCallMeBot: boolean;

  constructor(phoneNumber: string, apiKey: string = '', useCallMeBot: boolean = false) {
    this.phoneNumber = phoneNumber.replace(/\D/g, '');
    this.apiKey = apiKey;
    this.useCallMeBot = useCallMeBot && apiKey.length > 0;
  }

  // Format cart items for WhatsApp message
  private formatOrderMessage(
    items: CartItem[],
    customerInfo: {
      name: string;
      phone: string;
      address: string;
      city: string;
      notes?: string;
    },
    totalPrice: number
  ): string {
    const itemsList = items
      .map(
        (item) =>
          `• ${item.name} (${item.category}) - ${item.quantity}x ${item.price} MAD = ${
            item.quantity * item.price
          } MAD`
      )
      .join('\n');

    const message = `
🛍️ *NEW ORDER - AK KIDS*

👤 *Customer Information:*
Name: ${customerInfo.name}
Phone: ${customerInfo.phone}
Address: ${customerInfo.address}
City: ${customerInfo.city}

📦 *Order Details:*
${itemsList}

💰 *Total: ${totalPrice} MAD*

${customerInfo.notes ? `📝 *Notes:* ${customerInfo.notes}` : ''}

---
Order from AK Kids Website
    `.trim();

    return message;
  }

  // Send order via WhatsApp Web (opens in new tab)
  sendOrderViaWeb(
    items: CartItem[],
    customerInfo: {
      name: string;
      phone: string;
      address: string;
      city: string;
      notes?: string;
    },
    totalPrice: number
  ): void {
    const message = this.formatOrderMessage(items, customerInfo, totalPrice);
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${this.phoneNumber}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  }

  // Send order via CallMeBot API
  async sendOrderViaCallMeBot(
    items: CartItem[],
    customerInfo: {
      name: string;
      phone: string;
      address: string;
      city: string;
      notes?: string;
    },
    totalPrice: number
  ): Promise<{ success: boolean; message: string }> {
    if (!this.useCallMeBot || !this.apiKey) {
      return {
        success: false,
        message: 'CallMeBot API not configured. Using WhatsApp Web instead.',
      };
    }

    try {
      const message = this.formatOrderMessage(items, customerInfo, totalPrice);
      const url = `https://api.callmebot.com/whatsapp.php?phone=${this.phoneNumber}&text=${encodeURIComponent(
        message
      )}&apikey=${this.apiKey}`;

      const response = await fetch(url);
      
      if (response.ok) {
        return {
          success: true,
          message: 'Order sent successfully via WhatsApp!',
        };
      } else {
        throw new Error('Failed to send message');
      }
    } catch (error) {
      console.error('CallMeBot Error:', error);
      // Fallback to WhatsApp Web
      this.sendOrderViaWeb(items, customerInfo, totalPrice);
      return {
        success: true,
        message: 'Order opened in WhatsApp Web. Please send the message.',
      };
    }
  }

  // Quick order - just send cart items
  quickOrder(items: CartItem[], totalPrice: number): void {
    const itemsList = items
      .map(
        (item) =>
          `• ${item.name} - ${item.quantity}x ${item.price} MAD`
      )
      .join('\n');

    const message = `
🛍️ *AK KIDS ORDER*

${itemsList}

💰 *Total: ${totalPrice} MAD*

Please contact me to complete the order.
    `.trim();

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${this.phoneNumber}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  }
}

// Create default instance
export const whatsappService = new WhatsAppService(
  import.meta.env.VITE_WHATSAPP_NUMBER || '212612345678',
  import.meta.env.VITE_CALLMEBOT_API_KEY || '',
  false
);

export default WhatsAppService;
