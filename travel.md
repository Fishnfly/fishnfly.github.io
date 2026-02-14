---
title: Travel
---

<section aria-labelledby="travel-grid-heading">
  <h2 id="travel-grid-heading" class="sr-only">Stories in Travel</h2>
  <div class="card-grid">
    {% assign featured = site.posts | where_exp:'item', 'item.categories contains "travel"' | sort: 'date' | reverse | slice: 0, 4 %}
    {% for post in featured %}
      {% include card-thumb.html
        url=post.url
        img_src=post.thumbnail.base
        img_src_640=post.thumbnail.w640
        img_src_960=post.thumbnail.w960
        img_src_1280=post.thumbnail.w1280
        alt=post.thumbnail.alt
        location=post.location
        title=post.title
        dek=post.dek
      %}
    {% endfor %}
  </div>
</section>

<hr class="section-sep" />

{{ content }} <!-- keep your existing Travel positioning text -->

Travel, for us, isn’t about moving quickly or seeing as much as possible. It’s about paying attention.

We’re drawn to places where the experience comes from being present — where understanding a region means moving through it slowly, noticing how people live, and allowing plans to change once you’re on the ground.

Our trips are shaped less by itineraries and more by observation. We care about how landscapes influence daily life, how transportation really works, and what you miss when you only skim the surface of a place.

This section focuses on:
- Traveling *through* countries rather than hopping between highlights
- Moving at a pace that allows places to reveal themselves
- The small, often overlooked details that define a journey
- Detours, delays, and moments that reshape the original plan

Fishing appears here when it fits naturally into that rhythm — as a way of slowing down even further, spending time with water, and connecting with people and places from a different perspective. Sometimes it’s central to the experience; other times it’s absent entirely.

These aren’t destination guides or recommendations. They’re reflections and field notes — written for travelers who value curiosity over efficiency and depth over distance.

---

## Trips

<div class="card-grid">

  <!-- Morocco (LIVE) -->
  <article class="card">
    <a class="card-link" href="{{ '/travel/2025/02/15/morocco-field-notes.html' | relative_url }}">
      <img class="card-img" src="{{ '/assets/images/morocco/anchor.jpg' | relative_url }}" alt="Morocco Trip">
      <h3 class="card-title">Morocco Trip</h3>
      <p class="card-meta">— Morocco — <span class="trip-badge live">Live</span></p>
    </a>
  </article>

  <!-- Jordan & Egypt (COMING SOON) - no link yet -->
  <article class="card">
    <div class="card-img placeholder" aria-hidden="true"></div>
    <h3 class="card-title">Jordan &amp; Egypt — Field Notes</h3>
    <p class="card-meta">— Jordan, Egypt — <span class="trip-badge soon">Coming&nbsp;soon</span></p>
  </article>

  <!-- UAE (COMING SOON) - no link yet -->
  <article class="card">
    <div class="card-img placeholder" aria-hidden="true"></div>
    <h3 class="card-title">UAE — Field Notes</h3>
    <p class="card-meta">— Dubai, Abu Dhabi — <span class="trip-badge soon">Coming&nbsp;soon</span></p>
  </article>

</div>

{% if site.data.coming_soon and site.data.coming_soon.size > 0 %}
<section aria-labelledby="coming-soon-heading" class="coming-soon">
  <h2 id="coming-soon-heading">Coming Soon</h2>
  <div class="card-grid">
    {% for item in site.data.coming_soon %}
      <a href="{{ item.url }}" aria-disabled="true">
        <figure class="card-thumb__media">
          <img src="{{ item.img.base }}" alt="{{ item.img.alt }}">
          <figcaption class="card-thumb__label">{{ item.location }}</figcaption>
        </figure>
        <div class="card-thumb__body">
          <h3 class="card-thumb__title">{{ item.title }}</h3>
          {% if item.dek %}
            <p class="card-thumb__dek">{{ item.dek }}</p>
          {% endif %}
        </div>
      </a>
    {% endfor %}
  </div>
</section>
{% endif %}
