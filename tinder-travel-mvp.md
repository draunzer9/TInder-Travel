# Tinder Travel — MVP Product Specification

---

## Product Overview

**Tinder Travel** is a new Travel tab inside the Tinder app — a distinct product mode for **travel companionship and local connections, not dating.**

> **Core Hypothesis:** People may know where they want to travel, but they don't always have compatible people to travel with or know someone trustworthy at the destination.

Tinder can leverage its existing matching and recommendation infrastructure to connect people based on **destination, travel dates, travel style, interests, and compatibility.**

---

## Business Model

### Two User Types

| User Type | Capabilities |
|---|---|
| **Premium Traveler** | Discover and connect with travelers and verified locals; select destination and travel dates; receive ranked travel matches |
| **Free Local / Host** | Create a Local/Host profile; offer local recommendations, meetups, city exploration, cultural experiences, food recommendations, and optionally accommodation (if verified); cannot freely browse the global traveler network |

This distinction preserves Tinder's existing Premium monetization model while introducing a new Travel product that does not simply give free users unlimited location-based access.

---

## MVP Scope

The MVP covers **only** the following core loop:

```
Travel Profile → Preferences → Discover → Compatibility → Connect → Chat Safely
```

**Primary Product Loop:**

1. Destination + Dates + Travel Preferences
2. Compatible people
3. Understand compatibility
4. Connect
5. Travel together / meet locally

### Explicitly Out of Scope

- Flight booking
- Hotel booking
- Restaurant booking
- Full itinerary planner
- Payments
- Travel insurance
- Marketplace / tour operator marketplace
- Complex group-trip planning
- Social media feed

---

## Screen Specifications

---

### Screen 1 — Tinder Home / Travel Tab

**Mode toggle:** Dating ❤️ | Travel ✈️ *(Travel selected)*

**Header:** Travel

**Subtitle:** Find people who travel like you.

**Empty state / onboarding card:**

> **Where are you going?**

**CTA:** Start Travel Profile

**Design note:** Bottom navigation must clearly distinguish Dating from Travel. Travel should not look like a dating screen with a travel filter.

---

### Screen 2 — Travel Preferences

#### "How do you like to travel?"

Multi-select tags across three categories:

**Travel Style**
- Solo
- Budget
- Premium
- Adventure
- Relaxed

**Interests**
- Culture
- Food
- Nature
- Photography
- Nightlife
- Local experiences

**Travel Intent**
- Travel companion
- Meet locals
- Explore culture
- Group travel

---

#### "What are you doing?"

Two large selectable cards:

| Card | Icon | Description |
|---|---|---|
| I'm traveling | ✈️ | Find compatible people at my destination |
| I'm a local | 🏠 | Meet travelers and share my local knowledge |

- **"I'm traveling"** → Premium Traveler experience
- **"I'm a local"** → Free Local/Host profile setup

---

### Screen 3 — Premium Traveler Discovery

**Header:** Bali 🇮🇩 · Dec 12 – Dec 18

Card-based ranked discovery feed.

#### Example Profile Card

**Priya, 28**

92% Travel Match

Bengaluru → Bali · Dec 12–18

Tags: 🎒 Budget · 🌏 Culture · 🍜 Food · 🥾 Adventure

**Why you match:**
- ✓ Same destination
- ✓ Same travel dates
- ✓ Similar budget
- ✓ Both enjoy local food
- ✓ Both prefer cultural experiences

**Primary CTA:** Connect

**Secondary CTA:** Skip

**Label:** Premium Travel

---

### Screen 4 — Local / Host Profile

#### Arjun, 30

📍 Bali · Local Host

---

**I can help with:**

| Offering | Condition |
|---|---|
| 🏠 Stay | Only if verified |
| 🍜 Local food recommendations | Always available |
| 📍 Hidden places | Always available |
| 🚶 City exploration | Always available |
| 🌏 Cultural experiences | Always available |

---

**Travel Experience:**

⭐ 4.8 · 12 successful connections

---

**Trust & Verification:**

- ✓ Identity verified
- ✓ Phone verified
- ✓ Profile verified
- ✓ Community feedback

*Note: Do not display a simplistic "Safety Score." Use transparent trust signals instead.*

**Primary CTA:** Connect

**Secondary CTA:** View Safety Information

---

### Screen 5 — Match / Compatibility Detail

**Header:** Your Travel Match

**Score:** 92% compatible

---

**Why you match:**

- 📍 Same destination
- 📅 Same travel dates
- 💰 Similar budget
- 🌏 Both love cultural experiences
- 🍜 Both enjoy local food
- 🥾 Similar activity level

---

**Travel Style Comparison:**

| | Style |
|---|---|
| **You** | Budget · Culture · Food · Adventure |
| **Them** | Budget · Culture · Food · Adventure |

---

**Compatibility summary:**

> "You both prefer exploring local places, trying local food, and keeping the trip flexible."

*Note: Do not frame this as a dating compatibility score.*

**CTA:** Connect

---

### Screen 6 — Connection / Chat + Safety

**Header:** You matched for Bali ✈️

**Context message:**
> You both matched because you're traveling to Bali during the same week and share similar travel interests.

---

**Suggested conversation starters:**
- "What are you planning to explore in Bali?"
- "Are you traveling solo?"
- "Want to explore a local food spot together?"

---

**Travel Safety:**

Before meeting someone:

- ✓ Meet in a public place
- ✓ Keep communication inside Tinder
- ✓ Share your plans with someone you trust
- ✓ Report suspicious behavior

**Actions:** Report | Block | Safety Center

---

## Design System

### Visual Direction

- Tinder-inspired but **not** an exact copy of Tinder
- Clean white / light background
- Subtle pink/red accent color
- Large profile photography
- Rounded cards
- Modern typography
- Strong visual hierarchy
- Generous whitespace
- Premium, polished UI
- Minimal icons
- Smooth card-based discovery experience
- Realistic profile photos and place imagery

### Travel Visual Cues

Use sparingly: 🌍 ✈️ 📍 🧳

Travel should feel like a **distinct product mode** — not a dating screen with a travel filter, and not a generic travel booking app.

### Key Design Principle

> **Tinder is not trying to become another travel booking app.**

It is using its existing strength in people discovery and matching to answer one question:

### "Who would I actually enjoy traveling with?"

---

## Navigation Structure

| Tab | Icon | Mode |
|---|---|---|
| Dating | ❤️ | Existing Tinder experience |
| Travel | ✈️ | New Tinder Travel product |

The two modes must be visually and functionally distinct throughout the navigation and UI components.

---

## Consistency Requirements

All 6 screens must share:

- Consistent navigation
- Consistent typography
- Consistent component library (cards, buttons, tags, avatars)
- Consistent spacing and padding
- Consistent interaction patterns
- Consistent card-based layout system
