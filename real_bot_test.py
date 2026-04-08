import requests
import json
import re
from datetime import datetime

# ⚠️ SECURITY WARNING: Token exposed in chat
# This token should be revoked immediately after testing
TOKEN = "8206074989:AAFPhuij0_7LHuXjPATcbAhy-VunbRESn-U"
BASE_URL = f"https://api.telegram.org/bot{TOKEN}"

def get_bot_updates(limit=10, offset=None):
    """Fetch recent updates from bot."""
    url = f"{BASE_URL}/getUpdates"
    params = {'limit': limit}
    if offset:
        params['offset'] = offset
    
    try:
        response = requests.get(url, params=params, timeout=10)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f"Error fetching updates: {e}")
        return None

def find_rate_messages(updates):
    """Find messages that contain rate information."""
    if not updates or not updates.get('ok'):
        return []
    
    rate_messages = []
    for update in updates.get('result', []):
        message = update.get('message', {})
        text = message.get('text', '')
        date = message.get('date', 0)
        chat_id = message.get('chat', {}).get('id')
        
        # Check if message contains rate keywords
        if any(keyword in text for keyword in ['ဝယ်စျေး', 'ရောင်းစျေး', 'ဘတ်စျေး', 'Update']):
            rate_messages.append({
                'text': text,
                'timestamp': datetime.fromtimestamp(date).isoformat(),
                'chat_id': chat_id
            })
    
    return rate_messages

def parse_rate_message(text):
    """Parse rate message to extract date, buy, sell rates."""
    lines = text.strip().split('\n')
    date = None
    buy = None
    sell = None
    
    for line in lines:
        line = line.strip()
        # Look for date line (contains ✅ and date)
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
    
    # Fallback to today if no date found
    if not date:
        date = datetime.now().strftime('%d-%m-%Y')
    
    # Fallback rates if parsing fails
    if not buy:
        buy = 130.50  # default
    
    if not sell:
        sell = 134.00  # default
    
    # Apply 4% service fee for customer rates
    customer_buy = round(buy * 0.96, 2)   # THB → MMK
    customer_sell = round(sell * 1.04, 2) # MMK → THB
    
    return {
        'date': date,
        'bot_buy': buy,
        'bot_sell': sell,
        'customer_buy': customer_buy,
        'customer_sell': customer_sell,
        'service_fee_percent': 4,
        'updated_at': datetime.now().isoformat(),
        'source': '@mmktodaybot'
    }

def test_bot_connection():
    """Test if bot token is valid."""
    url = f"{BASE_URL}/getMe"
    try:
        response = requests.get(url, timeout=10)
        data = response.json()
        if data.get('ok'):
            bot_info = data['result']
            print(f"Bot connected: @{bot_info.get('username')} ({bot_info.get('first_name')})")
            return True
        else:
            print(f"Bot connection failed: {data.get('description')}")
            return False
    except requests.exceptions.RequestException as e:
        print(f"Connection error: {e}")
        return False

def main():
    print("=== Real Bot Test ===")
    print("SECURITY WARNING: Token exposed in chat")
    print("   Revoke this token immediately after testing!")
    print("=" * 50)
    
    # Test connection
    print("Testing bot connection...")
    if not test_bot_connection():
        print("Bot connection failed. Check token.")
        return
    
    print("Bot connection successful")
    print()
    
    # Fetch updates
    print("Fetching recent messages...")
    updates = get_bot_updates(limit=5)
    
    if not updates:
        print("❌ No updates received")
        return
    
    # Find rate messages
    rate_messages = find_rate_messages(updates)
    
    if not rate_messages:
        print("❌ No rate messages found in recent updates")
        print("Recent messages:")
        for update in updates.get('result', [])[:3]:
            msg = update.get('message', {})
            text = msg.get('text', '')[:100]
            print(f"  - {text}")
        return
    
    print(f"✅ Found {len(rate_messages)} rate message(s)")
    print()
    
    # Parse the latest rate message
    latest = rate_messages[0]
    print("Latest rate message preview:")
    print(latest['text'][:200] + "..." if len(latest['text']) > 200 else latest['text'])
    print()
    
    # Parse rates
    print("Parsing rates...")
    parsed = parse_rate_message(latest['text'])
    
    print("Parsed Result:")
    print(json.dumps(parsed, indent=2, ensure_ascii=False))
    
    # Save to file
    with open('real_rates.json', 'w', encoding='utf-8') as f:
        json.dump(parsed, f, indent=2, ensure_ascii=False)
    
    print()
    print("✅ Saved to real_rates.json")
    print()
    print("=" * 50)
    print("⚠️ IMPORTANT: Revoke this bot token immediately!")
    print("   Use @BotFather → /revoke")
    print("=" * 50)

if __name__ == '__main__':
    main()