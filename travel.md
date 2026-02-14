---
layout: page
title: "Travel"
permalink: /travel.html
---

<!-- Intro first -->
<section class="travel-intro" aria-label="Travel intro">
  <h2>Traveling farther. <em>Fishing better.</em> Stories around the world.</h2>
  <p><strong>Moving slowly, noticing more.</strong> Stories from places where time lingers.</p>
</section>

<!-- 4-tile grid (2x2) -->
<section aria-labelledby="travel-grid-heading">
  <h2 id="travel-grid-heading" class="sr-only">Stories in Travel</h2>

  <div class="card-grid">
    {% assign tiles = site.posts
      | where_exp: 'item', 'item.categories contains "travel"'
      | sort: 'date' | reverse | slice: 0, 4 %}

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
  </div>
</section>

<hr class="section-sep" />

<!-- Narrative / manifesto -->
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

<!-- Coming Soon (tile placeholders supported) -->
{% if site.data.coming_soon and site.data.coming_soon.size > 0 %}
<section aria-labelledby="coming-soon-heading" class="coming-soon">
  <h2 id="coming-soon-heading">Coming Soon</h2>

  <div class="card-grid">
    {% for item in site.data.coming_soon %}
      {% include card-thumb.html
        url=item.url | default:'#'
        img_src=item.img.base
        alt=item.img.alt
        location=item.location
        title=item.title
        dek=item.dek
      %}
    {% endfor %}
  </div>
</section>
{% endif %}
