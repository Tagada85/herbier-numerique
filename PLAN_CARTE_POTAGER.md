# Plan : Carte visuelle du potager

## Contexte
L'utilisateur a une liste de zones dans son herbier mais aucun moyen de visualiser leur emplacement sur son terrain. Il veut un schéma représentatif de son potager avec les zones positionnées spatialement, pour voir d'un coup d'oeil l'organisation de son espace.

**Approche** : un canvas libre avec des rectangles redimensionnables et déplaçables, chacun représentant une zone. Le potager est plutôt rectangulaire, donc des formes géométriques simples suffisent.

## Modèle de données

### Enrichir l'interface `Zone` existante

```typescript
// Avant
interface Zone {
  id: string
  name: string
  description: string
  createdAt: string
}

// Après
interface Zone {
  id: string
  name: string
  description: string
  color: string           // couleur de la zone sur la carte (ex: "#86efac")
  createdAt: string
}
```

### Nouveau store IndexedDB : `gardenMap`

Un seul enregistrement qui stocke la configuration de la carte :

```typescript
interface GardenMap {
  id: string                  // toujours "default" (une seule carte)
  width: number               // largeur du canvas en unités logiques
  height: number              // hauteur du canvas en unités logiques
  zonePlacements: ZonePlacement[]
  updatedAt: string
}

interface ZonePlacement {
  zoneId: string              // référence vers la zone
  x: number                   // position X (en % du canvas, 0-100)
  y: number                   // position Y (en % du canvas, 0-100)
  width: number               // largeur (en % du canvas)
  height: number              // hauteur (en % du canvas)
}
```

Stocker les positions en **pourcentages** plutôt qu'en pixels permet à la carte de s'adapter à toutes les tailles d'écran sans recalcul.

### Migration IndexedDB v1 → v2
- Incrémenter `DB_VERSION` à 2
- Créer le store `gardenMap` dans `upgrade()`
- Ajouter `color` aux zones existantes (valeur par défaut)
- Les zones sans `color` reçoivent une couleur par défaut au chargement

**Note** : si le journal de potager (PLAN_JOURNAL.md) est implémenté en premier, cette migration sera v2 → v3 à la place.

## Interaction utilisateur

### Visualisation
- Canvas qui affiche le contour du potager (rectangle de fond)
- Chaque zone est un rectangle coloré avec son nom affiché dessus
- Les zones sans placement ne sont pas affichées sur la carte (mais listées en dessous comme "zones non placées")

### Édition
- **Mode édition** activable par un bouton
- **Placer une zone** : taper sur une zone non placée → elle apparaît au centre du canvas
- **Déplacer** : drag & drop d'un rectangle sur le canvas (touch + mouse)
- **Redimensionner** : poignée en bas à droite du rectangle (drag pour agrandir/réduire)
- **Retirer du canvas** : bouton sur le rectangle en mode édition
- **Sauvegarder** : les positions sont enregistrées dans IndexedDB à chaque modification

### Touch support (mobile-first)
- `onTouchStart`, `onTouchMove`, `onTouchEnd` pour le drag & drop
- `onMouseDown`, `onMouseMove`, `onMouseUp` comme fallback desktop
- Prévoir un seuil de mouvement minimum pour distinguer tap et drag

## Implémentation technique

### Approche de rendu : HTML/CSS (pas de `<canvas>`)
Utiliser des `div` positionnées en `absolute` dans un conteneur `relative`. Plus simple que Canvas API pour :
- Afficher du texte (nom de zone)
- Gérer les événements touch/click par élément
- Styler avec Tailwind
- Maintenir l'accessibilité

### Fichiers à créer

#### Couche données
- `src/db/garden-map.db.ts` — CRUD pour la carte (getMap, saveMap, addZonePlacement, removeZonePlacement, updateZonePlacement)

#### Hook
- `src/hooks/useGardenMap.ts` — chargement/sauvegarde de la carte, logique de placement

#### Composants
- `src/components/garden/GardenCanvas.tsx` — conteneur principal de la carte (le "terrain")
- `src/components/garden/ZoneBlock.tsx` — rectangle d'une zone (draggable, resizable)
- `src/components/garden/UnplacedZones.tsx` — liste des zones pas encore placées sur la carte

#### Page
- `src/pages/GardenPage.tsx` — page de la carte, mode visualisation/édition

### Fichiers à modifier

#### `src/db/schema.ts`
- Ajouter les interfaces `GardenMap` et `ZonePlacement`
- Ajouter `color` à l'interface `Zone`
- Ajouter le store `gardenMap` dans `HerbierDB`
- Incrémenter `DB_VERSION`, gérer la migration

#### `src/App.tsx`
- Ajouter la route `/garden` → `GardenPage`
- Ajouter un onglet "Carte" dans la navigation bottom (3ème onglet)

#### `src/pages/ZonesPage.tsx`
- Ajouter un sélecteur de couleur lors de la création/édition d'une zone

## Navigation mise à jour

```
App
├── Layout (nav bottom : Herbier | Capturer | Carte)
├── HomePage (/)
├── CapturePage (/capture)
├── GardenPage (/garden)           ← NOUVEAU
│   ├── GardenCanvas
│   │   └── ZoneBlock[] (rectangles déplaçables)
│   ├── UnplacedZones (zones à placer)
│   └── Bouton mode édition
├── PlantDetailPage (/plants/:id)
└── ZonesPage (/zones)
```

## Flux utilisateur

### Première utilisation
1. L'utilisateur va sur "Carte" → canvas vide
2. Toutes ses zones sont listées dans "Zones non placées"
3. Il active le mode édition
4. Il tape sur une zone non placée → elle apparaît au centre du canvas
5. Il la déplace et la redimensionne à la bonne position
6. Il répète pour chaque zone
7. Il quitte le mode édition → la carte est sauvegardée

### Utilisation courante
1. L'utilisateur ouvre "Carte" → voit son potager avec toutes les zones positionnées
2. Tape sur une zone → voir les plantes associées à cette zone (lien vers HomePage filtrée)

## Palette de couleurs par défaut pour les zones

```typescript
const ZONE_COLORS = [
  '#86efac', // vert clair
  '#fde68a', // jaune
  '#fca5a5', // rouge clair
  '#93c5fd', // bleu clair
  '#c4b5fd', // violet clair
  '#fdba74', // orange clair
  '#a5f3fc', // cyan
  '#f9a8d4', // rose
]
```

Attribution automatique à la création (couleur suivante dans la liste, cyclique).

## Vérification
1. Créer 3-4 zones dans la page Zones
2. Aller sur la page Carte → les zones apparaissent dans "non placées"
3. Mode édition → placer les zones, redimensionner, déplacer
4. Quitter le mode édition → les positions sont conservées
5. Recharger l'app → les positions sont toujours là (persistées dans IndexedDB)
6. Taper sur une zone → redirige vers l'herbier filtré par cette zone
7. Tester sur mobile (touch drag & drop)
