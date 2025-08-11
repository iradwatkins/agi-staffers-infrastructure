-- CreateTable for Customers
CREATE TABLE "customers" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "email" VARCHAR(255) NOT NULL,
    "company_name" VARCHAR(255),
    "plan" VARCHAR(100) NOT NULL DEFAULT 'starter',
    "status" VARCHAR(50) DEFAULT 'active',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "customers_pkey" PRIMARY KEY ("id")
);

-- CreateTable for Customer Sites
CREATE TABLE "customer_sites" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "customer_id" UUID NOT NULL,
    "site_name" VARCHAR(255) NOT NULL,
    "domain" VARCHAR(255) NOT NULL,
    "template_type" VARCHAR(100) NOT NULL,
    "container_id" VARCHAR(255),
    "container_status" VARCHAR(50) DEFAULT 'pending',
    "ssl_enabled" BOOLEAN DEFAULT false,
    "customization_data" JSONB DEFAULT '{}',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "customer_sites_pkey" PRIMARY KEY ("id")
);

-- CreateTable for Site Templates
CREATE TABLE "site_templates" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "template_name" VARCHAR(255) NOT NULL,
    "template_type" VARCHAR(100) NOT NULL,
    "description" TEXT,
    "template_config" JSONB NOT NULL,
    "docker_config" JSONB NOT NULL,
    "is_active" BOOLEAN DEFAULT true,

    CONSTRAINT "site_templates_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "customers_email_key" ON "customers"("email");

-- CreateIndex
CREATE UNIQUE INDEX "customer_sites_domain_key" ON "customer_sites"("domain");

-- AddForeignKey
ALTER TABLE "customer_sites" ADD CONSTRAINT "customer_sites_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customers"("id") ON DELETE CASCADE ON UPDATE CASCADE;