

## Problem

Abhi Price List page alag items dikhata hai (Cement OPC, Sand Reti, etc.) jo calculator ke items se match nahi karte. Aap chahte hain ke **calculator mein jo items hain (Foundation, Columns, Cement, Floor Tiles, Electric Work, etc.) wohi same items Price List mein dikhen** - same sections ke saath - aur wahan se price update karne par calculator mein bhi update ho jaye.

## Solution

Calculator ke sections aur items ko Price List ka source banayein. Price List page calculator ke actual items dikhaye ga - same categories (Structure, Gray Structure, Finishing, Materials, Labor, Miscellaneous) ke saath.

## Changes

### 1. Update `useMasterPriceList.ts`
- Remove the separate `DEFAULT_ITEMS` array
- Instead, read items from calculator's template/state (from `templates.ts` sections)
- Store prices by item name as a price map in localStorage
- When price updates, propagate to saved estimates AND calculator's current state

### 2. Update `MasterPriceList.tsx`  
- Show items grouped by calculator sections (Structure, Gray Structure, Finishing, Materials, Labor, Miscellaneous)
- Each item shows its icon, name, unit, and editable unit price field
- Same card-row layout as calculator's CostItemRow
- When price is changed, it updates everywhere

### 3. Update `useCalculator.ts`
- On load, check master price list for updated prices and apply them to current state

### 4. Two-way sync logic
- Calculator → Price List: When items are added/edited in calculator, they appear in price list
- Price List → Calculator: When price updated in price list, calculator items update too

## Flow
```text
Calculator Items ←→ Master Price List (shared localStorage)
                         ↓
                  Saved Estimates (auto-update)
```

