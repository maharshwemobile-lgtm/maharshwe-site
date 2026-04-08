import json
import re
from datetime import datetime

# Mock bot response (example format from chat)
MOCK_BOT_REPLY = """ဘတ်စျေး 💎 Update🔔

✅09-04-2026✅

🍀ဝယ်စျေး = 130.50 ကျပ်

🍀 ရောင်းစျေး = 134.00 ကျပ်"""

def parse_bot_message(text):
    """Parse bot message to extract date, buy rate, sell rate."""
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

def save_to_json(data, filename='rates.json'):
    """Save rates data to JSON file."""
    with open(filename, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    print(f"Saved to {filename}")

def main():
    print("=== Mock Bot Fetch Test ===")
    print("Bot message:")
    try:
        print(MOCK_BOT_REPLY)
    except UnicodeEncodeError:
        print("[Burmese text - Unicode]")
    print("\n" + "="*40 + "\n")
    
    # Parse the message
    result = parse_bot_message(MOCK_BOT_REPLY)
    
    print("Parsed Result:")
    print(json.dumps(result, indent=2, ensure_ascii=False))
    
    # Save to file
    save_to_json(result)
    
    print("\n" + "="*40)
    print("Customer Rates (after 4% fee):")
    print(f"  THB → MMK: 1 THB = {result['customer_buy']} MMK")
    print(f"  MMK → THB: 1 MMK = {1/result['customer_sell']:.4f} THB")
    print(f"            (or {result['customer_sell']} MMK per THB)")

if __name__ == '__main__':
    main()