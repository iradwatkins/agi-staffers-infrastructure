#!/usr/bin/env python3

"""
Create DNS CNAME record for api.agistaffers.com pointing to Cloudflare
Requires CLOUDFLARE_EMAIL and CLOUDFLARE_API_KEY environment variables
"""

import os
import sys
from cloudflare import Cloudflare

def main():
    # Check for required environment variables
    email = os.environ.get("CLOUDFLARE_EMAIL")
    api_key = os.environ.get("CLOUDFLARE_API_KEY")
    
    if not email:
        print("❌ CLOUDFLARE_EMAIL environment variable is required")
        print("Set it with: export CLOUDFLARE_EMAIL=your_email@domain.com")
        return 1
        
    if not api_key:
        print("❌ CLOUDFLARE_API_KEY environment variable is required")
        print("Set it with: export CLOUDFLARE_API_KEY=your_global_api_key")
        return 1
    
    # Initialize Cloudflare client
    client = Cloudflare(api_email=email, api_key=api_key)
    
    try:
        # Zone ID for agistaffers.com (from previous commands)
        zone_id = "f6411878e9495ca7d33bfcc5914f079b"
        
        print("🌐 Creating DNS CNAME record for api.agistaffers.com...")
        
        # Create CNAME record pointing to agistaffers.com (proxied through Cloudflare)
        dns_record = client.dns.records.create(
            zone_id=zone_id,
            type="CNAME",
            name="api",
            content="agistaffers.com",
            proxied=True,  # Orange-cloud (proxy through Cloudflare) - Required for Workers routes
            ttl=1  # Automatic TTL when proxied
        )
        
        print(f"✅ DNS record created successfully!")
        print(f"   Record ID: {dns_record.id}")
        print(f"   Name: {dns_record.name}")
        print(f"   Type: {dns_record.type}")
        print(f"   Content: {dns_record.content}")
        print(f"   Proxied: {dns_record.proxied}")
        print(f"   TTL: {dns_record.ttl}")
        
        print("\n⏳ DNS record created. Propagation may take a few minutes...")
        print("🧪 Test the API gateway with:")
        print("   curl -s https://api.agistaffers.com/api/metrics | jq .")
        
        return 0
        
    except Exception as e:
        if "already exists" in str(e).lower():
            print("⚠️  DNS record already exists for api.agistaffers.com")
            print("🔍 Checking existing record...")
            
            # List existing DNS records for the zone
            records = client.dns.records.list(zone_id=zone_id, name="api.agistaffers.com")
            
            for record in records.result:
                print(f"   Existing record: {record.name} -> {record.content} (Type: {record.type}, Proxied: {record.proxied})")
            
            return 0
        else:
            print(f"❌ Error creating DNS record: {e}")
            return 1

if __name__ == "__main__":
    sys.exit(main())