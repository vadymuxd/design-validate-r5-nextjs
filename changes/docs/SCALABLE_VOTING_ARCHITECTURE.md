# **🏗️ Scalable Voting Architecture**

## **📋 Overview**

Transformed the voting system from a tool/method-specific approach to a truly scalable architecture that can handle voting on **any entity type** (tools, methods, cases, metrics, articles, frameworks, etc.).

## **🚨 Problem Solved**

### **Before (Not Scalable):**
```typescript
// Limited approach - only tool vs method detection
{
  tool_id?: string,    // ❌ Entity-specific field  
  method_id: number,   // ❌ Context hardcoded
  sentiment: string
}

// Inference logic - not extensible
const isToolVote = tool_id !== undefined;
```

### **After (Infinitely Scalable):**
```typescript
// Generic approach - works for any entity
{
  vote_type: 'tool' | 'method' | 'case' | 'metric' | 'article' | 'framework',
  entity_id: string,     // ✅ Universal entity identifier  
  context_id?: number,   // ✅ Optional context (e.g., method_id for tools)
  sentiment: 'UPVOTE' | 'DOWNVOTE'
}

// Explicit routing - highly extensible
switch (vote_type) {
  case 'tool': updateToolLeaderboard();
  case 'method': updateMethodCounts();
  case 'case': updateCaseAggregates();    // ✅ Future-ready
  case 'metric': updateMetricScores();    // ✅ Future-ready
  // ... infinitely extensible
}
```

---

## **🗄️ Database Architecture**

### **New Schema:**
```sql
CREATE TYPE vote_entity_type AS ENUM (
  'tool', 'method', 'case', 'metric', 'article', 'framework'
);

ALTER TABLE votes 
ADD COLUMN vote_type vote_entity_type NOT NULL,
ADD COLUMN entity_id text NOT NULL;

-- Optimized indexes for new query patterns
CREATE INDEX idx_votes_type_entity_device ON votes (vote_type, entity_id, device_id);
CREATE INDEX idx_votes_type_entity_context ON votes (vote_type, entity_id, method_id);
```

### **Universal Vote Storage:**
```sql
-- Tool vote
INSERT INTO votes (vote_type, entity_id, method_id, sentiment, device_id, ip_address)
VALUES ('tool', 'uuid-123', 5, 'UPVOTE', 'device123', 'ip');

-- Method vote  
INSERT INTO votes (vote_type, entity_id, sentiment, device_id, ip_address)
VALUES ('method', '5', 'UPVOTE', 'device123', 'ip');

-- Case vote (future)
INSERT INTO votes (vote_type, entity_id, sentiment, device_id, ip_address)
VALUES ('case', 'airbnb-redesign', 'UPVOTE', 'device123', 'ip');

-- Metric vote (future)
INSERT INTO votes (vote_type, entity_id, method_id, sentiment, device_id, ip_address) 
VALUES ('metric', 'conversion-rate', 3, 'UPVOTE', 'device123', 'ip');
```

---

## **🔌 API Architecture**

### **Single Unified Endpoint:**
```
POST /api/votes
```

### **Request Examples:**

#### **Tool Voting:**
```json
{
  "vote_type": "tool",
  "entity_id": "hotjar-uuid-123",
  "context_id": 5,                    // method_id where tool is being voted
  "sentiment": "UPVOTE"
}
```

#### **Method Voting:**
```json
{
  "vote_type": "method", 
  "entity_id": "5",                   // method.id as string
  "sentiment": "DOWNVOTE"
}
```

#### **Future: Case Voting:**
```json
{
  "vote_type": "case",
  "entity_id": "airbnb-checkout-redesign",
  "sentiment": "UPVOTE"
}
```

#### **Future: Metric Voting:**
```json
{
  "vote_type": "metric",
  "entity_id": "conversion-rate",
  "context_id": 3,                    // method_id context
  "sentiment": "UPVOTE"
}
```

### **Smart Routing Logic:**
```typescript
async function updateAggregatedCounts(voteType: VoteEntityType, entityId: string, contextId?: number) {
  switch (voteType) {
    case 'tool':
      await updateToolLeaderboard(entityId, contextId!);
      break;
    case 'method':
      await updateMethodVoteCounts(entityId);
      break;
    case 'case':
      await updateCaseAggregates(entityId);        // ✅ Ready for implementation
      break;
    case 'metric':
      await updateMetricScores(entityId, contextId); // ✅ Ready for implementation
      break;
    case 'article':
      await updateArticleScores(entityId);          // ✅ Ready for implementation  
      break;
    case 'framework':
      await updateFrameworkScores(entityId);        // ✅ Ready for implementation
      break;
  }
}
```

---

## **📊 Generic Vote Counting**

### **Universal Count Function:**
```sql
CREATE OR REPLACE FUNCTION count_entity_votes(
  entity_type vote_entity_type,
  entity_id_param text,
  context_id_param bigint DEFAULT NULL
)
RETURNS TABLE (upvotes bigint, downvotes bigint) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(*) FILTER (WHERE sentiment = 'UPVOTE') as upvotes,
    COUNT(*) FILTER (WHERE sentiment = 'DOWNVOTE') as downvotes
  FROM votes 
  WHERE vote_type = entity_type 
    AND entity_id = entity_id_param
    AND (context_id_param IS NULL OR method_id = context_id_param);
END;
$$ LANGUAGE plpgsql;
```

### **Usage Examples:**
```sql
-- Count tool votes in specific method
SELECT * FROM count_entity_votes('tool', 'hotjar-uuid', 5);

-- Count all method votes
SELECT * FROM count_entity_votes('method', '5');

-- Count case votes (future)
SELECT * FROM count_entity_votes('case', 'airbnb-redesign');
```

---

## **🎨 Frontend Architecture**

### **Unified Vote Function:**
```typescript
// Tool voting
fetch('/api/votes', {
  method: 'POST',
  body: JSON.stringify({
    vote_type: 'tool',
    entity_id: toolId,
    context_id: methodId,
    sentiment: 'UPVOTE'
  })
});

// Method voting  
fetch('/api/votes', {
  method: 'POST', 
  body: JSON.stringify({
    vote_type: 'method',
    entity_id: methodId.toString(),
    sentiment: 'UPVOTE'
  })
});

// Future: Case voting
fetch('/api/votes', {
  method: 'POST',
  body: JSON.stringify({
    vote_type: 'case', 
    entity_id: 'case-slug',
    sentiment: 'UPVOTE'
  })
});
```

---

## **🚀 Future Extensibility**

### **Adding New Votable Entities (3 Steps):**

#### **1. Update Database Enum:**
```sql
ALTER TYPE vote_entity_type ADD VALUE 'new_entity_type';
```

#### **2. Add Aggregation Logic:**
```typescript
case 'new_entity_type':
  await updateNewEntityAggregates(entityId, contextId);
  break;
```

#### **3. Update Frontend:**
```typescript
fetch('/api/votes', {
  body: JSON.stringify({
    vote_type: 'new_entity_type',
    entity_id: 'entity-identifier',
    sentiment: 'UPVOTE'
  })
});
```

### **Planned Future Entities:**

#### **📋 Cases:**
- **Purpose:** Vote on UX case studies
- **Entity ID:** Case slug (`'airbnb-checkout-redesign'`)
- **Context:** Optional method_id if case relates to specific method

#### **📈 Metrics:**
- **Purpose:** Vote on which metrics are most valuable
- **Entity ID:** Metric slug (`'conversion-rate'`, `'user-engagement'`)
- **Context:** method_id for method-specific metric relevance

#### **📝 Articles:**
- **Purpose:** Vote on educational content quality
- **Entity ID:** Article slug (`'how-to-ab-test'`)
- **Context:** None (standalone content)

#### **🛠️ Frameworks:**
- **Purpose:** Vote on development/design frameworks
- **Entity ID:** Framework slug (`'design-system-atomic'`)
- **Context:** Optional method_id if framework relates to method

---

## **📋 Migration Checklist**

- [x] Create `scalable-voting-migration.sql`
- [x] Add `vote_entity_type` enum with 6 entity types
- [x] Add `vote_type` and `entity_id` columns to votes table
- [x] Backfill existing data (tools & methods)
- [x] Create generic `count_entity_votes()` function
- [x] Rewrite `/api/votes` with smart routing
- [x] Update frontend (tool & method voting)
- [x] Update TypeScript types
- [x] Add performance indexes

---

## **✅ Benefits Achieved**

1. **🎯 Infinite Scalability:** Add new votable entities in 3 simple steps
2. **🔧 Single API Endpoint:** One `/api/votes` handles everything
3. **📊 Universal Counting:** Generic functions work for all entity types  
4. **🚀 Performance Optimized:** Proper indexes for new query patterns
5. **👨‍💻 Developer Experience:** Clear, explicit vote_type (no inference)
6. **🔮 Future-Proof:** Ready for cases, metrics, articles, frameworks
7. **🧹 Clean Architecture:** No entity-specific logic scattered around

---

## **🎯 Result**

**Before:** Limited voting system requiring major refactoring for each new entity type.

**After:** ✨ **Infinitely scalable voting architecture** that handles any votable entity with consistent patterns, performance, and maintainability. 