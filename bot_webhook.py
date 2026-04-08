import json
import re
from datetime import datetime
from http.server import HTTPServer, BaseHTTPRequestHandler

# Bot token (exposed - should be revoked after testing)
TOKEN = "8206074989:AAFPhuij0_7LHuXjPATcbAhy-VunbRESn-U"
RATES_FILE = "rates_latest.json"

def parse_rate_message(text):
    """Parse rate message from bot."""
    lines = text.strip().split('\n')
    date = None
    buy = None
    sell = None
    
    for line in lines:
        line = line.strip()
        # Look for date
        if '✅' in line:
            date_match = re.search(r'(\d{2}-\d{2}-\d{4})', line)
            if date_match:
                date = date_match.group(1)
        
        # Look for buy rate
        if 'ဝယ်စျေး' in line:
            buy_match = re.search(r'(\d+\.\d+)', line)
            if buy_match:
                buy = float(buy_match.group(1))
        
        # Look for sell rate
        if 'ရောင်းစျေး' in line:
            sell_match = re.search(r'(\d+\.\d+)', line)
            if sell_match:
                sell = float(sell_match.group(1))
    
    # Fallbacks
    if not date:
        date = datetime.now().strftime('%d-%m-%Y')
    if not buy:
        buy = 130.50
    if not sell:
        sell = 134.00
    
    # Apply 4% fee
    customer_buy = round(buy * 0.96, 2)
    customer_sell = round(sell * 1.04, 2)
    
    return {
        'date': date,
        'bot_buy': buy,
        'bot_sell': sell,
        'customer_buy': customer_buy,
        'customer_sell': customer_sell,
        'service_fee_percent': 4,
        'updated_at': datetime.now().isoformat(),
        'source': 'forwarded_from_mmktodaybot'
    }

def save_rates(data):
    """Save rates to JSON file."""
    with open(RATES_FILE, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    print(f"Rates saved to {RATES_FILE}")

class BotHandler(BaseHTTPRequestHandler):
    def do_POST(self):
        """Handle Telegram webhook POST requests."""
        content_length = int(self.headers['Content-Length'])
        post_data = self.rfile.read(content_length)
        
        try:
            update = json.loads(post_data.decode('utf-8'))
            self.handle_update(update)
        except Exception as e:
            print(f"Error processing update: {e}")
        
        self.send_response(200)
        self.end_headers()
    
    def handle_update(self, update):
        """Process Telegram update."""
        message = update.get('message', {})
        text = message.get('text', '')
        chat_id = message.get('chat', {}).get('id')
        
        print(f"Received message from chat {chat_id}: {text[:100]}...")
        
        # Check if it's a forwarded rate message
        if any(keyword in text for keyword in ['ဝယ်စျေး', 'ရောင်းစျေး', 'ဘတ်စျေး']):
            print("Rate message detected!")
            parsed = parse_rate_message(text)
            save_rates(parsed)
            
            # Send acknowledgment
            self.send_reply(chat_id, f"✅ Rate updated: {parsed['date']}\nBuy: {parsed['customer_buy']} | Sell: {parsed['customer_sell']}")
    
    def send_reply(self, chat_id, text):
        """Send reply via Telegram API."""
        import requests
        url = f"https://api.telegram.org/bot{TOKEN}/sendMessage"
        payload = {
            'chat_id': chat_id,
            'text': text
        }
        try:
            requests.post(url, json=payload, timeout=5)
        except Exception as e:
            print(f"Error sending reply: {e}")
    
    def log_message(self, format, *args):
        """Override to reduce log noise."""
        pass

def setup_webhook():
    """Set up Telegram webhook."""
    import requests
    webhook_url = "https://your-server.com/webhook"  # Needs public URL
    url = f"https://api.telegram.org/bot{TOKEN}/setWebhook?url={webhook_url}"
    
    try:
        response = requests.get(url, timeout=10)
        print(f"Webhook setup response: {response.json()}")
    except Exception as e:
        print(f"Error setting webhook: {e}")

def main():
    """Main function - run webhook server or poll updates."""
    print("=== Bot Forward Handler ===")
    print("This bot will process forwarded rate messages from @mmktodaybot")
    print()
    print("INSTRUCTIONS:")
    print("1. Get rate from @mmktodaybot (interactive)")
    print("2. Forward that message to @Uptodatebotmmkbot")
    print("3. Bot will parse and save rates to rates_latest.json")
    print()
    print("For testing, running in poll mode...")
    
    # Simple poll mode for testing
    import requests
    import time
    
    offset = None
    while True:
        try:
            url = f"https://api.telegram.org/bot{TOKEN}/getUpdates"
            params = {'timeout': 30}
            if offset:
                params['offset'] = offset
            
            response = requests.get(url, params=params, timeout=35)
            updates = response.json()
            
            if updates.get('ok'):
                for update in updates.get('result', []):
                    offset = update['update_id'] + 1
                    
                    message = update.get('message', {})
                    text = message.get('text', '')
                    chat_id = message.get('chat', {}).get('id')
                    
                    # Check for rate message
                    if any(keyword in text for keyword in ['ဝယ်စျေး', 'ရောင်းစျေး', 'ဘတ်စျေး']):
                        print(f"Rate message received from chat {chat_id}")
                        parsed = parse_rate_message(text)
                        save_rates(parsed)
                        
                        # Send acknowledgment
                        ack_url = f"https://api.telegram.org/bot{TOKEN}/sendMessage"
                        ack_payload = {
                            'chat_id': chat_id,
                            'text': f"Rate updated: {parsed['date']}\nBuy: {parsed['customer_buy']} MMK/THB\nSell: {parsed['customer_sell']} MMK/THB"
                        }
                        requests.post(ack_url, json=ack_payload, timeout=5)
            
            time.sleep(1)
            
        except KeyboardInterrupt:
            print("\nExiting...")
            break
        except Exception as e:
            print(f"Error in poll loop: {e}")
            time.sleep(5)

if __name__ == '__main__':
    main()