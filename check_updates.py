import requests
import json

TOKEN = "8206074989:AAFPhuij0_7LHuXjPATcbAhy-VunbRESn-U"

def check_messages():
    url = f"https://api.telegram.org/bot{TOKEN}/getUpdates"
    try:
        response = requests.get(url, timeout=10)
        data = response.json()
        
        print("=== Bot Updates Check ===")
        print(f"Status: {data.get('ok')}")
        
        if data.get('ok'):
            updates = data.get('result', [])
            print(f"Total updates: {len(updates)}")
            
            for i, update in enumerate(updates[-3:]):  # Last 3 updates
                message = update.get('message', {})
                text = message.get('text', '')
                chat_id = message.get('chat', {}).get('id')
                from_user = message.get('from', {})
                
                print(f"\nUpdate {i+1}:")
                print(f"  From: {from_user.get('first_name', 'Unknown')} (@{from_user.get('username', 'N/A')})")
                print(f"  Chat ID: {chat_id}")
                print(f"  Text preview: {text[:150]}...")
                
                # Check if it's a rate message
                if any(keyword in text for keyword in ['ဝယ်စျေး', 'ရောင်းစျေး', 'ဘတ်စျေး']):
                    print("  ⭐ RATE MESSAGE DETECTED!")
                    
                    # Parse and save
                    import re
                    lines = text.split('\n')
                    date = None
                    buy = None
                    sell = None
                    
                    for line in lines:
                        if '✅' in line:
                            date_match = re.search(r'(\d{2}-\d{2}-\d{4})', line)
                            if date_match:
                                date = date_match.group(1)
                        if 'ဝယ်စျေး' in line:
                            buy_match = re.search(r'(\d+\.\d+)', line)
                            if buy_match:
                                buy = float(buy_match.group(1))
                        if 'ရောင်းစျေး' in line:
                            sell_match = re.search(r'(\d+\.\d+)', line)
                            if sell_match:
                                sell = float(sell_match.group(1))
                    
                    if date and buy and sell:
                        from datetime import datetime
                        customer_buy = round(buy * 0.96, 2)
                        customer_sell = round(sell * 1.04, 2)
                        
                        result = {
                            'date': date,
                            'bot_buy': buy,
                            'bot_sell': sell,
                            'customer_buy': customer_buy,
                            'customer_sell': customer_sell,
                            'service_fee_percent': 4,
                            'updated_at': datetime.now().isoformat()
                        }
                        
                        with open('forwarded_rates.json', 'w', encoding='utf-8') as f:
                            json.dump(result, f, indent=2, ensure_ascii=False)
                        
                        print(f"  ✅ Saved to forwarded_rates.json")
                        print(f"  Date: {date}, Buy: {buy}, Sell: {sell}")
                        print(f"  Customer rates: Buy {customer_buy}, Sell {customer_sell}")
        
        else:
            print(f"Error: {data.get('description')}")
            
    except Exception as e:
        print(f"Error: {e}")

if __name__ == '__main__':
    check_messages()