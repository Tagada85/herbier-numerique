# Plan : Journal de Potager

## Contexte
Ajouter un journal d'activités au sein de l'Herbier Numérique pour suivre les actions réalisées au potager (semis, arrosage, rempotage, etc.). Remplace l'usage de growveg.co.uk pour le garden journal.

## Règles métier

### Liens entre entités
Une activité peut être liée à :
- **Une plante** (optionnel) — quelle espèce est concernée
- **Une zone** (optionnel) — où l'activité a lieu

Les deux sont indépendants. Toutes les combinaisons sont valides :
- Plante + zone : "Arrosage des tomates zone B"
- Plante seule : "Semis de courgettes en godets" (intérieur, pas de zone)
- Zone seule : "Préparer le terrain zone C" (pas encore de plante décidée)
- Aucun : "Désherbage général", "Entretien compost"

### Types d'activités
Liste prédéfinie + possibilité d'ajouter des types personnalisés.

Types prédéfinis :
- Semis
- Arrosage
- Rempotage
- Taille
- Récolte
- Préparation du sol
- Désherbage
- Fertilisation
- Traitement
- Paillage
- Plantation
- Bouturage
- Observation

---

## Modèle de données

### Nouveau store IndexedDB : `activities`

```typescript
interface Activity {
  id: string
  type: string              // type prédéfini ou personnalisé
  notes: string             // champ libre pour détails
  plantId: string | null    // référence optionnelle vers une plante
  zoneId: string | null     // référence optionnelle vers une zone
  date: string              // date de l'activité (ISO 8601)
  createdAt: string
}
```

Index sur :
- `by-plant-id` (plantId) — pour afficher les activités d'une plante
- `by-zone-id` (zoneId) — pour afficher les activités d'une zone
- `by-date` (date) — pour le tri chronologique

### Nouveau store IndexedDB : `activityTypes`

```typescript
interface ActivityType {
  id: string
  label: string             // "Semis", "Arrosage", ou un type personnalisé
  isCustom: boolean         // false pour les prédéfinis, true pour les ajoutés par l'utilisateur
}
```

Les types prédéfinis sont insérés au premier lancement (dans la migration IndexedDB v2).

### Migration IndexedDB
- Incrémenter la version de la base de 1 à 2
- Créer les stores `activities` et `activityTypes` dans le callback `upgrade`
- Peupler `activityTypes` avec les types prédéfinis

---

## Fichiers à créer

### Couche données
- `src/db/activities.db.ts` — CRUD activités (add, getAll, getByPlantId, getByZoneId, getByDateRange, delete)
- `src/db/activity-types.db.ts` — CRUD types d'activités (getAll, addCustomType, deleteCustomType)

### Hooks
- `src/hooks/useActivities.ts` — gestion des activités (liste, filtres, ajout, suppression)
- `src/hooks/useActivityTypes.ts` — gestion des types (liste prédéfinis + personnalisés)

### Composants
- `src/components/ActivityForm.tsx` — formulaire d'ajout d'activité :
  - Sélecteur de type (dropdown avec les types prédéfinis + personnalisés + option "Autre")
  - Sélecteur de plante (optionnel, dropdown des plantes de l'herbier)
  - Sélecteur de zone (optionnel, dropdown des zones)
  - Date (pré-remplie à aujourd'hui)
  - Champ notes (texte libre)
- `src/components/ActivityCard.tsx` — affichage d'une activité dans une liste
- `src/components/ActivityList.tsx` — liste chronologique d'activités avec filtres

### Pages
- `src/pages/JournalPage.tsx` — nouvelle page principale du journal :
  - Vue chronologique des activités récentes
  - Filtres par plante, zone, type, date
  - Bouton d'ajout d'activité

---

## Fichiers à modifier

### `src/db/schema.ts`
- Ajouter les interfaces `Activity` et `ActivityType`
- Ajouter les stores dans `HerbierDB`
- Incrémenter `DB_VERSION` à 2
- Ajouter la création des stores + seed des types prédéfinis dans `upgrade()`

### `src/App.tsx`
- Ajouter la route `/journal` → `JournalPage`
- Ajouter un 3ème onglet "Journal" dans la navigation bottom

### `src/pages/PlantDetailPage.tsx`
- Ajouter une section "Activités récentes" qui affiche les activités liées à cette plante (via `getByPlantId`)
- Bouton "Ajouter une activité" pré-rempli avec la plante courante

---

## Navigation (mise à jour)

```
App
├── Layout (nav bottom : Herbier | Capturer | Journal)
├── HomePage (/)
├── CapturePage (/capture)
├── JournalPage (/journal)        ← NOUVEAU
│   ├── Filtres (plante, zone, type, date)
│   ├── ActivityCard[] (liste chronologique)
│   └── Bouton "Nouvelle activité" → ActivityForm
└── PlantDetailPage (/plants/:id)
    └── Section "Activités récentes" ← NOUVEAU
```

---

## Flux utilisateur

### Ajouter une activité depuis le journal
1. Onglet "Journal" → bouton "+" 
2. ActivityForm s'affiche
3. Choix du type (dropdown)
4. Optionnel : sélection d'une plante
5. Optionnel : sélection d'une zone
6. Date (aujourd'hui par défaut)
7. Notes libres
8. Valider → activité enregistrée, affichée dans la liste

### Ajouter une activité depuis une fiche plante
1. PlantDetailPage → "Ajouter une activité"
2. ActivityForm s'affiche avec la plante pré-sélectionnée
3. Le reste du flux est identique

---

## Tests
- `activities.db.ts` : tester le CRUD avec `fake-indexeddb`, vérifier les requêtes par plantId, zoneId et date range
- `ActivityForm` : tester que les champs optionnels fonctionnent (soumettre sans plante, sans zone, sans les deux)
- Migration v1 → v2 : vérifier que les données existantes (plantes, photos, zones) ne sont pas perdues
