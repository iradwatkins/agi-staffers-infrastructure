#!/usr/bin/env python3

"""
Test API Gateway by manually resolving DNS and making HTTPS requests
This bypasses any local DNS caching issues
"""

import requests
import json
from urllib3.exceptions import InsecureRequestWarning
requests.packages.urllib3.disable_warnings(InsecureRequestWarning)

def test_api_gateway():
    print("🧪 Testing AGI Staffers API Gateway")
    print("=" * 50)
    
    # Cloudflare IPs for api.agistaffers.com (from DNS resolution)
    cloudflare_ips = ["172.67.202.29", "104.21.60.231"]
    
    for ip in cloudflare_ips:
        print(f"\n📍 Testing via Cloudflare IP: {ip}")
        
        try:
            # Test basic connectivity
            url = f"https://{ip}/test"
            headers = {
                "Host": "api.agistaffers.com",
                "User-Agent": "AGI-Staffers-Test/1.0"
            }
            
            print(f"🔗 Testing: {url}")
            response = requests.get(url, headers=headers, timeout=10, verify=False)
            
            print(f"✅ Status: {response.status_code}")
            print(f"📄 Response: {response.text[:200]}")
            
            # Test metrics API
            url_metrics = f"https://{ip}/api/metrics"
            print(f"\n📊 Testing metrics: {url_metrics}")
            response_metrics = requests.get(url_metrics, headers=headers, timeout=10, verify=False)
            
            print(f"✅ Metrics Status: {response_metrics.status_code}")
            
            if response_metrics.status_code == 200:
                try:
                    metrics_data = response_metrics.json()
                    print("📈 Metrics Data Preview:")
                    print(json.dumps(metrics_data, indent=2)[:300])
                except:
                    print(f"📄 Raw Response: {response_metrics.text[:200]}")
            else:
                print(f"❌ Error: {response_metrics.text[:200]}")
            
            # Test CORS headers
            print(f"\n🌍 CORS Headers:")
            for header, value in response_metrics.headers.items():
                if "access-control" in header.lower():
                    print(f"   {header}: {value}")
            
            break  # If one IP works, we're good
            
        except requests.exceptions.ConnectTimeout:
            print(f"⏰ Timeout connecting to {ip}")
        except requests.exceptions.ConnectionError as e:
            print(f"❌ Connection error to {ip}: {e}")
        except requests.exceptions.SSLError as e:
            print(f"🔒 SSL error to {ip}: {e}")
        except Exception as e:
            print(f"❌ Error with {ip}: {e}")
    
    print("\n🧪 Test complete!")

if __name__ == "__main__":
    test_api_gateway()