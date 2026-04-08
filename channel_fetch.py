import requests
import re
import json
from datetime import datetime
from bs4 import BeautifulSoup

CHANNEL_URL = "https://t.me/s/mmktodaybot"

def fetch_channel_messages():
    """Fetch latest messages from Telegram channel."""
    try:
        response = requests.get(CHANNEL_URL, timeout=15)
        response.raise_for_status()
        return response.text
    except requests.exceptions.RequestException as e:
        print(f"Error fetching channel: {e}")
        return None

def parse_messages(html):
    """Parse HTML to extract messages."""
    soup = BeautifulSoup(html, 'html.parser')
    messages = []
    
    # Telegram web page structure
    message_divs = soup.find_all('div', class_='tgme_widget_message')
    
    for div in message_divs[:10]:  # Latest 10 messages
        # Extract text
        text_elem = div.find('div', class_='tgme_widget_message_text')
        if not text_elem:
            continue
            
        text = text_elem.get_text(strip=True, separator='\n')
        
        # Extract date/time
        time_elem = div.find('time', class_='time')
        timestamp = time_elem['datetime'] if time_elem else None
        
        messages.append({
            'text': text,
            'timestamp': timestamp,
            'raw_html': str(div)[:500]  # For debugging
        })
    
    return messages

def find_rate_messages(messages):
    """Find messages containing rate information."""
    rate_messages = []
    
    for msg in messages:
        text = msg['text']
        # Check for rate keywords
        if any(keyword in text for keyword in ['ဝယ်စျေး', 'ရောင်းစျေး', 'ဘတ်စျေး', 'Update']):
            rate_messages.append(msg)
    
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
        'source': CHANNEL_URL
    }

def main():
    print("=== Channel Fetch Test ===")
    print(f"Channel: {CHANNEL_URL}")
    print("=" * 50)
    
    # Fetch channel
    print("Fetching channel messages...")
    html = fetch_channel_messages()
    
    if not html:
        print("Failed to fetch channel")
        return
    
    print(f"HTML length: {len(html)} characters")
    
    # Parse messages
    print("Parsing messages...")
    messages = parse_messages(html)
    print(f"Found {len(messages)} messages")
    
    if not messages:
        print("No messages found. Channel might be private or have different structure.")
        print("Trying alternative parsing...")
        
        # Simple text search as fallback
        if 'ဝယ်စျေး' in html:
            print("Rate keywords found in HTML (but parsing failed)")
            # Extract snippet
            start = html.find('ဝယ်စျေး')
            snippet = html[start:start+300]
            print(f"Snippet: {snippet}")
        return
    
    # Find rate messages
    rate_messages = find_rate_messages(messages)
    print(f"Found {len(rate_messages)} rate messages")
    
    if not rate_messages:
        print("No rate messages found.")
        print("Latest messages:")
        for i, msg in enumerate(messages[:3]):
            print(f"{i+1}. {msg['text'][:100]}...")
        return
    
    # Parse the latest rate message
    latest = rate_messages[0]
    print("\nLatest rate message:")
    print("-" * 40)
    print(latest['text'])
    print("-" * 40)
    
    # Parse rates
    print("\nParsing rates...")
    parsed = parse_rate_message(latest['text'])
    
    print("\nParsed Result:")
    print(json.dumps(parsed, indent=2, ensure_ascii=False))
    
    # Save to file
    filename = 'channel_rates.json'
    with open(filename, 'w', encoding='utf-8') as f:
        json.dump(parsed, f, indent=2, ensure_ascii=False)
    
    print(f"\nSaved to {filename}")
    
    # Summary
    print("\n" + "=" * 50)
    print("Rate Summary:")
    print(f"Date: {parsed['date']}")
    print(f"Bot Buy: {parsed['bot_buy']} MMK per THB")
    print(f"Bot Sell: {parsed['bot_sell']} MMK per THB")
    print(f"Customer Buy (THB→MMK): {parsed['customer_buy']} MMK per THB")
    print(f"Customer Sell (MMK→THB): {parsed['customer_sell']} MMK per THB")
    print(f"Service Fee: {parsed['service_fee_percent']}%")
    print("=" * 50)

if __name__ == '__main__':
    main()