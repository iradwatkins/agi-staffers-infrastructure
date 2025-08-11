#!/bin/bash

echo "🚀 Adding Customers & Sites tabs to current admin dashboard..."

# First, let me download the current index.html, modify it, and upload it back
expect -c "
spawn scp root@72.60.28.175:/root/admin-dashboard-local/index.html /tmp/current-admin.html
expect \"password:\"
send \"Bobby321&Gloria321Watkins?\\r\"
expect eof
"

echo "📝 Current dashboard downloaded to /tmp/current-admin.html"
echo "✏️  Now modifying to add Customers and Sites tabs..."

# Use sed to add the new tabs
cp /tmp/current-admin.html /tmp/updated-admin.html

# Add the new tab buttons after the existing tabs
sed -i '' 's|<button class="tab-button active" onclick="showTab.*dashboard.*">Dashboard</button>|<button class="tab-button active" onclick="showTab('\''dashboard'\'')">Dashboard</button>|g' /tmp/updated-admin.html
sed -i '' 's|<button class="tab-button" onclick="showTab.*backup.*">Backup</button>|<button class="tab-button" onclick="showTab('\''customers'\'')">Customers</button><button class="tab-button" onclick="showTab('\''sites'\'')">Sites</button><button class="tab-button" onclick="showTab('\''backup'\'')">Backup</button>|g' /tmp/updated-admin.html

# Add the new tab content sections
cat >> /tmp/updated-admin.html << 'EOF'

<!-- Customers Tab Content -->
<div id="customers" class="tab-content" style="display: none;">
    <div class="card">
        <div class="card-header">
            <h3>Customer Management</h3>
            <button class="btn btn-primary" onclick="showAddCustomerForm()">Add Customer</button>
        </div>
        <div class="card-body">
            <div class="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Company</th>
                            <th>Contact</th>
                            <th>Email</th>
                            <th>Plan</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody id="customers-list">
                        <tr>
                            <td>TechFlow Solutions</td>
                            <td>Sarah Johnson</td>
                            <td>sarah@techflow.com</td>
                            <td><span class="badge badge-premium">Premium</span></td>
                            <td><span class="badge badge-active">Active</span></td>
                            <td>
                                <button class="btn btn-sm" onclick="viewCustomer('1')">View</button>
                                <button class="btn btn-sm" onclick="editCustomer('1')">Edit</button>
                            </td>
                        </tr>
                        <tr>
                            <td>Green Valley Organic</td>
                            <td>Mike Chen</td>
                            <td>mike@greenvalley.com</td>
                            <td><span class="badge badge-basic">Basic</span></td>
                            <td><span class="badge badge-active">Active</span></td>
                            <td>
                                <button class="btn btn-sm" onclick="viewCustomer('2')">View</button>
                                <button class="btn btn-sm" onclick="editCustomer('2')">Edit</button>
                            </td>
                        </tr>
                        <tr>
                            <td>Pixel Perfect Design</td>
                            <td>Emma Rodriguez</td>
                            <td>emma@pixelperfect.design</td>
                            <td><span class="badge badge-enterprise">Enterprise</span></td>
                            <td><span class="badge badge-active">Active</span></td>
                            <td>
                                <button class="btn btn-sm" onclick="viewCustomer('3')">View</button>
                                <button class="btn btn-sm" onclick="editCustomer('3')">Edit</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</div>

<!-- Sites Tab Content -->
<div id="sites" class="tab-content" style="display: none;">
    <div class="card">
        <div class="card-header">
            <h3>Site Management</h3>
            <button class="btn btn-primary" onclick="showCreateSiteForm()">Create Site</button>
        </div>
        <div class="card-body">
            <div class="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Domain</th>
                            <th>Customer</th>
                            <th>Template</th>
                            <th>Status</th>
                            <th>Created</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody id="sites-list">
                        <tr>
                            <td>techflow.com</td>
                            <td>TechFlow Solutions</td>
                            <td>Business Portfolio</td>
                            <td><span class="badge badge-active">Active</span></td>
                            <td>2025-08-01</td>
                            <td>
                                <button class="btn btn-sm" onclick="window.open('https://techflow.com', '_blank')">Visit</button>
                                <button class="btn btn-sm" onclick="manageSite('1')">Manage</button>
                            </td>
                        </tr>
                        <tr>
                            <td>greenvalley.com</td>
                            <td>Green Valley Organic</td>
                            <td>E-commerce Starter</td>
                            <td><span class="badge badge-deploying">Deploying</span></td>
                            <td>2025-08-05</td>
                            <td>
                                <button class="btn btn-sm" disabled>Visit</button>
                                <button class="btn btn-sm" onclick="manageSite('2')">Manage</button>
                            </td>
                        </tr>
                        <tr>
                            <td>pixelperfect.design</td>
                            <td>Pixel Perfect Design</td>
                            <td>Agency Showcase</td>
                            <td><span class="badge badge-active">Active</span></td>
                            <td>2025-08-03</td>
                            <td>
                                <button class="btn btn-sm" onclick="window.open('https://pixelperfect.design', '_blank')">Visit</button>
                                <button class="btn btn-sm" onclick="manageSite('3')">Manage</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
    
    <div class="card mt-4">
        <div class="card-header">
            <h3>Available Templates</h3>
        </div>
        <div class="card-body">
            <div class="templates-grid">
                <div class="template-card">
                    <h4>Business Portfolio</h4>
                    <p>Professional business template with services and contact sections</p>
                    <span class="badge badge-business">Business</span>
                </div>
                <div class="template-card">
                    <h4>E-commerce Starter</h4>
                    <p>Complete online store with shopping cart and payments</p>
                    <span class="badge badge-ecommerce">E-commerce</span>
                </div>
                <div class="template-card">
                    <h4>Agency Showcase</h4>
                    <p>Creative agency template with portfolio and team profiles</p>
                    <span class="badge badge-creative">Creative</span>
                </div>
                <div class="template-card">
                    <h4>Restaurant Menu</h4>
                    <p>Beautiful restaurant template with online ordering</p>
                    <span class="badge badge-hospitality">Restaurant</span>
                </div>
            </div>
        </div>
    </div>
</div>

<style>
/* Additional styles for new tabs */
.templates-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1rem;
}

.template-card {
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    padding: 1rem;
    background: white;
}

.template-card h4 {
    margin: 0 0 0.5rem 0;
    color: #2d3748;
}

.template-card p {
    margin: 0 0 1rem 0;
    color: #718096;
    font-size: 0.9rem;
}

.badge-business { background: #3182ce; color: white; }
.badge-ecommerce { background: #38a169; color: white; }
.badge-creative { background: #9f7aea; color: white; }
.badge-hospitality { background: #ed8936; color: white; }
.badge-premium { background: #3182ce; color: white; }
.badge-basic { background: #38a169; color: white; }
.badge-enterprise { background: #9f7aea; color: white; }
.badge-deploying { background: #ed8936; color: white; }
.badge-active { background: #38a169; color: white; }

.table-container {
    overflow-x: auto;
}

table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 1rem;
}

th, td {
    padding: 0.75rem;
    text-align: left;
    border-bottom: 1px solid #e2e8f0;
}

th {
    background: #f7fafc;
    font-weight: 600;
    color: #2d3748;
}

.btn-sm {
    padding: 0.25rem 0.5rem;
    font-size: 0.875rem;
    margin-right: 0.25rem;
}

.card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.mt-4 { margin-top: 1rem; }
</style>

<script>
// JavaScript functions for new tabs
function showAddCustomerForm() {
    alert('Add Customer form would open here.\n\nFeatures:\n- Company details\n- Contact information\n- Plan selection\n- Subdomain setup');
}

function showCreateSiteForm() {
    alert('Create Site form would open here.\n\nFeatures:\n- Customer selection\n- Domain configuration\n- Template selection\n- Deployment settings');
}

function viewCustomer(id) {
    alert(`View customer ${id} details.\n\nWould show:\n- Customer profile\n- Sites owned\n- Billing history\n- Support tickets`);
}

function editCustomer(id) {
    alert(`Edit customer ${id} details.\n\nWould allow editing:\n- Company information\n- Contact details\n- Plan tier\n- Account settings`);
}

function manageSite(id) {
    alert(`Manage site ${id}.\n\nFeatures:\n- Deployment status\n- SSL certificate\n- Backup management\n- Performance metrics`);
}
</script>

EOF

echo "🔄 Uploading updated dashboard..."
expect -c "
spawn scp /tmp/updated-admin.html root@72.60.28.175:/root/admin-dashboard-local/index.html
expect \"password:\"
send \"Bobby321&Gloria321Watkins?\\r\"
expect eof
"

echo "✅ Dashboard updated with Customers and Sites tabs!"
echo ""
echo "🌐 **Visit admin.agistaffers.com and you should now see:**"
echo "   [Dashboard] [Customers] [Sites] [Backup] [Monitoring] [Memory] [Notifications]"
echo ""
echo "📋 **New Features Added:**"
echo "   • Customers tab with sample customer data"
echo "   • Sites tab with deployment status"
echo "   • Template marketplace preview"
echo "   • Customer management interface"
echo ""
echo "🔄 **Please refresh the page with Cmd+Shift+R to see changes!**"