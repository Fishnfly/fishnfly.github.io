---
layout: page
title: "Travel"
permalink: /travel.html
---

<!-- Intro narrative FIRST -->
<section class="travel-intro" aria-label="Travel intro">
  <h2>Traveling farther. <em>Fishing better.</em> Stories around the world.</h2>
  <p><strong>Moving slowly, noticing more.</strong> Stories from places where time lingers.</p>
</section>

<!-- Unified, expandable tile grid (stories first; optional top‑up from Coming Soon) -->
<section aria-labelledby="travel-grid-heading">
  <h2 id="travel-grid-heading" class="sr-only">Stories in Travel</h2>

  {% comment %}
  CONFIG:
  - target_count: how many tiles you want to show at minimum.
      0   → show ONLY published travel stories
      6   → show at least 6 (top up from Coming Soon if needed)
      999 → show all live stories AND all Coming Soon items
  Set to 999 now so the grid can expand freely while you build.
  {% endcomment %}
  {% assign target_count = 999 %}

  {% comment %}
  1) All LIVE travel posts (newest first)
  {% endcomment %}
  {% assign live_posts = site.posts
    | where_exp:'p','p.categories contains "travel"'
    | sort:'date' | reverse %}

  {% assign tiles = live_posts %}
  {% assign current_count = tiles | size %}

  {% comment %}
  2) Optionally top‑up from Coming Soon until we reach target_count
     - If target_count <= current_count, or no _data/coming_soon.yml, we skip.
     - If you prefer to limit the number of Coming Soon items added, replace the assignment
       of `cs` below with: {% assign cs = site.data.coming_soon | slice:0, needed %}
  {% endcomment %}
  {% if target_count > current_count and site.data.coming_soon %}
    {% assign needed = target_count | minus: current_count %}
    {% assign cs = site.data.coming_soon %}
  {% else %}
    {% assign cs = nil %}
  {% endif %}

  <div class="card-grid">
    {%- comment -%} Render all LIVE stories first {%- endcomment -%}
    {% for post in tiles %}
      {% include card-thumb.html
        url=post.url
        img_src=post.thumbnail.base
        alt=post.thumbnail.alt
        location=post.location
        title=post.title
        dek=post.dek
      %}
    {% endfor %}

    {%- comment -%} Then render Coming Soon items (shows placeholder if no image) {%- endcomment -%}
    {% if cs %}
      {% for item in cs %}
        {% assign item_url = item.url | default:'#' %}
        {% if item.img and item.img.base %}
          {% assign item_img = item.img.base %}
        {% else %}
          {% assign item_img = '' %}
        {% endif %}
        {% assign item_alt = item.img.alt | default:item.title %}

        {% include card-thumb.html
          url=item_url
          img_src=item_img
          alt=item_alt
          location=item.location
          title=item.title
          dek=item.dek
        %}
      {% endfor %}
    {% endif %}
  </div>
</section>

<hr class="section-sep" />

<!-- Narrative / manifesto AFTER the tiles -->
<section aria-labelledby="travel-intro-heading">
  <h2 id="travel-intro-heading">About This Section</h2>

  <p>Travel, for us, isn’t about moving quickly or seeing as much as possible. It’s about paying attention.</p>
  <p>We’re drawn to places where the experience comes from being present — where understanding a region means moving through it slowly, noticing how people live, and allowing plans to change once you're on the ground.</p>
  <p>Our trips are shaped less by itineraries and more by observation. We care about how landscapes influence daily life, how transportation really works, and what you miss when you only skim the surface of a place.</p>

  <p><strong>This section focuses on:</strong></p>
  <ul>
    <li>Traveling <em>through</em> countries rather than hopping between highlights</li>
    <li>Moving at a pace that allows places to reveal themselves</li>
    <li>The small, often overlooked details that define a journey</li>
    <li>Detours, delays, and moments that reshape the original plan</li>
  </ul>

  <p>Fishing appears here when it fits naturally into that rhythm — as a way of slowing down even further, spending time with water, and connecting with people and places from a different perspective. Sometimes it’s central to the experience; other times it’s absent entirely.</p>
  <p>These aren’t destination guides or recommendations. They’re reflections and field notes — written for travelers who value curiosity over efficiency and depth over distance.</p>
</section>
