---
layout: page
title: "Travel"
permalink: /travel.html
---

<!-- 1) Dynamic Travel Grid -->
<section aria-labelledby="travel-grid-heading">
  <h2 id="travel-grid-heading" class="sr-only">Stories in Travel</h2>

  <div class="card-grid">
    {% assign featured = site.posts
      | where_exp: 'item', 'item.categories contains "travel"'
      | sort: 'date'
      | reverse
      | slice: 0, 6 %}

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

<!-- 2) Travel manifesto -->
<section aria-labelledby="travel-intro-heading">
  <h2 id="travel-intro-heading" class="sr-only">About This Section</h2>

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

<!-- 3) Data-driven Coming Soon -->
{% if site.data.coming_soon and site.data.coming_soon.size > 0 %}
<section aria-labelledby="coming-soon-heading" class="coming-soon">
  <h2 id="coming-soon-heading">Coming Soon</h2>

  <div class="card-grid">
    {% for item in site.data.coming_soon %}
      <a href="{{ item.url | default: '#' }}" class="card-thumb" aria-disabled="{{ item.url == '#' }}">
        <figure class="card-thumb__media">

          {% if item.img and item.img.base %}
            <img
              src="{{ item.img.base | replace: '/assets/images/', '/assets/img/' | relative_url }}"
              alt="{{ item.img.alt | default: item.title | escape }}"
              loading="lazy"
              width="960"
              height="600"
            />
          {% else %}
            <div class="card-thumb__placeholder" aria-hidden="true">
              <span>Image coming soon</span>
            </div>
          {% endif %}

          {% if item.location %}
            <figcaption class="card-thumb__label">{{ item.location }}</figcaption>
          {% endif %}
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
