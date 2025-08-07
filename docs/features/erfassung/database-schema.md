# Erfassung Database Schema Design

## Overview
Database schema extension for the Erfassung (AI-powered product cataloging) feature, integrating with the existing Formular PostgreSQL database.

## Core Erfassung Models

### Product Model
```prisma
model Product {
  id                String          @id @default(cuid())
  
  // Basic Information
  articleNumber     String?         // Artikelnummer
  title             String          // Product title
  shortDescription  String?         // Kurzbeschreibung  
  longDescription   String?         // Langtext
  manufacturer      String?         // Hersteller
  
  // Physical Dimensions (in mm and kg)
  length            Float?          // Länge in mm
  width             Float?          // Breite in mm
  height            Float?          // Höhe in mm
  weight            Float?          // Gewicht in kg
  
  // Categories (Kivitendo compatible)
  mainCategoryA     String?         // Hauptkategorie A
  mainCategoryB     String?         // Hauptkategorie B
  subCategoryA      String?         // Unterkategorie A
  subCategoryB      String?         // Unterkategorie B
  
  // Sales Data
  stockQuantity     Int?            // Lagerbestand
  price             Float?          // Preis
  articleType       String?         // Artikeltyp
  unit              String?         // Einheit
  
  // Status and Processing
  status            ProductStatus   @default(DRAFT)
  confidenceScore   Float?          // AI confidence (0-1)
  
  // Metadata
  userId            String
  organizationId    String?
  createdAt         DateTime        @default(now())
  updatedAt         DateTime        @updatedAt
  
  // Relations
  user              User            @relation(fields: [userId], references: [id], onDelete: Cascade)
  organization      Organization?   @relation(fields: [organizationId], references: [id])
  photos            ProductPhoto[]
  analyses          ProductAnalysis[]
  exports           ProductExport[]
  storePublications StorePublication[]

  @@map("products")
}
```

### ProductPhoto Model
```prisma
model ProductPhoto {
  id              String          @id @default(cuid())
  productId       String
  
  // File Information
  filename        String          // Original filename
  storagePath     String          // Cloud storage path/URL
  mimeType        String          // image/jpeg, image/png, etc.
  fileSize        Int             // File size in bytes
  
  // Image Metadata
  width           Int?            // Image width in pixels
  height          Int?            // Image height in pixels
  photoType       PhotoType       @default(GENERAL)
  
  // Processing
  uploadedAt      DateTime        @default(now())
  processedAt     DateTime?       // When AI analysis completed
  ocrText         String?         // Extracted text from OCR
  ocrConfidence   Float?          // OCR confidence score
  
  // Relations
  product         Product         @relation(fields: [productId], references: [id], onDelete: Cascade)

  @@map("product_photos")
}
```

### ProductAnalysis Model
```prisma
model ProductAnalysis {
  id              String          @id @default(cuid())
  productId       String
  
  // Analysis Details
  analysisType    ProductAnalysisType
  model           String          // AI model used (gpt-4-vision, claude-3, etc.)
  prompt          String          // Analysis prompt used
  result          Json            // Structured analysis results
  confidence      Float?          // Overall confidence score
  processingTime  Int?            // Processing time in milliseconds
  
  // Status and Error Handling
  status          AnalysisStatus  @default(PENDING)
  error           String?         // Error message if failed
  
  // Metadata
  createdAt       DateTime        @default(now())
  updatedAt       DateTime        @updatedAt
  
  // Relations
  product         Product         @relation(fields: [productId], references: [id], onDelete: Cascade)

  @@map("product_analyses")
}
```

### ProductExport Model
```prisma
model ProductExport {
  id              String          @id @default(cuid())
  
  // Export Configuration
  name            String          // Export name/description
  format          ExportFormat    // CSV, XLSX, JSON, XML, TSV
  template        String?         // Export template used
  productIds      String[]        // Array of product IDs included
  customMapping   Json?           // Custom field mapping configuration
  
  // Export Data
  filePath        String?         // Generated file path
  fileSize        Int?            // File size in bytes
  recordCount     Int             // Number of products exported
  downloadUrl     String?         // Secure download URL
  expiresAt       DateTime?       // Download link expiration
  
  // E-commerce Integration
  targetPlatform  String?         // medusa-js, shopware, generic
  syncStatus      SyncStatus?     // Integration sync status
  platformData    Json?           // Platform-specific data
  
  // Metadata
  userId          String
  organizationId  String?
  status          ExportStatus    @default(PENDING)
  createdAt       DateTime        @default(now())
  completedAt     DateTime?
  
  // Relations
  user            User            @relation(fields: [userId], references: [id], onDelete: Cascade)
  organization    Organization?   @relation(fields: [organizationId], references: [id])
  products        Product[]       @relation("ProductExports")

  @@map("product_exports")
}
```

### StorePublication Model
```prisma
model StorePublication {
  id              String          @id @default(cuid())
  productId       String
  
  // Store Information
  storeName       String          // Store/platform name (medusa-js, shopware, etc.)
  storeProductId  String?         // ID in the target store
  publicationUrl  String?         // URL to published product
  storeApiUrl     String?         // API endpoint used for integration
  
  // Publication Status
  status          PublicationStatus @default(PENDING)
  publishedAt     DateTime?
  lastSyncAt      DateTime?
  
  // Sync Data
  syncData        Json            @default("{}")
  integrationData Json?           // Platform-specific integration data
  workflowId      String?         // Medusa JS workflow ID
  catalogId       String?         // Shopware catalog ID
  error           String?
  
  // Automation Settings
  autoSync        Boolean         @default(false)
  syncFrequency   String?         // daily, weekly, on-change
  
  // Metadata
  createdAt       DateTime        @default(now())
  updatedAt       DateTime        @updatedAt
  
  // Relations
  product         Product         @relation(fields: [productId], references: [id], onDelete: Cascade)

  @@map("store_publications")
}
```

## Enums

### ProductStatus
```prisma
enum ProductStatus {
  DRAFT           // Initial state, photos uploaded
  ANALYZING       // AI analysis in progress
  ANALYZED        // Analysis completed, ready for review
  REVIEWED        // User has reviewed and approved
  EXPORTED        // Exported to external system
  PUBLISHED       // Published to store/catalog
  ARCHIVED        // Archived/inactive
}
```

### PhotoType
```prisma
enum PhotoType {
  GENERAL         // General product photo
  LABEL           // Product label/Typenschild
  DIMENSIONS      // Photo showing measurements
  WEIGHT          // Photo showing weight on scale
  PACKAGING       // Packaging/box photos
  DETAIL          // Detail/close-up photos
}
```

### ProductAnalysisType
```prisma
enum ProductAnalysisType {
  OCR             // Text extraction from labels
  CLASSIFICATION  // Product category classification
  DIMENSION       // Size/dimension detection
  WEIGHT          // Weight detection
  DESCRIPTION     // Description generation
  FULL_ANALYSIS   // Complete product analysis
}
```

### ExportFormat
```prisma
enum ExportFormat {
  CSV_KIVITENDO   // Kivitendo-compatible CSV
  CSV_GENERIC     // Generic CSV format
  XLSX            // Excel format (.xlsx)
  JSON            // JSON format
  XML             // XML format
  TSV             // Tab-separated values
  MEDUSA_JSON     // Medusa JS workflow format
  SHOPWARE_CSV    // Shopware catalog import format
}

enum SyncStatus {
  IDLE            // No sync in progress
  SYNCING         // Sync in progress
  COMPLETED       // Last sync completed successfully
  FAILED          // Last sync failed
  CANCELLED       // Sync was cancelled
}
```

### ExportStatus
```prisma
enum ExportStatus {
  PENDING         // Export queued
  PROCESSING      // Export in progress
  COMPLETED       // Export completed successfully
  FAILED          // Export failed
  CANCELLED       // Export cancelled by user
}
```

### PublicationStatus
```prisma
enum PublicationStatus {
  PENDING         // Queued for publication
  PUBLISHING      // Publication in progress
  PUBLISHED       // Successfully published
  FAILED          // Publication failed
  UNPUBLISHED     // Unpublished/removed
}
```

## Database Relationships

### Existing Model Extensions

#### User Model Extension
```prisma
model User {
  // ... existing fields ...
  
  // New Erfassung relations
  products        Product[]
  productExports  ProductExport[]
}
```

#### Organization Model Extension
```prisma
model Organization {
  // ... existing fields ...
  
  // New Erfassung relations
  products        Product[]
  productExports  ProductExport[]
}
```

#### BackgroundJob Enum Extension
```prisma
enum JobType {
  // ... existing types ...
  PRODUCT_ANALYSIS
  PRODUCT_EXPORT
  PRODUCT_PUBLICATION
  IMAGE_PROCESSING
}
```

## Storage Strategy

### Photo Storage
- **Cloud Storage**: AWS S3, Google Cloud Storage, or Azure Blob
- **File Organization**: `/products/{productId}/photos/{photoId}.{extension}`
- **Thumbnails**: Generate multiple sizes for different use cases
- **Retention**: Configurable retention policy for inactive products

### File Naming Convention
```
products/
├── {productId}/
│   ├── photos/
│   │   ├── original/
│   │   │   ├── {photoId}_001.jpg
│   │   │   └── {photoId}_002.jpg
│   │   ├── thumbnails/
│   │   │   ├── {photoId}_001_thumb.jpg
│   │   │   └── {photoId}_002_thumb.jpg
│   │   └── processed/
│   │       ├── {photoId}_001_ocr.json
│   │       └── {photoId}_002_ocr.json
│   └── exports/
│       ├── {exportId}_kivitendo.csv
│       └── {exportId}_products.json
```

## Indexing Strategy

### Performance Indexes
```sql
-- Product search and filtering
CREATE INDEX idx_products_status ON products(status);
CREATE INDEX idx_products_user_id ON products(userId);
CREATE INDEX idx_products_organization_id ON products(organizationId);
CREATE INDEX idx_products_created_at ON products(createdAt);
CREATE INDEX idx_products_article_number ON products(articleNumber);

-- Photo lookup
CREATE INDEX idx_product_photos_product_id ON product_photos(productId);
CREATE INDEX idx_product_photos_type ON product_photos(photoType);

-- Analysis tracking
CREATE INDEX idx_product_analyses_product_id ON product_analyses(productId);
CREATE INDEX idx_product_analyses_status ON product_analyses(status);

-- Export history
CREATE INDEX idx_product_exports_user_id ON product_exports(userId);
CREATE INDEX idx_product_exports_status ON product_exports(status);
CREATE INDEX idx_product_exports_created_at ON product_exports(createdAt);
```

### Full-Text Search
```sql
-- Enable full-text search on product descriptions
CREATE INDEX idx_products_search ON products 
USING gin(to_tsvector('german', title || ' ' || COALESCE(shortDescription, '') || ' ' || COALESCE(longDescription, '')));
```

## Migration Strategy

### Phase 1: Core Models
1. Create Product and ProductPhoto models
2. Add basic photo upload and storage
3. Implement simple product CRUD operations

### Phase 2: AI Analysis
1. Add ProductAnalysis model
2. Integrate with existing LLM infrastructure
3. Implement OCR and classification

### Phase 3: Export System
1. Add ProductExport model
2. Implement Kivitendo CSV export
3. Add export history and management

### Phase 4: Store Integration
1. Add StorePublication model
2. Implement basic store preview
3. Add publication tracking

## Data Validation

### Product Validation Rules
```typescript
const productValidation = {
  title: z.string().min(1).max(255),
  articleNumber: z.string().optional(),
  length: z.number().positive().optional(),
  width: z.number().positive().optional(),
  height: z.number().positive().optional(),
  weight: z.number().positive().optional(),
  price: z.number().positive().optional(),
  stockQuantity: z.number().int().nonnegative().optional(),
};
```

### Photo Validation Rules
```typescript
const photoValidation = {
  mimeType: z.enum(['image/jpeg', 'image/png', 'image/webp']),
  fileSize: z.number().max(10 * 1024 * 1024), // 10MB max
  filename: z.string().min(1).max(255),
};
```

## Security Considerations

### Access Control
- Users can only access their own products
- Organization admins can access all org products
- Proper row-level security (RLS) policies

### Data Privacy
- Secure photo storage with access controls
- Audit logging for sensitive operations
- GDPR compliance for user data

### API Security
- Rate limiting for photo uploads
- File type validation and scanning
- Secure file URLs with expiration

## Performance Considerations

### Optimization Strategies
- Lazy loading for product photos
- Pagination for large product catalogs
- Background processing for AI analysis
- Caching for frequently accessed data

### Monitoring
- Track photo upload success rates
- Monitor AI analysis processing times
- Alert on failed exports or publications
- Usage metrics for billing/analytics

## Backup and Recovery

### Data Backup
- Regular database backups including BLOB references
- Separate backup strategy for photo storage
- Point-in-time recovery capabilities

### Disaster Recovery
- Multi-region photo storage replication
- Database failover procedures
- Recovery testing procedures

## Next Steps

1. **Schema Implementation**: Create Prisma migration files
2. **Storage Setup**: Configure cloud storage integration
3. **API Design**: Plan tRPC endpoints for Erfassung
4. **Security Review**: Implement access controls and validation
5. **Performance Testing**: Load test with sample data
6. **Documentation**: API documentation and user guides