# Erfassung AI Integration Strategy

created_date: 2025-07-10
last_modified_date: 2025-08-13
last_modified_summary: "Document AI-driven FormSchema generation, validation pipeline, and data integrity guarantees."

## AI-driven FormSchema generation (best practice)

- The AI proposes a FormSchema (typed Zod shape) rather than plain text instructions.
- Output contract: AI returns a JSON object conforming to the FormSchema DSL (field array, types, constraints, relations, sectioning, version).
- Versioning: Every generated schema carries `schemaVersion` and a `source.meta` block (model, prompt hash) for auditability.

### Guardrails
- Strict Zod validation of AI output. On failure: return actionable errors and auto-generate a minimal viable schema as fallback.
- Normalization pass enforces defaults (labels, ids, required flags, regexes, min/max, enum options).
- Sensitive fields policy: detect PII-like names; apply masking rules and storage encryption flags in metadata.

### Data integrity pipeline
1) Client-side Zod validation (zodResolver) ensures UX-level correctness.
2) Server route validates the same schema; rejects drift.
3) Prisma-level constraints: NOT NULL, enum, length; foreign keys for references; transaction boundaries.
4) Property-based tests (Playwright/Vitest) generate randomized inputs for each field type and assert invariants.
5) Post-ingest checks: background job verifies referential integrity, runs schema-specific checks (e.g., required groups, cross-field constraints).

### Structured data first
- All forms store `schema` (JSON) + `currentVersion` with `versions[]` history.
- Submissions store `data` (JSON) and `metadata` with a pointer to `schemaVersion` used at submission time.
- Breaking changes: create a new `FormVersion`; readers use version-aware adapters.

## Prompts and adapters
- Prompts describe domain goals and constraints, not UI components.
- Adapter converts model output to the FormSchema DSL, with explicit error reporting when fields are underspecified.
- Idempotency keys on analysis tasks; deduplicate per input hash.

## Observability
- Structured logs include prompt+response hashes, schemaVersion, and validation outcomes.
- Sentry for errors; OpenTelemetry traces around generation, validation, and persistence.

## Overview
This document outlines the AI/ML services integration strategy for Erfassung's product cataloging system, focusing on OCR, image analysis, and product classification capabilities.

## Core AI Requirements

### 1. Photo Analysis Pipeline
- **OCR for Product Labels**: Extract text from product labels, datasheets, and typeschilds
- **Image Classification**: Identify product categories automatically
- **Dimension Detection**: Analyze photos with measuring tools to extract size data
- **Weight Recognition**: Process photos of products on scales
- **General Description**: Generate product descriptions from visual analysis

### 2. Multi-Modal Processing
- Process multiple photos per product with different purposes
- Combine text extraction with visual analysis
- Confidence scoring for all extracted data
- Error handling and fallback mechanisms

## Recommended AI Services Stack

### Primary Vision API: OpenAI GPT-4 Vision
**Rationale**: Already integrated in Formular backend, supports multi-modal analysis
```javascript
// Example implementation
const analyzeProduct = async (photos, analysisType) => {
  const messages = [
    {
      role: "user", 
      content: [
        { 
          type: "text", 
          text: "Analyze this product photo and extract: product name, manufacturer, model, dimensions, weight, and category. Return structured JSON." 
        },
        ...photos.map(photo => ({
          type: "image_url",
          image_url: { url: photo.url }
        }))
      ]
    }
  ];

  const response = await openai.chat.completions.create({
    model: "gpt-4-vision-preview",
    messages,
    response_format: { type: "json_object" },
    max_tokens: 1000
  });

  return JSON.parse(response.choices[0].message.content);
};
```

### Secondary OCR: Google Vision API
**Rationale**: Best-in-class OCR accuracy (98.0%) for challenging product labels
```javascript
// Integration for high-accuracy text extraction
const extractTextWithVision = async (imageBuffer) => {
  const [result] = await visionClient.textDetection({
    image: { content: imageBuffer.toString('base64') }
  });
  
  return {
    fullText: result.fullTextAnnotation?.text,
    confidence: result.textAnnotations?.[0]?.confidence,
    boundingBoxes: result.textAnnotations?.map(annotation => ({
      text: annotation.description,
      bounds: annotation.boundingPoly
    }))
  };
};
```

### Fallback OCR: Tesseract.js
**Rationale**: Cost-effective, runs locally, good for basic text extraction
```javascript
// Local processing fallback
const extractTextWithTesseract = async (imageUrl) => {
  const { data: { text, confidence } } = await Tesseract.recognize(
    imageUrl,
    'deu+eng', // German and English
    {
      logger: m => console.log(m)
    }
  );
  
  return { text, confidence: confidence / 100 };
};
```

## Service Performance Comparison

### OCR Accuracy Rankings (2025 Data)
1. **Google Vision API**: 98.0% accuracy
2. **AWS Textract**: 97.8% accuracy  
3. **Azure Computer Vision**: 97.2% accuracy
4. **Tesseract**: 94.5% accuracy (varies with image quality)

### Cost Analysis (per 1,000 requests)
- **OpenAI GPT-4 Vision**: $0.01-0.03 (varies by image size)
- **Google Vision API**: $1.50 (first 5M), $0.60 (above 5M)
- **AWS Textract**: $1.50-3.00 (depending on features)
- **Tesseract**: Free (open source)

### Processing Speed
- **Tesseract**: ~2-3 seconds (local)
- **OpenAI GPT-4 Vision**: ~3-8 seconds
- **Google Vision**: ~1-2 seconds
- **AWS Textract**: ~2-4 seconds

## Implementation Strategy

### Phase 1: MVP Implementation
```typescript
// Service abstraction layer
interface ProductAnalysisService {
  analyzePhotos(photos: ProductPhoto[], analysisType: AnalysisType): Promise<AnalysisResult>;
  extractText(photo: ProductPhoto): Promise<OCRResult>;
  classifyProduct(photos: ProductPhoto[]): Promise<ClassificationResult>;
  detectDimensions(photo: ProductPhoto): Promise<DimensionResult>;
}

// Primary implementation using OpenAI
class OpenAIProductAnalysisService implements ProductAnalysisService {
  async analyzePhotos(photos: ProductPhoto[], analysisType: AnalysisType): Promise<AnalysisResult> {
    const prompt = this.buildPrompt(analysisType);
    const imageContents = photos.map(photo => ({
      type: "image_url",
      image_url: { url: photo.storagePath }
    }));

    const response = await this.openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{
        role: "user",
        content: [{ type: "text", text: prompt }, ...imageContents]
      }],
      response_format: { type: "json_object" },
      max_tokens: 2000
    });

    return this.parseResponse(response.choices[0].message.content);
  }

  private buildPrompt(analysisType: AnalysisType): string {
    const prompts = {
      FULL_ANALYSIS: `
        Analyze these product photos and extract all available information in JSON format:
        {
          "title": "Product name/title",
          "manufacturer": "Brand or manufacturer name",
          "model": "Model number or identifier",
          "articleNumber": "Article/SKU number if visible",
          "shortDescription": "Brief product description",
          "longDescription": "Detailed product description",
          "dimensions": {
            "length": "Length in mm",
            "width": "Width in mm", 
            "height": "Height in mm",
            "unit": "mm"
          },
          "weight": {
            "value": "Weight value",
            "unit": "g or kg"
          },
          "categories": {
            "mainA": "Primary category",
            "mainB": "Secondary category",
            "subA": "Subcategory A",
            "subB": "Subcategory B"
          },
          "confidence": {
            "overall": 0.85,
            "title": 0.92,
            "manufacturer": 0.95,
            // ... confidence for each field
          },
          "extractedText": ["All visible text found in images"],
          "photoTypes": ["label", "general", "dimensions", "weight"]
        }
        
        Guidelines:
        - Extract text exactly as it appears
        - Use German product categories when possible
        - Provide confidence scores (0-1) for each field
        - Return null for unavailable information
        - Identify photo types (label, general, dimensions, weight, packaging)
      `,
      OCR: "Extract all visible text from these images and return as structured JSON...",
      CLASSIFICATION: "Classify this product into appropriate categories...",
      DIMENSION: "Detect and extract dimension information from measuring tools in the image..."
    };

    return prompts[analysisType] || prompts.FULL_ANALYSIS;
  }
}
```

### Phase 2: Multi-Service Pipeline
```typescript
// Hybrid approach for maximum accuracy
class HybridProductAnalysisService implements ProductAnalysisService {
  private openaiService: OpenAIProductAnalysisService;
  private visionService: GoogleVisionService;
  private tesseractService: TesseractService;

  async analyzePhotos(photos: ProductPhoto[], analysisType: AnalysisType): Promise<AnalysisResult> {
    // Primary analysis with OpenAI GPT-4 Vision
    const primaryResult = await this.openaiService.analyzePhotos(photos, analysisType);
    
    // Enhanced OCR for label photos
    const labelPhotos = photos.filter(p => p.photoType === 'LABEL');
    if (labelPhotos.length > 0) {
      const ocrResults = await Promise.all([
        this.visionService.extractText(labelPhotos[0]), // High accuracy
        this.tesseractService.extractText(labelPhotos[0]) // Fallback
      ]);
      
      // Merge and validate OCR results
      primaryResult.extractedText = this.mergeOCRResults(ocrResults);
      primaryResult.confidence.ocr = this.calculateOCRConfidence(ocrResults);
    }

    return primaryResult;
  }

  private mergeOCRResults(results: OCRResult[]): string[] {
    // Combine results, preferring higher confidence extractions
    const merged = new Set<string>();
    results.forEach(result => {
      if (result.confidence > 0.7) {
        result.text.split('\n').forEach(line => {
          if (line.trim()) merged.add(line.trim());
        });
      }
    });
    return Array.from(merged);
  }
}
```

## Data Processing Pipeline

### Background Job Implementation
```typescript
// Queue system for processing
import { Queue } from 'bull';

const productAnalysisQueue = new Queue('product analysis', {
  redis: { host: 'localhost', port: 6379 }
});

// Job processor
productAnalysisQueue.process('analyze-product', async (job) => {
  const { productId, photos, analysisType } = job.data;
  
  try {
    // Update status
    await updateProductStatus(productId, 'ANALYZING');
    
    // Run analysis
    const analysisService = new HybridProductAnalysisService();
    const results = await analysisService.analyzePhotos(photos, analysisType);
    
    // Store results
    await saveAnalysisResults(productId, results);
    await updateProductStatus(productId, 'ANALYZED');
    
    // Notify frontend via WebSocket
    io.to(`product-${productId}`).emit('analysis-complete', results);
    
    return results;
  } catch (error) {
    await updateProductStatus(productId, 'DRAFT');
    throw error;
  }
});
```

### Confidence Scoring System
```typescript
interface ConfidenceScores {
  overall: number;
  title: number;
  manufacturer: number;
  dimensions: number;
  weight: number;
  categories: number;
  ocr: number;
}

class ConfidenceCalculator {
  static calculateOverallConfidence(scores: Partial<ConfidenceScores>): number {
    const weights = {
      title: 0.25,
      manufacturer: 0.20,
      dimensions: 0.15,
      weight: 0.10,
      categories: 0.20,
      ocr: 0.10
    };

    let totalScore = 0;
    let totalWeight = 0;

    Object.entries(weights).forEach(([field, weight]) => {
      if (scores[field as keyof ConfidenceScores] !== undefined) {
        totalScore += scores[field as keyof ConfidenceScores]! * weight;
        totalWeight += weight;
      }
    });

    return totalWeight > 0 ? totalScore / totalWeight : 0;
  }

  static getConfidenceLevel(score: number): 'high' | 'medium' | 'low' {
    if (score >= 0.8) return 'high';
    if (score >= 0.6) return 'medium';
    return 'low';
  }
}
```

## Error Handling & Fallbacks

### Service Availability Strategy
```typescript
class ResilientAnalysisService {
  private services: ProductAnalysisService[];
  private healthChecker: ServiceHealthChecker;

  async analyzePhotos(photos: ProductPhoto[], analysisType: AnalysisType): Promise<AnalysisResult> {
    const availableServices = await this.healthChecker.getHealthyServices();
    
    for (const service of availableServices) {
      try {
        const result = await service.analyzePhotos(photos, analysisType);
        if (result.confidence.overall > 0.5) {
          return result;
        }
      } catch (error) {
        console.warn(`Service ${service.constructor.name} failed:`, error);
        // Continue to next service
      }
    }
    
    // All services failed - return manual entry placeholder
    return this.createManualEntryPlaceholder(photos);
  }

  private createManualEntryPlaceholder(photos: ProductPhoto[]): AnalysisResult {
    return {
      title: '',
      manufacturer: '',
      confidence: { overall: 0 },
      requiresManualReview: true,
      photos: photos.map(p => ({ id: p.id, type: p.photoType }))
    };
  }
}
```

## Performance Optimization

### Caching Strategy
```typescript
// Redis-based caching for analysis results
class AnalysisCache {
  private redis: Redis;

  async getCachedAnalysis(photoHashes: string[]): Promise<AnalysisResult | null> {
    const cacheKey = this.generateCacheKey(photoHashes);
    const cached = await this.redis.get(cacheKey);
    
    if (cached) {
      return JSON.parse(cached);
    }
    return null;
  }

  async cacheAnalysis(photoHashes: string[], result: AnalysisResult): Promise<void> {
    const cacheKey = this.generateCacheKey(photoHashes);
    await this.redis.setex(cacheKey, 86400, JSON.stringify(result)); // 24h TTL
  }

  private generateCacheKey(photoHashes: string[]): string {
    return `analysis:${photoHashes.sort().join(':')}`;
  }
}
```

### Batch Processing
```typescript
// Process multiple products efficiently
class BatchAnalysisService {
  async analyzeProductBatch(productIds: string[]): Promise<Map<string, AnalysisResult>> {
    const results = new Map();
    const batchSize = 5; // Process 5 products concurrently
    
    for (let i = 0; i < productIds.length; i += batchSize) {
      const batch = productIds.slice(i, i + batchSize);
      const batchPromises = batch.map(async (productId) => {
        const product = await getProduct(productId);
        const analysisResult = await this.analyzeProduct(product);
        return [productId, analysisResult];
      });
      
      const batchResults = await Promise.allSettled(batchPromises);
      batchResults.forEach((result, index) => {
        if (result.status === 'fulfilled') {
          const [productId, analysis] = result.value;
          results.set(productId, analysis);
        }
      });
    }
    
    return results;
  }
}
```

## Monitoring & Analytics

### Success Metrics
- **Analysis Accuracy**: Track user corrections vs AI predictions
- **Processing Speed**: Monitor analysis completion times
- **Service Availability**: Track API uptime and error rates
- **Cost Efficiency**: Monitor API usage and costs per product
- **User Satisfaction**: Track confidence scores and manual overrides

### Logging Strategy
```typescript
class AnalysisLogger {
  static logAnalysisAttempt(productId: string, service: string, photos: number): void {
    console.log({
      event: 'analysis_started',
      productId,
      service,
      photoCount: photos,
      timestamp: new Date().toISOString()
    });
  }

  static logAnalysisResult(productId: string, result: AnalysisResult, processingTime: number): void {
    console.log({
      event: 'analysis_completed',
      productId,
      confidence: result.confidence.overall,
      processingTime,
      fieldsExtracted: Object.keys(result).length,
      timestamp: new Date().toISOString()
    });
  }
}
```

## Next Steps

### Phase 1 Implementation (Weeks 1-2)
1. Set up OpenAI GPT-4 Vision integration
2. Implement basic product analysis pipeline
3. Create background job processing
4. Build confidence scoring system

### Phase 2 Enhancement (Weeks 3-4)
1. Add Google Vision API for enhanced OCR
2. Implement caching and optimization
3. Build monitoring and analytics
4. Add batch processing capabilities

### Phase 3 Optimization (Weeks 5-6)
1. Fine-tune prompts based on real data
2. Implement custom classification models
3. Add advanced error handling
4. Optimize cost and performance

## Integration with Formular

### Leveraging Existing Infrastructure
- **Background Jobs**: Use existing Bull queue system
- **Database**: Extend Prisma schema with analysis models
- **API**: Add tRPC endpoints for analysis operations
- **WebSockets**: Real-time updates via existing Socket.io setup
- **Authentication**: Use existing user and organization context

### Reusing Form Technology
Product data review forms will leverage Formular's existing dynamic form system:
- Use `FormField` components for data editing
- Apply existing validation patterns
- Reuse `FormPreview` for displaying structured data
- Leverage `useFormValidation` hooks for field validation

This ensures consistency with the existing Formular UX while providing specialized product cataloging capabilities.